export const Empty = undefined

export const isEmpty = (v) => v === Empty
export const isNotEmpty = (v) => !isEmpty(v)
export const isSameValue = (a, b) => a === b
export const isNotSameValue = (a, b) => !isSameValue(a, b)
export const isFalse = (v) => !v
export const isTrue = (v) => !!v

export const isBoolean = (v) => typeof v == 'boolean'
export const isNumber = (v) => typeof v == 'number'
export const isString = (v) => typeof v == 'string'
export const isObject = (v) => typeof v == 'object' && v !== null
export const isArray = (v) => isObject(v) && isNotEmpty(v.length)

/**
 * get a brand new object
 * @return {Object}
 */
export const getObject = () => ({})

/**
 * make a name camelized or dashed determined by the reverse
 * @param {string} name - name to be format
 * @param {boolean} reverse - true = make camelized, false = make dashed
 * @return {string}
 */
export const camelize = (name, reverse = false) => {
  const reg = reverse ? /(\w)([A-Z])/g : /-(\w)/g
  const replacer = reverse
    ? (_, g1, g2) => `${g1}-${g2.toLowerCase()}`
    : (_, g) => `${g.toUpperCase()}`
  return name.replace(reg, replacer)
}

/**
 * report something
 * - internal errors use error-style report
 * - user code errors use warn-style report
 * @param {string | Error} msg
 * @param {string} desc
 * @param {string} name
 * @param {string} type
 */
export const reportMsg = (msg, name = '', desc = '', type = 'warn') => {
  const report = console[type]
  const descPart = desc ? `[${desc}]` : ''
  report(`[Silver]${descPart}: ${msg} [in ${name}]`)
}

/**
 * run a function with try-catch
 * @param {Function} fn
 * @param {Array} args
 * @param {any} thisArg
 * @return {[boolean, any]}
 */
export const tryCatch = (fn, args = [], thisArg = null) => {
  try {
    return [true, fn.apply(thisArg, args)]
  } catch (err) {
    return [false, err]
  }
}
