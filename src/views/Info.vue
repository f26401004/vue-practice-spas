<template lang="pug">
  div(id="info_page_root")
    a-row(style="height: 15%; margin: 0; background: #1890ff; padding: 16px; box-sizing: border-box;")
      h1(:style="{ 'color': blue[0] }")
        a-icon(type="solution" style="margin-right: 12px;")
        span Meetings
      a-tag(color="blue") Members
      span 6
      a-divider(type="vertical")
      a-tag(color="green") Meetings
      span 6
      a-divider(type="vertical")
      a-tag(color="red") Problems
      span 2
    a-row(style="height: 85%; overflow-y: auto; margin: 0;")
      a-tabs(size="large" :tabBarGutter="0" defaultActiveKey="1" style="height: 100%; overflow-y: auto;")
        a-tab-pane(key="1")
          span(slot="tab")
            a-icon(type="team")
            span Members
          div(style="height: 100%; overflow-y: auto; padding: 0 24px;")
            a-row(v-for="i in 6" :key="i")
              a-card(hoverable style="height: 300px")
                img(alt="example" slot="cover" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png")
                a-card-meta(title="Card title" description="Card description")
        a-tab-pane(key="2")
          span(slot="tab")
            a-icon(type="thunderbolt")
            span Ranking
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
      blue
    }
  }
}
</script>

<style lang="scss" scoped>
  #info_page_root {
    width: 100%;

    background: linear-gradient(180deg, #e6f7ff 0%, white 100%);
  }
</style>
