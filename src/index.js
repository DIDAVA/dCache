const config = require('./config')
const dCache = require('./dCache')
const response = require('./response')

const cache = new dCache(config)
const express = require('express')
const api = express()
api.use(express.json())

api.get('/', (req, res) => {
  res.json(response.result({
    service: 'dCache',
    version: '1.0.0',
    description: 'In-memory database'
  }))
})

api.post('/search', (req, res) => {
  const result = cache.search(req.body)
  console.log(result)
  res.json(response.result(result))
})

api.post('/import', (req, res) => {
  const success = cache.import(req.body)
  if (success) res.json(response.result('OK'))
  else res.json(response.error(400, 'bad request'))
})

api.get('/export', (req, res) => {
  const data = cache.export()
  res.json(response.result(data))
})

api.delete('/flush', (req, res) => {
  cache.flush()
  res.json(response.result('OK'))
})

api.get('/key/:key', (req, res) => {
  const data = cache.get(req.params.key)
  if (data) res.json(response.result(data))
  else res.json(response.error(404, 'not found'))
})

api.post('/key/:key', (req, res) => {
  cache.set(req.params.key, req.body)
  res.json(response.result('OK'))
})

api.delete('/key/:key', (req, res) => {
  cache.delete(req.params.key)
  res.json(response.result('OK'))
})

api.listen(config.port, () => {
  console.log('dCache Server is running at port', config.port)
})