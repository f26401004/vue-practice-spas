<template lang="pug">
  a-layout-header(class="header" :style="{ 'background': blue.primary }" style="padding: 0 24px;")
    a-row(type="flex" justify="space-between" align="middle")
      router-link(tag="div" to="/" style="display: flex; align-content: center;")
        h2(style="display: inline; margin: 0;" :style="{ 'color': blue[0] }") Meetings
      a-icon(v-responsive.sm.xs style="color: white;" :type="displayDrawer ? 'menu-unfold': 'menu-fold'" @click="displayDrawer = !displayDrawer")
      a-drawer(v-responsive.sm.xs title="Menu" :closable="true" :visible="displayDrawer" placement="right" @close="displayDrawer = false")
        a-menu(theme="light" mode="vertical" :style="{ 'line-height': '64px' }")
          a-menu-item
            router-link(tag="span" to="/meeting" @click.native="displayDrawer = false") meetings
          a-menu-item(v-show="!user.uid")
            router-link(tag="span" to="/login" @click.native="displayDrawer = false") login
          a-menu-item(v-show="user.uid" @click="handleLogout") logout
          a-menu-item
            router-link(tag="span" to="/register" @click.native="displayDrawer = false") register
      a-menu(v-responsive.md.lg.xl theme="dark" mode="horizontal" :style="{ 'line-height': '64px', 'background': blue.primary }")
        a-menu-item
          router-link(tag="span" to="/meeting") meetings
        a-menu-item(v-show="!user.uid")
          router-link(tag="span" to="/login") login
        a-menu-item(v-show="user.uid" @click="handleLogout") logout
        a-menu-item
          router-link(tag="span" to="/register") register
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { blue } from '@ant-design/colors'

export default {
  name: 'nav-bar',
  data: function () {
    return {
      blue,
      displayDrawer: false
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
    ...mapActions('feature', ['logout']),
    handleLogout: async function (event) {
      try {
        await this.logout()
        this.$router.go(0)
        this.displayDrawer = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #nav_bar_logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-color: white;
    mask-image: url("../assets/logo.svg");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: 50% 50%;
    margin: 12px 18px 12px 12px;
  }
</style>
