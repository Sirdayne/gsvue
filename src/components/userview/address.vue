<template lang="pug">
div
  h3 Address
  .col
    .row State:
      .cell {{viewData.state}}
    .row City:
      .cell {{viewData.city}}
  .col
    .row Address line 1:
      .cell {{viewData.addressLine1}}
    .row Address line 2:
      .cell {{viewData.addressLine2}}
    .row Zip code:
      .cell {{viewData.zipCode}}
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
