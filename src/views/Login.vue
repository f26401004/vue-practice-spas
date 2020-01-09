<template lang="pug">
  div
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :md="14" :lg="6")
        div(style="padding: 24px;")
          a-row
            h1 Login
          a-alert(v-if="errorMessage" type="error" :message="errorMessage" banner)
          a-row(style="margin-top: 12px;")
            a-form(layout="horizontal" :form="form" @submit="handleSubmit")
              a-form-item
                a-input(placeholder="Email" type="email"
                  v-decorator="['email', { rules: [{ validator: emailValidator, message: 'Please input a correct email!' }] }]")
                  a-icon(slot="prefix" type="mail")
                  a-tooltip(slot="suffix" title="Enter your username here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                a-input(placeholder="Password" type="password"
                  v-decorator="['password', { rules: [{ required: true, message: 'Please input your password!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your password here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                a-checkbox(v-decorator="['remember', { valuePropName: 'checked', initialValue: true }]") Remember me
                a(style="float: right;") Forgot password
                a-button(type="primary" style="width: 100%;" html-type="submit") Login
                span or
                a &nbsp;register now!
</template>

<script>
import { blue } from '@ant-design/colors'
import Firebase from '@/firebase'

export default {
  name: 'login',
  data: function () {
    return {
      blue,
      errorMessage: null
    }
  },
  beforeCreate: function () {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  methods: {
    handleSubmit: async function (event) {
      event.preventDefault()
      this.form.validateFields(async (error, values) => {
        if (!error) {
          console.log('Received values from form:', values)
          try {
            const result = await Firebase.auth().signInWithEmailAndPassword(values.email, values.password)
            console.log(result)
            this.$router.push('meeting')
          } catch (error) {
            this.errorMessage = error.message
          }
        } else {
          this.errorMessage = error.message
        }
      })
    },
    emailValidator: function (rule, value, callback) {
      const temp = value.split('@')
      callback(temp.length > 1 && temp[1].length > 0 && value.length > 0 ? undefined : false)
    }
  }
}
</script>
