const api = require('axios').default
const base = 'http://localhost:9000'
const key = `track:${Date.now()}`
const data = {artist: 'Joe Cocker', title: 'Trust in me!'}
const dump = [[key, data]]

test('FLUSH Whole Data', async () => {
  const url = `${base}/flush`
  const response = await api.delete(url)
  expect(response.data.result).toBe('OK')
})

test('SET Data', async () => {
  const url = `${base}/key/${key}`
  const response = await api.post(url, data)
  expect(response.data.result).toBe('OK')
})

test('GET Valid Key Data', async () => {
  const url = `${base}/key/${key}`
  const response = await api.get(url)
  expect(response.data.result).toStrictEqual(data)
})

test('GET Invalid Key Data', async () => {
  const wrong = Date.now()
  const url = `${base}/key/${wrong}`
  const response = await api.get(url)
  expect(response.data.error).toStrictEqual({code: 404, message: 'not found'})
})

test('Export Whole Data', async () => {
  const url = `${base}/export`
  const response = await api.get(url)
  expect(response.data.result).toStrictEqual(dump)
})

test('Import Valid Dump Data', async () => {
  const url = `${base}/import`
  const response = await api.post(url, dump)
  expect(response.data.result).toBe('OK')
})

test('Import Invalid Dump Data (Object)', async () => {
  const url = `${base}/import`
  const response = await api.post(url, [{}])
  expect(response.data.error).toStrictEqual({code: 400, message: 'bad request'})
})

test('Import Invalid Dump Data (Array)', async () => {
  const url = `${base}/import`
  const response = await api.post(url, {})
  expect(response.data.error).toStrictEqual({code: 400, message: 'bad request'})
})

test('Delete Data', async () => {
  const url = `${base}/key/${key}`
  const response = await api.delete(url)
  expect(response.data.result).toBe('OK')
})