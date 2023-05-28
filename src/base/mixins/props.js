import { reportMsg } from '../../utils/internal/index.js'

// component props
export default (instance) => {
  // data
  const data = {}

  // main
  instance.props = {
    // props
    data: new Proxy(data, {
      get(target, key, receiver) {
        return Reflect.get(target, key, receiver)
      },
      set(_, key) {
        reportMsg(
          'Props is readonly.',
          instance.name,
          `Try to set ${key}`,
          'warn'
        )
        return false
      },
    }),

    // internal
    set: (name, value) => (data[name] = value),
    clear: () => {
      Object.keys(data).forEach((key) => delete data[key])
    },
  }
}
