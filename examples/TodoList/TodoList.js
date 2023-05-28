import { toComponent as c, toAttr } from '../../src/index.js'

import Header from './Header.js'
import Body from './Body.js'

const TodoList = ({ state, event }) => {
  state('list', [])
  const addTodo = (e) => state('list', state('list').concat(e.detail))

  return {
    render: () => {
      return `
        <h1>My Todo List</h1>
        <${c(Header)} ${event('addTodo', addTodo)}></${c(Header)}>
        <${c(Body)} ${toAttr('listData', state('list'), true)}></${c(Body)}>
        `
    },
    style: '',
  }
}

export default {
  name: 'MyTodoList',
  initialize: TodoList,
  props: [],
  emits: [],
  components: [Header],
}
