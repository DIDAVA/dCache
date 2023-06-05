const EventEmitter = require('events')
const fs = require('fs')

class dCache extends EventEmitter {

  constructor(config = {}){
    super()
    this.file = `${__dirname}/data.json`
    this.cache = new Map()
    this.nonce = 0
    this.limit = config.limit ?? 10
    this.epoch = Date.now()
    if (fs.existsSync(this.file)) this.load()
    else this.save()
  }

  load(){
    const data = JSON.parse(fs.readFileSync(this.file))
    data.forEach(i => this.cache.set(i[0], i[1]))
    this.emit('load')
  }

  save(checkNonce = false){
    const data = Array.from(this.cache.entries())
    fs.writeFileSync(this.file, JSON.stringify(data))
    this.emit('save')
  }

  set(key, value){
    this.cache.set(key, value)
    this.nonce++
    this.emit('set', key)
    const now = Date.now()
    const epoch = this.epoch + (this.timer * 1000)
    if (this.nonce >= this.limit || now > epoch) {
      this.save()
      this.nonce = 0
      this.epoch = now
    }
  }

  get(key){
    return this.cache.has(key) ? this.cache.get(key) : null
  }

}

module.exports = dCache