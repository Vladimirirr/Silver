// component relationship
export default (instance) => {
  // data
  const data = {
    parent: null,
    children: [],
  }

  // main
  instance.relationship = () => data

  // internal

  instance.relationship.parent = (c) => (data.parent = c)
  instance.relationship.child = (c) => data.children.push(c)

  // internal
  instance.relationship.clear = () => {
    data.parent = null
    data.children.length = 0
  }
}
