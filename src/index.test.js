const memoize = require('.')

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

describe('memoize', () => {
  describe('error flow', () => {
    describe('wrong argument', () => {
      describe.each([undefined, null, 3, 'string', Symbol('s')])('%p', () => {
        it('should throw', () => {
          const memoized = memoize(() => {})
          expect(() => memoized()).toThrow()
        })
      })
    })
    describe('exception', () => {
      describe('thrown', () => {
        function arrangeAndAct() {
          const fn = jest.fn(() => {
            throw new Error('Thrown')
          })
          const memoized = memoize(fn)
          const errors = []
          try {
            memoized({})
          } catch (error) {
            errors.push(error)
          }
          try {
            memoized({})
          } catch (error) {
            errors.push(error)
          }
          return { fn, errors }
        }
        it('should be called once', () => {
          const { fn } = arrangeAndAct()
          expect(fn).toHaveBeenCalledTimes(1)
        })
        it('should throw same exception', () => {
          const { errors } = arrangeAndAct()
          expect(errors[1]).toBe(errors[0])
        })
      })
      describe('returned', () => {
        function arrangeAndAct() {
          const fn = jest.fn(() => new Error('Returned'))
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
          expect(b).toBe(a)
        })
      })
    })
  })
})
