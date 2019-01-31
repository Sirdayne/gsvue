<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  h2(style="margin-bottom: 30px;") Create new progress note
  el-form-item(label="Date")
    el-date-picker(v-model="form.procedureDate", type="datetime", placeholder="Pick a date", format="MM/dd/yyyy HH:mm:ss A")
  el-form-item(v-if="isAdminRole" label="Doctor")
    el-select(v-model="form.doctorId", placeholder="Doctor", style="width: 220px", clearable, filterable)
      el-option(v-for="item in doctors", :label="item.formatName", :value="item.id", :key="item.id")
  el-form-item(label="Patient")
    el-select(v-model="form.patientId", placeholder="Patient", style="width: 220px", clearable, filterable)
      el-option(v-for="item in patients", :label="item.formatName", :value="item.id", :key="item.id")
  el-form-item(label="Note")
    el-input.input-width(v-model="form.noteView.note", type="textarea", :rows="4")
  el-form-item
    el-button(@click="createNote()", type="primary", round) Save
</template>

<script>
import { EventBus} from '@/services/EventBus'
import moment from 'moment'
import http from '@/services/httpQuery'
import msgHandler from '@/services/msgHandler'
import gm from '@/services/GlobalMethods'

export default {
  data () {
    return {
      form: {
        noteView: {
          note: ''
        }
      },
      doctors: [],
      patients: [],
      loading: false,
      endpoint: 'progressNotes/'
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    isAdminRole() {
      return gm.hasRole('ROLE_ADMIN') || gm.hasRole('ROLE_SYSTEM_ADMIN')
    },
    isDoctorRole() {
      return gm.hasRole('ROLE_DOCTOR')
    },
    getUserInfo() {
      return this.$store.getters.getUserInfo
    },
  },
  methods: {
    fetchData() {
      this.loading = true
      Promise.all([
        gm.fetchEntity('doctors'),
        gm.fetchEntity('patients'),
      ]).then(([acct, perms]) => {
        this.afterFetch()
      }, () => {
        this.loading = false
      })
    },
    afterFetch() {
      this.doctors = gm.fromVuex('doctors')
      this.patients = gm.fromVuex('patients')
      this.setData()
      this.loading = false
    },
    setData() {
      this.patients.forEach(patient => {
        patient.formatName = `${patient.firstName} ${patient.lastName}`
      })
      this.doctors.forEach(patient => {
        patient.formatName = `${patient.firstName} ${patient.lastName}`
      })
    },
    createNote() {
      this.loading = true
      this.prepareForm()
      http.post(this.endpoint, this.form).then(() => {
        msgHandler.showSuccess('Progress note created')
        this.nullForm()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    prepareForm() {
      this.form.procedureDate = `${moment(this.form.procedureDate).format('MM/DD/YYYY')} ${moment(this.form.procedureDate).format('LTS')}`
      const foundPatient = this.form.patientId ? this.patients.find(patient => patient.id === this.form.patientId) : {}
      this.form.patientVersion = foundPatient.version
      if (this.isDoctorRole) {
        this.form.doctorId = this.getUserInfo.id
      }
    },
    nullForm() {
      this.form = {
        noteView: {note: ''}
      }
    },
    getLabelPosition() {
      return window.innerWidth > 1000 ? 'right' : 'top'
    },
  }
}
</script>
