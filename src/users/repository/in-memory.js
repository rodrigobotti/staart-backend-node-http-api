const { NotFoundError, ConflictError } = require('../../errors')
const { wait } = require('../../utils')

const InMemoryUsersRepository = () => {
  let idSequence = 1
  const users = {}

  const findByUsername = username =>
    Object.values(users).find((user) => user.username === username)

  const insert = async (user) => {
    await wait(500)
    // simular algo similar a `unique constraint violation`
    if (findByUsername(user.username)) {
      return Promise.reject(new ConflictError(`User with username '${user.username}' already registered`))
    }
    const id = idSequence++
    const data = { ...user, id }
    users[id] = data
    return data
  }

  const list = async () => {
    await wait(100)
    return Object.values(users)
  }

  const get = async (id) => {
    await wait(100)
    const user = users[id]
    return user ?? Promise.reject(new NotFoundError({ resourceName: 'user', resourceId: id }))
  }

  const update = async (user) => {
    await wait(500)
    users[user.id] = user
    return user
  }

  const del = async (id) => {
    await wait(500)
    delete users[id]
  }

  return {
    insert,
    list,
    get,
    update,
    del,
  }
}

module.exports = {
  InMemoryUsersRepository,
}
