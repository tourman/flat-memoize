const Chain = require('./Chain')

// Todo: make it right
module.exports = function memoize(fn) {
  const cache = new Chain()
  // eslint-disable-next-line func-names
  return function (args) {
    if (cache.has(args)) {
      return cache.get(args)
    }
    const result = fn(args)
    cache.set(args, result)
    return result
  }
}
