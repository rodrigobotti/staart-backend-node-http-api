const { Router } = require('express')
const Joi = require('joi')

const withAsyncErrorHandler = require('../middlewares/async-error')
const validate = require('../middlewares/validate')

const router = Router()

const { UsersRepository } = require('./repository')

const repository = UsersRepository()

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/

// ************
// ** create **
// ************

const CreateUserBodySchema = {
  body: Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
    name: Joi.string().regex(/^[A-Za-z]+(\s?[A-Za-z])*$/).required()
  })
}

const createUser = async (req, res) => {
  const user = req.body
  // e se já existir com email cadastrado ?
  const inserted = await repository.insert(user)
  const location = `/api/users/${inserted.id}`
  res.status(201).header('Location', location).send(inserted)
}

router.post('/', validate(CreateUserBodySchema), withAsyncErrorHandler(createUser))

// ************
// ** update **
// ************

const UpdateUserSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(10).max(40),
    name: Joi.string().regex(/^[A-Za-z]+(\s?[A-Za-z])*$/)
  }).or('password', 'name')
}

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const body = req.body
  const registered = await repository.get(id)
  const user = { ...registered, ...body, id }
  const updated = await repository.update(user)
  res.status(200).send(updated)
}

router.put('/:id', validate(UpdateUserSchema), withAsyncErrorHandler(updateUser))

// ************
// ** delete **
// ************

const DeleteUserSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  })
}

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id)
  await repository.get(id)
  await repository.del(id)
  res.status(204).send()
}

router.delete('/:id', validate(DeleteUserSchema), withAsyncErrorHandler(deleteUser))

// **********
// ** read **
// **********

const GetUserSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  })
}

const listUsers = (_req, res) =>
  repository
    .list()
    .then(users => res.status(200).send({ users }))

const getUser = async (req, res) => {
  const id = parseInt(req.params.id)
  const user = await repository.get(id)
  res.status(200).send(user)
}

router.get('/', withAsyncErrorHandler(listUsers))
router.get('/:id', validate(GetUserSchema), withAsyncErrorHandler(getUser))

module.exports = router
