import { HoleMark } from './constants.js'

// A receiver for tagged template.
const html = (strs, ...vals) => ({
  template: strs.join(HoleMark),
  strs,
  vals,
})

export default html
