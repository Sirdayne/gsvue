<template lang="pug">
#authorization.float-container
  .auth-back
  .auth-form
    h4 Set password for {{ doctorsEmail }}
    el-form
      el-form-item(label="Password")
        el-input(:disabled="loading", v-model="form.password", type="password")
      el-form-item(label="Confirm password")
        el-input(:disabled="loading", v-model="validatePassword", type="password")
      el-form-item
        el-button(:loading="loading", @click="confirmPassword", round) confirm
</template>

<script>
import http from '@/services/httpAuth'
import msgHandler from '@/services/msgHandler'
import Auth from '@/services/Auth'

export default {
  name: 'DoctorConfirmPassword',
  data () {
    return {
      doctorsEmail: 'invalid e-mail',
      validatePassword: '',
      form: {
        password: ''
      },
      loading: false,
      endpoint: 'users/password/set/'
    }
  },
  created() {
    Auth.logoutWithoutRedirect()
    this.doctorsEmail = this.$route.query.email
  },
  methods: {
    confirmPassword() {
      if (this.form.password === this.validatePassword) {
        this.loading = true
        const endpoint = this.endpoint + this.$route.query.token
        http.post(endpoint, this.form).then(() => {
          this.loading = false
          this.$router.push(`/sign-in`)
        }).catch(() => {
          this.loading = false
        })
      } else {
        msgHandler.showError('Passwords must be the same')
      }
    },
  }
}
</script>
