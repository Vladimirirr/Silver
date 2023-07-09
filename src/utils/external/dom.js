import { isBoolean, camelize, toTagName } from '../internal/index.js'
import { cpdp } from '../../constants/index.js'

export const toAttr = (name, value, keepType = false) => {
  if (isBoolean(value)) {
    return value ? `${name}` : ''
  } else {
    if (keepType) {
      return `${camelize(name, true)}="${cpdp}"`
    } else {
      return `${name}="${value}"`
    }
  }
}

export const toComponent = (component) => toTagName(component.name)
