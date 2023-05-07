import { EventListeningTag } from './constants.js'
import { isNotEmpty } from '../utils/internal/index.js'

export const eventDelegator = (event, instance) => {
  const { target } = event
  const listening = target.dataset[EventListeningTag]
  if (isNotEmpty(listening)) {
    instance.event.run(listening, event)
  }
  // All events are blocked in here, which means scoped them in their own component.
  event.stopPropagation()
}

export const getBaseId = () => getBaseId.__id++
getBaseId.__id = 0
