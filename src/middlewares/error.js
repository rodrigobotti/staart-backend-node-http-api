const { NotFoundError } = require("../errors")

const responseMappers = {
  [NotFoundError.name]: (error) => ({
    status: 404,
    body: {
      statusCode: 404,
      error: NotFoundError.name,
      message: error.message,
      cause: []
    }
  }),
  default: (error) => ({
    status: 500,
    body: {
      statusCode: 500,
      error: error.name ?? 'UnexpectedError',
      message: error.message,
      cause: [],
    }
  })
}

const errorToResponse = (error) => {
  const mapper = responseMappers[error.name] ?? responseMappers.default
  return mapper(error)
}

const errorHandler = ({ log = console.error } = {}) =>
  (error, _req, res, _next) => {
    log(error)
    const { status, body } = errorToResponse(error)
    res.status(status).send(body)
  }

module.exports = errorHandler
