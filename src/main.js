import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from './store'

import { $api } from "./api";

import Echo from "laravel-echo";
import './plugins/registerServiceWorker'
import './plugins/toaster'

window.Pusher = require("pusher-js");
window.Pusher.logToConsole = true;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: process.env.VUE_APP_MIX_PUSHER_APP_KEY,
    cluster: process.env.VUE_APP_MIX_PUSHER_APP_CLUSTER,
    encrypted: false,
    logToConsole: true
});

const startSpinner = () => {
    window && window.loading && typeof window.loading.start === 'function' &&  window.loading.start()
};

const finishSpinner = () => {
    window && window.loading && typeof window.loading.finish === 'function' &&  window.loading.finish()
};

window.finishSpinner = finishSpinner;
window.startSpinner = startSpinner;

Vue.config.productionTip = false;
Vue.prototype.$api = $api;


window.vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
