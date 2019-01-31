<template lang="pug">
.simple-container
  el-dialog.profile-dialog(:visible.sync="dialogEdit", title="Edit", :append-to-body="true")
    edit
  .top-title Profile
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item Cabinet
  .float-container
    //.simple-container
      .main-subtitle(style="margin-top: 0;") Info
      .cloud-container(style="padding-top: 0px;")
        .inner-title General:
        .row.cut
          .label Clinic Name
          .value Some Text Here
        .row.cut
          .label First name
          .value {{ getUserInfo.firstName }}
        .row.cut
          .label Last name
          .value {{ getUserInfo.lastName }}

        .inner-title Clinic:
        .row.cut
          .label City
          .value Some Text Here
        .row.cut
          .label State
          .value Some Text Here
        .row.cut
          .label Zip code
          .value Some Text Here
        .row.cut
          .label Address Line 1
          .value Some Text Here
        .row.cut
          .label Address Line 2
          .value Some Text Here

        .inner-title Contacts:
        .row.cut
          .label Work phone
          .value Some Text Here
        .row.cut
          .label Work phone extension
          .value Some Text Here
        .row.cut
          .label Mobile phone
          .value Some Text Here
        .row.cut
          .label Home phone
          .value Some Text Here
        .row.cut
          .label Fax
          .value Some Text Here
        .row.cut
          .label Email
          .value Some Text Here
        .row
          el-button.blue-button(@click="changeForm()", size="small", round, :loading="loading") Edit

    .simple-container
      .main-subtitle(style="margin-top: 0;") Password
      .cloud-container
        .row.no-border.cut
          .label Current password:
          .value
            el-input(v-model="formPassword.oldPassword", placeholder="Current password", round, :disabled="loading")
        .row.no-border.cut
          .label New password:
          .value
            el-input(v-model="formPassword.newPassword", placeholder="New password", round, :disabled="loading")
        .row
          el-button.blue-button(@click="changePassword()", size="small", round, :loading="loading") Save changes

    .simple-container
      .main-subtitle Authorities
      .cloud-container
        .row(v-for="item in getUserInfo.authorities")
          .label {{getClinicById(item.tenantId)}}:
          .value {{getCustomTitle(item.authority)}} - {{item.authority}}
        .row
          el-button(style="margin-top: 30px;", size="small", type="primary", @click="logout", round) Log out
</template>

<script>

import roles from './custom-roles'
import Auth from '@/services/Auth'
import http from '@/services/httpQuery'
import msgHandler from '@/services/msgHandler'
import edit from './edit'

export default {
  components: {
    edit
  },
  data () {
    return {
      formPassword: {
        oldPassword: '',
        newPassword: '',
      },
      dialogEdit: false,
      loading: false
    }
  },
  computed: {
    getUserInfo() {
      return this.$store.getters.getUserInfo
    },
  },
  methods: {
    getClinicById(id) {
      const found = this.$store.getters.getClinics.find(c => c.id === id)
      const out = found ? found.name : 'noname'
      return out
    },
    logout() {
      Auth.logout()
    },
    getCustomTitle(role) {
      let custom = roles[role] ? roles[role] : 'Patient'
      return custom
    },
    changePassword() {
      this.loading = true
      const endpoint = 'users/password/reset/'
      http.post(endpoint, this.formPassword).then(data => {
        Auth.changeToken(data.token)
        msgHandler.showMessage('Password successfully changed')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    changeForm() {
      this.dialogEdit = true
    }
  }
}

</script>
