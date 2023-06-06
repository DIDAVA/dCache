const EventEmitter = require('events')
const fs = require('fs')

class dCache extends EventEmitter {

  constructor(config = {}){
    super()
    if (config.verbose) this.verbose()
    this.file = `${__dirname}/data.json`
    this.cache = new Map()
    this.nonce = 0
    this.limit = config.limit ?? 1
    if (fs.existsSync(this.file)) this.load()
    else this.save(true)
    setInterval(() => this.save(), config.timer ?? 30000)
  }

  load(){
    const data = JSON.parse(fs.readFileSync(this.file))
    this.cache = new Map(data)
    this.emit('load')
  }

  save(force = false){
    const now = Date.now()
    if (force || this.nonce >= this.limit) {
      const data = Array.from(this.cache.entries())
      fs.writeFileSync(this.file, JSON.stringify(data))
      this.nonce = 0
      this.emit('save')
    }
    
  }

  set(key, value){
    this.cache.set(key, value)
    this.nonce++
    this.emit('set', key)
  }

  get(key){
    return this.cache.has(key) ? this.cache.get(key) : null
  }

  delete(key){
    if (this.cache.has(key)) {
      this.cache.delete(key)
      this.nonce++
      this.emit('delete', key)
    }
  }

  search(input){
    const query = {}
    for (let k in input) query[k] = new RegExp(input[k], 'g')
    console.log(query)
    const result = []
    this.cache.forEach((value, key) => {
      for (let qk in query) {
        if (qk in value) {
          if (value[qk] instanceof Array) {
            const map = value[qk].map(i => query[qk].test(i))
            if (map.includes(true)) result.push([key, value])
          }
          else if (query[qk].test(value[qk])) result.push([key, value])
        }
      }
    })
    return result
  }

  import(data){
    if (!(data instanceof Array)) return false
    else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].length != 2) {
          this.emit('import', false)
          return false
        }
      }
      this.cache = new Map(data)
      this.emit('import', true)
      return true
    }
  }

  export(){
    this.emit('export')
    return Array.from(this.cache.entries())
  }

  flush(){
    this.cache.clear()
    this.nonce++
    this.emit('flush')
  }

  verbose(){
    this.on('load', () => console.log('LOD', 'Database loaded and initialized'))
    this.on('save', () => console.log('SAV', 'Database backup completed'))
    this.on('set', key => console.log('SET ', key))
    this.on('delete', key => console.log('DEL ', key))
    this.on('import', success => console.log('IMP', success ? 'Success' : 'Failed'))
    this.on('export', () => console.log('EXP', 'Success'))
    this.on('flush', () => console.log('FLS', 'Success'))
  }

}

module.exports = dCache