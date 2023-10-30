const Chain = require('./Chain')

describe('Chain', () => {
  describe('get', () => {
    describe('nothing', () => {
      it('should return undefined', () => {
        const chain = new Chain()
        chain.set({ n: 1 }, 'test string')
        const result = chain.get({ u: undefined, o: {}, n: 1 })
        expect(result).toBe(undefined)
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
