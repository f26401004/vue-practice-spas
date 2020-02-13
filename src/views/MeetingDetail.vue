<template lang="pug">
  div(id="meeting_detail_page_root")
    a-row(style="margin: 0; padding: 12px 24px;" :style="{ 'background-color': blue[5] }")
      a-row(type="flex" justify="space-between" align="middle" style="margin: 0;")
        h2(style="margin: 0; color: white;" ) {{ meeting.title }}
        a-button(shape="circle" type="ghost" size="small")
          a-icon(type="info")
    a-row(id="meeting_banner_container" type="flex" justify="start" align="top" style="margin: 0; padding: 24px;")
      a-avatar(:src="avatarURL" :size="48" style="margin-right: 24px;")
      a-row(style="margin: 0")
        h3(style="color: white; margin: 0;") {{ meeting.host.username }}
        p(style="color: white; margin: 0;") test status
        router-link(tag="span" :to="`/profile/${meeting.host.uid}`")
          a-button(type="ghost" size="small" style="margin-top: 12px;") View Profile
    a-row(style="margin: 0; padding: 24px; max-height: calc(100% - 197px); overflow-y: auto;")
      a-divider(orientation="left" style="margin: 0;") Topics

      a-steps(direction="vertical" :current="meeting.units.length" style="margin-top: 16px;")
        a-step(v-for="(unit, index) of meeting.units" :key="`${unit.title}-${index}-unit`")
          a-row(slot="icon" type="flex" justify="center" align="middle" style="margin: 0; border-radius: 100%; border: 1px solid #1890ff; width: 32px; height: 32px;")
            label(style="font-size: 14px; font-weight: 600;") {{ index + 1 }}
          div(slot="title")
            a-card(
              hoverable
              style="margin-bottom: 16px; border-left: 8px solid #34F6F2;")
              a-row(type="flex" justify="space-between" align="middle" style="margin: 0;")
                a-row(type="flex" justify="start" style="margin: 0")
                  h3(:style="{ 'color': blue[5] }" style="margin: 0;" class="custom-topic-title") {{ unit.title }}
                  a-tag(style="margin-left: 12px;" :color="transferLevel(unit.level).color") {{ transferLevel(unit.level).text }}
                a-button(v-if="unit.attachment" shape="circle")
                  a-icon(type="file")
              p(style="margin: 0;") {{ unit.description }}
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
    ...mapMutations('feature', ['SET_loading']),
    transferLevel: function (level) {
      switch (level) {
        case 0:
          return {
            text: 'Easy',
            color: '#87d068'
          }
        case 1:
          return {
            text: 'Medium',
            color: '#108ee9'
          }
        case 2:
          return {
            text: 'Hard',
            color: '#f50'
          }
      }
    }
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
  .custom-progress-dot {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    border: 1px solid #1890ff;
    font-size: 16px;
  }
</style>
