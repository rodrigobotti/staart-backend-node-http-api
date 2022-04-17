const express = require('express')

const todos = require('./todos/routes')
const hello = require('./hello/routes')

const app = express()

app.use(express.json())
app.use('/hello', hello)
app.use('/todos', todos)


app
  .listen(3000, '0.0.0.0', () => {
    console.log('Server started successfully')
  })
  .once('error', (error) => {
    console.error('Server failed', error)
    process.exit(1)
  })
