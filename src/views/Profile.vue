<template lang="pug">
  div(id="profile_page_root")
    div(id="profile_page_background" class="decorator")
    div(id="profile_picture" class="decorator")
    a-row(type="flex" justify="center" align="middle" style="margin-top: 18vh;")
      h2(style="color: white;") {{ user.username }}
    a-row(type="flex" justify="center" align="middle" :gutter="32")
      a-col(:span="8")
        a-icon(style="color: white; font-size: 32px;" type="github")
      a-col(style="color: white; font-size: 32px;" :span="8")
        a-icon(type="facebook" theme="filled")
      a-col(style="color: white; font-size: 32px;" :span="8")
        a-icon(type="linkedin" theme="filled")
    a-row(type="flex" justify="center" align="middle" id="profile_status_container")
      p(style="text-align: center;") U know exactly what you want, though u r running away.
      a-button(type="primary" size="large" shape="round" class="decorator" style="top: calc(100% - 20px); ") logout
    a-row(type="flex" justify="space-between" align="middle" style="width: 100%; margin-top: 44px;")
      label(:style="{ 'color': blue.primary }" style="font-weight: 900;") Attendence
      label x1
    a-list(itemLayout="horizontal" size="small" :dataSource="test" header="schedule" style="font-size: 12px; width: 100%; height: 100%; overflow-y: auto;")
      a-list-item(slot="renderItem" slot-scope="item, index")
        a-list-item-meta
          a-row(slot="title")
            a-col(:span="12")
              a-row(type="flex" justify="start" align="middle")
                label {{ item.title }}
            a-col(:span="12")
              a-row(type="flex" justify="end" align="middle")
                time(:style="{ 'color': blue[2] }" style="text-align: right; font-weight: 300;") {{ item.date.toDateString() }}
</template>

<script>
import { mapState } from 'vuex'
import { blue } from '@ant-design/colors'
import infiniteScroll from 'vue-infinite-scroll'
import { RecycleScroller } from 'vue-virtual-scroller'

export default {
  directives: {
    infiniteScroll
  },
  components: {
    RecycleScroller
  },
  data: function () {
    return {
      blue,
      busy: false,
      loading: false,
      test: new Array(3).fill({
        title: 'Vue practice!!',
        description: 'Practice vue framework and build a calendar APP for yourself!!',
        date: new Date(),
        join: false,
        icon: ''
      })
    }
  },
  computed: {
    ...mapState('feature', {
      user: 'currentUser'
    })
  },
  methods: {
    handleInfiniteOnLoad: function () {
    }
  }
}
</script>

<style lang="scss" scoped>
  #profile_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto) 1fr;
    grid-auto-flow: row;
    justify-content: center;
    justify-items: center;
    align-content: flex-start;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
  }
  #profile_page_background {
    top: 0;
    left: 0;
    width: 140%;
    height: 38vh;
    background-color: #1890FF;
    z-index: -1;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.09);
  }
  #profile_picture {
    top: 5vh;
    width: 24vw;
    height: 24vw;
    border-radius: 100%;
    background-color: gray;

    &:before {
      position: absolute;
      top: -2vw;
      left: -2vw;
      content: "";
      width: 28vw;
      height: 28vw;
      border: 3px solid rgba(255, 255, 255, 0.75);
      border-radius: 100%;
    }
  }

  #profile_status_container {
    position: relative;
    width: 100%;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.09);
    padding: 12px;
    box-sizing: border-box;
  }
</style>
