<template lang="pug">
#main-page.float-container
  p SpellMe is your personal voice assistant to simplify your work with Dentrix
</template>

<script>

export default {
  name: 'MainPage',
  computed: {
    getLogged() {
      return this.$store.getters.getLogged
    },
  },
  created() {
    if (this.getLogged) {
      this.$router.push('/dashboard')
    } else {
      this.$router.push('/sign-in')
    }
  }
}
</script>
