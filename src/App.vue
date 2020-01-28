<template lang="pug">
  div(id="app")
    nav-bar(v-responsive.md.lg.xl)
    vue-page-transition(name="overlay-right-full")
      router-view(style="height: calc(100vh - 64px);")
    nav-bar(v-responsive.sm.xs)
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Firebase from '@/firebase.js'
import { mapMutations, mapGetters } from 'vuex'
import { blue } from '@ant-design/colors'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    NavBar
  },
  data: function () {
    return {
      blue
    }
  },
  computed: {
    ...mapGetters('feature', {
      loading: 'getLoading'
    })
  },
  beforeCreate: function () {
    // check if user have logined.
    Firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // get the user information
        const docRef = await Firebase.firestore().collection('users').doc(user.uid)
        const responseUser = await docRef.get()
        const userData = responseUser.data()

        this.SET_currentUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          ...userData
        })

        // get user avatar
        try {
          const storageRef = Firebase.storage().ref()
          const url = await storageRef.child(`images/avatar/${user.uid}`).getDownloadURL()
          const responseAvatar = await axios.get(url, { responseType: 'blob' })
          this.SET_currentUsrAvatar(window.URL.createObjectURL(responseAvatar.data))
        } catch (error) {
          console.log(error)
        }
      }
    })
  },
  methods: {
    ...mapMutations('user', ['SET_currentUser', 'SET_currentUserAvatar'])
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Railway', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 300;
    width: 100%;
    height: 100%;
    overflow: hidden;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }

  .decorator {
    position: absolute !important;
  }

  .delay-1 {
    animation-delay: .6s;
  }
  .delay-2 {
    animation-delay: .7s;
  }
  .delay-3 {
    animation-delay: .8s;
  }
  .delay-4 {
    animation-delay: .9s;
  }
  .delay-5 {
    animation-delay: 1.0s;
  }
  .delay-6 {
    animation-delay: 1.1s;
  }
  .delay-7 {
    animation-delay: 1.2s;
  }

  .overlay-top, .overlay-bottom, .overlay-right, .overlay-left {
    background: url("./assets/logo-transition.svg"), #096dd9 !important;
    background-position: 50% 50% !important;
    background-size: 18vh, cover !important;
    background-repeat: no-repeat !important;
    z-index: 999;
  }
  .overlay-right, .overlay-left {
    height: calc(100vh - 64px) !important;
  }

  .ant-drawer-header {
    background-color: #1890ff !important;
    border-radius: 0 !important;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09);
    .ant-drawer-title {
      font-size: 18px !important;
      font-weight: 600 !important;
      color: white !important;
    }
    .ant-drawer-close {
      color: white !important;
    }
  }
  .ant-row, .ant-row-flex {
    margin-top: 12px;
  }

  [v-cloak] {
    display: none;
  }

  .ps__thumb-y {
    width: 0 !important;
  }
  .ps__rail-y {
    opacity: 0 !important;
  }
  .ant-modal-wrap {
    display: flex !important;
    align-content: center !important;
    align-items: center !important;
    pointer-events: none;
  }
  .ant-modal-mask {
    pointer-events: none;
  }
  .ant-modal {
    pointer-events: all;
  }
  .custom-modal-style {
    width: calc(100vw - 48px) !important;
    max-height: calc(100vh - 48px) !important;
    top: 0 !important;
  }
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
    pointer-events: none;
  }
  .ant-spin-container {
    height: 100%;
  }
  .ant-tabs-content {
    position: relative;
    height: calc(100% - 84px);
    overflow-y: auto;
  }
  .ant-tabs-nav-container {
    padding-top: 24px;
    box-sizing: border-box;
    background: #1890ff;
    color: white;
  }
  .ant-tabs-tab-active {
    color: white !important;
    font-weight: 900;
    background: rgba(255, 255, 255, 0.33);
    border-radius: 8px 8px 0 0;
  }
</style>
