<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  el-form-item(label="Date")
    el-date-picker(v-model="form.procedureDate", type="datetime", placeholder="Pick a date" format="MM/dd/yyyy HH:mm:ss A")
  el-form-item(label="Doctor")
    el-select(v-model="form.doctorId", placeholder="Doctor", style="width: 220px;", clearable, filterable)
      el-option(v-for="item in doctors", :label="item.formatName", :value="item.id", :key="item.id")
  el-form-item(label="Patient")
    el-select(v-model="form.patientId", placeholder="Patient", style="width: 220px;", clearable, filterable)
      el-option(v-for="item in patients", :label="item.formatName", :value="item.id", :key="item.id")
  el-form-item(label="Note")
    el-input.input-width(v-model="form.noteView.note", type="textarea", :rows="4")
  el-form-item
    el-button(@click="saveNote()", type="primary", round) Save
</template>

<script>
import { EventBus} from '@/services/EventBus'
import moment from 'moment'
import http from '@/services/httpQuery'

export default {
  props: ['form', 'doctors', 'patients'],
  data () {
    return {
      progressNotes: null,
      loading: false,
      endpoint: 'progressNotes/'
    }
  },
  methods: {
    getLabelPosition() {
      return window.innerWidth > 1000 ? 'right' : 'top'
    },
    saveNote() {
      this.loading = true
      this.form.procedureDate = `${moment(this.form.procedureDate).format('MM/DD/YYYY')} ${moment(this.form.procedureDate).format('LTS')}`
      http.put(this.endpoint + this.form.id, this.form).then(() => {
        this.$emit('progressNotesChanged')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
