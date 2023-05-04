import { DelegatedEvents } from './constants/index.js'
import {
  isBoolean,
  isNotSameValue,
  camelize,
  eventDelegator,
} from './utils/index.js'

const createComponent = (component) => {
  return class extends HTMLElement {
    constructor() {
      super()

      // component itself
      const instance = this

      // how many times the component had been mounted and unmounted
      instance.lifes = 0

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
            this.data.set(name, hook)
          },
          trigger(name) {
            const hook = this.data.get(name)
            hook?.()
          },
        }
      }

      instance.init()
    }
    init() {
      const instance = this

      // internal status: preparing, running, ended
      instance.status = 'preparing'

      const result = component.initialize(instance)
      instance.$render = result.render
      instance.$style = result.style
    }
    update() {
      const instance = this

      if (instance.status == 'ended') {
        throw 'Update called invalidly.'
      }

      instance.rootNode.innerHTML = instance.$render(instance.props)

      if (instance.status == 'running') {
        instance.lifecycle.trigger('updated')
      }
    }
    connectedCallback() {
      const instance = this

      if (instance.lifes == 0) {
        instance.content = instance.attachShadow({ mode: 'open' })
      } else {
        // reuse it
        instance.init()
      }

      {
        // init style
        const styleNode = document.createElement('style')
        styleNode.id = 'componentStyle'
        styleNode.textContent = instance.$style
        instance.content.appendChild(styleNode)
      }
      {
        // init root container node
        const rootNode = document.createElement('div')
        rootNode.id = 'root'
        rootNode.className = 'root'
        instance.content.appendChild(rootNode)
        instance.rootNode = rootNode
      }

      instance.eventDelegator = (event) => eventDelegator(event, instance)
      DelegatedEvents.forEach((eventName) => {
        instance.content.addEventListener(
          eventName,
          instance.eventDelegator,
          true
        )
      })

      // first update
      instance.update()

      instance.lifecycle.trigger('mounted')

      instance.status = 'running'

      instance.lifes++
    }
    disconnectedCallback() {
      const instance = this

      instance.lifecycle.trigger('beforeUnmount')

      // remove all event listeners
      DelegatedEvents.forEach((eventName) => {
        instance.content.removeEventListener(
          eventName,
          instance.eventDelegator,
          true
        )
      })

      // clear content
      instance.rootNode.innerHTML = ''
      instance.content.innerHTML = ''

      instance.lifecycle.trigger('unmounted')

      {
        // clear all core parts
        instance.state.data.clear()

        instance.event.data.clear()
        instance.event.id = 0

        instance.lifecycle.data.clear()
      }

      instance.status = 'ended'
    }
    static get observedAttributes() {
      const needObserving = component.props.map((i) => camelize(i, true))
      console.log('observing these attributes', needObserving)
      return needObserving
    }
    attributeChangedCallback(name, oldValue, newValue) {
      const instance = this
      if (isNotSameValue(oldValue, newValue)) {
        instance.props[camelize(name)] = newValue
        if (instance.status == 'running') {
          instance.update()
        }
      }
    }
  }
}

export default createComponent
