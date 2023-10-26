const Chain = require('./Chain')

function Thrown(error) {
  this.error = error
}

function throwOrReturn(value) {
  if (value instanceof Thrown) {
    throw value.error
  }
  return value
}

// Todo: make it right
module.exports = function memoize(fn) {
  const cache = new Chain()
  // eslint-disable-next-line func-names
  return function (args) {
    if (cache.has(args)) {
      return throwOrReturn(cache.get(args))
    }
    let result
    try {
      result = fn(args)
    } catch (error) {
      result = new Thrown(error)
    }
    cache.set(args, result)
    return throwOrReturn(result)
  }
}
