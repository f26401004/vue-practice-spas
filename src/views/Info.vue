<template lang="pug">
  div(id="info_page_root")
    a-row(type="flex" justify="space-between" align="middle" style="height: 64px; margin: 0; background: linear-gradient(90deg, rgba(9,109,217,1) 0%, rgba(24,144,255,1) 100%); padding: 16px 24px; box-sizing: border-box;")
      h2(style="color: white; margin: 0;")
        a-icon(type="solution" style="margin-right: 12px;")
        span Meetings
      a-icon(type="info-circle" style="font-size: 18px; color: white" theme="filled" @click="showInfo")
    a-row(style="height: calc(100% - 64px); overflow-y: auto; margin: 0;")
      a-tabs(size="large" :tabBarGutter="0" defaultActiveKey="1" style="height: 100%; overflow-y: auto;")
        a-tab-pane(key="1")
          span(slot="tab" style="width: 50%;")
            a-icon(type="team")
            span Members
          div(style="height: 100%; overflow-y: auto; padding: 24px; box-sizing: border-box;")
            a-divider(orientation="right" style="margin: 0;" :style="{ 'color': blue.primary }") ▼ Members | 6
            a-list(:dataSource="test" type="horizontal")
              a-lite-item(slot="renderItem" slot-scope="member, index")
                a-card(hoverable style="height: 80px; margin-top: 16px; border-left: 8px solid #34F6F2;")
                  a-card-meta
                    a-row(slot="avatar" type="flex" justify="space-between" align="middle" style="margin: 0;")
                      img(v-if="index < 3" :src="require(`@/assets/cup_${index + 1}.svg`)" width="24" height="24")
                      h3(v-else :style="{ 'color': blue[7] }" style="width: 24px; text-align: center; margin: 0; font-weight: 700;") {{ index + 1 }}
                      a-avatar(size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style="margin-left: 12px;")
                    a-row(slot="description" type="flex" justify="space-between" align="middle" style="margin: 0;")
                      div
                        h3(:style="{ 'color': blue.primary }" style="margin: 0; font-weight: 700;") {{ member.username }}
                        p(style="margin: 0;") Point: 128
                      router-link(type="span" :to="`/profile/${member.uid}`")
                        a-button(size="large" shape="circle" type="primary")
                          a-icon(type="user")
        a-tab-pane(key="3")
          span(slot="tab")
            a-icon(type="info-circle")
            span About
    a-row
</template>

<script>
import { blue } from '@ant-design/colors'
export default {
  data: function () {
    return {
      blue,
      test: new Array(6).fill({
        username: 'test',
        status: 'test status',
        uid: 'xFjojWL60SUUCAqE02KmYU2tHG23'
      })
    }
  },
  methods: {
    showInfo: function () {
      this.$info({
        class: 'custom-modal-style',
        okType: 'ghost',
        title: 'Info Page',
        content: h => (<div>
          <ul style="margin: 0; padding-left: 24px;">
            <li><b>Click on</b> user button to check member's detail information.</li>
          </ul>
          <br/>
        </div>)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #info_page_root {
    width: 100%;
  }
</style>
