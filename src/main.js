import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueResponsive from 'vue-responsive'
import VuePageTransition from 'vue-page-transition'
import workbox from './registerServiceWorker'
import VueVirtualScroller from 'vue-virtual-scroller'

Vue.use(Antd)
Vue.use(VueResponsive)
Vue.use(VuePageTransition)
Vue.use(VueVirtualScroller)
// add workbox into vue instance
Vue.prototype.$workbox = workbox

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
