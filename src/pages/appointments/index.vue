<template lang="pug">
.simple-container
  .top-title Appointments
    el-breadcrumb(separator="/")
      el-breadcrumb-item.color-red(:to="`/`") Home
      el-breadcrumb-item Appointments
      el-breadcrumb-item(:to="`/Appointments`") Schedule
  .float-container(v-if="!globalLoading")
    el-dialog(:visible.sync="dialogColor", title="Edit color", width="240px", :append-to-body="true")
      colors(:colors="colors")
    el-dialog(:visible.sync="dialogDelete", title="Delete appointment", width="320px", :append-to-body="true")
      el-button(@click="deleteAppointment()", type="primary", round) Confirm
      el-button(@click="closeDialogDelete()", round) Cancel
    el-dialog(v-if="dialogEdit", :visible.sync="dialogEdit", title="Edit appointment", width="500px", :append-to-body="true")
      edit(:form="form",
          :selectedDate="selectedDate",
          :getTimes="getTimes",
          :operatories="operatories",
          :doctors="doctors",
          :patients="patients",
          :constStep="constStep")
    el-dialog(v-if="dialogCreate", :visible.sync="dialogCreate", title="Create appointment", width="500px", :append-to-body="true")
      create(:form="form",
          :selectedDate="selectedDate",
          :getTimes="getTimes",
          :appointments="appointments",
          :operatories="operatories",
          :doctors="doctors",
          :patients="patients",
          :constStep="constStep")
    #panel.appointments-top-panel.fx-sticky
      .legends(style="margin-bottom: 20px;")
        el-button(v-if="false", v-loading="loading", @click="createAppointment()", round) New appointment
        el-date-picker.appointments-main-date(v-loading="loading", v-model="selectedDate", type="date", format="MM/dd/yyyy", placeholder="Pick a date" :clearable="false")
        el-button(@click="dialogColor = true", round) change open/close colors
      .legends
        p Doctors:
        .legend.shadow(v-for="doctor in doctors", :style="doctor.style") {{ doctor.name }}({{ doctor.providerId }})
    .appointments-book.shadow
      .fx-cols(:style="getColsStyle()")
        .fx-col.fx-col-time.col-time-mob
          .fx-cl.fx-grey time
          .fx-cl(v-for="time in getTimes")
            .fx-cell#scroll(v-if="time.scroll", style="font-size: 11px;") {{time.label}}
            .fx-cell(v-else, style="font-size: 11px;") {{time.label}}
        .fx-col.fx-col-appointment(v-for="operatory in operatories")
          .fx-cl.fx-grey {{ operatory.dentrixId }}
            .appointment-table-title {{ operatory.title }}
          .fx-cl(v-for="time in operatory.times")
            .fx-cell(v-if="time.length")
              drag.fx-appointment(v-if="time.length", v-loading="loading", :style="getAppointmentStyle(time.appointmentId, time.length)", :transfer-data="{ appointmentId: time.appointmentId, length: time.length }")
                p Reason: {{ getEntityByKey(appointments, time.appointmentId, 'id', 'reason') }}
                p Doctor: {{ getEntityByKey(doctors, getEntityByKey(appointments, time.appointmentId, 'id', 'providerId'), 'providerId', 'name') }}
                p Patient: {{ getEntityByKey(appointments, time.appointmentId, 'id', 'patientName') }}
                p Length: {{ getEntityByKey(appointments, time.appointmentId, 'id', 'length') }} minutes
                el-button.fx-app-delete(v-if="false", @click="removeAppointment(time.appointmentId)", icon="el-icon-delete", circle, size="mini")
                el-button.fx-app-edit(v-if="false", @click="editAppointment(time.appointmentId)", icon="el-icon-edit", circle, size="mini")
                el-button.fx-app-drag(v-if="false", icon="el-icon-rank", circle, size="mini")
            drop.fx-emp(v-else,
              @drop="handleDrop(time.label, operatory.dentrixId, ...arguments)",
              :class="{ 'dropover': time.drop }",
              @dragover="time.drop = true",
              @dragleave="time.drop = false",
              :style="getCellStyle(time.label)",
            )
        .fx-col.fx-col-time.col-none-mob
          .fx-cl.fx-grey time
          .fx-cl(v-for="time in getTimes")
            .fx-cell(style="font-size: 11px;") {{time.label}}
    .legends(v-if="false", style="margin-top: 20px;")
      h2(style="margin: 10px 0 20px;")
        span(style="margin-right: 10px;") Broken appointments:
        el-checkbox(v-model="showBrokenAppointments")
      el-table(:data="getAppointments", border style="width: 100%;", v-loading="loading", element-loading-text="Loading...")
        el-table-column(label="Operatory", prop="operatoryId")
        el-table-column(prop="date", label="Date")
        el-table-column(prop="length", label="Length (min)")
        el-table-column(prop="reason" label="Reason")
        el-table-column(prop="amount" label="Amount")
        el-table-column(label="Doctor")
          template(slot-scope="scope")
            p {{ getEntityByKey(doctors, scope.row.providerId, 'providerId', 'name') }}
        el-table-column(label="Patient")
          template(slot-scope="scope")
            p {{ scope.row.patientName }}
        el-table-column(v-if="false", label="Operations" width="150" align="center")
          template(slot-scope="scope")
            el-button(v-if="false", type="info", size="mini", icon="el-icon-edit", circle, @click="editAppointment(scope.row.id)")
  .float-container(v-else, style="min-height: calc(100vh - 180px)", v-loading="globalLoading", element-loading-text="Loading...")
</template>

<script>
import gm from '@/services/GlobalMethods'
import { EventBus } from '@/services/EventBus'
import msgHandler from '@/services/msgHandler'
import http from '@/services/httpQuery'
import moment from 'moment'
import randomcolor from 'randomcolor'
import { Drag, Drop } from 'vue-drag-drop'
import httpMixin from '@/pages/appointments/mixins/httpMixin'
import timeMixin from '@/pages/appointments/mixins/timeMixin'
import create from '@/pages/appointments/create'
import edit from '@/pages/appointments/edit'
import colors from '@/pages/appointments/colors'

export default {
  components: {
    edit,
    create,
    colors,
    Drag,
    Drop
  },
  mixins: [
    httpMixin,
    timeMixin
  ],
  data () {
    return {
      appointments: [],
      brokenAppointments: [],
      doctors: [],
      patients: [],
      operatories: [],
      schedule: [],
      colors: {
        open: '#f6f7df',
        close: '#dadbf7'
      },
      selectedDate: new Date(),
      form: {},
      showBrokenAppointments: true,
      dialogDelete: false,
      dialogEdit: false,
      dialogCreate: false,
      dialogColor: false,
      closedTimes: [],
      loading: false,
      globalLoading: true,
      api: 'appointments/',
      constStep: 10
    }
  },
  computed: {
    getAppointments() {
      const array = this.appointments.filter(a => {
        if (!this.showBrokenAppointments || a.broken) {
          return a
        }
      }).concat(this.brokenAppointments)
      return array
    },
  },
  watch: {
    'selectedDate' () {
      this.refetchAppointments()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      Promise.all([
        gm.fetchEntity('doctors'),
        gm.fetchEntity('patients'),
        gm.fetchEntity('operatories'),
        gm.fetchEntity('schedule'),
        this.fetchAppointments()
      ]).then(([acct, perms]) => {
          this.afterFetch()
      }, () => {
        this.globalLoading = false
      })
      this.fetchBrokenAppointments()
    },
    fetchAppointments() {
      return new Promise((resolve, reject) => {
        const start = moment(this.selectedDate).format('YYYY-MM-DD')
        const end = moment(this.selectedDate).add(1, 'days').format('YYYY-MM-DD')
        const endpoint = `appointments?startDate=${start}&endDate=${end}`
        http.get(endpoint).then((data) => {
          this.appointments = data
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    refetchAppointments() {
      if (this.selectedDate) {
        this.loading = true
        const start = moment(this.selectedDate).format('YYYY-MM-DD')
        const end = moment(this.selectedDate).add(1, 'days').format('YYYY-MM-DD')
        const endpoint = `appointments?startDate=${start}&endDate=${end}`
        http.get(endpoint).then((data) => {
          this.appointments = data
          this.setData()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        msgHandler.showMessage('Pick valid date')
      }
    },
    fetchBrokenAppointments() {
      let endpoint = `appointments/broken`
      http.get(endpoint).then((data) => {
        this.brokenAppointments = data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    afterFetch() {
      this.doctors = gm.fromVuex('doctors')
      this.patients = gm.fromVuex('patients')
      this.operatories = gm.fromVuex('operatories')
      this.schedule = gm.fromVuex('schedule')
      this.setData()
      this.globalLoading = false
      setTimeout(() => { this.setScroll() }, 400)
    },
    setData() {
      this.doctors.forEach(d => {
        d.name = `${d.firstName} ${d.lastName}`
      })
      this.patients.forEach(p => {
        p.name = `${p.firstName} ${p.lastName}`
      })
      this.operatories = this.operatories.length > 0 ? this.operatories : [{ id: 0, dentrixId: "NO OPERATORY"}]
      this.setDoctorsStyles()
      this.drawSchedule()
    },
    setDoctorsStyles() {
      this.doctors.forEach(d => {
        let color = this.getColor(d.id)
        d.style = `background: ${color}; border: 1px solid ${color};`
      })
    },
    drawSchedule() {
      this.setOperatoriesTimes()
      this.setAppointments()
    },
    setOperatoriesTimes() {
      this.nullOperatoriesTimes()
      this.operatories.forEach(operatory => {
        this.getTimes.forEach(time => {
          operatory.times.push({
            label: time.label,
            time: time.time,
            appointmentId: null,
            length: null,
            drop: false
          })
        })
      })
    },
    nullOperatoriesTimes() {
      this.operatories.forEach(operatory => {
        operatory.times = []
      })
    },
    setAppointments() {
      this.appointments.forEach(app => {
        this.setAppointment(app)
      })
    },
    setAppointment(app) {
      let operatory = this.operatories.find(op => op.dentrixId == app.operatoryId)
      if (operatory) {
        const startTime = moment(this.selectedDate).hour(app.startHour).minute(app.startMinute).format('YYYY-MM-DDTHH:mm')
        let time = startTime
        let length = app.length
        while(length > 0) {
          let found = operatory.times.find(t => t.time === time)
          found.appointmentId = app.id
          if (length === app.length) {
            found.length = length
          }
          time = moment(time, 'YYYY-MM-DDTHH:mm').add(this.constStep, 'minutes').format('YYYY-MM-DDTHH:mm')
          length -= this.constStep
        }
      } else {
        msgHandler.showError(`Operatory ${app.operatoryId} not found`)
      }
    },
    editAppointment(appointmentId) {
      let appointment = gm.getEntity(this.appointments, appointmentId)
      if (appointment) {
        this.form = gm.deepClone(appointment)
        this.dialogEdit = true
      } else {
        let brokenAppointment = gm.getEntity(this.brokenAppointments, appointmentId)
        if (brokenAppointment) {
          this.form = gm.deepClone(brokenAppointment)
          this.dialogEdit = true
        }
      }
    },
    removeAppointment(appointmentId) {
      this.form = {
        id: appointmentId
      }
      this.dialogDelete = true
    },
    closeDialogDelete() {
      this.form = {}
      this.dialogDelete = false
    },
    createAppointment() {
      this.form = {}
      this.dialogCreate = true
    },
    getAppointmentStyle(appointmentId, length) {
      let appointment = gm.getEntity(this.appointments, appointmentId)
      const pixels = 30
      let height = length / this.constStep * pixels
      let style = `height: ${height}px;`
      if (appointment && appointment.providerId) {
        let doctor = gm.getEntity(this.doctors, appointment.providerId, 'providerId')
        if (doctor) {
          style += doctor.style
        }
      }
      return style
    },
    getCellStyle(time) {
      let style = this.closedTimes.includes(time) ? `background: ${this.colors.close};` :  `background: ${this.colors.open};`
      return style
    },
    handleDrop(time, operatoryId, data) {
      if (data) {
        let appointmentId = data.appointmentId
        let appointment = gm.getEntity(this.appointments, appointmentId)
        const hour = moment(time, 'HH:mm A').hour()
        const minute = moment(time, 'HH:mm A').minute()
        if (appointment) {
          this.form = gm.deepClone(appointment)
          this.form.operatoryId = operatoryId
          this.form.startHour = hour
          this.form.startMinute = minute
          this._updateAppointment()
        }
      } else {
        this.operatoriesNullDrop()
      }
    },
    operatoriesNullDrop() {
      this.operatories.forEach(operatory => {
        operatory.times.forEach(time => {
          time.drop = false
        })
      })
    },
    getColor() {
      return randomcolor({
        luminosity: 'light',
        hue: 'blue'
      })
    },
    setScroll() {
      let element = document.getElementById("scroll")
      let panel = document.getElementById("panel")
      if (element && panel) {
        window.scrollTo(0, element.offsetTop - panel.clientHeight)
      }
    },
    getEntityByKey(entities, id, key = 'id', returnKey = 'name') {
      return gm.getEntityByKey(entities, id, key, returnKey)
    },
    getColsStyle() {
      const colWidth = 250
      const timeColWidth = 60
      return window.innerWidth < 1000 ? `width: ${timeColWidth + colWidth * this.operatories.length}px;` : ''
    }
  }
}
</script>
