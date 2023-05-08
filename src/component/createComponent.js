import SilverComponent from '../base/index.js'

import { camelize, toTagName } from '../utils/internal/index.js'
import { formatCompoent, formatCompoentCarriedOptions } from './utils.js'

/**
 * Create a initialized component class based on SilverComponent.
 * @param {Object} component
 * @param {Object} options
 * @return {SilverInitializedComponent}
 */
const createComponent = (component, options) => {
  component = formatCompoent(component) // modified on itself
  options = formatCompoentCarriedOptions(options) // return a new options object
  return class SilverInitializedComponent extends SilverComponent {
    constructor() {
      super(component, options)

      // component name
      this.name = component.name

      // define its children
      component.components.forEach((c) => {
        const tagName = toTagName(c.name)
        const componentCarriedOptions = Object.assign({}, options, {
          parent: this,
        })
        const componentClass = createComponent(c, componentCarriedOptions)
        customElements.define(tagName, componentClass)
      })
    }
    // This static method will be called by `customElements.define` on first.
    static get observedAttributes() {
      const { props } = component
      const needObserving = props.map((i) => camelize(i, true))
      return needObserving
    }
  }
}

export default createComponent
