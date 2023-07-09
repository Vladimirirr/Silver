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
export const isFunction = (v) => typeof v == 'function'
export const isObject = (v) => typeof v == 'object' && v !== null
export const isArray = (v) => Array.isArray(v)

/**
 * get a value's type.
 * @param {any} v
 * @return {string}
 */
export const getType = (v) => {
  switch (typeof v) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'bigint':
      return 'bigint'
    case 'symbol':
      return 'symbol'
    case 'undefined':
      return 'undefined'
    case 'function':
      return 'function'
    case 'object':
      if (v === null) return 'null'
      if (isArray(v)) return 'Array'
      return 'Object'
  }
}

/**
 * get a brand new object
 * @return {Object}
 */
export const getObject = () => ({})

/**
 * make a char Uppercase or Lowercase in a string
 * @param {string} str - a string
 * @param {number} pos - 0 meas first and -1 means last
 * @param {string} toWhat - 'Upper' | 'Lower'
 * @return {string}
 */
export const makeCharUpperOrLower = (str, pos, toWhat) => {
  const strLen = str.length

  if (pos < 0) {
    // make sure pos >= 0
    pos = Math.max(0, strLen - pos)
  }
  // make sure pos <= strLen - 1
  pos = Math.min(strLen - 1, pos)

  const theChar = str[pos]
  const theCharRes = theChar[`to${toWhat}Case`]()
  const res = Array.from(str)

  res.splice(pos, 1, theCharRes)

  return res.join('')
}

/**
 * make a name camelized or dashed determined by the reverse
 * @param {string} name - name to be format
 * @param {boolean} reverse - false = make camelized, true = make dashed
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
 * transform a component name to HTML tag name
 * @param {string} name
 * @return {string}
 */
export const toTagName = (name) =>
  camelize(makeCharUpperOrLower(name, 0, 'Lower'), true)

/**
 * report something
 * - use error-style report for internal errors
 * - use warn-style report for user code errors
 * @param {string | Error} msg
 * @param {string} name
 * @param {string} desc
 * @param {'info' | 'warn' | 'error'} type
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

/**
 * wipe all attributes with Empty value
 * @param {Object} object
 * @return {Object}
 */
export const wipeEmptyAttrs = (object) =>
  Object.keys(object).reduce((acc, cur) => {
    const v = object[cur]
    return isEmpty(v) ? acc : ((acc[cur] = v), acc)
  }, {})
