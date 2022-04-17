const { Router } = require('express')

const router = Router()

router
  .get('/', (_req, res) => {
    res.status(200).send('Hello World!\n')
  })
  .get('/:name', (req, res) => {
    const name = req.params.name
    res.status(200).send(`Hello ${name}!\n`)
  })

module.exports = router
