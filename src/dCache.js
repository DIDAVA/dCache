const EventEmitter = require('events')
const fs = require('fs')

class dCache extends EventEmitter {

  constructor(config = {}){
    super()
    this.file = `${__dirname}/data.json`
    this.cache = new Map()
    this.nonce = 0
    this.limit = config.limit ?? 1
    if (fs.existsSync(this.file)) this.load()
    else this.save()
    setInterval(() => this.save(), config.timer ?? 60000)
  }

  load(){
    const data = JSON.parse(fs.readFileSync(this.file))
    data.forEach(i => this.cache.set(i[0], i[1]))
    this.emit('load')
  }

  save(force = false){
    const now = Date.now()
    if (force || this.nonce >= this.limit) {
      const data = Array.from(this.cache.entries())
      fs.writeFile(this.file, JSON.stringify(data))
      this.nonce = 0
      this.emit('save')
    }
    
  }

  set(key, value){
    this.cache.set(key, value)
    this.nonce++
    this.emit('set', key)
    this.save()
  }

  get(key){
    return this.cache.has(key) ? this.cache.get(key) : null
  }

  del(key){
    this.cache.delete(key)
    this.nonce++
    this.emit('del', key)
    this.save()
  }

}

module.exports = dCache