function Fork() {
  this.objectLike = new WeakMap()
  this.primitive = new Map()
}
Object.assign(Fork, {
  type(value) {
    const type =
      ['object', 'function'].includes(typeof value) && value !== null
        ? 'objectLike'
        : 'primitive'
    return type
  },
})
Object.assign(Fork.prototype, {
  set(key, value) {
    const type = Fork.type(key)
    this[type].set(key, value)
  },
  has(key) {
    const type = Fork.type(key)
    return this[type].has(key)
  },
  get(key) {
    const type = Fork.type(key)
    return this[type].get(key)
  },
})

module.exports = Fork
