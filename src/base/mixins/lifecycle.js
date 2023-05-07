import { tryCatch, reportMsg } from '../../utils/internal/index.js'

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
  // consts for all lifecycles
  instance.lifecycle.BeforeMount = 'beforeMount'
  instance.lifecycle.Mounted = 'mounted'
  instance.lifecycle.BeforeUpdate = 'beforeUpdate'
  instance.lifecycle.Updated = 'updated'
  instance.lifecycle.BeforeUnmount = 'beforeUnmount'
  instance.lifecycle.Unmounted = 'unmounted'

  // internal
  instance.lifecycle.call = (name) => {
    const hooks = data.get(name)
    hooks?.forEach((hook) => {
      // The component is a pure function with limited effects, so the `this` is not needed for all methods declared in the function.
      const [status, res] = tryCatch(hook)
      if (!status) {
        reportMsg(res, instance.name, `Lifecycle -> ${name}`)
      }
    })
  }

  // internal
  instance.lifecycle.clear = () => {
    data.clear()
  }
}
