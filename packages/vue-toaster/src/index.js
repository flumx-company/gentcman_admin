import Api from './api.js'
import Toaster from "./Toaster";


const optsDefault = {
    componentName: "toast"
};

const plugin = {
    install(Vue, opts = {}) {
        if (Vue.prototype.$vm2) {
            return;
        }

        const options = Object.assign(optsDefault, opts);

        Vue.prototype.$toast = Api({}, opts);

        Vue.component(options.componentName, Toaster);
    }
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

export default plugin;
