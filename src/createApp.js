import createComponent from './component/createComponent.js'

/**
 * Create a Silver instance.
 * @param {Object} options - the options for creating Silver instance
 * @param {Object} options.rootComponent - core option
 * @param {string} options.tagName - core option
 */
export const createApp = (options) => {
  // The steps of the `customElements.define` method invoked:
  // 1. Invoke its static "observedAttributes"
  // ~ When an element matched
  // 2. Invoke its "constructor"
  // 3. Connect it with current document and trigger "connectedCallback" method
  const { tagName, rootComponent } = options
  customElements.define(tagName, createComponent(rootComponent, {}))
}
