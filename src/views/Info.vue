<template lang="pug">
  div(id="info_page_root")
    a-row(type="flex" justify="space-between" align="middle" style="height: 64px; margin: 0; background: linear-gradient(90deg, rgba(24,144,255,1) 0%, rgba(145,213,255,1) 100%); padding: 16px 24px; box-sizing: border-box;")
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
            a-divider(orientation="right" style="margin: 0;" :style="{ 'color': blue.primary }") ▼ Members | {{ members.length }}
            a-row(style="margin: 0;")
              a-card(v-for="(member, index) of members" :key="`member-${member.uid}-${index}`" hoverable style="width: 100%; height: 80px; margin-top: 16px; border-left: 8px solid #34F6F2;")
                a-card-meta
                  a-row(slot="avatar" type="flex" justify="space-between" align="middle" style="margin: 0;")
                    img(v-if="index < 3" :src="require(`@/assets/cup_${index + 1}.svg`)" width="24" height="24")
                    h3(v-else :style="{ 'color': blue[7] }" style="width: 24px; text-align: center; margin: 0; font-weight: 700;") {{ index + 1 }}
                    a-avatar(size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style="margin-left: 12px;")
                  a-row(slot="description" type="flex" justify="space-between" align="middle" style="margin: 0;")
                    div
                      h3(:style="{ 'color': blue.primary }" style="margin: 0; font-weight: 700;") {{ member.username }}
                      p(style="margin: 0;") Point: {{ member.point }}
                    router-link(type="span" :to="`/profile/${member.uid}`")
                      a-button(size="large" shape="circle" type="primary")
                        a-icon(type="user")
            //- a-list(:dataSource="members" type="horizontal" :loading="loadMembers")
            //-   a-list-item(slot="renderItem" slot-scope="member, index")
        a-tab-pane(key="3")
          span(slot="tab")
            a-icon(type="info-circle")
            span About
    a-row
</template>

<script>
import { blue } from '@ant-design/colors'
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      blue,
      loadMembers: true
    }
  },
  computed: {
    ...mapState('feature', {
      members: 'members'
    })
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
