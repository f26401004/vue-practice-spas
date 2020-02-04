import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store/index.js'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/meeting',
    name: 'meeting',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "loggedin" */ '@/views/Meeting.vue')
  }, {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  }, {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Register.vue')
  }, {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "loggedin" */ '@/views/Profile.vue'),
    beforeEnter: (to, from, next) => {
      const currentUser = Store.getters['user/getCurrentUser']
      if (!currentUser) {
        next({ path: '/error/401' })
        return
      }
      next()
    },
    props: route => ({
      user: Store.getters['user/getCurrentUser'],
      avatar: Store.getters['user/getCurrentUserAvatar']
    })
  }, {
    path: '/profile/:uid',
    name: 'profile-uid',
    component: () => import(/* webpackChunkName: "loggedin" */ '@/views/Profile.vue')
  }, {
    path: '/info',
    name: 'info',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Info.vue')
  }, {
    path: '/error/:code',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
