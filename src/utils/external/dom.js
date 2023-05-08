import { isBoolean, toTagName } from '../internal/index.js'

export const toAttr = (name, value) => {
  if (isBoolean(value)) {
    return value ? `${name}` : ''
  } else {
    return `${name}="${value}"`
  }
}

export const toComponent = (component) => toTagName(component.name)
