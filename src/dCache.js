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
      fs.writeFileSync(this.file, JSON.stringify(data))
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

  delete(key){
    if (this.cache.has(key)) {
      this.cache.delete(key)
      this.nonce++
      this.emit('delete', key)
      this.save()
    }
  }

  verbose(){
    this.on('load', () => console.log('LOAD', 'Database loaded and initialized'))
    this.on('save', () => console.log('SAVE', 'Database backup completed'))
    this.on('set', key => console.log('SET ', key))
    this.on('delete', key => console.log('DEL ', key))
  }

}

module.exports = dCache