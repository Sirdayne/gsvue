<template lang="pug">
  #app(v-loading="!ready", element-loading-text="Loading...")
    .app-container(v-if="ready")
      app-header
      .app-content(:class="{ 'active': getLogged && getNavbar, 'not-logged': !getLogged }")
        router-view
    .app-container(v-else)
    .banner(v-if="showBanner", @click="showBanner = false")
      img(src="http://www.nixser.com.my/img/graph.png")
      p Here is banner for advertising
</template>

<script>
import AppHeader from '@/components/header'
import Auth from '@/services/Auth'

window.addEventListener('storage', (events) => {
  if (!Auth.isLogged())
    Auth.logout()
})

export default {
  name: 'App',
  data () {
    return {
      showBanner: true
    }
  },
  components: {
    AppHeader
  },
  computed: {
    ready() {
      return !this.getUserLoading && !this.getClinicsLoading
    },
    getLogged() {
      return this.$store.getters.getLogged
    },
    getUserLoading() {
      return this.$store.getters.getUserLoading
    },
    getClinicsLoading() {
      return this.$store.getters.getClinicsLoading
    },
    getNavbar() {
      return this.$store.getters.getNavbar
    },
  },
  created() {
    if (Auth.isLogged()) {
      this.fetchData()
    } else {
      this.loadedData()
    }
  },
  methods: {
    fetchData() {
      Auth.setUserInfo()
      Auth.setClinics()
    },
    loadedData() {
      this.$store.dispatch('actionSetUserLoading', false)
      this.$store.dispatch('actionSetClinicsLoading', false)
    }
  }
}
</script>
