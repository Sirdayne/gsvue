<template lang="pug">
.x-ray.cloud-container(v-loading="loading")
  div(v-if="!loading")
    p Latest X-Ray:
    .x-ray-img
      img(src="https://arkansasfamilydental.com/wp-content/uploads/2014/08/dentist-x-ray.jpg")
  .x-ray-loader(v-else)
</template>

<script>
export default {
  props: ['loading'],
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
