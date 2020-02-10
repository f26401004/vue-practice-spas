<template lang="pug">
  div(id="meeting_detail_page_root")
    a-row(style="margin: 0; padding: 24px;" :style="{ 'background-color': blue[5] }")
      a-row(type="flex" justify="space-between" align="middle" style="margin: 0;")
        h1(style="margin: 0; color: white;" ) {{ meeting.title }}
        a-button(shape="circle" type="ghost" size="small" @click="displaySearch = !displaySearch")
          a-icon(type="info")
    a-row(id="meeting_banner_container" type="flex" justify="start" align="start" style="margin: 0; padding: 24px;")
      a-avatar(:src="avatarURL" :size="48" style="margin-right: 24px;")
      a-row(style="margin: 0")
        h3(style="color: white; margin: 0;") {{ meeting.host.username }}
        p(style="color: white; margin: 0;") test status
        a-button(type="ghost" size="small" style="margin-top: 12px;") View Profile
    a-row
</template>

<script>
import firebaseInit from '@/firebase.js'
import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
import { blue } from '@ant-design/colors'

export default {
  name: 'meeting-detail',
  data: function () {
    return {
      blue: blue,
      avatarURL: ''
    }
  },
  computed: {
    ...mapState('feature', {
      meetings: 'meetings'
    }),
    meeting: function () {
      return this.meetings.find(target => target.mid === this.$route.params.mid)
    }
  },
  beforeMount: async function () {
    if (!this.meeting) {
      // TODO: route to page not found page
    }
    const firebase = await firebaseInit(['storage', 'firestore'])
    // display the loading effect
    this.SET_loading(true)
    // fetch for avatar
    try {
      const storageRef = firebase.storage.ref()
      const url = await storageRef.child(`images/avatar/${this.$route.params.uid}`).getDownloadURL()
      const { data } = await axios.get(url, { responseType: 'blob' })
      this.avatarURL = window.URL.createObjectURL(data)
    } catch (error) {
      console.log(error.message)
    }
    this.SET_loading(false)
  },
  methods: {
    ...mapMutations('feature', ['SET_loading'])
  }
}
</script>

<style lang="scss" scoped>
  #meeting_banner_container {
    position: relative;
    background-image: url("../assets/meeting_background.svg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      background: #507dbc;
    }
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(80, 125,188, 0.91)
    }
  }
</style>
