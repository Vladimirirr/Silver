// component lifecycle
export default (instance) => {
  // data
  const data = new Map()

  // main
  instance.lifecycle = (name, hook) => {
    const hooks = data.get(name)
    if (hooks) {
      hooks.push((name, hook))
    } else {
      data.set(name, [hook])
    }
  }

  // internal
  instance.lifecycle.call = (name) => {
    const hooks = data.get(name)
    hooks?.forEach((hook) => hook()) // NOT `hook.call(this)` because that defining a component is a pure function and `this` is not needed here
  }

  // internal
  instance.lifecycle.clear = () => {
    data.clear()
  }
}
