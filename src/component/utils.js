import { isArray } from '../utils/internal/index.js'

export const formatCompoentOptions = (component) => {
  component.props = isArray(component.props) ? component.props : []
  component.emits = isArray(component.emits) ? component.emits : []
  component.name = component.name + ''
  return component
}
