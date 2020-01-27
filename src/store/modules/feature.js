const state = {
  loading: false
}

const getters = {
  getLoading: state => state.loading
}

const mutations = {
  'SET_loading': (state, data) => {
    state.loading = data
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
