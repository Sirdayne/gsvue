import ValidationMixin from '@/mixins/ValidationMixin'

export default {
  mixins: [
    ValidationMixin
  ],
  data() {
    return {
      validation: {
        email: false,
        firstName: false,
        lastName: false,
        password: false,
        contactsFax: false,
        contactsEmail: false,
        clinicName: false,
        addressCity: false,
        addressState: false,
        addressZipCode: false
      }
    }
  },
  watch: {
    'form.email' (val) {
      this.validation.email = !this.validEmail(val)
    },
    'form.firstName' (val) {
      this.validation.firstName = !this.validName(val)
    },
    'form.lastName' (val) {
      this.validation.lastName = !this.validName(val)
    },
    'confirmPassword' (val) {
      this.validation.password = !this.inValidPassword(val)
    },
    'form.contacts.fax' (val) {
      this.validation.contactsFax = val.length > 0 ? !this.validNumbers(val) : false
    },
    'form.contacts.email' (val) {
      this.validation.contactsEmail = val.length > 0 ? !this.validEmail(val) : false
    },
    'form.clinicName' (val) {
      this.validation.clinicName = !this.validCharsNumbers(val)
    },
    'form.address.city' (val) {
      this.validation.addressCity = val.length > 0 ? !this.validChars(val) : false
    },
    'form.address.state' (val) {
      this.validation.addressState = val.length > 0 ? !this.validChars(val) : false
    },
    'form.address.zipCode' (val) {
      this.validation.addressZipCode = val.length > 0 ? !this.validCharsNumbers(val) : false
    }
  },
  methods: {
    inValidPassword(pass) {
      let out = this.form.password === pass
      return out && this.validLength(pass)
    },
  }
}
