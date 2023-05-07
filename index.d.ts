type T_CreateAppOptions = {
  tagName: string
  rootComponent: Object
}

export const createApp: (options: T_CreateAppOptions) => void

export const attr: (name: string, value: any) => string
