import Firebase from '@/firebase.js'

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
  login: async (context, { email, password }) => {
    await Firebase.auth().signInWithEmailAndPassword(email, password)
  },
  logout: async () => {
    await Firebase.auth().signOut()
  },
  register: async ({ commit }, { email, password, username, inviteCode }) => {
    // check token exist
    const docRef = Firebase.firestore().collection('tokens').doc(inviteCode)
    const response = await docRef.get()
    const targetToken = response.data()
    if (targetToken.used) {
      throw new Error('Invalid invite code.')
    }
    const result = await Firebase.auth().createUserWithEmailAndPassword(email, password)
    // update the displayName of user
    await result.user.updateProfile({
      displayName: username
    })
    // update register token
    await docRef.set({ used: true })
    // create user data in firestore
    Firebase.firestore().collection('users').doc(result.user.uid).set({
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
