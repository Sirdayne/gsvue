<template lang="pug">
.simple-container
  el-button(@click="routerReturn()", type="primary", round) to Clinics
  .simple-container(v-loading="loading", element-loading-text="Loading...", style="margin: 35px 0 50px")
    .view-data(v-if="viewData")
      h2 Clinic: {{ viewData.name }}
      .col
        .row Subscription ID:
          .cell {{ viewData.id }}
        .row Active till:
          .cell {{ viewData.subscription.formatActiveTill }}
        .row Type:
          .cell {{ viewData.subscription.type }}
        .row Valid:
          .cell {{ viewData.subscription.valid }}
        .row Version:
          .cell {{ viewData.subscription.version }}
        .row Address line 1:
          .cell {{ viewData.address.addressLine1 }}
        .row Address line 2:
          .cell {{ viewData.address.addressLine2 }}
        .row State:
          .cell {{ viewData.address.state }}
        .row City:
          .cell {{ viewData.address.city }}
        .row Zip code:
          .cell {{ viewData.address.zipCode }}
      .col
        .row Payment ID:
          .cell {{ viewData.subscription.payment.id }}
        .row Payment Balance transaction:
          .cell {{ viewData.subscription.payment.balanceTransaction }}
        .row Payment Charge ID:
          .cell {{ viewData.subscription.payment.chargeId }}
        .row Payment Clinic name:
          .cell {{ viewData.subscription.payment.clinicName }}
        .row Payment Payment date:
          .cell {{ viewData.subscription.payment.paymentDate }}
        .row Payment Status:
          .cell {{ viewData.subscription.payment.status }}
        .row Payment Stripe email:
          .cell {{ viewData.subscription.payment.stripeEmail }}
        .row Payment Stripe token:
          .cell {{ viewData.subscription.payment.stripeToken }}
        .row Payment Version:
          .cell {{ viewData.subscription.payment.version }}
    .view-data(v-else, style="min-height: 150px")
      .row No data
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpToken'
import moment from 'moment'

export default {
  data () {
    return {
      viewData: null,
      endpoint: 'clinics/',
      loading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    routerReturn() {
      this.$router.push('/super-dashboard/clinics/')
    },
    fetchData() {
      this.loading = true
      http.get(this.endpoint + this.$route.params.id).then(data => {
        this.viewData = data ? data : null
        this.setData()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    setData() {
      this.viewData.subscription.formatActiveTill = moment(this.viewData.subscription.activeTill, 'YYYY-MM-DD').format('L')
      this.viewData.subscription.payment = this.viewData.subscription.payment ? this.viewData.subscription.payment : {}
    }
  }
}

</script>
