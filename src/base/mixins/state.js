import { isNotEmpty, isNotSameValue } from '../../utils/internal/index.js'

// component state
export default (instance) => {
  // data
  const data = new Map()

  // main
  instance.state = (name, value) => {
    if (isNotEmpty(value)) {
      // for settng
      let needCallUpdate = false
      if (data.has(name)) {
        // update the state
        const theOld = data.get(name)
        const theNew = value
        if (isNotSameValue(theOld, theNew)) {
          data.set(name, theNew)
          needCallUpdate = true
        }
      } else {
        // add new state
        const initial = value
        data.set(name, initial)
        needCallUpdate = true
      }
      if (needCallUpdate) {
        // update the component
        instance.scheduleUpdate()
      }
    }
    // return it
    return data.get(name)
  }

  // internal
  instance.state.has = (name) => data.has(name)
  instance.state.get = (name) => data.get(name)
  instance.state.set = (name, value) => data.set(name, value)
  instance.state.del = (name) => data.delete(name)

  // internal
  instance.state.clear = () => {
    data.clear()
  }
}
