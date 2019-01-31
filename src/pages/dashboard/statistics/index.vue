<template>
<div class="dashboard-statistics">
  <div class="dashboard-link" v-loading="loadingLink">
    <a :href="linkDownloadDesktop" target="_blank" class="link">&middot; download Spell Me</a>
  </div>
  <div class="dashboard-boxes">
    <div class="dashboard-box" v-loading="loading">
      <i class="zmdi zmdi-hospital zmdi-hc-3x clinics"></i>
      <h6>Clinics</h6>
      <span>{{ countClinics.count }}</span>
    </div>
    <div class="dashboard-box cursor-pointer" v-loading="loading" @click="toDoctors">
      <i class="zmdi zmdi-plaster zmdi-hc-3x doctors"></i>
      <h6>Doctors</h6>
      <span>{{ countDoctors.count }}</span>
    </div>
    <div class="dashboard-box cursor-pointer" v-loading="loading" @click="toPatients">
      <i class="zmdi zmdi-account-box zmdi-hc-3x patients"></i>
      <h6>Patients</h6>
      <span>{{ countPatients.count }}</span>
    </div>
    <div class="dashboard-box cursor-pointer" v-loading="loading" @click="toAppointments">
      <i class="zmdi zmdi-calendar zmdi-hc-3x appointments"></i>
      <h6>Appointments</h6>
      <span>{{ countAppointments.count }}</span>
    </div>
  </div>
  <appointments v-loading="loading"></appointments>
  <bar-chart v-loading="loading"></bar-chart>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import axios from 'axios'
import appointments from './appointments'
import barChart from './barChart'


export default {
  components: { appointments, barChart },
  data () {
    return {
      countClinics: 0,
      countDoctors: 0,
      countPatients: 0,
      countAppointments: 0,
      linkDownloadDesktop: '',
      loading: true,
      loadingLink: true
    }
  },
  created() {
    this.fetchData()
    this.fetchLink()
  },
  methods: {
    fetchLink() {
      this.loadingLink = true
      const endpoint = `https://desktopapp.blob.core.windows.net/desktopappsversions?restype=container&comp=list`
      axios.get(endpoint).then((response) => {
        const xml = response.data
        this.parseXML(xml)
        this.loadingLink = false
      }).catch((err) => {
        this.loadingLink = false
      })
    },
    parseXML(xml) {
      let parser = new DOMParser()
      let doc = parser.parseFromString(xml, "text/xml")
      let url = doc.getElementsByTagName("Url")
      let firstUrl = url[0]
      this.linkDownloadDesktop = firstUrl && firstUrl.innerHTML ? firstUrl.innerHTML : ''
    },
    toDoctors() {
      this.$router.push('/dashboard/doctors')
    },
    toPatients() {
      this.$router.push('/dashboard/patients')
    },
    toAppointments() {
      this.$router.push('/appointments')
    },
    fetchData() {
      this.loading = true
      Promise.all([
        http.get('clinics/count'),
        http.get('doctors/count'),
        http.get('patients/count'),
        http.get('appointments/count')
      ]).then(data => {
        [ this.countClinics, this.countDoctors, this.countPatients, this.countAppointments ] = data
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}

</script>
