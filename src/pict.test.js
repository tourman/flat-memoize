/* eslint-disable prefer-arrow-callback */
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
  const testOneCall = (arrangeAndAct) => {
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
  }
  const testTwoCalls = (arrangeAndAct) => {
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
  }
  describe('0   3       same       same         same                   undefined          same', () => {
    testOneCall(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { o: {}, n: 1, u: undefined }
      const a = memoized({ ...args })
      const b = memoized({ ...args })
      return { fn, a, b }
    })
  })
  describe('1   1       same       one-less     same                   undefined          same', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { o: {} }
      const a = memoized({ ...args })
      const b = memoized({})
      return { fn, a, b }
    })
  })
  describe('2   1       shuffle    one-more     first                  objectLike         another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { n: 1 }
      const a = memoized({ ...args })
      const b = memoized({ o: () => {}, ...args })
      return { fn, a, b }
    })
  })
  describe('3   0       same       same         same                   undefined          same', () => {
    testOneCall(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({})
      const b = memoized({})
      return { fn, a, b }
    })
  })
  describe('4   3       shuffle    change-one   first                  primitive          same', () => {
    testOneCall(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { n: 1, f: () => {}, o: {} }
      const a = memoized({ ...args, n: 1 })
      const b = memoized({ ...args })
      return { fn, a, b }
    })
  })
  describe('5   1       same       change-one   same                   primitive          another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({ n: 1 })
      const b = memoized({ n: 2 })
      return { fn, a, b }
    })
  })
  describe('6   3       same       one-more     last                   objectLike         same', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const args = { f: () => {}, o: {}, n: 1 }
      const a = memoized({ ...args })
      const b = memoized({ ...args, d: new Date() })
      return { fn, a, b }
    })
  })
  describe('7   3       shuffle    one-more     last                   undefined          another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const f = () => {}
      const o = []
      const n = 1
      const a = memoized({ f, o, n })
      const b = memoized({ o, n, f, u: undefined })
      return { fn, a, b }
    })
  })
  describe('8   1       shuffle    one-more     last                   primitive          another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const f = () => {}
      const a = memoized({ f })
      const b = memoized({ f, s: '-' })
      return { fn, a, b }
    })
  })
  describe('9   3       shuffle    one-less     same                   undefined          same', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const f = () => {}
      const s = Symbol('s')
      const a = memoized({ f, s, u: undefined })
      const b = memoized({ s, f })
      return { fn, a, b }
    })
  })
  describe('10  1       same       same         same                   undefined          same', () => {
    testOneCall(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({ u: undefined })
      const b = memoized({ u: undefined })
      return { fn, a, b }
    })
  })
  describe('11  3       shuffle    change-one   same                   objectLike         another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const o = []
      const n = 1
      const a = memoized({ o, f: () => {}, n })
      const b = memoized({ n, f: () => {}, o })
      return { fn, a, b }
    })
  })
  describe('12  0       same       one-more     first                  objectLike         another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({})
      const b = memoized({ o: [] })
      return { fn, a, b }
    })
  })
  describe('13  3       shuffle    one-more     first                  undefined          same', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const o = {}
      const f = () => {}
      const n = null
      const a = memoized({ o, f, n })
      const b = memoized({ u: undefined, f, o, n })
      return { fn, a, b }
    })
  })
  describe('14  3       shuffle    same         same                   undefined          same', () => {
    testOneCall(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const o = {}
      const n = null
      const u = undefined
      const a = memoized({ o, u, n })
      const b = memoized({ n, u, o })
      return { fn, a, b }
    })
  })
  describe('15  0       same       one-more     first                  primitive          another', () => {
    testTwoCalls(function arrangeAndAct() {
      const fn = jest.fn((args) => args)
      const memoized = memoize(fn)
      const a = memoized({})
      const b = memoized({ n: null })
      return { fn, a, b }
    })
  })
})
