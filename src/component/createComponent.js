import SilverComponent from '../base/index.js'

import mixinState from './mixins/state.js'
import mixinEvent from './mixins/event.js'
import mixinLifecycle from './mixins/lifecycle.js'
import mixinProps from './mixins/props.js'

import { camelize, log } from '../utils/internal/index.js'

const createComponent = (component, options) => {
  const resolvedOptions = Object.assign(
    {
      props: component.props || [],
      emits: component.emits || [],
    },
    options
  )
  return class extends SilverComponent {
    constructor() {
      super(resolvedOptions)

      // component itself
      const instance = this

      // component name
      instance.name = component.name || 'unknown'

      // component update used outside
      this.updateBound = this.update.bind(this)

      // mxin the core parts of the component
      mixinState(this)
      mixinEvent(this)
      mixinLifecycle(this)
      mixinProps(this)

      instance.init()
    }
    init() {
      const instance = this

      instance.baseInit()

      const result = component.initialize(instance)
      instance.$render = result.render
      instance.$style = result.style

      // add the core parts cleanup function in last
      instance.lifecycle('unmounted', () => {
        instance.state.clear()
        instance.event.clear()
        instance.lifecycle.clear()
        instance.props.clear()
      })
    }
    update() {
      const instance = this

      if (instance.status == 'ended') {
        throw 'Update called invalidly.'
      }

      instance.rootNode.innerHTML = this.baseUpdate()

      if (instance.status == 'running') {
        instance.lifecycle.call('updated')
      }
    }
    // This static method will be called by `customElements.define` on first.
    static get observedAttributes() {
      const { props } = resolvedOptions
      const needObserving = props.map((i) => camelize(i, true))
      log('observing these attributes', needObserving)
      return needObserving
    }
  }
}

export default createComponent
