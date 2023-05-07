import { isArray, isFunction } from '../utils/internal/index.js'

export const formatCompoentOptions = (component) => {
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
