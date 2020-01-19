<template lang="pug">
  div(id="app")
    nav-bar(v-responsive.md.lg.xl)
    vue-page-transition(name="overlay-right-full")
      router-view(style="height: calc(100vh - 64px);")
    //- a-row(type="flex" justify="center" align="middle" :style="{ 'background-color': blue.primary }" style="height: 32px; color: white; font-size: 12px;")
      //- p(style="margin: 0;") Copyright © 2020 f26401004 All rights reserved.
    nav-bar(v-responsive.sm.xs)
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Firebase from '@/firebase.js'
import { mapMutations } from 'vuex'
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
  beforeCreate: function () {
    // check if user have logined.
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.SET_currentUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName
        })
      }
    })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUser'])
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
</style>
