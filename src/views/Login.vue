<template lang="pug">
  div(id="login_page_root")
    a-row(type="flex" justify="center" align="middle" class="animated fadeIn faster delay-1")
      div(id="login_logo")
        div
        span
    a-row(type="flex" justify="center" align="middle" class="animated fadeIn faster delay-2")
      p(:style="{ 'color': grey[1] }" style="margin: 0; text-align: center") Improve meeting scheduling
        | <br/> for your team.
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :md="14" :lg="6")
        div(style="padding: 24px;")
          a-alert(v-if="errorMessage" type="error" :message="errorMessage" banner)
          a-row(style="margin-top: 12px;")
            a-form(layout="horizontal" :form="form" @submit.prevent="handleSubmit")
              a-form-item(class="animated fadeIn faster delay-3")
                a-input(placeholder="Email" type="email"
                  size="large"
                  v-decorator="['email', { rules: [{ validator: emailValidator, message: 'Please input a correct email!' }] }]")
                  a-icon(slot="prefix" type="mail")
                  a-tooltip(slot="suffix" title="Enter your email here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item(class="animated fadeIn faster delay-4")
                a-input(placeholder="Password" type="password"
                  size="large"
                  v-decorator="['password', { rules: [{ required: true, message: 'Please input your password!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your password here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item(class="animated fadeIn faster delay-4")
                a-checkbox(v-decorator="['remember', { valuePropName: 'checked', initialValue: true }]") Remember me
                a(style="float: right;") Forgot password
                a-button(size="large" type="primary" style="width: 100%;" html-type="submit" class="ripple") Login
                span or
                router-link(tag="a" to="/register") &nbsp;register now!
</template>

<script>
import { blue, grey } from '@ant-design/colors'
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'login',
  data: function () {
    return {
      blue,
      grey,
      errorMessage: null
    }
  },
  beforeCreate: function () {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUser']),
    ...mapActions('feature', ['login']),
    handleSubmit: async function (event) {
      this.form.validateFields(async (error, values) => {
        if (!error) {
          try {
            await this.login(values)
            this.$router.push('/meeting')
          } catch (error) {
            this.errorMessage = error.message
          }
          return
        }
        this.errorMessage = error.message
      })
    },
    emailValidator: function (rule, value, callback) {
      const temp = value.split('@')
      callback(temp.length > 1 && temp[1].length > 0 && value.length > 0 ? undefined : false)
    }
  }
}
</script>

<style lang="scss" scoped>
  #login_page_root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-auto-flow: row;
    align-content: center;
    align-items: center;
  }
  #login_logo {
    position: relative;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    width: 22vw;
    height: 22vw;
    margin: 10vh 5vh 5vh 5vh;
    & > div:nth-child(1) {
      width: 100%;
      height: 100%;
      width: 20vw;
      height: 20vw;
      background-color: #1890ff;
      mask-image: url("../assets/user.svg");
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: 50% 50%;
    }
    & > span:nth-child(2) {
      position: absolute;
      top: -4vw;
      left: -4vw;
      width: 100%;
      height: 100%;
      content: "";
      width: 30vw;
      height: 30vw;
      border: 2px solid #1890ff;
      border-radius: 100%;
    }
  }
</style>
