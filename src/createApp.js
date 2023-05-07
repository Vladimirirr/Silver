import createComponent from './component/createComponent.js'

/**
 * Create a Silver instance.
 * @param {Object} options - the options for creating Silver instance
 * @param {Object} options.rootComponent - core option
 * @param {string} options.tagName - core option
 * @param {boolean} options.closeShadow
 */
export const createApp = ({ tagName, rootComponent, closeShadow }) => {
  customElements.define(
    tagName,
    createComponent(rootComponent, {
      closeShadow,
    })
  )
}
