/**
 * Define a component's initializer.
 * @param {Object} effectSystem - effect system for the component (provides the powerful features to the component)
 * @param {Object} effectSystem.state - state feature
 * @param {Object} effectSystem.attr - attr feature
 * @param {Object} effectSystem.event- event feature
 * @param {Object} effectSystem.lifecycle- lifecycle feature
 * @return {Object} the component
 */
const CounterCore = ({ state, attr, event, lifecycle }) => {
  // declare some state
  state.add('current', 0)

  // declare some method
  const add = () => state.set('current', state.get('current') + 1)
  const minus = () => state.set('current', state.get('current') - 1)

  // hook some lifecycle
  lifecycle.on('mounted', () => console.log('Counter mounted'))
  lifecycle.on('updated', () => console.log('Counter updated'))
  lifecycle.on('unmounted', () => console.log('Counter unmounted'))

  // A component must have and only have one root node.
  return {
    render: (props) => {
      const { counterColor } = props
      const current = state.get('current')
      return `
        <button ${event.listen('click', add)}>+</button>
        <b ${attr.calc('style', `color: ${counterColor}`)}> ${current} </b>
        <button 
          ${event.listen('click', minus)} 
          ${attr.calc('disabled', current == 0)}
        >
          -
        </button>
        `
    },
    style: `
      .root{
        display: inline-flex;
        align-items: center;
      }
      button{
        padding: 8px 12px;
        cursor: pointer;
      }
      button[disabled]{
        cursor: not-allowed;
      }
      b{
        display: inline-block;
        margin: 0 6px;
        width: 60px;
        text-align: center;
        font-size: 2em;
      }
    `,
  }
}

export default {
  name: 'MyCounter',
  initialize: CounterCore,
  props: ['counterColor'],
  emits: [],
}
