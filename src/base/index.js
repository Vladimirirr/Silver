import { EventListeningTag } from '../constants/index.js'
import { DelegatedEvents, UseCapture } from './constant.js'
import {
  isEmpty,
  isNotEmpty,
  isNotSameValue,
  camelize,
} from '../utils/internal/index.js'

import scheduleUpdate from '../scheduler/index.js'

const DefaultOptions = {
  closeShadow: false,
}

const eventDelegator = (event, instance) => {
  const { target } = event
  const listening = target.dataset[EventListeningTag]
  if (isNotEmpty(listening)) {
    instance.event.run(listening, event)
  }
}

export default class SilverComponent extends HTMLElement {
  constructor(options = {}) {
    super()

    // save options
    this.options = Object.assign(options, DefaultOptions)

    // how many times the component had been mounted and unmounted
    this.lifes = 0

    // internal status: constructing, preparing, running, ended
    // only the constructing appears once
    this.status = 'constructing'
  }
  baseInit() {
    this.status = 'preparing'
  }
  baseUpdate() {
    if (isEmpty(this.$render)) {
      return ''
    }
    return this.$render(this.props)
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

    // remove all event listeners
    DelegatedEvents.forEach((eventName) => {
      // remove
      this.content.removeEventListener(
        eventName,
        this.eventDelegator,
        UseCapture
      )
    })

    {
      // clear content
      this.rootNode.innerHTML = ''
      this.styleNode.innerHTML = ''
    }

    this.lifecycle.call('unmounted')

    this.status = 'ended'
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (isNotSameValue(oldValue, newValue)) {
      this.props[camelize(name)] = newValue
      if (this.status == 'running') {
        this.update()
      }
    }
  }
}
