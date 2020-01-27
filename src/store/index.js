import Vue from 'vue'
import Vuex from 'vuex'

import feature from '@/store/modules/feature.js'
import user from '@/store/modules/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    feature
  }
})
