const { Router } = require('express')

const withAsyncErrorHandler = require('../middlewares/async-error')

const router = Router()

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

const createUser = async (req, res) => {
  res.status(201).header('Location', '/users/???').send()
}

router.post('/', withAsyncErrorHandler(createUser))

// ************
// ** update **
// ************

const updateUser = async (req, res) => {
  res.status(200).send()
}

router.put('/:id', withAsyncErrorHandler(updateUser))

// ************
// ** delete **
// ************

const deleteUser = async (req, res) => {
  res.status(204).send()
}

router.delete('/:id', withAsyncErrorHandler(deleteUser))

// **********
// ** read **
// **********

const listUsers = async (req, res) => {
  res.status(200).send({ users: [] })
}

const getUser = async (req, res) => {
  res.status(200).send({ })
}

router.get('/', withAsyncErrorHandler(listUsers))
router.get('/:id', withAsyncErrorHandler(getUser))

module.exports = router
