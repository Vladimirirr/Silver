const Body = () => {
  return {
    render: (props) => {
      const listView = props.listData.map((i) => `<li>${i}</li>`)
      return `
        <ol>
          ${listView.join('')}
        </ol>
        `
    },
    style: '',
  }
}

export default {
  name: 'MyTodoListBody',
  initialize: Body,
  props: ['listData'],
  emits: [],
}
