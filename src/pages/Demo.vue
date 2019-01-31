<template lang="pug">
el-form.demo-send-form(label-position="top")
  el-form-item(label="Name")
    el-input(v-model="form.name", :disabled="loading")
  el-form-item(label="Phone")
    el-input(v-model="form.phone", type="phone", v-mask="'1-###-###-####'", :disabled="loading")
  el-form-item(label="E-mail")
    el-input(v-model="form.email", :disabled="loading")
  el-form-item
    el-button(@click="sendMail()", type="primary", round, :loading="loading") Request demo
</template>

<script>
import axios from 'axios'
import msgHandler from '@/services/msgHandler'

export default {
  data () {
    return {
      form: {
        name: '',
        phone: '',
        email: ''
      },
      loading: false,
    }
  },
  methods: {
    sendMail() {
      this.loading = true
      const URL = BASE_URL + 'emails'
      axios.post(URL, this.form).then(() => {
        this.nullForm()
        msgHandler.showMessage('Successfully requested')
        this.loading = false
      }).catch(error => {
        msgHandler.showError(error)
        this.loading = false
      })
    },
    nullForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
    }
  }
}
</script>
