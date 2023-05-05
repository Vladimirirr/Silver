import { isBoolean } from '../internal/index.js'

export const attr = (name, value) => {
  if (isBoolean(value)) {
    return value ? `${name}` : ''
  } else {
    return `${name}="${value}"`
  }
}
