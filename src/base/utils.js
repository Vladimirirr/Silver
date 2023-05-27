import { EventListeningTag } from './constants.js'
import { isNotEmpty } from '../utils/internal/index.js'

export const createEventDelegator = (instance) => (event) => {
  const { target } = event
  const listening = target.dataset[EventListeningTag]
  if (isNotEmpty(listening)) {
    instance.event.run(listening, event)
  }
  // All events are blocked in rootNode, which means scoping them in their own component.
  event.stopPropagation()
}

export const getBaseId = () => getBaseId.__id++
getBaseId.__id = 0
