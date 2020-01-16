import Firebase from '@/firebase.js'

const state = {
  currentUser: {}
}

const getters = {
  getCurrentUser: function (state) {
    return state.currentUser
  }
}

const mutations = {
  'SET_currentUser': function (state, user) {
    state.currentUser = Object.assign({}, user)
  }
}

const actions = {
  login: async function (context, { email, password }) {
    await Firebase.auth().signInWithEmailAndPassword(email, password)
  },
  logout: async function () {
    await Firebase.auth().signOut()
  },
  register: async function (context, { email, password, username }) {
    const result = await Firebase.auth().createUserWithEmailAndPassword(email, password)
    // update the displayName of user
    await result.user.updateProfile({
      displayName: username
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
