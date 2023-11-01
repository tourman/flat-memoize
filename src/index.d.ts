declare const memoize: <F extends (...args: any) => any>(
  fn: F,
) => F & { hits: () => number }

export default memoize
