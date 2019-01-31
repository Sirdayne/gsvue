import { EventBus } from '@/services/EventBus'
import msgHandler from '@/services/msgHandler'
import moment from 'moment'
import http from '@/services/httpQuery'

export default {
  created() {
    EventBus.$on('AppointmentSave', () => {
      this._updateAppointment()
    })
    EventBus.$on('AppointmentCreate', () => {
      this._createAppointment()
    })
  },
  methods: {
    _updateAppointment() {
      try {
        this.checkIntersection()
        this.putAppointment()
        this.dialogEdit = false
      } catch(error) {
        msgHandler.showError(error)
      }
    },
    _createAppointment() {
      try {
        this.checkIntersection()
        this.dialogCreate = false
      } catch(error) {
        msgHandler.showError(error)
      }
    },
    checkIntersection() {
      let operatory = this.operatories.find(op => op.dentrixId === this.form.operatoryId)
      if (operatory) {
        const startTime = moment(this.selectedDate).hour(this.form.startHour).minute(this.form.startMinute).format('YYYY-MM-DDTHH:mm')
        let time = startTime
        let length = this.form.length
        while(length > 0) {
          let found = operatory.times.find(t => t.time === time)
          if (found.appointmentId && found.appointmentId !== this.form.id) {
            throw new Error('Intersection error')
          }
          time = moment(time, 'YYYY-MM-DDTHH:mm').add(10, 'minutes').format('YYYY-MM-DDTHH:mm')
          length -= 10
        }
      }
    },
    putAppointment() {
      this.loading = true
      const endpoint = `appointments/${this.form.id}`
      http.put(endpoint, this.form).then(() => {
        this.refetchAppointments()
      }).catch(() => {
        this.loading = false
      })
    },
    deleteAppointment() {
      this.loading = true
      const endpoint = `appointments/${this.form.id}`
      http.delete(endpoint).then(() => {
        this.refetchAppointments()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
