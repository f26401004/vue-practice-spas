<template lang="pug">
  a-layout-header(class="header" :style="{ 'background': blue.primary }")
    a-row(type="flex" justify="space-between" align="middle")
      h3(style="margin: 0;")
        router-link(tag="span" to="/" :style="{ 'color': blue[0] }") Meeting Logs
      a-menu(theme="dark" mode="horizontal" :style="{ 'line-height': '64px', 'background': blue.primary }")
        a-menu-item
          router-link(tag="span" to="/meeting") meetings
        a-menu-item(v-show="!user.uid")
          router-link(tag="span" to="/login") login
        a-menu-item(v-show="user.uid" @click="handleLogout") logout
        a-menu-item
          router-link(tag="span" to="/register") register
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { blue } from '@ant-design/colors'
import Firebase from '@/firebase.js'

export default {
  name: 'nav-bar',
  data: function () {
    return {
      blue
    }
  },
  computed: {
    ...mapGetters('feature', {
      currentPage: 'getCurrentPage',
      user: 'getCurrentUser'
    })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentPage', 'SET_currentUser']),
    handleLogout: async function (event) {
      try {
        await Firebase.auth().signOut()
        this.SET_currentUser({})
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
