<template lang="pug">
#authorization.float-container
  .auth-form
    el-form(v-loading="loading")
      el-form-item(label="Password")
        el-input(v-model="form.password", type="password")
      el-form-item(label="Confirm password")
        el-input(v-model="validatePassword", type="password")
      el-form-item
        el-button(@click="confirmPassword", :loading="loading", round) change
</template>

<script>
import http from '@/services/httpAuth'
import msgHandler from '@/services/msgHandler'

export default {
  name: 'ForgotPassword',
  data () {
    return {
      validatePassword: '',
      form: {
        password: ''
      },
      loading: false,
      api: 'forgot/'
    }
  },
  methods: {
    confirmPassword() {
      if (this.form.password === this.validatePassword) {
        this.loading = true
        const endpoint = this.api + this.$route.query.token
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
