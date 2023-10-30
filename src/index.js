const Chain = require('./Chain')

function Thrown(error) {
  this.error = error
}

function Container(value) {
  this.value = value
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
  let hits = 0
  // eslint-disable-next-line func-names
  return Object.assign(
    // eslint-disable-next-line prefer-arrow-callback, func-names
    function (args) {
      let result
      result = cache.get(args)
      if (result instanceof Container) {
        hits++
        return throwOrReturn(result.value)
      }
      try {
        result = fn(args)
      } catch (error) {
        result = new Thrown(error)
      }
      cache.set(args, new Container(result))
      return throwOrReturn(result)
    },
    {
      hits() {
        return hits
      },
    },
  )
}
