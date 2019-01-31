<template lang="pug">
#registration.float-container
  .auth-back
  .form-registration
    .reg-form-title Sign up
    el-form
      .item Register new clinic:
      el-form-item(label="Clinic name")
        el-input(v-model="form.clinicName", :class="{'input-error': validation.clinicName}", :disabled="loading")
      el-form-item(label="Email", title="Example: johndoe@gmail.com")
        el-input(v-model="form.email", type="email", :class="{'input-error': validation.email}", :disabled="loading")
      el-form-item(label="First name")
        el-input(v-model="form.firstName", :class="{'input-error': validation.firstName}", :disabled="loading")
      el-form-item(label="Last name")
        el-input(v-model="form.lastName", :class="{'input-error': validation.lastName}", :disabled="loading")
      .item Password:
      el-form-item(label="Password")
        el-input(v-model="form.password", :class="{'input-error': validation.password}", type="password", :disabled="loading")
      el-form-item(label="Confirm password", title="Re-type your password, they must be the same")
        el-input(v-model="confirmPassword", :class="{'input-error': validation.password}", type="password", :disabled="loading")

      .item Clinic:
      el-form-item(label="City", title="Example: New York")
        el-input(v-model="form.address.city", :class="{'input-error': validation.addressCity}", :disabled="loading")
      el-form-item(label="State", title="Example: California")
        el-input(v-model="form.address.state", :class="{'input-error': validation.addressState}", :disabled="loading")
      el-form-item(label="Zip code", title="Example: 10001")
        el-input(v-model="form.address.zipCode", :class="{'input-error': validation.addressZipCode}", :disabled="loading")
      el-form-item(label="Address Line 1")
        el-input(v-model="form.address.addressLine1", :disabled="loading")
      el-form-item(label="Address Line 2")
        el-input(v-model="form.address.addressLine2", :disabled="loading")

      .item Contacts:
      el-form-item(label="Work phone")
        el-input(v-model="form.contacts.workPhone", type="phone", v-mask="'1-###-###-####'", :disabled="loading")
      el-form-item(label="Work phone extension")
        el-input(v-model="form.contacts.workPhoneExt" :disabled="loading")
      el-form-item(label="Mobile phone")
        el-input(v-model="form.contacts.mobilePhone", type="phone", v-mask="'1-###-###-####'", :disabled="loading")
      el-form-item(label="Home phone")
        el-input(v-model="form.contacts.homePhone", type="phone", v-mask="'1-###-###-####'", :disabled="loading")
      el-form-item(label="Fax")
        el-input(v-model="form.contacts.fax", :class="{'input-error': validation.contactsFax}", :disabled="loading")
      el-form-item(label="Email", title="Example: johndoe@gmail.com")
        el-input(v-model="form.contacts.email", :class="{'input-error': validation.contactsEmail}", type="email", :disabled="loading")

      .item(style="text-align: center;")
        el-button(@click="submit()", :loading="loading", round) Sign up
      .item-login
        .red-text(@click="toSignIn()") Already have account?
        el-button(@click="toSignIn()", round, type="primary", style="width: auto;", size="mini") Log in
</template>

<script>
import msgHandler from '@/services/msgHandler'
import http from '@/services/httpAuth'
import validation from './validation'

export default {
  mixins: [
    validation
  ],
  data () {
    return {
      confirmPassword: '',
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        clinicName: "",
        contacts: {
          mobilePhone: "",
          homePhone: "",
          fax: "",
          email: "",
          workPhone: "",
          workPhoneExt: ""
        },
        address: {
          addressLine1: "",
          addressLine2: "",
          zipCode: "",
          city: "",
          state: "",
        }
      },
      loading: false,
      endpoint: 'users'
    }
  },
  methods: {
    toSignIn() {
      this.$router.push('/sign-in')
    },
    signUp() {
      this.loading = true
      http.register(this.endpoint, this.form).then(() => {
      }).catch(() => {
        this.loading = false
      })
    },
    submit() {
      try {
        this.validateForm()
        this.validateClinic()
        this.validateContacts()
        this.signUp()
      } catch(error) {
        msgHandler.showError(error)
      }
    },
    validateForm() {
      if (this.form.clinicName.length === 0) {
        throw new Error('Clinic name must be filled')
      }
      if (this.form.clinicName.length >= this.maxLength) {
        throw new Error(`Clinic name size must be less than ${this.maxLength} symbols`)
      }
      if (this.validation.clinicName) {
        throw new Error('No special symbols are allowed in clinic name')
      }
      if (this.form.email.length === 0) {
        throw new Error('E-mail must be filled')
      }
      if (this.form.email.length >= this.maxLength) {
        throw new Error(`E-mail size must be less than ${this.maxLength} symbols`)
      }
      if (this.validation.email) {
        throw new Error('Input valid email')
      }
      if (this.form.firstName.length === 0) {
        throw new Error('First name must be filled')
      }
      if (this.form.firstName.length >= this.maxLength) {
        throw new Error(`First name size must be less than ${this.maxLength} symbols`)
      }
      if (this.validation.firstName) {
        throw new Error('No special symbols are allowed first name field')
      }
      if (this.form.lastName.length === 0) {
        throw new Error('Last name must be filled')
      }
      if (this.form.lastName.length >= this.maxLength) {
        throw new Error(`Last name size must be less than ${this.maxLength} symbols`)
      }
      if (this.validation.lastName) {
        throw new Error('No special symbols are allowed last name field')
      }
      if (this.form.password.length === 0) {
        throw new Error('Password must be filled')
      }
      if (this.form.password !== this.confirmPassword) {
        throw new Error('Passwords must be the same')
      }
      if (this.form.password.length >= this.maxLength) {
        throw new Error(`Password size must be less than ${this.maxLength} symbols`)
      }
    },
    validateClinic() {
      if (this.form.address.city.length >= this.maxLength) {
        throw new Error(`Address city size must be less than ${this.maxLength} symbols`)
      }
      if (this.form.address.city.length > 0 && this.validation.addressCity) {
        throw new Error('No special symbols are allowed in address city field')
      }
      if (this.form.address.state.length >= this.maxLength) {
        throw new Error(`Address state size must be less than ${this.maxLength} symbols`)
      }
      if (this.form.address.state.length > 0 && this.validation.addressState) {
        throw new Error('No special symbols are allowed in address state field')
      }
      if (this.form.address.zipCode.length >= this.maxLength) {
        throw new Error(`Address zip code size must be less than ${this.maxLength} symbols`)
      }
      if (this.form.address.zipCode.length > 0 && this.validation.addressZipCode) {
        throw new Error('No special symbols are allowed in address zip code field')
      }
    },
    validateContacts() {
      if (this.form.contacts.fax.length >= this.maxLength) {
        throw new Error(`Fax size must be less than ${this.maxLength} symbols`)
      }
      if (this.form.contacts.fax.length > 0 && this.validation.contactsFax) {
        throw new Error('Allowed only chars in fax field')
      }
      if (this.form.contacts.email.length >= this.maxLength) {
        throw new Error(`Contacts E-mail size must be less than ${this.maxLength} symbols`)
      }
      if (this.form.contacts.email.length > 0 && this.validation.contactsEmail) {
        throw new Error('Input valid email to contacts email field')
      }
    },
  }
}

</script>
