<template lang="pug">
  div(id="nav_bar_root")
    a-menu(id="nav_bar_menu" mode="horizontal" :selectedKeys="[currentPage]" :inlineIndent="12")
      a-menu-item(v-for="(item, index) of menuItems" :key="item.name" class="ripple")
        div(class="nav_bar_menu_item")
          a-icon(v-responsive.sm.xs style="font-size: 20px;" :type="item.icon")
          router-link(tag="span" :to="item.url") {{ item.name }}
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { blue } from '@ant-design/colors'

export default {
  name: 'nav-bar',
  data: function () {
    return {
      blue,
      displayDrawer: false,
      currentPage: 'home'
    }
  },
  computed: {
    ...mapState('user', {
      user: 'currentUser'
    }),
    menuItems: function () {
      if (this.user.uid) {
        return [
          { name: 'home', url: '/', icon: 'home' },
          { name: 'meeting', url: '/meeting', icon: 'audit' },
          { name: 'profile', url: '/profile', icon: 'profile' },
          { name: 'info', url: '/info', icon: 'info-circle' }
        ]
      }
      return [
        { name: 'home', url: '/', icon: 'home' },
        // { name: 'meeting', url: '/meeting', icon: 'profile' },
        { name: 'login', url: '/login', icon: 'login' },
        { name: 'register', url: '/register', icon: 'user-add' },
        { name: 'info', url: '/info', icon: 'info-circle' }
      ]
    }
  },
  watch: {
    '$route': function (to, from) {
      this.currentPage = to.name
      console.log(this.currentPage)
    }
  },
  methods: {
    ...mapMutations('user', ['SET_currentUser']),
    ...mapActions('user', ['logout']),
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
  #nav_bar_root {
    display: flex;
    align-content: center;
    align-items: center;
    height: 64px;
    box-shadow: 6px 0 12px rgba(0, 0, 0, 0.09);
  }
  #nav_bar_menu {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    grid-auto-flow: column;
    justify-content: space-between;
    justify-items: center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    line-height: 100%;
    border-bottom: none !important;
  }
  .nav_bar_menu_item {
    position: relative;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 20px 12px;
    grid-row-gap: 6px;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    & > i {
      margin: 0 !important;
    }
  }
</style>
