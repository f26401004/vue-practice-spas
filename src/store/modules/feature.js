import Firebase from '@/firebase.js'

const state = {
  loading: false,
  members: [],
  meetings: []
}

const getters = {
  getLoading: state => state.loading
}

const mutations = {
  'SET_loading': (state, data) => {
    state.loading = data
  },
  'SET_members': (state, data) => {
    state.members = data.slice()
  },
  'SET_meetings': (state, data) => {
    state.meetings = data.slice()
  }
}

const actions = {
  loadMembers: async ({ commit }) => {
    const collectionRef = Firebase.firestore().collection('users')
    const snapshot = await collectionRef.get()
    const members = snapshot.docs.map(doc => {
      const data = doc.data()
      const point = data.activity + data.attendance + data.knowledge
      if (!point) {
        return {
          ...data,
          point: 0
        }
      }
      return {
        ...data,
        point
      }
    })
    commit('SET_members', members)
  },
  loadMeetings: async ({ commit }) => {
    const collectionRef = Firebase.firestore().collection('meetings')
    const snapshot = await collectionRef.get()
    const meetings = await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data()
      // retrieve host data
      const host = (await data.host.get()).data()
      data.host = {
        uid: data.host.id,
        username: host.username
      }
      return {
        ...data,
        mid: doc.id
      }
    }))
    commit('SET_meetings', meetings)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
