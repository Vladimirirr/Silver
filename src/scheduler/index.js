const updatersQueue = []

const updaterMaxUpdateCount = 10
const updatersCurrentUpdatedCount = new Map()

let isUpdating = false

/**
 * enqueue an updater
 * @param {Function} updater
 */
const enqueueUpdater = (updater) => {
  const isExisted = updatersQueue.indexOf(updater) > -1
  if (isExisted) return

  // Push.
  updatersQueue.push(updater)

  // Update should begin from the sub components.
  updatersQueue.sort((a, b) => b.id - a.id)
}

/**
 * begin the update
 */
const beginUpdate = () => {
  // Use "while" to test that the updatersQueue is empty now or not.
  while (updatersQueue.length) {
    // The "updatersQueue" is a FIFO queue, so get the head updater in each loop.
    const updater = updatersQueue.shift()
    // To detect if an infinite loop appeared.
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
    // Call this updater.
    updater()
    // Add the updater's count.
    updatersCurrentUpdatedCount.set(updater, updaterCurrentCount + 1)
  }

  resetUpdate()
}

/**
 * reset
 */
const resetUpdate = () => {
  updatersQueue.length = 0
  updatersCurrentUpdatedCount.clear()
  isUpdating = false
}

/**
 * schedule a series of updates
 * @param {Function} updater
 */
const scheduleUpdate = (updater) => {
  enqueueUpdater(updater)
  if (isUpdating) {
    return
  }
  isUpdating = true
  queueMicrotask(() => {
    beginUpdate()
    resetUpdate()
  })
}

export default scheduleUpdate
