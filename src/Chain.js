const Fork = require('./Fork')

function Chain() {
  this.store = new Fork()
}
Object.assign(Chain.prototype, {
  has(args) {
    const keys = Object.keys(args).sort()
    const token = JSON.stringify(keys)
    const argValues = keys.map((key) => args[key])
    argValues.unshift(token)
    for (let index = 0, acc = this.store; index < argValues.length; index++) {
      const arg = argValues[index]
      if (!acc.has(arg)) {
        return false
      }
      acc = acc.get(arg)
    }
    return true
  },
  set(args, value) {
    const keys = Object.keys(args).sort()
    const token = JSON.stringify(keys)
    const argValues = keys.map((key) => args[key])
    argValues.unshift(token)
    let set = (v) => this.store.set(token, v)
    let acc = this.store
    for (const arg of argValues) {
      if (!acc.has(arg)) {
        acc.set(arg, new Fork())
      }
      acc = acc.get(arg)
      // eslint-disable-next-line no-loop-func
      set = (v) => acc.set(arg, v)
    }
    set(value)
  },
  get(args) {
    const keys = Object.keys(args).sort()
    const token = JSON.stringify(keys)
    const argValues = keys.map((key) => args[key])
    argValues.unshift(token)
    let get = () => this.store.get(token)
    for (let index = 0, acc = this.store; index < argValues.length; index++) {
      const arg = argValues[index]
      if (!acc.has(arg)) {
        throw new Error(`No value for args: ${JSON.stringify(args)}`)
      }
      acc = acc.get(arg)
      get = () => acc.get(arg)
    }
    return get()
  },
})

module.exports = Chain
