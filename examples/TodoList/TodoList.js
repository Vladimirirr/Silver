import { attr } from '../../src/index.js'

import Header from './Header.js'

const TodoList = ({ state, event }) => {
  state('list', [])
  const addTodo = (e) => state('list', state('list').concat(e.detail))

  return {
    render: () => {
      const listView = state('list').map((i) => `<li>${i}</li>`)
      return `
        <h1>My Todo List</h1>
        <my-todo-list-header
          ${event('addTodo', addTodo)}
        ></my-todo-list-header>
        <ol>
          ${listView}
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
