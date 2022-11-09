import Toaster from './Toaster.vue'
import eventBus from './helpers/event-bus.js'
import mount from './helpers/mount-component'

const normalizeMessage = (data) => Array.isArray(data) ? data[0] || "Invalid data" : typeof data === 'string'? data : "Invalid data"

const Api = (globalOptions = {}, context) => {
  return {
    show(message, options = {}) {


      let localOptions = { message, ...options }
      const c = mount(Toaster, {
        props: { ...globalOptions, ...localOptions },
      });
      return c
    },
    clear() {
      eventBus.$emit('toast-clear')
    },
    success(message, options = {}) {
      options.type = 'success';
      return this.show(normalizeMessage(message), options)
    },
    error(message, options = {}) {
      options.type = 'error';
      return this.show(normalizeMessage(message), options)
    },
    info(message, options = {}) {
      options.type = 'info';
      return this.show(normalizeMessage(message), options)
    },
    warning(message, options = {}) {
      options.type = 'warning';
      return this.show(normalizeMessage(message), options)
    },
    $context: context
  }
};

export default Api
