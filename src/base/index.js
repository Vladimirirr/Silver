import { DelegatedEvents, UseCapture, DefaultOptions } from './constants.js'

import {
  Empty,
  isNotSameValue,
  camelize,
  reportMsg,
} from '../utils/internal/index.js'
import { eventDelegator, getBaseId } from './utils.js'

import scheduleUpdate from '../scheduler/index.js'

// These are all effect features, which build the whole effect system for Silver components.
import mixinState from './mixins/state.js'
import mixinEvent from './mixins/event.js'
import mixinLifecycle from './mixins/lifecycle.js'
import mixinProps from './mixins/props.js'

/**
 * The SilverComponent Class definition.
 * An attribute with prefix "$" means that it is passed or derived from outside environment.
 */
export default class SilverComponent extends HTMLElement {
  constructor(component, options) {
    super()

    // set id
    this.baseId = getBaseId()

    // save the meta data
    this.$component = component
    this.$options = Object.assign({}, DefaultOptions, options)

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
  }
  init() {
    this.status = 'preparing'

    const result = this.$component.initialize(this)
    this.$render = result.render
    this.$style = result.style || ''

    // add the event delegator
    this.eventDelegator = (event) => eventDelegator(event, this)
    DelegatedEvents.forEach((eventName) => {
      // Use capture mode to avoid that can not receive these events processed by stopPropagation.
      this.content.addEventListener(eventName, this.eventDelegator, UseCapture)
    })

    // render style
    this.styleNode.textContent = this.$style
    // render view
    this.update()

    this.lifes++

    this.status = 'running'
  }
  fresh() {
    // do diff and patch on the new and old view
    // for now, just using innerHTML
    this.rootNode.innerHTML = this.$render(this.props)
  }
  update() {
    const isInMount = ['beforeMount', 'mounted']
    const isInUpdate = ['beforeUpdate', 'updated']
    const s = this.status
    let lc = [] // lc = lifecycle list
    switch (s) {
      case 'preparing':
        lc = isInMount
        break
      case 'running':
        lc = isInUpdate
        break
      default:
        reportMsg('Can not do update when component is not running.', this.name)
        return
    }

    this.lifecycle.call(lc[0])

    this.fresh()

    this.lifecycle.call(lc[1])
  }
  callUpdate(immediate) {
    if (this.status == 'running') {
      if (immediate) {
        this.updateBound()
      } else {
        scheduleUpdate(this.updateBound)
      }
    }
  }
  sendData(name, data) {
    const oldData = this.props[name]
    const newData = data
    if (isNotSameValue(oldData, newData)) {
      this.props.set(name, newData)
      this.callUpdate()
    }
  }
  connectedCallback() {
    const { $options } = this
    if (this.lifes == 0) {
      {
        // create the shadow dom
        const mode = $options.closeShadow ? 'closed' : 'open'
        this.content = this.attachShadow({ mode })
      }
      {
        // init component style node
        const styleNode = document.createElement('style')
        styleNode.id = 'componentStyle'
        this.content.appendChild(styleNode)
        this.styleNode = styleNode

        // Using the newer "adoptedStyleSheets" api to set global styles for a document may be the best practice.
      }
      {
        // init root container node
        const rootNode = document.createElement('div')
        rootNode.id = 'root'
        rootNode.className = 'root'
        this.content.appendChild(rootNode)
        this.rootNode = rootNode
      }
    }

    this.init()
  }
  disconnectedCallback() {
    this.lifecycle.call('beforeUnmount')

    // remove all event listeners
    DelegatedEvents.forEach((eventName) => {
      // do remove
      this.content.removeEventListener(
        eventName,
        this.eventDelegator,
        UseCapture
      )
    })

    // clear content
    this.rootNode.innerHTML = ''
    this.styleNode.innerHTML = ''

    // clear $render and $style
    this.$render = Empty
    this.$style = Empty

    this.lifecycle.call('unmounted')

    // clear all core parts
    this.state.clear()
    this.event.clear()
    this.lifecycle.clear()
    // this.props.clear() // DO NOT CLEAR PROPS

    this.status = 'ended'
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (isNotSameValue(oldValue, newValue)) {
      this.props.set(camelize(name), newValue)
      if (this.status == 'running') {
        this.callUpdate()
      }
    }
  }
}
