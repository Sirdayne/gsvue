<template lang="pug">
div
  h3 Contacts
  .col
    .row Home phone:
      .cell {{viewData.homePhone}}
    .row Mobile phone:
      .cell {{viewData.mobilePhone}}
    .row Other phone:
      .cell {{viewData.otherPhone}}
  .col
    .row Work phone:
      .cell {{viewData.workPhone}}
    .row Work phone extension:
      .cell {{viewData.workPhoneExt}}
    .row Contact e-mail:
      .cell {{viewData.email}}
    .row Fax:
      .cell {{viewData.fax}}
</template>

<script>

export default {
  props: ['data'],
  data () {
    return {
      viewData: {}
    }
  },
  created() {
    this.viewData = this.data ? this.data : {}
  }
}

</script>
