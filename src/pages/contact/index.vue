<template lang="pug">
.simple-container
  .top-title Contact
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item Contact
  .float-container
    .alpino-table
      .alpino-card(v-for="(user, index) in users" :key="index")
        .alpino-card-img
          img(:src="user.img")
        .alpino-card-title {{ user.name }}
        social
        p {{ user.address }}
</template>

<script>
import social from '@/components/social'

export default {
  components: { social },
  data () {
    return {
      users: [
        {
          name: "JOHN SMITH",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar1.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "HOSSEIN SHAMS",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar2.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "MARYAM AMIRI",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar3.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "TIM HANK",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar4.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "JOHN SMITH",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar5.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "FRANK CAMLY",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar6.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "GARY CAMARA",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar1.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
        {
          name: "FIDEL TONN",
          img: "https://thememakker.com/templates/alpino/main/assets/images/sm/avatar2.jpg",
          address: "795 Folsom Ave, Suite 600 San Francisco, CADGE 94107"
        },
      ]
    }
  },
  methods: {
  }
}
</script>
