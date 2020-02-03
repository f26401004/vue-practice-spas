<template lang="pug">
  div(id="home_page_root")
    div(id="home_page_background" class="decorator")
    div(id="home_page_title" class="decorator animated fadeIn delay-1")
      a-row(type="flex" justify="center" align="middle")
        h1(style="color: white;") Meetings
      a-row(v-if="user.uid" type="flex" justify="center" style="color: white; font-size: 14px; text-align: center;")
        a-col(:span="24")
          span Welcome back,&nbsp;
        a-col(:span="24")
          strong
            span(style="color: white;, margin-left: 4px;") {{ user.username ? user.username : user.email }}
      a-row(v-if="user.uid" type="flex" justify="center" align="middle" style="color: white;")
        router-link(tag="span" to="/meeting")
          a-button(size="large" type="ghost" ) Check All
            a-icon(type="arrow-right")
      a-row(v-if="!user.uid" type="flex" justify="center" align="middle")
        router-link(tag="span" to="/register")
          a-button(v-show="!user.uid" size="large" type="ghost" style="margin-right: 12px;" ) Register
        router-link(tag="span" to="/login")
          a-button(v-show="!user.uid" size="large" style="margin-right: 12px;" ) Login
    a-row(type="flex" justify="center" align="middle" style="margin-top: 32vh;" class="animated fadeIn delay-2")
      a-col(:xs="20" :sm="12" :md="8" :lg="6")
        p(:style="{ 'color': grey[0], 'text-align': 'center' }") An meeting APP for study group. Developed with <a href="https://vuejs.org/">Vue.js</a>
          | &nbsp;and
          | <a href="https://firebase.google.com">Firebase</a>.
    a-row(type="flex" justify="center" align="middle" class="animated fadeIn delay-3")
      a-col(:xs="20" :sm="12" :md="8" :lg="6")
        a-list(itemLayout="horizontal" :dataSource="meetings" style="font-size: 12px;")
          a-list-item(slot="renderItem" slot-scope="item, index")
            a-list-item-meta(:description="item.description")
              a-avatar(slot="avatar" :src="item.icon")
              a-row(slot="title")
                a-col(:span="12")
                  a-row(type="flex" justify="start" align="middle")
                    label {{ item.title }}
                a-col(:span="12")
                  a-row(type="flex" justify="end" align="middle")
                    time(:style="{ 'color': blue[2] }" style="text-align: right; font-weight: 300;") {{ item.time | timestampToDate }}
</template>

<script>
import { blue, grey } from '@ant-design/colors'
// import db from '@/db.js'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'home',
  data: function () {
    return {
      grey,
      blue,
      test: []
    }
  },
  computed: {
    ...mapGetters('user', {
      user: 'getCurrentUser'
    }),
    ...mapState('feature', {
      meetings: 'meetings'
    })
  },
  filters: {
    timestampToDate: function (value) {
      const time = new Date(value.seconds * 1000)
      return time.toDateString()
    }
  },
  methods: {
    ...mapMutations('user', ['SET_currentUser'])
  }
}
</script>

<style lang="scss" scoped>
  #home_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-auto-flow: row;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
  }
  #home_page_background {
    top: -7%;
    left: -20%;
    width: 140%;
    height: 40vh;
    background: linear-gradient(180deg, rgba(24,144,255,1) 14%, rgba(145,213,255,1) 100%);
    border-radius: 100%;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);
  }
  #home_page_title {
    top: 0;
    left: 0;
    width: 100%;
    height: 32vh;
    z-index: 100;

    display: grid;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;

    padding-bottom: 64px;
    box-sizing: border-box;
  }

</style>
