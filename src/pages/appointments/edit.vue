<template lang="pug">
el-form(label-width="130px", v-loading="loading")
  el-form-item(label="Date")
    el-date-picker(v-model="changeDate", type="date", placeholder="Pick a date")
  el-form-item(label="Operatory")
    el-select(v-model="form.operatoryId", placeholder="Operatory", clearable, filterable)
      el-option(v-for="item in operatories", :label="item.dentrixId", :value="item.dentrixId", :key="item.id")
  el-form-item(label="Reason")
    el-input(v-model="form.reason", placeholder="Reason", style="max-width: 217px;")
  el-form-item(label="Amount")
    el-input(v-model="form.amount", placeholder="Amount", style="max-width: 217px;")
  el-form-item(label="Doctor")
    el-select(v-model="form.providerId", placeholder="Doctor", clearable, filterable)
      el-option(v-for="item in doctors", :label="item.providerId", :value="item.providerId", :key="item.id")
  el-form-item(label="Patient")
    el-select(v-model="form.dentrixPatientId", placeholder="Patient", clearable, filterable)
      el-option(v-for="item in patients", :label="item.name", :value="item.id", :key="item.id")
  el-form-item(label="Time")
    el-select(v-model="editTime", placeholder="Time", clearable, filterable)
      el-option(v-for="(item, index) in getTimes", :label="item.label", :value="item.label", :key="index")
  el-form-item(label="Length in minutes")
    el-input-number(v-model="form.length", size="mini", :step="10", :min="0", placeholder="Length")
  el-form-item(label="End time")
    p {{ getEndTime(editTime, form.length) }}
  el-form-item
    el-button(@click="validateForm()", type="primary", round) Save
</template>

<script>
import { EventBus} from '@/services/EventBus'
import moment from 'moment'
import msgHandler from '@/services/msgHandler'

export default {
  props: ['form', 'selectedDate', 'getTimes', 'operatories', 'doctors', 'patients', 'constStep'],
  data () {
    return {
      changeDate: new Date(),
      editTime: null,
      loading: false
    }
  },
  created() {
    this.changeDate = this.selectedDate
    this.form.startHour = this.form.startHour ? this.form.startHour : 0
    this.form.startMinute = this.form.startHour ? this.form.startMinute : 0
    this.editTime = moment(this.selectedDate).hour(this.form.startHour).minute(this.form.startMinute).format('LT')
  },
  methods: {
    getEndTime(editTime, length) {
      return moment(editTime, 'HH:mm A').add(length, 'minutes').format('LT')
    },
    validateForm() {
      if (this.form.length % this.constStep !== 0) {
        msgHandler.showError(`Step must be multiple of ${this.constStep}`)
      } else {
        this.saveAppointment()
      }
    },
    saveAppointment() {
      const hour = moment(this.editTime, 'HH:mm A').hour()
      const minute = moment(this.editTime, 'HH:mm A').minute()
      this.form.startHour = hour
      this.form.startMinute = minute
      this.form.date = `${moment(this.changeDate).format('MM/DD/YYYY')} ${moment(this.changeDate).format('LTS')}`
      this.form.broken = false
      EventBus.$emit('AppointmentSave')
    }
  }
}
</script>
