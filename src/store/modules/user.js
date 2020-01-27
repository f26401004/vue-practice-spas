import Firebase from '@/firebase.js'

const state = {
  currentUser: {},
  userAvatar: ''
}

const getters = {
  getCurrentUser: state => state.currentUser
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
      activityRate: 0,
      knowledge: 0,
      schedules: [],
      githubLink: '',
      facebookLink: '',
      linkedinLink: '',
      status: ''
    })
    // set the local user data directly
    commit('SET_currentUser', {
      uid: result.user.uid,
      email: email,
      username: username,
      attendance: 0,
      activityRate: 0,
      knowledge: 0,
      schedules: [],
      githubLink: '',
      facebookLink: '',
      linkedinLink: '',
      status: ''
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
