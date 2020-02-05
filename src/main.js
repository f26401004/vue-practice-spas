// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/antDesignVueImport.js'
import VueResponsive from 'vue-responsive'
import VuePageTransition from 'vue-page-transition'
// import workbox from './registerServiceWorker'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import '@/directives/longpress.js'
import FastClick from 'fastclick'
import Vue from 'vue'

Vue.use(VueResponsive)
Vue.use(VuePageTransition)
// add workbox into vue instance
// Vue.prototype.$workbox = workbox

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

FastClick.attach(document.body)
