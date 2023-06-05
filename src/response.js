module.exports = {
  result: data => {
    return {result: data}
  },
  error: (code, message) => {
    return {error: {code, message}}
  }
}