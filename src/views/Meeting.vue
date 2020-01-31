<template lang="pug">
  div(id="meeting_page_root")
    a-row(:class="{'slide-active': displaySearch}"
      style="max-height: 146px; margin: 0; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09); padding: 24px; background-color: white; overflow-y: hidden; transition: .4s max-height ease;")
      a-row(type="flex" justify="space-between" align="middle" style="margin: 0;")
        h1(:style="{ 'color': blue[6] }" style="margin: 0;" ) Meeting
        a-button(shape="circle" type="primary" size="large" @click="displaySearch = !displaySearch")
          a-icon(type="search")
      a-row(ref="promptString" style="margin: 0; transition: .1s max-height; overflow-y: hidden;")
        p(style="margin: 0; padding: 12px 0 16px 0;") Hi,&nbsp;
          span(:style="{ 'color': blue[6] }" style="font-weight: 700;") {{ currentUser.username }}
          span . Here is our study group schedules recently.
      transition(name="slide")
        a-row(v-show="displaySearch" style="padding-top: 12px; margin: 0;")
          a-input(size="large")
            a-icon(slot="prefix" type="search")
            a-tooltip(slot="suffix" title="Search the meeting by title or host")
              a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45);")
    a-row(ref="meetingContainer" style="overflow-y: auto; margin: 0; padding-bottom: 24px;")
      transition(name="slide")
        a-row(v-if="recentMeeting.mid && displayIncomingMeeting" style="margin: 24px 0  24px 24px; padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);"
          :style="{ 'background-color': blue[4] }"
          class="ripple")
          h1(style="color: white;") Incoming Meeting
          p(style="color: white; margin: 0;") You have meeting schedule on <b>{{ recentMeeting.time | timestampToDate }}</b>. The topic is <b>{{ recentMeeting.title }}</b> Let's prepare to learn the new things!
          a-row
            a-button(shape="round" size="large" :style="{ 'color': blue.primary }" @click="displayIncomingMeeting = false") OK, GOT IT
      a-divider(orientation="right" style="margin-top: 24px; padding: 0 24px; box-sizing: border-box;" :style="{ 'color': blue.primary }") ▼ Schedules | 6
      a-timeline(style="margin-left: 24px;")
        a-timeline-item(v-for="(meeting, index) of meetings" :key="`meeting-${meeting.mid}-${index}`" :data-index="index" )
          a-row(style="margin: 0px 0 0 12px;")
            h3(:style="{ 'color': blue[6] }") {{ meeting.time }}
            a-row(style="padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px; background: linear-gradient(90deg, rgba(80,125,188,1) 0%, rgba(52,246,242,0.33) 100%), #507dbc; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);" class="ripple" )
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
      displayIncomingMeeting: true,
      recentMeeting: {
        mid: '',
        title: '',
        description: '',
        time: '',
        host: ''
      },
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
  filters: {
    timestampToDate: function (value) {
      const time = new Date(value.seconds * 1000)
      return time.toDateString()
    }
  },
  mounted: async function () {
    if (this.currentUser.schedules.length > 0) {
      const responseRecentMeeting = await this.currentUser.schedules[0].get()
      this.recentMeeting = {
        mid: this.currentUser.schedules[0].id,
        ...responseRecentMeeting.data()
      }
    }
    this.$nextTick(() => {
      const originHeight = this.$refs.promptString.$el.clientHeight
      // add scroll event to meeting container and make transition on prompt string
      this.$refs.meetingContainer.$el.addEventListener('scroll', event => {
        const height = Math.max(originHeight - this.$refs.meetingContainer.$el.scrollTop, 0)
        this.$refs.promptString.$el.style.maxHeight = `${height}px`
      })
    })
  },
  methods: {
    checkJoin: function (mid) {
      return this.currentUser.schedules.findIndex(target => target.mid === mid) === -1
    },
    meetingBeforeEnter: function (el) {
      console.log(el)
      el.style.display = 'none'
    },
    meetingEnter: function (el) {
      const delay = el.dataset.index * 200
      setTimeout(function () {
        el.style.display = 'block'
        el.classList.add('animated fadeIn')
      }, delay)
    },
    meetingLeave: function (el) {
      // const delay = el.dataset.index * 200
      // setTimeout(function () {
      //   el.style.display = 'block'
      //   el.classList.add('animated fadeIn')
      // }, delay)
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
    background: #fafafa;
  }

  .slide-active {
    max-height: 225px !important;
  }
</style>
