const updatersQueue = []

const updaterMaxUpdateCount = 10
const updatersCurrentUpdatedCount = new Map()

let isUpdating = false

/**
 * enqueue an updater to the updatersQueue
 * @param {Function} updater
 * @return {boolean} success or not
 */
const queueUpdater = (updater) => {
  const isExisted = updatersQueue.indexOf(updater) > -1
  if (isExisted) {
    // all same updaters will keep only one
    return false
  }
  updatersQueue.push(updater)
  return true
}

/**
 * begin the update, and call all updaters in updatersQueue
 */
const beginUpdate = () => {
  if (isUpdating) {
    throw '[internal error in scheduler]: An update is running.'
  }
  isUpdating = true

  /* call all updaers in the microtask cycle of this event loop */

  // use while to test the updatersQueue is empty now
  while (updatersQueue.length) {
    // updatersQueue is a FIFO queue, so get the head updater
    const updater = updatersQueue.shift()
    // detect if an infinite loop appeared
    if (!updatersCurrentUpdatedCount.has(updater)) {
      updatersCurrentUpdatedCount.set(updater, 0)
    }
    const updaterCurrentCount = updatersCurrentUpdatedCount.get(updater)
    if (updaterCurrentCount == updaterMaxUpdateCount) {
      console.warn('[scheduler]: An updater caused an infinite update loop.')
      console.log(updater)
      // abort
      break
    }
    // call this updater
    updater()
    // add the updater's count
    updatersCurrentUpdatedCount.set(updater, updaterCurrentCount + 1)
  }

  // resetUpdate
  resetUpdate()
}

/**
 * reset all status
 */
const resetUpdate = () => {
  updatersQueue.length = 0
  updatersCurrentUpdatedCount.clear()
  isUpdating = false
}
