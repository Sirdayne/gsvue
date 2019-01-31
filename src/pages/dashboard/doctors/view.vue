<template lang="pug">
.simple-container
  el-button(@click="routerReturn()", type="primary", round) All doctors
  .simple-container(v-loading="loading", element-loading-text="Loading...", style="margin: 35px 0 50px")
    .view-data(v-if="viewData")
      h2 {{ viewData.firstName }} {{ viewData.lastName }}
      .col
        .row E-mail:
          .cell {{viewData.email}}
        .row Provider ID:
          .cell {{viewData.providerId}}
        .row Provider middle initial:
          .cell {{viewData.mi}}
        .row Provider suffix (MD, DDS, DMD, etc):
          .cell {{viewData.suffix}}
        .row Provider TIN number:
          .cell {{viewData.tin}}
        .row Provider NPI number:
          .cell {{viewData.npi}}
        .row Provider Social Security Number:
          .cell {{viewData.ssn}}
      .col
        .row Provider Medicaid ID:
          .cell {{viewData.medicalId}}
        .row Provider Drug ID:
          .cell {{viewData.drugId}}
        .row Provider Specialty ID:
          .cell {{viewData.specialty_id}}
        .row Provider Blue Cross ID:
          .cell {{viewData.blueCrossId}}
        .row Provider #:
          .cell {{viewData.provNum}}
        .row Is secondary provider:
          .cell {{viewData.formatIsSecondaryProvider}}
        .row Other ID:
          .cell {{viewData.otherId}}
      view-contacts(:data="viewData.contacts")
      view-address(:data="viewData.address")
    .view-data(v-else, style="min-height: 150px")
      .row No data
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import gm from '@/services/GlobalMethods'
import viewAddress from '@/components/userview/address'
import viewContacts from '@/components/userview/contacts'

export default {
  components: {
    viewAddress,
    viewContacts
  },
  data () {
    return {
      viewData: null,
      endpoint: 'doctors/',
      endpointId: null,
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    routerReturn() {
      this.$router.push('/dashboard/doctors')
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
      this.viewData.formatIsSecondaryProvider = gm.getFromBool(this.viewData.isSecondaryProvider)
      this.viewData.contacts = this.viewData.contacts ? this.viewData.contacts : {}
      this.viewData.address = this.viewData.address ? this.viewData.address : {}
    },
  }
}

</script>
