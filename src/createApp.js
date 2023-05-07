import createComponent from './component/createComponent.js'

/**
 * Create a Silver instance.
 * @param {Object} options - the options for creating Silver instance
 * @param {Object} options.rootComponent - core option
 * @param {string} options.tagName - core option
 * @param {boolean} options.closeShadow
 */
export const createApp = ({ tagName, rootComponent, closeShadow }) => {
  // The steps of the `customElements.define` method invoked:
  // 1. Invoke its static "observedAttributes"
  // ~ When an element matched
  // 2. Invoke its "constructor"
  // 3. Connect it with current document and trigger "connectedCallback" method
  customElements.define(
    tagName,
    createComponent(rootComponent, {
      closeShadow,
    })
  )
}
