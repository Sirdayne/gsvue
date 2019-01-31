<template lang="pug">
.search-form
  .search-container
    .search-input
      el-input(ref="search" placeholder="Search..." v-model="search")
        el-button(slot="append" icon="el-icon-search" style="cursor: default")
    .search-links
      .search-col
        h4 DASHBOARD
        .search-link(v-for="(link, index) in filterDashboard", :key="index", @click="changeRoute(link.url)") {{ link.name }}
      .search-col
        h4 PROGRESS NOTES
        .search-link(v-for="(link, index) in filterProgressNotes", :key="index", @click="changeRoute(link.url)") {{ link.name }}
      .search-col
        h4 HEATLH HISTORY
        .search-link(v-for="(link, index) in filterHealthHistory", :key="index", @click="changeRoute(link.url)") {{ link.name }}
      .search-col
        h4 OTHERS
        .search-link(v-for="(link, index) in filterOther", :key="index", @click="changeRoute(link.url)") {{ link.name }}
    .search-social
      el-button
        i.zmdi.zmdi-facebook-box
      el-button
        i.zmdi.zmdi-linkedin-box
      el-button
        i.zmdi.zmdi-instagram
      el-button
        i.zmdi.zmdi-twitter-box
    .search-bot-title(style="margin-top: 25px;") Spell Me
    .search-bot-title Cloud-based dental speech recognition software

  el-button.search-close(icon="el-icon-close" type="primary" circle @click="closeSearchModal()")
</template>

<script>
export default {
  data () {
    return {
      linksDashboard: [
        {
          name: 'Statistics',
          url: '/dashboard'
        },
        {
          name: 'Patients',
          url: '/dashboard/patients'
        },
        {
          name: 'Doctors',
          url: '/dashboard/doctors'
        }
      ],
      linksProgressNotes: [
        {
          name: "List",
          url: "/progress-notes/list"
        },
        {
          name: "Create",
          url: "/progress-notes/create"
        }
      ],
      linksOther: [
        {
          name: "Appointments",
          url: "/appointments"
        },
        {
          name: "Profile",
          url: "/profile"
        },
        {
          name: "Contact",
          url: "/contact"
        },
      ],
      linksHealthHistory: [
        {
          name: "Questionnaires list",
          url: "/health-history/questionnaires/list"
        },
        {
          name: "Fill in questionnaire",
          url: "/health-history/questionnaires/create"
        },
        {
          name: "Questions list",
          url: "/health-history/questions/list"
        },
        {
          name: "Create question",
          url: "/health-history/questions/create"
        },
        {
          name: "Categories list",
          url: "/health-history/categories/list"
        },
        {
          name: "Create category",
          url: "/health-history/categories/create"
        }
      ],
      search: ''
    }
  },
  computed: {
    filterDashboard() {
      const array = this.linksDashboard.filter(link => link.name.toLowerCase().includes(this.search.toLowerCase()))
      return array
    },
    filterProgressNotes() {
      const array = this.linksProgressNotes.filter(link => link.name.toLowerCase().includes(this.search.toLowerCase()))
      return array
    },
    filterHealthHistory() {
      const array = this.linksHealthHistory.filter(link => link.name.toLowerCase().includes(this.search.toLowerCase()))
      return array
    },
    filterOther() {
      const array = this.linksOther.filter(link => link.name.toLowerCase().includes(this.search.toLowerCase()))
      return array
    },
  },
  mounted() {
    this.$refs.search.$el.children[0].focus()
  },
  methods: {
    changeRoute(url) {
      this.$router.push(url)
      this.closeSearchModal()
    },
    closeSearchModal() {
      this.$emit('closeSearchModal')
    }
  }
}
</script>
