import { attr } from '../../src/index.js'

const Header = ({ state, event, lifecycle }) => {
  return {
    render: () => {
      return `
        <input 
          type="text"
          placeholder="add a todo..." 
        />
        <input type="button" value="add" />
        `
    },
    style: ``,
  }
}

export default {
  name: 'MyTodoListHeader',
  initialize: Header,
  props: [],
  emits: [],
}
