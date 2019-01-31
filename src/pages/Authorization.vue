<template lang="pug">
#authorization.float-container
  .auth-back
  .auth-detail
    .auth-logo
      img(src="@/assets/logo-white.svg")
    .auth-title CLOUD-BASED DENTAL SPEECH RECOGNITION SOFTWARE
    .auth-subtitle Cut off time spent for manual data entry and patient charts update. Your patient story can be captured and added instantly with your voice.
    .auth-social-media
      a(href="https://facebook.com", target="_blank")
        i.auth-icon.fa.fa-facebook
      a(href="https://linkedin.com", target="_blank")
        i.auth-icon.fa.fa-linkedin
      a(href="https://google.com", target="_blank")
        i.auth-icon.fa.fa-google-plus
    .auth-line
      span(@click="openDialogDemo()") REQUEST DEMO
  .auth-form
    .auth-form-title Log in
    el-form
      el-form-item(label="Email")
        el-input(v-model="form.email", :class="{'input-error': validation.email}", type="email", :disabled="loading")
      el-form-item(label="Password")
        el-input(v-model="form.password", type="password", :disabled="loading")
      el-form-item
        el-checkbox(v-model="form.longToken", label="Remember me?", :disabled="loading")
        el-button.auth-clear(@click="clearForm()", :disabled="loading", round, size="mini") Clear
      el-form-item.auth-btns(style="text-align: center")
        el-button(@click="submit", :loading="loading", :disabled="form.email.length === 0 || form.password.length === 0", round) Sign in
        el-button(@click="toSignUp()", type="primary", round) Sign up
  el-dialog(v-if="dialogDemo", :visible.sync="dialogDemo", title="Demo form" width="300px" :append-to-body="true")
    demo
</template>

<script>
import http from '@/services/httpAuth'
import ValidationMixin from '@/mixins/ValidationMixin'
import msgHandler from '@/services/msgHandler'
import demo from '@/pages/Demo'

export default {
  name: 'Authorization',
  components: {
    demo
  },
  mixins: [
    ValidationMixin
  ],
  data () {
    return {
      dialogDemo: false,
      form: {
        email: '',
        password: '',
        longToken: false
      },
      validation: {
        email: false,
      },
      loading: false,
      api: 'auth'
    }
  },
  watch: {
    'form.email' (val) {
      this.validation.email = !this.validEmail(val)
    },
  },
  methods: {
    toSignUp() {
      this.$router.push('/sign-up')
    },
    submit() {
      try {
        this.validateForm()
        this.signIn()
      } catch(error) {
        msgHandler.showError(error)
      }
    },
    validateForm() {
      if (this.form.email.length === 0) {
        throw new Error('E-mail must be filled')
      }
      if (this.form.email.length >= this.maxLength) {
        throw new Error(`E-mail size must be less than ${this.maxLength} symbols`)
      }
      if (this.validation.email) {
        throw new Error('Input valid email')
      }
      if (this.form.password.length === 0) {
        throw new Error('Password must be filled')
      }
    },
    signIn() {
      this.loading = true
      http.login(this.api, this.form).then(() => {
      }).catch(() => {
        this.loading = false
      })
    },
    forgotPassword() {
      this.$router.push('/forgot-password')
    },
    clearForm() {
      this.form.email = ''
      this.form.password = ''
      this.form.longToken = false
    },
    openDialogDemo() {
      this.dialogDemo = true
    }
  }
}

</script>
