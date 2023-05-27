import { tryCatch, reportMsg } from '../../utils/internal/index.js'

const isDefinedCustomEvent = (name, instance) =>
  instance.$component.emits.includes(name)

// component event
export default (instance) => {
  // data
  const data = new Map()
  const domEvents = []
  let id = 0

  // main
  instance.event = (name, handler) => {
    const eid = id++
    if (isDefinedCustomEvent(name, instance)) {
      // custom event
      instance.event.on(name, handler)
    } else {
      // dom event
      data.set(eid, {
        name,
        handler,
      })
      if (!domEvents.includes(name)) {
        domEvents.push(name)
        instance.rootNode.addEventListener(name, instance.eventDelegator)
      }
    }
    return `data-listening="${eid}"`
  }

  // for user event
  instance.event.on = (name, handler) => {
    instance.rootNode.addEventListener(name, handler)
  }
  instance.event.off = (name, handler) => {
    instance.rootNode.removeEventListener(name, handler)
  }
  instance.event.emit = (name, data) => {
    // Invoke "dispatchEvent" on a Node --> The Node spreads the event --> The two capturing and bubbling stages happen if available
    instance.dispatchEvent(
      new CustomEvent(name, {
        // bubbles
        bubbles: true,
        // The custom event between father and son components are scoped in where they are.
        composed: false,
        // carried data
        detail: data,
      })
    )
  }

  // internal
  instance.event.run = (eid, event) => {
    eid = +eid
    const eventData = data.get(eid)
    if (event.type === eventData.name) {
      const [status, res] = tryCatch(eventData.handler, [event])
      if (!status) {
        reportMsg(res, instance.name, `Event -> ${eventData.name}`)
      }
    }
  }

  // internal
  instance.event.clear = () => {
    data.clear()
    domEvents.forEach((name) =>
      instance.rootNode.removeEventListener(name, instance.eventDelegator)
    )
    domEvents.length = 0
    id = 0
  }
}
