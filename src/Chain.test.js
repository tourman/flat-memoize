const Chain = require('./Chain')

describe('Chain', () => {
  describe('has', () => {
    describe('nothing', () => {
      it('should return false', () => {
        const chain = new Chain()
        const result = chain.has({ u: undefined, o: {}, n: 1 })
        expect(result).toBe(false)
      })
    })
    describe('another arguments', () => {
      it('should return false', () => {
        const chain = new Chain()
        chain.set({ u: undefined, n: 1 })
        const result = chain.has({ u: undefined, o: {}, n: 1 })
        expect(result).toBe(false)
      })
    })
    describe('same arguments', () => {
      it('should return true', () => {
        const chain = new Chain()
        const f = () => {}
        chain.set({ u: undefined, n: 1, f })
        const result = chain.has({ f, u: undefined, n: 1 })
        expect(result).toBe(true)
      })
    })
  })
  describe('get', () => {
    describe('nothing', () => {
      it('should throw', () => {
        const chain = new Chain()
        expect(() => chain.get({ u: undefined, o: {}, n: 1 })).toThrow()
      })
    })
    describe('another arguments', () => {
      it('should throw', () => {
        const chain = new Chain()
        chain.set({})
        expect(() => chain.get({ u: undefined, o: {}, n: 1 })).toThrow()
      })
    })
    describe('same arguments', () => {
      it('should return', () => {
        const chain = new Chain()
        const expected = {}
        chain.set({}, expected)
        const result = chain.get({})
        expect(result).toBe(expected)
      })
    })
  })
})
