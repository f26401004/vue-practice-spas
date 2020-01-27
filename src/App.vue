<template lang="pug">
  div(id="app")
    nav-bar(v-responsive.md.lg.xl)
    vue-page-transition(name="overlay-right-full")
      router-view(style="height: calc(100vh - 64px);")
    //- a-row(type="flex" justify="center" align="middle" :style="{ 'background-color': blue.primary }" style="height: 32px; color: white; font-size: 12px;")
      //- p(style="margin: 0;") Copyright © 2020 f26401004 All rights reserved.
    nav-bar(v-responsive.sm.xs)
    div(class="loading-overlay" :class="{ 'loading-overlay-active': this.loading }")
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Firebase from '@/firebase.js'
import { mapMutations, mapGetters } from 'vuex'
import { blue } from '@ant-design/colors'

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
        const response = await docRef.get()
        const userData = response.data()

        this.SET_currentUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          ...userData
        })
      }
    })
  },
  methods: {
    ...mapMutations('user', ['SET_currentUser'])
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

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    pointer-events: none;
    transition: .2s background-color cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .loading-overlay-active {
    background-color: rgba(0, 0, 0, 0.18);
  }
</style>
