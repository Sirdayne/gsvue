<template lang="pug">
header#header
  .header-sidebar(v-if="getLogged")
    router-link(to="/dashboard")
      .nav.nav-logo
        img(src="@/assets/logo-without-text.svg")
    .nav(@click="modalSearch = true")
      i.zmdi.zmdi-search
    .nav.nav-toggle(title="Toggle navigation bar", @click="openNavbar()")
      i.zmdi.zmdi-swap
    router-link(v-if="isSystemAdminRole", to="/super-dashboard")
      .nav(title="Super-dashboard")
        i.zmdi.zmdi-apps
    router-link(v-if="!isSystemAdminRole", to="/dashboard")
      .nav(title="Dashboard")
        i.zmdi.zmdi-apps
    router-link(v-if="!isSystemAdminRole", to="/progress-notes")
      .nav(title="Progress notes")
        i.zmdi.zmdi-collection-bookmark
    router-link(v-if="!isSystemAdminRole", to="/appointments")
      .nav(title="Appointments")
        i.zmdi.zmdi-calendar
    router-link(v-if="!isSystemAdminRole", to="/health-history")
      .nav(title="Health history")
        i.zmdi.zmdi-assignment
    router-link(to="/contact")
      .nav(title="Contact")
        i.zmdi.zmdi-account-box-phone
    .nav.nav-power(title="Logout", @click="logout()")
      i.zmdi.zmdi-power
    router-link(to="/profile")
      .nav.nav-setting(title="Profile")
        i.zmdi.zmdi-settings.zmdi-hc-spin
  navbar(v-if="getLogged")
  search(v-if="modalSearch" @closeSearchModal="closeSearchModal()")
</template>

<script>
import navbar from '@/components/navbar'
import {EventBus} from '@/services/EventBus'
import gm from '@/services/GlobalMethods'
import Auth from '@/services/Auth'
import search from '@/components/search'

export default {
  name: 'AppHeader',
  data() {
    return {
      modalSearch: false,
    }
  },
  components: {
    navbar,
    search
  },
  created() {

  },
  computed: {
    getLogged() {
      return this.$store.getters.getLogged
    },
    getNavbar() {
      return this.$store.getters.getNavbar
    },
    isSystemAdminRole() {
      return gm.hasRole('ROLE_SYSTEM_ADMIN')
    },
  },
  methods: {
    openNavbar() {
      const payload = !this.getNavbar
      this.$store.dispatch('actionSetNavbar', payload)
    },
    logout() {
      Auth.logout()
    },
    closeSearchModal() {
      this.modalSearch = false
    }
  }
}

</script>
