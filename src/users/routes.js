const { Router } = require('express')

const router = Router()

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/

// create
router.post('/', async (req, res) => {
  res.status(201).header('Location', '/users/???').send()
})

// update
router.put('/:id', async (req, res) => {
  res.status(200).send()
})

// delete
router.delete('/:id', async (req, res) => {
  res.status(204).send()
})

// read
router.get('/', async (req, res) => {
  res.status(200).send({ users: [] })
})
router.get('/:id', async (req, res) => {
  res.status(200).send({ })
})

module.exports = router
