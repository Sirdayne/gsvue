export default {
  data() {
    return {
      maxLength: 40,
    }
  },
  methods: {
    validEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email) && this.validLength(email)
    },
    validName(name) {
      let re = /^[a-zA-Z '-]*$/;
      return re.test(name) && this.validLength(name)
    },
    validCharsNumbers(name) {
      let re = /^[a-zA-Z0-9 ]*$/;
      return re.test(name) && this.validLength(name)
    },
    validChars(name) {
      let re = /^[a-zA-Z ]*$/;
      return re.test(name) && this.validLength(name)
    },
    validNumbers(name) {
      let re = /^[0-9]*$/;
      return re.test(name) && this.validLength(name)
    },
    validLength(str) {
      return str && str.length < this.maxLength ? true : false
    },
  }
}
