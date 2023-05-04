import { isBoolean } from './index.js'

export const attr = {
  calc(name, value) {
    if (isBoolean(value)) {
      return value ? `${name}` : ''
    } else {
      return `${name}="${value}"`
    }
  },
}
