import SilverComponent from '../base/index.js'

import { isObject, getObject, camelize } from '../utils/internal/index.js'
import { formatCompoentOptions } from './utils.js'

/**
 * Create a initialized component class based on SilverComponent.
 * @param {Object} component
 * @param {Object} options
 * @return {SilverInitializedComponent}
 */
const createComponent = (component, options) => {
  component = formatCompoentOptions(component)
  options = isObject(options) ? options : getObject()
  return class SilverInitializedComponent extends SilverComponent {
    constructor() {
      super(component, options)

      // component name
      this.name = component.name

      // component update with bound
      this.updateBound = this.update.bind(this)
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
