const memoize = require('.')

/**
 * Criteria yet to be combined and tested
 * - num of arguments: 0, 1, 3
 * - key order: same, shuffle
 * - second call arguments: -1, 0, +1, ±1
 * - new argument sorted position: before all, same, after all
 * - new argument type: undefined, objectLike, primitive
 * - new argument equality: same, another
 *
 * The cases are formed with `npm run comb`
 */
describe('memoize', () => {
  describe('0   3       same       same         same                   undefined          same', () => {
    function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { o: {}, n: 1, u: undefined }
      const a = memoized({ ...args })
      const b = memoized({ ...args })
      return { fn, a, b }
    }
    it('should be called once', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should return the same result', () => {
      const { a, b } = arrangeAndAct()
      expect(b).toBe(a)
    })
    it('should have the same result for the call', () => {
      const { a, fn } = arrangeAndAct()
      expect(a).toBe(fn.mock.results[0].value)
    })
  })
  describe('1   1       same       one-less     same                   undefined          same', () => {
    function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { o: {} }
      const a = memoized({ ...args })
      const b = memoized({})
      return { fn, a, b }
    }
    it('should be called twice', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(2)
    })
    it('should return another result', () => {
      const { a, b } = arrangeAndAct()
      expect(b).not.toBe(a)
    })
    it('should have the same result for the first call', () => {
      const { a, fn } = arrangeAndAct()
      expect(a).toBe(fn.mock.results[0].value)
    })
    it('should have the same result for the second call', () => {
      const { b, fn } = arrangeAndAct()
      expect(b).toBe(fn.mock.results[1].value)
    })
  })
  describe('2   1       shuffle    one-more     first                  objectLike         another', () => {
    function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { n: 1 }
      const a = memoized({ ...args })
      const b = memoized({ o: () => {}, ...args })
      return { fn, a, b }
    }
    it('should be called twice', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(2)
    })
    it('should return another result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).not.toBe(b)
    })
    it('should have the same result for the first call', () => {
      const { a, fn } = arrangeAndAct()
      expect(a).toBe(fn.mock.results[0].value)
    })
    it('should have the same result for the second call', () => {
      const { b, fn } = arrangeAndAct()
      expect(b).toBe(fn.mock.results[1].value)
    })
  })
  describe('3   0       same       same         same                   undefined          same', () => {
    function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({})
      const b = memoized({})
      return { fn, a, b }
    }
    it('should be called once', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should return the same result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).toBe(b)
    })
    it('should have the same result for the call', () => {
      const { a, fn } = arrangeAndAct()
      expect(a).toBe(fn.mock.results[0].value)
    })
  })
  describe('4   3       shuffle    change-one   first                  primitive          same', () => {
    function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { f: () => {}, o: {} }
      const a = memoized({ ...args, n: 1 })
      const b = memoized({ n: 1, ...args })
      return { fn, a, b }
    }
    it('should be called once', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should return the same result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).toBe(b)
    })
    it('should have the same result for the call', () => {
      const { a, fn } = arrangeAndAct()
      expect(a).toBe(fn.mock.results[0].value)
    })
  })
})
