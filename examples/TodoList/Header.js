import { toAttr } from '../../src/index.js'

const Header = ({ state, event }) => {
  state('todo', '')

  const addTodo = () => {
    event.emit('addTodo', state('todo'))
    state('todo', '')
  }

  return {
    render: () => {
      return `
        <input 
          type="text"
          placeholder="add a todo..." 
          ${toAttr('value', state('todo'))}
          ${event('change', (e) => state('todo', e.target.value))}
        />
        <input
          type="button"
          value="add"
          ${event('click', addTodo)}
        />
        `
    },
    style: ``,
  }
}

export default {
  name: 'MyTodoListHeader',
  initialize: Header,
  props: [],
  emits: ['addTodo'],
}
