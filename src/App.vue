<template lang="pug">
  div(id="app")
    nav-bar
    router-view(style="width: 100vw; height: calc(100vh - 96px);")
    a-row(type="flex" justify="center" align="middle" :style="{ 'background-color': blue.primary }" style="height: 32px; color: white; font-size: 12px;")
      p(style="margin: 0;") Copyright © 2020 f26401004 All rights reserved.
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

</style>
