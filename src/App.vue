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
import { mapMutations, mapGetters, mapActions } from 'vuex'
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

        // get user schedules
        try {
          await this.loadSchedules()
        } catch (error) {
          console.log(error)
        }

        // get members
        try {
          await this.loadMembers()
        } catch (error) {
          console.log(error)
        }

        try {
          await this.loadMeetings()
        } catch (error) {
          console.log(error)
        }
      }
    })
  },
  methods: {
    ...mapMutations('user', ['SET_currentUser', 'SET_currentUserAvatar']),
    ...mapActions('user', ['loadSchedules']),
    ...mapActions('feature', ['loadMembers', 'loadMeetings'])
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
    background-color: #fafafa;
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

  @mixin delay-generate($count) {
    $temp: calc((#{$count}s / 10) + 0.5s);
    .delay-#{$count} {
      animation-delay: #{$temp};
    }
  }

  @for $i from 0 through 7 {
    @include delay-generate($i);
  }

  .overlay-top, .overlay-bottom, .overlay-right, .overlay-left {
    background: url("./assets/logo-transition.svg"), linear-gradient(180deg, rgba(24,144,255,1) 0%, rgba(52,246,242,1) 100%) !important;
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
    background: #fafafa;
  }
  .ant-tabs-bar {
    margin: 0 !important;
  }
  .ant-tabs-nav-container {
    padding-top: 12px;
    box-sizing: border-box;
    background: linear-gradient(90deg, rgba(24,144,255,1) 0%, rgba(145,213,255,1) 100%);
    color: white;
  }
  .ant-tabs-nav {
    width: 100%;
  }
  .ant-tabs-tab-active {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.33);
    border-radius: 8px 8px 0 0;
  }
  .ant-tabs-tab {
    display: inline-flex !important;
    justify-content: center !important;
    justify-items: center !important;
    width: 50%;
    transition: .2s all ease !important;
    background-position: center;
  }
  .ant-tabs-tab:hover {
    background: rgba(255, 255, 255, 0.33) radial-gradient(circle, transparent 1%, rgba(255, 255, 255, 0.33) 1%) center/15000% !important;
    transition:  0.8s all ease-out !important;
  }
  .ant-tabs-tab:active {
    background-color: rgba(255, 255, 255, 0.33) !important;
    background-size: 100% !important;
    transition: background 0s !important;
  }

  .ant-menu-item-selected {
    border-bottom: none !important;
  }
  .ant-menu-item {
    border-bottom: none !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0!important;
  }
  .ant-menu::before, .ant-menu::after {
    content: none !important;
  }

  .ripple {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }
  .ripple:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle,black 10%,transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10,10);
    opacity: 0;
    transition: transform .4s, opacity 1s;
  }
  .ripple:active:after {
    transform: scale(0,0);
    opacity: .2;
    transition: 0s;
  }

  .slide-leave-active,
  .slide-enter-active {
    transition: .2s transform cubic-bezier(0.215, 0.61, 0.355, 1), .2s opacity cubic-bezier(0.215, 0.61, 0.355, 1);
    overflow: hidden;
    transform-origin: center top;
    opacity: 0;
  }
  .slide-enter-to, .slide-leave {
    transform: scaleY(100%);
    opacity: 1;

  }
  .slide-enter, .slide-leave-to {
    transform: scaleY(0);
  }

</style>
