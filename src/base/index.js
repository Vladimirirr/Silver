import { DelegatedEvents, UseCapture, DefaultOptions } from './constants.js'

import { isNotSameValue, camelize } from '../utils/internal/index.js'
import { eventDelegator } from './utils.js'

import scheduleUpdate from '../scheduler/index.js'

import mixinState from './mixins/state.js'
import mixinEvent from './mixins/event.js'
import mixinLifecycle from './mixins/lifecycle.js'
import mixinProps from './mixins/props.js'

export default class SilverComponent extends HTMLElement {
  constructor(component, options) {
    super()

    // save the meta data
    this.component = component
    this.options = Object.assign({}, DefaultOptions, options)

    // how many times the component had been mounted and unmounted
    this.lifes = 0

    // internal status: constructing, preparing, running, ended
    // the constructing only appears once
    this.status = 'constructing'

    // mxin all core parts of the component
    mixinState(this)
    mixinEvent(this)
    mixinLifecycle(this)
    mixinProps(this)

    this.init()
  }
  init() {
    this.status = 'preparing'

    const result = this.component.initialize(this)
    this.$render = result.render
    this.$style = result.style
  }
  update() {
    if (this.status == 'ended') {
      throw 'Can not call the update when component already has been ended.'
    }

    this.rootNode.innerHTML = this.$render(this.props)

    if (this.status == 'running') {
      this.lifecycle.call('updated')
    }
  }
  scheduleUpdate() {
    if (this.status == 'running') {
      scheduleUpdate(this.updateBound)
    }
  }
  sendData(name, data) {
    const oldData = this.props[name]
    const newData = data
    if (isNotSameValue(oldData, newData)) {
      this.props.set(name, newData)
      this.update()
    }
  }
  connectedCallback() {
    const { options } = this
    if (this.lifes == 0) {
      {
        // create the shadow dom
        const mode = options.closeShadow ? 'closed' : 'open'
        this.content = this.attachShadow({ mode })
      }
      {
        // init component style node
        const styleNode = document.createElement('style')
        styleNode.id = 'componentStyle'
        styleNode.textContent = this.$style
        this.content.appendChild(styleNode)
        this.styleNode = styleNode
      }
      {
        // init root container node
        const rootNode = document.createElement('div')
        rootNode.id = 'root'
        rootNode.className = 'root'
        this.content.appendChild(rootNode)
        this.rootNode = rootNode
      }
    } else {
      this.init()
    }

    this.eventDelegator = (event) => eventDelegator(event, this)
    DelegatedEvents.forEach((eventName) => {
      // Use capture mode to avoid that can not receive these events processed by stopPropagation.
      this.content.addEventListener(eventName, this.eventDelegator, UseCapture)
    })

    // first update
    this.update()

    this.lifecycle.call('mounted')

    this.status = 'running'

    this.lifes++
  }
  disconnectedCallback() {
    this.lifecycle.call('beforeUnmount')

    // // remove all event listeners
    // DelegatedEvents.forEach((eventName) => {
    //   // do remove
    //   this.content.removeEventListener(
    //     eventName,
    //     this.eventDelegator,
    //     UseCapture
    //   )
    // })

    // // clear all core parts
    // this.state.clear()
    // this.event.clear()
    // this.lifecycle.clear()
    // this.props.clear()

    // // clear content
    // this.rootNode.innerHTML = ''
    // this.styleNode.innerHTML = ''

    this.lifecycle.call('unmounted')

    this.status = 'ended'
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (isNotSameValue(oldValue, newValue)) {
      this.props.set(camelize(name), newValue)
      if (this.status == 'running') {
        this.update()
      }
    }
  }
}
