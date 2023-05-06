import { getObject } from '../../utils/internal/index.js'

// component props
export default (instance) => {
  // data
  let data = getObject()

  // main
  instance.props = (name) => data[name]

  // internal
  instance.props.set = (name, value) => (data[name] = value)
  instance.props.reveal = () => data

  // internal
  instance.props.clear = () => {
    data = getObject()
  }
}
