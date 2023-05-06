import { attr } from '../../src/index.js'

/**
 * Define a component's initializer.
 * @param {Object} effectSystem - effect system for the component (provides the powerful features to the component)
 * @param {Object} effectSystem.state - state feature
 * @param {Object} effectSystem.event - event feature
 * @param {Object} effectSystem.lifecycle - lifecycle feature
 * @return {Object} the component
 */
const CounterCore = ({ state, event, lifecycle }) => {
  // declare some state
  state('current', 0)
  state('addStep', 1)

  // declare some method
  const add = () => {
    // The more than one times `state.set` called at same time will only trigger one actually update.
    state('current', state('current') + state('addStep'))
  }
  const minus = () => state('current', state('current') - 1)
  const changeAddStep = (e) => {
    const v = +e.target.selectedOptions[0].value
    console.log('current selected add step', v)
    state('addStep', v)
  }

  // hook some lifecycle
  lifecycle('mounted', () => console.log('Counter mounted'))
  lifecycle('updated', () => console.log('Counter updated'))
  lifecycle('unmounted', () => console.log('Counter unmounted'))

  // A component must have and only have one root node.
  return {
    render: (props) => {
      const showColor = props('showColor')
      const current = state('current')
      const stepOptions = Array(4)
        .fill(1)
        .map(
          (_, i) =>
            `<option 
              ${attr('selected', i + 1 == state('addStep'))} 
              ${attr('value', i + 1)}>${i + 1}</option>`
        )
        .join('')
      return `
        <div>
          Choose step for add:
          <select ${event('change', changeAddStep)}>
            ${stepOptions}
          </select>
        </div>
        <div class="counter">
          <button ${event('click', add)}>+</button>
          <b ${attr('style', `color: ${showColor}`)}> ${current} </b>
          <button 
            ${event('click', minus)} 
            ${attr('disabled', current == 0)}
          >
            -
          </button>
        </div>
        `
    },
    style: `
      .root{
        border: 2px green dashed;
        padding: 10px;
      }
      .counter{
        display: inline-flex;
        align-items: center;
        margin-top: 6px;
      }
      .counter button{
        padding: 2px 4px;
        cursor: pointer;
      }
      .counter button[disabled]{
        cursor: not-allowed;
      }
      .counter b{
        display: inline-block;
        margin: 0 2px;
        width: 50px;
        text-align: center;
        font-size: 16px;
      }
    `,
  }
}

export default {
  name: 'MyCounter',
  initialize: CounterCore,
  props: ['showColor'],
  emits: [],
}
