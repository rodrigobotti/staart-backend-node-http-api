const express = require('express')
const { TodosRepository } = require('./todos/repository')

const app = express()

app.use(express.json())

// ***************
// ** hello API **
// ***************

app.get('/hello', (_req, res) => {
  res.status(200).send('Hello World!\n')
})

app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  res.status(200).send(`Hello ${name}!\n`)
})

// ***************
// ** todos API **
// ***************

const NotFound = {
  error: 'Not found',
  message: 'Resource not found',
}

const todosRepository = TodosRepository()

app.get('/todos', (_req, res) =>
  todosRepository
    .list()
    .then(todos =>
      res.status(200).send({ todos })
    )
)

app.get('/todos/:id', async (req, res) => {
  const id = req.params.id
  const todo = await todosRepository.get(id)
  if (!todo) {
    res.status(404).send(NotFound)
    return
  }
  res.status(200).send(todo)
})

app.post('/todos', async (req, res) => {
  const todo = req.body // precisa do middleware express.json
  const inserted = await todosRepository.insert(todo)

  res.status(201)
    .header('Location', `/todos/${inserted.id}`)
    .send(inserted)
})

app.put('/todos/:id', async (req, res) => {
  const id = req.params.id
  const todo = { ...req.body, id }
  const found = await todosRepository.get(id)
  if (!found) {
    return res.status(404).send(NotFound)
  }
  const updated = await todosRepository.update(todo)
  res.status(200).send(updated)
})

app.delete('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const found = await todosRepository.get(id)
  if (!found) {
    return res.status(404).send(NotFound)
  }
  await todosRepository.del(id)
  res.status(204).send()
})

app
  .listen(3000, '0.0.0.0', () => {
    console.log('Server started successfully')
  })
  .once('error', (error) => {
    console.error('Server failed', error)
    process.exit(1)
  })
