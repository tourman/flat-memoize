# flat-memoize

Memoizes monadic functions with named arguments.

## Installation

```sh
npm install --save flat-memoize
```

## Basic Usage Points

- It works with monadic functions, which have only a single argument served as an object using named parameters.
- Each parameter can be any type.
- The memoized function is not supposed to be called in scope of an object.

```js
const memoize = require('flat-memoize')
const fn = (args) => {
  console.log(args)
  return args
}
const memoized = memoize(fn)

const o = {}
// calls `fn` and puts the result in the cache
memoized({ n: 1, o })
// calls `fn` and puts the result in the cache as the key `u` is new
memoized({ n: 1, o, u: undefined })
// returns `{ n: 1, o }` from the cache
memoized({ n: 1, o })
// returns `{ n: 1, o, u: undefined }` from the cache
memoized({ n: 1, o, u: undefined })
```

## TODO List

- [ ] Benchmark tests and performance improvements
- [ ] Types
- [ ] TS
- [ ] Error flows
- [ ] Install `pict`
- [ ] ES6 classes
- [ ] ES module
