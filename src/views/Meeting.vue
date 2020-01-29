<template lang="pug">
  div(id="meeting_page_root")
    h1(:style="{ 'color': blue[6] }" style="padding: 24px 24px 0 24px; margin: 0;") Meeting
    p(style="margin: 0; padding: 0 24px;") Hi,&nbsp;
      span(:style="{ 'color': blue[6] }" style="font-weight: 700;") {{ currentUser.username }}
      span . Here is our study group schedule recently.
    a-row(style="overflow-y: auto; max-height: calc(100% - 118px); min-height: calc(100% - 164px); margin: 0; padding-bottom: 24px;")
      a-row(style="margin-left: 24px; padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px;"
        :style="{ 'background-color': cardBackgroundColors[0] }")
        h1(style="color: white;") Incoming Meeting
        p(style="color: white; margin: 0;") You have meeting schedule on <b>Tomorrow</b>. The topic is <b>VUE SPA GUIDELINE</b> Let's prepare to learn the new things!
        a-row
          a-button(shape="round" size="large") OK, GOT IT
      a-row(v-for="(meeting, index) of meetings" :key="`meeting-${meeting.mid}-${index}`")
        a-row(style="margin-left: 24px; padding: 24px; box-sizing: border-box; border-radius: 12px 0 0 12px;"
          :style="{ 'background-color': cardBackgroundColors[index % cardBackgroundColors.length] }")
          h1(style="color: white; margin: 0;") {{ meeting.title }}
          p(style="color: white; margin: 0;") {{ meeting.description }}
          a-row
            a-tag(type="primary") time
            time(style="color: white;") {{ meeting.time }}
            a-divider(type="vertical")
            a-tag(type="primary") host
            label(style="color: white;") {{ meeting.host }}
</template>

<script>
import { blue, red, gold, green, purple } from '@ant-design/colors'
import { mapState } from 'vuex'
export default {
  data: function () {
    return {
      blue,
      meetings: new Array(5).fill({
        mid: '123',
        title: 'Vue SPA guideline',
        description: 'Vue SPA guideline descrption',
        host: 'f26401004',
        time: new Date().toDateString()
      }),
      cardBackgroundColors: [blue[3], red[3], gold[3], green[3], purple[3]]
    }
  },
  computed: {
    ...mapState('user', {
      currentUser: 'currentUser'
    })
  }
}
</script>

<style lang="scss" scoped>
  #meeting_page_root {
    width: 100%;
    height: 100%;
  }
</style>
