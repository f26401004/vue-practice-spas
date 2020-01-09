<template lang="pug">
  div(id="app")
    nav-bar
    router-view
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import Firebase from '@/firebase.js'
import { mapMutations } from 'vuex'

export default {
  name: 'app',
  components: {
    NavBar
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

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    font-size: 20px;
  }
</style>
