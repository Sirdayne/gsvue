<template lang="pug">
.main-navbar(:class="{ 'active': getNavbar }")
  .simple-container.profile-link
    .float-container
      .avatar-container(@click="toProfile()", style="cursor: pointer;")
        .avatar
          img(v-if="false", src="https://thememakker.com/templates/alpino/main/assets/images/profile_av.jpg")
          .first-letters {{ getInitals }}
      .row-center
        .row.bold(@click="toProfile()", style="cursor: pointer;") {{ getUserInfo.firstName }} {{ getUserInfo.lastName}}
        .row(@click="toProfile()", style="cursor: pointer; margin: 10px 0;") {{ getUserInfo.username }}
        .row.profile-social-icons
          i.zmdi.zmdi-facebook-box
          i.zmdi.zmdi-linkedin-box
          i.zmdi.zmdi-instagram
          i.zmdi.zmdi-twitter-box
  .x-container(v-if="!isSystemAdminRole")
    .row(v-loading="getClinics.length === 0")
      .row-title Selected clinic:
      .row
        el-select(v-model="selectedTenant", placeholder="Clinic", size="small")
          el-option(v-for="item in getClinics", :label="item.name", :value="item.id", :key="item.id")
  .simple-container(v-if="navigation.length > 0")
    el-menu.sidebar(
      :default-active="$route.path",
      :unique-opened="true",
      router
    )
      template(v-for="(link, firstIndex) in navigation")
        el-submenu(v-if="link.urls", :index="`${link.url}`")
          template(slot="title") {{link.title}}
          router-link(v-for="(url, secondIndex) in link.urls", :key="secondIndex", :to="`${url.value}`")
            el-menu-item(:index="`${url.value}`") {{url.name}}
        el-menu-item.el-menu-item-media(v-else, :index="`${link.url}`") {{ link.title }}
</template>

<script>
import {EventBus} from '@/services/EventBus'
import gm from '@/services/GlobalMethods'
import navigation from './navigation.json'
import roles from '@/router/roles'

export default {
  name: 'Userinfo',
  data () {
    return {
      navigation: [],
      selectedTenant: null,
      selectedMenu: ''
    }
  },
  computed: {
    getLogged() {
      return this.$store.getters.getLogged
    },
    getUserInfo() {
      return this.$store.getters.getUserInfo
    },
    getInitals() {
      let userinfo = this.getUserInfo ? this.getUserInfo : {}
      let initials = userinfo && userinfo.firstName && userinfo.firstName[0] && userinfo.lastName && userinfo.lastName[0] ? `${userinfo.firstName[0].toUpperCase()}${userinfo.lastName[0].toUpperCase()}` : ''
      return initials
    },
    getClinics() {
      return this.$store.getters.getClinics
    },
    getNavbar() {
      return this.$store.getters.getNavbar
    },
    isAdminRole() {
      return gm.hasRole('ROLE_ADMIN') || gm.hasRole('ROLE_SYSTEM_ADMIN')
    },
    isSystemAdminRole() {
      return gm.hasRole('ROLE_SYSTEM_ADMIN')
    },
  },
  watch: {
    'selectedTenant' (val, oldVal) {
      if (val && oldVal && val != oldVal) {
        localStorage.setItem('tenant', val)
        this.$store.dispatch('actionSetTenant', val)
        window.location.reload()
      }
    }
  },
  created() {
    this.selectedTenant = this.$store.getters.getTenant
    this.setNavigation()
  },
  methods: {
    toProfile() {
      this.$router.push('/profile')
    },
    setNavigation() {
      this.navigation = navigation
      this.navigation = this.navigation.filter(nav => {
        if (nav.role) {
          const hasRole = roles[nav.role].findIndex(role => gm.hasRole(role))
          if (hasRole !== -1)
            return nav
        } else {
          return nav
        }
      })
    }
  }
}
</script>
