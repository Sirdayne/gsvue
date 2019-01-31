<template lang="pug">
.simple-container
  el-button(@click="routerReturn()", type="primary", round) All patients
  .simple-container(v-loading="loading", element-loading-text="Loading...", style="margin: 35px 0 50px")
    xray(:loading="loading")
    .view-data(v-if="viewData")
      h2 {{ viewData.firstName }} {{ viewData.lastName }}
      .col
        .row E-mail:
          .cell {{viewData.email}}
        .row Status:
          .cell {{viewData.formatStatus}}
        .row Date of birth:
          .cell {{viewData.birthDate}}
        .row Gender:
          .cell {{viewData.formatGender}}
        .row Chart Number:
          .cell {{viewData.chartNumber}}
        .row Driver’s License number:
          .cell {{viewData.driversLicense}}
        .row First visit date:
          .cell {{viewData.firstVisitDate}}
        .row Last visit date:
          .cell {{viewData.lastVisitDate}}
        .row Last missed appointment date:
          .cell {{viewData.lastMissedAppointment}}
        .row Number of missed appointments:
          .cell {{viewData.numberOfMissedAppointments}}
        .row ssn:
          .cell {{viewData.ssn}}
      .col
        .row Title:
          .cell {{viewData.title}}
        .row Patient preferred name:
          .cell {{viewData.preferredName}}
        .row Salutation:
          .cell {{viewData.salutation}}
        .row Primary Dental Insured ID:
          .cell {{viewData.primaryDentalInsuredId}}
        .row Primary Medical Insured ID:
          .cell {{viewData.primaryMedicalInsuredId}}
        .row Primary Provider First Name:
          .cell {{viewData.primaryProviderFirstName}}
        .row Primary Provider Last Name:
          .cell {{viewData.primaryProviderLastName}}
        .row Secondary Provider First Name:
          .cell {{viewData.secondaryProviderFirstName}}
        .row Secondary Provider Last Name:
          .cell {{viewData.secondaryProviderLastName}}
        .row Secondary Dental Insured ID:
          .cell {{viewData.secondaryDentalInsuredId}}
        .row Secondary Medical Insured ID:
          .cell {{viewData.secondaryMedicalInsuredId}}
      view-contacts(:data="viewData.contacts")
      view-address(:data="viewData.address")
    .view-data(v-else, style="min-height: 150px")
      .row No data
    edit
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import viewAddress from '@/components/userview/address'
import viewContacts from '@/components/userview/contacts'
import edit from '@/pages/health-history/questionnaires/edit'
import xray from '@/components/xray'

export default {
  components: {
    viewAddress,
    viewContacts,
    edit,
    xray
  },
  data () {
    return {
      viewData: null,
      endpoint: 'patients/',
      endpointId: null,
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    routerReturn() {
      this.$router.push('/dashboard/patients')
    },
    fetchData() {
      this.loading = true
      this.endpointId = this.$route.params.id
      http.get(this.endpoint + this.endpointId).then(data => {
        this.viewData = data ? data : null
        this.setData()
        this.loading = false
      }).catch(() => {
        this.viewData = null
        this.loading = false
      })
    },
    setData() {
      this.viewData.formatStatus = this.viewData.status === 1 ? 'Patient' : this.viewData.status === 2 ? 'Non-Patient' : this.viewData.status === 3 ? 'Inactive' : 'Archived'
      this.viewData.formatGender = this.viewData.gender === 1 ? 'Male' : 'Female'
    },
  }
}

</script>
