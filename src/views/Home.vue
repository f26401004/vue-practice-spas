<template lang="pug">
  div(style="padding: 24px;")
    a-row(type="flex" justify="center" align="middle" v-if="user.uid") Welcome back,&nbsp;
      strong
        span(:style="{ 'color': blue.primary, 'margin-left': '4px' }") {{ user.username ? user.username : user.email }}
    a-row(type="flex" justify="center" align="middle")
      h1(:style="{ 'color': blue.primary }") Meeting Log
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :sm="12" :md="8" :lg="6")
        p This simple app creates meetings, allows people to check in, and
          | picks random users to award giveaways. It's a good example of a
          | Single Page Application which includes connection to a database and
          | routing. It's a practical way to learn <a href="https://vuejs.org/">Vue.js</a>
          | with
          | <a href="https://firebase.google.com">Firebase</a>.
    a-row(type="flex" justify="center" align="middle")
      router-link(tag="span" to="/register")
        a-button(v-show="!user.uid" style="margin-right: 12px;") Register
      router-link(tag="span" to="/login")
        a-button(v-show="!user.uid" type="primary" style="margin-right: 12px;") Login
      a-col(v-show="user.uid" :xs="20" :sm="12" :md="8" :lg="6")
        a-button(type="primary" style="width: 100%;") Meetings
          router-link(tag="span" to="/meeting")
</template>

<script>
import { blue } from '@ant-design/colors'
// import db from '@/db.js'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  data: function () {
    return {
      blue
    }
  },
  computed: {
    ...mapGetters('feature', {
      user: 'getCurrentUser'
    })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUser'])
  }
}
</script>
