// Todo: make it right
module.exports = function memoize(fn) {
  const cache = {}
  // eslint-disable-next-line func-names
  return function (args) {
    const keys = Object.keys(args).sort()
    const token = JSON.stringify(keys)
    cache[token] = cache[token] || {}
    let acc = cache
    let broken = false
    for (const key of keys) {
      const arg = args[key]
      const type =
        ['object', 'function'].includes(typeof arg) && arg !== null
          ? 'objectLike'
          : 'primitive'
      if (!acc[type]) {
        broken = true
        break
      }
      if (!acc[type].has(arg)) {
        broken = true
        break
      }
      acc = acc[type].get(arg)
    }
    if (!broken) {
      return acc
    }
    const result = fn(args)
    acc = cache
    for (let index = 0; index < keys.length; index++) {
      const isLast = index === keys.length - 1
      const key = keys[index]
      const arg = args[key]
      const type =
        ['object', 'function'].includes(typeof arg) && arg !== null
          ? 'objectLike'
          : 'primitive'
      acc[type] =
        acc[type] || (type === 'objectLike' ? new WeakMap() : new Map())
      if (!acc[type].has(arg)) {
        if (isLast) {
          acc[type].set(arg, result)
        } else {
          acc[type].set(arg, {})
        }
      }
      acc = acc[type].get(arg)
    }
    return result
  }
}
