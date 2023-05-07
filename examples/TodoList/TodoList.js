import { attr } from '../../src/index.js'

import Header from './Header.js'

const TodoList = ({ state, event, lifecycle }) => {
  return {
    render: () => {
      return `
        <h1>My Todo List.</h1>
        <my-todo-list-header></my-todo-list-header>
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
