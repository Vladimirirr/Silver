import { isBoolean, toTagName } from '../internal/index.js'

export const toAttr = (name, value, keepType = false) => {
  if (isBoolean(value)) {
    return value ? `${name}` : ''
  } else {
    if (keepType) {
      // set the a props channel for the prop
    } else {
      return `${name}="${value}"`
    }
  }
}

export const toComponent = (component) => toTagName(component.name)
