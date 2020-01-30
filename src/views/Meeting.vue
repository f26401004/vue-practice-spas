<template lang="pug">
  div(id="meeting_page_root")
    a-row(style="margin: 0; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09); padding: 24px; background-color: white;")
      a-row(type="flex" justify="space-between" align="middle" style="margin: 0;")
        h1(:style="{ 'color': blue[6] }" style="margin: 0;" ) Meeting
        a-button(shape="circle" type="primary" size="large" @click="displaySearch = !displaySearch")
          a-icon(type="search")
      p(style="margin: 0; padding-top: 12px;") Hi,&nbsp;
        span(:style="{ 'color': blue[6] }" style="font-weight: 700;") {{ currentUser.username }}
        span . Here is our study group schedules recently.
      transition(name="slide")
        a-row(v-show="displaySearch" style="padding-top: 12px; margin: 0;")
          a-input(size="large")
            a-icon(slot="prefix" type="search")
      a-row(v-if="currentUser.schedules.length > 0" style="margin: 12px 0  24px 24px; padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);"
        :style="{ 'background-color': blue[4] }"
        class="ripple")
        h1(style="color: white;") Incoming Meeting
        p(style="color: white; margin: 0;") You have meeting schedule on <b>{{ currentUser.schedules[0].time }}</b>. The topic is <b>{{ currentUser.schedules[0].title }}</b> Let's prepare to learn the new things!
        a-row
          a-button(shape="round" size="large" :style="{ 'color': blue.primary }") OK, GOT IT
    a-row(style="overflow-y: auto; margin: 0; padding-bottom: 24px;")
      a-divider(orientation="right" style="margin-top: 24px;" :style="{ 'color': blue.primary }") ▼ Schedules | 6
      a-timeline(style="margin-left: 24px;")
        a-timeline-item(v-for="(meeting, index) of meetings" :key="`meeting-${meeting.mid}-${index}`" )
          a-row(style="margin: 0px 0 0 12px;")
            h3(:style="{ 'color': blue[6] }") {{ meeting.time }}
            a-row(style="padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px; background-color: #507DBC; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);" class="ripple" )
              a-row(style="margin: 0;" type="flex" justify="space-between" align="middle")
                div
                  h3(style="color: white; margin: 0;") {{ meeting.title }}
                  p(style="color: white; margin: 0;") {{ meeting.description }}
                a-button(type="ghost" shape="circle" size="large")
                  a-icon(v-show="checkJoin(meeting.mid)" type="plus")
                  a-icon(v-show="!checkJoin(meeting.mid)" type="minus")
              a-row
                a-tag(color="#40a9ff") time
                time(style="color: white;") {{ meeting.time }}
              a-row(style="margin-top: 6px;")
                a-tag(color="#40a9ff") host
                label(style="color: white;") {{ meeting.host }}
</template>

<script>
import { blue } from '@ant-design/colors'
import { mapState } from 'vuex'
export default {
  data: function () {
    return {
      blue,
      displaySearch: false,
      meetings: new Array(5).fill({
        mid: '123',
        title: 'Vue SPA guideline',
        description: 'Vue SPA guideline descrption',
        host: 'f26401004',
        time: new Date().toDateString()
      })
    }
  },
  computed: {
    ...mapState('user', {
      currentUser: 'currentUser'
    })
  },
  methods: {
    checkJoin: function (mid) {
      return this.currentUser.schedules.findIndex(target => target.mid === mid) === -1
    }
  }
}
</script>

<style lang="scss" scoped>
  #meeting_page_root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, auto);
    width: 100%;
    height: 100%;
    background: #fafafa;
  }
</style>
