<template lang="pug">
.simple-container
  el-button(@click="routerReturn()", type="primary", round) All progress notes
  .simple-container(v-loading="loadingPatient || loadingDoctor", element-loading-text="Loading...", style="margin: 35px 0 50px")
    .view-data(v-if="viewData && patient && doctor")
      h2 Patient: {{ patient.firstName }} {{ patient.lastName }}
      .col(style="width: 100%")
        .row Date:
          .cell {{ viewData.procedureDate }}
        .row Doctor:
          .cell {{ doctor.firstName }} {{ doctor.lastName }}
        .row Note:
          .note {{ viewData.noteView.note }}
    .view-data(v-else, style="min-height: 150px")
      .row No data
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'

export default {
  data () {
    return {
      viewData: null,
      patient: null,
      doctor: null,
      endpoint: 'progressNotes/',
      endpointId: null,
      loadingDoctor: true,
      loadingPatient: true,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    routerReturn() {
      this.$router.push('/progress-notes/list')
    },
    fetchData() {
      this.loadingDoctor = true
      this.loadingPatient = true
      this.endpointId = this.$route.params.id
      http.get(this.endpoint + this.endpointId).then(data => {
        this.viewData = data ? data : null
        this.getPatient()
        this.getDoctor()
      }).catch(() => {
        this.viewData = null
        this.loadingDoctor = false
        this.loadingPatient = false
      })
    },
    getPatient() {
      this.loadingPatient = true
      http.get(`patients/${this.viewData.patientId}`).then(data => {
        this.patient = data ? data : null
        this.loadingPatient = false
      }).catch(() => {
        this.patient = null
        this.loadingPatient = false
      })
    },
    getDoctor() {
      this.loadingDoctor = true
      http.get(`doctors/${this.viewData.doctorId}`).then(data => {
        this.doctor = data ? data : null
        this.loadingDoctor = false
      }).catch(() => {
        this.doctor = null
        this.loadingDoctor = false
      })
    },
  }
}

</script>
