type T_CreateAppOptions = {
  tagName: string
  rootComponent: Object
}
type T_SilverComponentObject = {
  name: string
  initialize: Function
  props?: string[]
  emits?: string[]
  components?: T_SilverComponentObject[]
}

export const createApp: (options: T_CreateAppOptions) => void

export const toAttr: (name: string, value: any) => string
export const toComponent: (component: T_SilverComponentObject) => string
