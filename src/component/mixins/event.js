// component event
export default (instance) => {
  // data
  const data = new Map()
  let id = 0

  // main
  instance.event = (name, handler) => {
    const eid = id++
    data.set(eid, {
      name,
      handler,
    })
    return `data-listening="${eid}"`
  }

  // for user event
  instance.event.on = (name, handler) => {}
  instance.event.off = (name, handler) => {}
  instance.event.emit = (name, data) => {}

  // internal
  instance.event.run = (eid, event) => {
    eid = +eid
    const eventData = data.get(eid)
    if (event.type === eventData.name) {
      eventData.handler.call(event, event)
    }
  }

  // internal
  instance.event.clear = () => {
    data.clear()
    id = 0
  }
}
