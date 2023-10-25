const memoize = require('.')

/**
 * Criteria yet to be combined and tested
 * - num of arguments: 0, 1, 3
 * - key order: same, shuffle
 * - second call arguments: -1, 0, +1, ±1
 * - new argument sorted position: before all, same, after all
 * - new argument type: undefined, objectLike, primitive
 * - new argument equality: same, another
 */
describe('memoize', () => {
  function arrange() {
    const fn = jest.fn((args) => args)
    const memoized = memoize(fn)
    const o = {}
    const f = () => {}
    const s = Symbol('s')
    const args = { n: 1, o, f, s, l: null, u: undefined }
    return { fn, memoized, args }
  }
  describe('the same set of objects and primitives', () => {
    function arrangeAndAct() {
      const payload = arrange()
      const { args, memoized } = payload
      const a = memoized({ ...args })
      const b = memoized({ ...args })
      return { ...payload, a, b }
    }
    it('should be called once', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(1)
    })
    it('should return the same result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).toBe(b)
    })
  })
  describe('with extra arguments', () => {
    function arrangeAndAct() {
      const payload = arrange()
      const { args, memoized } = payload
      const a = memoized({ ...args })
      const b = memoized({ ...args, extraObject: {} })
      return { ...payload, a, b }
    }
    it('should be called twice', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(2)
    })
    it('should return another result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).not.toBe(b)
    })
  })
  describe('with less arguments', () => {
    function arrangeAndAct() {
      const payload = arrange()
      const { args, memoized } = payload
      const a = memoized({ ...args, extraObject: {} })
      const b = memoized({ ...args })
      return { ...payload, a, b }
    }
    it('should be called twice', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(2)
    })
    it('should return another result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).not.toBe(b)
    })
  })
  describe('with same keys but different values', () => {
    function arrangeAndAct() {
      const payload = arrange()
      const { args, memoized } = payload
      const a = memoized({ ...args, extra: {} })
      const b = memoized({ ...args, extra: undefined })
      return { ...payload, a, b }
    }
    it('should be called twice', () => {
      const { fn } = arrangeAndAct()
      expect(fn).toHaveBeenCalledTimes(2)
    })
    it('should return another result', () => {
      const { a, b } = arrangeAndAct()
      expect(a).not.toBe(b)
    })
  })
})
