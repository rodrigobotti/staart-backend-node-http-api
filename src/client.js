const fetch = require('node-fetch')
const {AbortController} = require('abort-controller')


class HttpStatusError extends Error {
  constructor({ body, status }) {
    super(`Request failed with status ${status}`)
    this.name = 'HttpStatusError'
    this.body = body
    this.status = status
  }
}

const rejectHttpStatusError = res =>
  res
    .text()
    .then(body => new HttpStatusError({ body, status: res.status }))
    .then(error => Promise.reject(error))

const createUser = (user, timeout=10_000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  return fetch(
    'http://localhost:3000/api/users',
    {
      method: 'POST', // por padrão é GET
      headers: { // por padrão é {}
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user),
    }
  )
  .finally(() => clearTimeout(timeoutId))
  .then(res => res.ok
      ? res
      : rejectHttpStatusError(res)
    )
  .then(res => res.json())
}

createUser({
  username: 'a@a.com',
  password: 'mudar123',
  firstName: 'Rodrigo',
  lastName: 'Botti',
})
  .then(console.log)
  .catch(console.error)
