const express = require('express')

// middlewares
const error = require('./middlewares/error')
const logger = require('./middlewares/logger')

// routes
const todos = require('./todos/routes')
const hello = require('./hello/routes')

const app = express()

app.use(express.json())
app.use(logger())
app.use('/hello', hello)
app.use('/todos', todos)

app.get('/error', (_req, _res) =>
  Promise.reject(Error('async'))
)
app.get('/error/sync', (_req, _res) => {
  throw Error('sync')
})

app.use(error())


app
  .listen(3000, '0.0.0.0', () => {
    console.log('Server started successfully')
  })
  .once('error', (error) => {
    console.error('Server failed', error)
    process.exit(1)
  })
