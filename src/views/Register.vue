<template lang="pug">
  div(id="register_page_root")
    a-row(type="flex" justify="center" align="middle" class="animated fadeIn faster delay-1")
      div(id="register_logo")
    a-row(type="flex" justify="center" align="middle" class="animated fadeIn faster delay-1")
      p(style="color: white; margin: 0; text-align: center") Improve meeting scheduling
        | <br/> for your team.
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :md="14" :lg="6")
        div(style="padding: 24px; box-sizing: border-box;")
          a-alert(v-if="errorMessage" type="error" :message="errorMessage" banner)
          a-row(style="margin-top: 12px;")
            a-form(layout="horizontal" :form="form" @submit.prevent="handleSubmit")
              a-form-item(class="animated fadeIn faster delay-2")
                a-input(placeholder="Username" type="text"
                  size="large"
                  v-decorator="['username', { rules: [{ required: true, message: 'Please input a your username!' }] }]")
                  a-icon(slot="prefix" type="user")
                  a-tooltip(slot="suffix" title="Enter your username here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
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
              a-form-item(class="animated fadeIn faster delay-5")
                a-input(placeholder="Comfirm password" type="password"
                  size="large"
                  v-decorator="['comfirmPassword', { rules: [{ required: true, message: 'Please input your password again!'}, {validator: confirmPasswordValidator, message: 'Please make sure the passwords are the same!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your password here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item(class="animated fadeIn faster delay-6")
                a-input(placeholder="Invite code" type="password"
                  size="large"
                  v-decorator="['inviteCode', { rules: [{ required: true, message: 'Please input your invite code!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your invite code here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item(class="animated fadeIn faster delay-7")
                a-button(size="large" style="width: 100%;" html-type="submit" type="ghost" ) Register
                router-link(tag="a" style="color: white; float: right;" to="/login") Have an account?
</template>

<script>
import { grey } from '@ant-design/colors'
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'register',
  data: function () {
    return {
      grey,
      errorMessage: ''
    }
  },
  beforeCreate: function () {
    this.form = this.$form.createForm(this, { name: 'normal_register' })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUser']),
    ...mapActions('feature', ['register']),
    handleSubmit: async function (event) {
      this.form.validateFields(async (error, values) => {
        if (!error) {
          try {
            this.register(values)
            this.$router.replace('/meeting')
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
    },
    confirmPasswordValidator: function (rule, value, callback) {
      const temp = this.form.getForm().getFieldValue('password')
      callback(temp === value ? undefined : false)
    }
  }
}
</script>

<style lang="scss" scoped>

  #register_page_root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-auto-flow: row;
    align-content: center;
    align-items: center;

    background-color: #1890ff;
  }
  #register_logo {
    display: inline-block;
    width: 14vw;
    height: 14vw;
    background-color: white;
    mask-image: url("../assets/logo.svg");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: 50% 50%;
    margin: 9vh 3vh 3vh 3vh;
  }

</style>
