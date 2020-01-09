<template lang="pug">
  div
    a-row(type="flex" justify="center" align="middle")
      a-col(:xs="20" :md="14" :lg="6")
        div(style="padding: 24px;")
          a-row
            h1 Register
          a-alert(v-if="errorMessage" type="error" :message="errorMessage" banner)
          a-row(style="margin-top: 12px;")
            a-form(layout="horizontal" :form="form" @submit.prevent="handleSubmit")
              a-form-item
                a-input(placeholder="Username" type="text"
                  v-decorator="['username', { rules: [{ required: true, message: 'Please input a your username!' }] }]")
                  a-icon(slot="prefix" type="user")
                  a-tooltip(slot="suffix" title="Enter your username here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                a-input(placeholder="Email" type="email"
                  v-decorator="['email', { rules: [{ validator: emailValidator, message: 'Please input a correct email!' }] }]")
                  a-icon(slot="prefix" type="mail")
                  a-tooltip(slot="suffix" title="Enter your email here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                a-input(placeholder="Password" type="password"
                  v-decorator="['password', { rules: [{ required: true, message: 'Please input your password!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your password here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                a-input(placeholder="Comfirm password" type="password"
                  v-decorator="['comfirmPassword', { rules: [{ required: true, message: 'Please input your password again!'}, {validator: confirmPasswordValidator, message: 'Please make sure the passwords are the same!'}] }]")
                  a-icon(slot="prefix" type="lock")
                  a-tooltip(slot="suffix" title="Enter your password here")
                    a-icon(type="info-circle" style="color: rgba(0, 0, 0, 0.45)")
              a-form-item
                router-link(tag="a" style="float: right;" to="/login") Have an account?
                a-button(type="primary" style="width: 100%;" html-type="submit") Register
</template>

<script>
import Firebase from '@/firebase'
import { mapMutations } from 'vuex'

export default {
  name: 'register',
  data: function () {
    return {
      errorMessage: ''
    }
  },
  beforeCreate: function () {
    this.form = this.$form.createForm(this, { name: 'normal_register' })
  },
  methods: {
    ...mapMutations('feature', ['SET_currentUser']),
    handleSubmit: async function (event) {
      this.form.validateFields(async (error, values) => {
        if (!error) {
          try {
            const result = await Firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
            // update the displayName of user
            await result.user.updateProfile({
              displayName: values.username
            })
            this.$router.replace('/meeting')
            return
          } catch (error) {
            this.errorMessage = error.message
          }
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
