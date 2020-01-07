<template lang="pug">
  div
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :sm="12" :md="8" :lg="6")
        div(style="padding: 24px;")
          a-row
            h1 Login
          a-alert(v-if="error" type="error" message="Error text here." banner)
          a-row(style="margin-top: 12px;")
            a-input(placeholder="Username")
              a-icon(slot="prefix" type="user")
              a-tooltip(slot="suffix" title="Enter your username here")
                a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
            a-input(placeholder="Password" type="password" style="margin-top: 12px;")
              a-icon(slot="prefix" type="lock")
              a-tooltip(slot="suffix" title="Enter your password here")
                a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
          a-row(type="flex" justify="end" align="middle" style="margin-top: 12px;")
            a-button(type="primary") Login
</template>

<script>
import { blue } from '@ant-design/colors'

export default {
  name: 'login',
  data: function () {
    return {
      blue,
      error: null
    }
  }
}
</script>
