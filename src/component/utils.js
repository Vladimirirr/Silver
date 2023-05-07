import { isArray, isFunction, isEmpty } from '../utils/internal/index.js'

// format component itself
export const formatCompoent = (component) => {
  const c = component // short name

  if (!isFunction(c.initialize)) {
    throw 'A component must have initialize.'
  }

  // DO NOT use dynamic name with loop to check and set.
  // BECAUSE it is slower than just set with static.
  c.name = c.name + ''
  c.props = isArray(c.props) ? c.props : []
  c.emits = isArray(c.emits) ? c.emits : []
  c.components = isArray(c.components) ? c.components : []
  return c
}

// format component carried options removing all Empty attrs
export const formatCompoentCarriedOptions = (options) =>
  Object.keys(options).reduce((acc, cur) => {
    const v = options[cur]
    return isEmpty(v) ? acc : (acc[cur] = v)
  }, {})
