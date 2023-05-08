import { toComponent } from '../../src/index.js'

import Header from './Header.js'

const TodoList = ({ state, event }) => {
  state('list', [])
  const addTodo = (e) => state('list', state('list').concat(e.detail))

  return {
    render: () => {
      const listView = state('list').map((i) => `<li>${i}</li>`)
      return `
        <h1>My Todo List</h1>
        <${toComponent(Header)} 
          ${event('addTodo', addTodo)}
        ></${toComponent(Header)}>
        <ol>
          ${listView.join('')}
        </ol>
        `
    },
    style: ``,
  }
}

export default {
  name: 'MyTodoList',
  initialize: TodoList,
  props: [],
  emits: [],
  components: [Header],
}
