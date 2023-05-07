import { attr } from '../../src/index.js'

import Header from './Header.js'

const TodoList = ({ state, event, lifecycle }) => {
  state('list', [])
  const listView = state('list').map((i) => `<li>${i}</li>`)
  return {
    render: () => {
      return `
        <h1>My Todo List</h1>
        <my-todo-list-header></my-todo-list-header>
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
