import SilverComponent from './base/index.js'

import { enqueueUpdater, beginUpdate, resetUpdate } from './scheduler/index.js'

import { DelegatedEvents } from './base/constant.js'
import { isBoolean, isNotSameValue } from './utils/index.js'

const createComponent = (component, options) => {
  const resolvedOptions = Object(
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

      {
        // init the core parts of the component

        // the props
        instance.props = {}

        // state system
        instance.state = {
          data: new Map(),
          get(name) {
            return this.data.get(name)
          },
          add(name, initial) {
            this.set(name, initial)
          },
          set(name, newValue) {
            const oldValue = this.get(name)
            this.data.set(name, newValue)
            if (instance.status == 'running') {
              if (isNotSameValue(oldValue, newValue)) {
                instance.update()
              }
            }
          },
        }

        // set the DOM attribute
        instance.attr = {
          calc(name, value) {
            if (isBoolean(value)) {
              return value ? `${name}` : ''
            } else {
              return `${name}="${value}"`
            }
          },
        }

        // set the DOM event
        instance.event = {
          data: new Map(),
          id: 0,
          listen(name, handler) {
            if (!DelegatedEvents.includes(name)) {
              throw 'Does not support the event currently.'
            }
            const eid = this.id++
            this.data.set(eid, {
              name,
              handler,
            })
            return `data-listening="${eid}"`
          },
          run(eid, event) {
            eid = +eid
            const { handler } = this.data.get(eid)
            handler.call(event, event)
          },
        }

        // the lifecycle
        instance.lifecycle = {
          data: new Map(),
          on(name, hook) {
            const hooks = this.data.get(name)
            if (hooks) {
              hooks.push(this.data.set(name, hook))
            } else {
              this.data.set(name, [hook])
            }
          },
          call(name) {
            const hooks = this.data.get(name)
            hooks?.forEach((hook) => hook()) // NOT `hook.call(this)` because that defining a component is a pure function
          },
        }
      }

      instance.init()
    }
    init() {
      const instance = this

      instance.baseInit()

      const result = component.initialize(instance)
      instance.$render = result.render
      instance.$style = result.style

      // add the core parts cleanup function in last
      instance.lifecycle.on('unmounted', () => {
        instance.state.data.clear()

        instance.event.data.clear()
        instance.event.id = 0

        instance.lifecycle.data.clear()
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
  }
}

export default createComponent
