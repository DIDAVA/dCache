const axios = require('axios').default

const test = async () => {
  const url = 'http://localhost:9000/track:123'
  await axios.post(url, {
    id: Date.now(),
    artist: 'Cher',
    title: 'Do beleive the love after love'
  })
  const result = await axios.get(url)
  console.log(result.data)
  await axios.delete(url)
}

test()