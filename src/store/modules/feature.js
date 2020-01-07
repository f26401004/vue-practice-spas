const pageList = ['home', 'meeting', 'login', 'register']

const state = {
  currentPage: '',
  currentUser: 'f26401004'
}

const getters = {
  getCurrentPage: function (state) {
    return state.currentPage
  },
  getCurrentUser: function (state) {
    return state.currentUser
  }
}

const mutations = {
  'SET_currentPage': function (state, page) {
    if (!pageList.includes(page)) {
      throw new Error('The page did not exist.')
    }
    state.currentPage = page
  },
  'SET_currentUser': function (state, user) {
    state.currentUser = user
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
