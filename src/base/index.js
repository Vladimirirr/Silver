import { DefaultOptions, HooksInMount, HooksInUpdate } from './constants.js'

import {
  Empty,
  isNotSameValue,
  camelize,
  reportMsg,
} from '../utils/internal/index.js'
import { createEventDelegator, getBaseId } from './utils.js'

import scheduleUpdate from '../scheduler/index.js'

// These are all effect features, which build the whole effect system for Silver components.
import mixinState from './mixins/state.js'
import mixinEvent from './mixins/event.js'
import mixinLifecycle from './mixins/lifecycle.js'
import mixinProps from './mixins/props.js'
import mixinRelationship from './mixins/relationship.js'

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

    // lifes times (mounted and unmounted for one time)
    this.lifes = 0

    // internal status: constructing, preparing, running, ended
    // the constructing only appears once
    this.status = 'constructing'

    // flags
    this.isMounted = false

    // set update method with bound this and its id (for priority)
    this.updateBound = this.update.bind(this)
    this.updateBound.id = this.baseId

    // mixin all effects for the component
    mixinState(this)
    mixinEvent(this)
    mixinLifecycle(this)
    mixinProps(this)
    mixinRelationship(this)

    // set relationship
    {
      const parent = this.$options.parent
      if (parent) {
        // set parent
        this.relationship.parent(parent)
        // tell parent to set me as child
        parent.relationship.child(this)
      }
    }
  }
  init() {
    this.status = 'preparing'

    // get render and style from the component
    {
      const result = this.$component.initialize({
        state: this.state,
        event: this.event,
        lifecycle: this.lifecycle,
        relationship: this.relationship,
      })
      this.$render = result.render
      this.$style = result.style || ''
    }

    // add the event delegator
    this.eventDelegator = createEventDelegator(this)

    this.lifes++

    this.status = 'running'

    // finally we do the first render
    // render style
    this.styleNode.textContent = this.$style
    // render view
    this.callUpdate()
  }
  patch() {
    // do diff and patch on the new and old view
    // for now, just using innerHTML
    this.rootNode.innerHTML = this.$render(this.props.data)
  }
  update() {
    if (this.status != 'running') {
      reportMsg('Can not do update when component is not running.', this.name)
      return
    }
    const isMounted = this.isMounted
    const chosen = isMounted ? HooksInUpdate : HooksInMount

    this.lifecycle.call(chosen[0])

    this.patch()

    if (!isMounted) {
      this.isMounted = true
    }

    this.lifecycle.call(chosen[1])
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
    const oldData = this.props.data[name]
    const newData = data
    if (isNotSameValue(oldData, newData)) {
      this.props.set(name, newData)
      this.callUpdate()
    }
  }
  connectedCallback() {
    if (this.lifes == 0) {
      {
        // create the shadow dom
        this.content = this.attachShadow({ mode: 'open' })
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
        rootNode.dataset.root = 'root'
        this.content.appendChild(rootNode)
        this.rootNode = rootNode
      }
    }

    this.init()
  }
  disconnectedCallback() {
    this.lifecycle.call('beforeUnmount')

    // clear all rendered content
    this.rootNode.innerHTML = ''
    this.styleNode.textContent = ''

    // clear $render and $style
    this.$render = Empty
    this.$style = Empty

    this.isMounted = false

    this.lifecycle.call('unmounted')

    // Only clear the effects created by component itself.
    // DO NOT CLEAR the "props" and "relationship" because there are from the outside.
    this.state.clear()
    this.event.clear()
    this.lifecycle.clear()

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
