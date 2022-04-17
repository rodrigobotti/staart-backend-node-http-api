const http = require('http')

const wait = (time) =>
  new Promise(resolve =>
    setTimeout(resolve, time)
  )

const todosDatabase = (() => {
  let idSequence = 1
  const todos = {}

  const insert = async (todo) => {
    await wait(500)
    const id = idSequence++
    const data = { ...todo, id }
    todos[id] = data
    return data
  }

  const list = async () => {
    await wait(100)
    return Object.values(todos)
  }

  const get = async (id) => {
    await wait(100)
    return todos[id]
  }

  const update = async (todo) => {
    await wait(500)
    todos[todo.id] = todo
    return todo
  }

  const del = async (id) => {
    await wait(500)
    delete todos[id]
  }

  return {
    insert,
    list,
    get,
    update,
    del,
  }

})()

const JsonHeaders = { 'Content-Type': 'application/json' }
const NotFoundJson = JSON.stringify({
  error: 'Not found',
  message: 'Resource not found',
})

const server = http.createServer((request, response) => {

  console.log({
    url: request.url,
    method: request.method,
    headers: request.headers,
  })

  // GET /hello

  if (/^\/hello\/\w+$/.test(request.url)) {
    const [,, name] = request.url.split('/')
    response.writeHead(200)
    response.end(`Hello ${name}!\n`)
    return
  }

  // GET /hello/:name

  if (request.url.startsWith('/hello')) {
    response.writeHead(200)
    response.end('Hello World!\n')
    return
  }

  // POST /echo

  if (request.url.startsWith('/echo') && request.method === 'POST') {
    response.writeHead(200)
    request.pipe(response)
    return
  }

  // ***************
  // ** todos API **
  // ***************

  // GET /todos/:id

  if (/^\/todos\/\d+$/.test(request.url) && request.method === 'GET') {
    const [,, idRaw] = request.url.split('/')
    const id = parseInt(idRaw)

    todosDatabase.get(id).then((todo) => {
      if (!todo) {
        response.writeHead(404, JsonHeaders)
        response.end(NotFoundJson)
      }

      response.writeHead(200, JsonHeaders)
      response.end(JSON.stringify(todo))
    })

    return
  }

  // POST /todos

  if (request.url.startsWith('/todos') && request.method === 'POST') {
    let bodyRaw = ''

    request.on('data', data => bodyRaw += data)

    request.once('end', () => {
      const todo = JSON.parse(bodyRaw)
      todosDatabase.insert(todo)
        .then(inserted => {
          response.writeHead(201, JsonHeaders)
          response.end(JSON.stringify(inserted))
        })
    })

    return
  }

  // PUT /todos/:id

  if (/^\/todos\/\d+$/.test(request.url) && request.method === 'PUT') {
    let bodyRaw = ''
    const [,, idRaw] = request.url.split('/')
    const id = parseInt(idRaw)

    request.on('data', data => bodyRaw += data)

    request.once('end', () => {
      const todo = { ...JSON.parse(bodyRaw), id }

      todosDatabase.update(todo)
        .then(updated => {
          response.writeHead(200, JsonHeaders)
          response.end(JSON.stringify(updated))
        })
    })

    return
  }

  // DEL /todos/:id

  if (/^\/todos\/\d+$/.test(request.url) && request.method === 'DEL') {
    const [,, idRaw] = request.url.split('/')
    const id = parseInt(idRaw)

    todosDatabase.del(id).then(() => {
      response.writeHead(204)
      response.end()
    })

    return
  }

  // GET /todos

  if (request.url.startsWith('/todos') && request.method === 'GET') {
    todosDatabase.list().then(todos => {
      response.writeHead(200, JsonHeaders)
      response.end(JSON.stringify({ todos }))
    })
    return
  }

  // *************************************
  // ** Default response: 404 Not Found **
  // *************************************

  response.writeHead(404)
  response.end('Not Found')
})

server.listen(3000, '0.0.0.0', () => {
  console.log('Server started')
})
