
// import { auth, firestore } from '@/firebase.js'
import firebaseInit from '@/firebase.js'

const state = {
  currentUser: {},
  userAvatar: '',
  userSchedules: []
}

const getters = {
  getCurrentUser: state => state.currentUser,
  getCurrentUserUID: state => state.currentUser.uid,
  getCurrentUserAvatar: state => state.userAvatar
}

const mutations = {
  'SET_currentUser': (state, data) => {
    state.currentUser = Object.assign({}, data)
  },
  'SET_currentUserAvatar': (state, data) => {
    state.userAvatar = data
  },
  'UPDATE_currentUser': (state, data) => {
    Object.keys(data).forEach(key => {
      state.currentUser[key] = data[key]
    })
  },
  'ADD_userSchedules': (state, data) => {
    state.userSchedules.push(data)
  }
}

const actions = {
  login: async ({ rootState }, { email, password }) => {
    const firebase = await firebaseInit(['auth'])
    await firebase.auth.signInWithEmailAndPassword(email, password)
  },
  logout: async ({ rootState }) => {
    const firebase = await firebaseInit(['auth'])
    await firebase.auth.signOut()
  },
  register: async ({ rootState, commit }, { email, password, username, inviteCode }) => {
    const firebase = await firebaseInit(['firestore', 'auth'])
    // check token exist
    const docRef = firebase.firestore.collection('tokens').doc(inviteCode)
    const response = await docRef.get()
    const targetToken = response.data()
    if (targetToken.used) {
      throw new Error('Invalid invite code.')
    }
    const result = await rootState.featrue.firebase.auth.createUserWithEmailAndPassword(email, password)
    // update the displayName of user
    await result.user.updateProfile({
      displayName: username
    })
    // update register token
    await docRef.set({ used: true })
    // create user data in firestore
    firebase.firestore.collection('users').doc(result.user.uid).set({
      attendance: 0,
      activity: 0,
      knowledge: 0,
      schedules: [],
      githubLink: '',
      facebookLink: '',
      linkedinLink: '',
      status: '',
      username: username
    })
    // set the local user data directly
    commit('SET_currentUser', {
      uid: result.user.uid,
      email: email,
      username: username,
      attendance: 0,
      activity: 0,
      knowledge: 0,
      schedules: [],
      githubLink: '',
      facebookLink: '',
      linkedinLink: '',
      status: ''
    })
  },
  loadSchedules: async ({ commit, state }) => {
    if (state.currentUser.schedules.length === 0) {
      return
    }
    // parallelly fetch the data and push it into array
    state.currentUser.schedules.forEach(doc => {
      doc.get().then(response => {
        commit('ADD_userSchedules', response.data())
      })
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
