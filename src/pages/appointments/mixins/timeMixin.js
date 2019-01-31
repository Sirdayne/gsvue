import moment from 'moment'

export default {
  computed: {
    getTimes() {
      this.closedTimes = []
      const dayOfWeek = this.getDayOfWeek()
      const schedule = this.schedule[0] ? this.schedule[0] : {}
      const startTime = moment(this.selectedDate).hours(6).minutes(0)
      const endTime = moment(this.selectedDate).hours(20).minutes(1)

      const startTime1 = moment(schedule[`${dayOfWeek}StartTime1`], 'HH:mm').hours()
      const endTime1 = moment(schedule[`${dayOfWeek}EndTime1`], 'HH:mm').hours()
      const startTime2 = moment(schedule[`${dayOfWeek}StartTime2`], 'HH:mm').hours()
      const endTime2 = moment(schedule[`${dayOfWeek}EndTime2`], 'HH:mm').hours()

      const workStart = moment(this.selectedDate).hours(startTime1).minutes(0)
      const lunchStart = moment(this.selectedDate).hours(endTime1).minutes(0)
      const lunchEnd = moment(this.selectedDate).hours(startTime2).minutes(0)
      const workEnd = moment(this.selectedDate).hours(endTime2).minutes(0)
      let time = startTime
      const times = []
      while (time < endTime) {
        let obj = {
          label: moment(time).format('LT'),
          time: moment(time).format('YYYY-MM-DDTHH:mm'),
        }
        if (time.isSame(workStart)){
          obj.scroll = true
        }
        if (time < workStart || time > workEnd || (time >= lunchStart && time < lunchEnd)) {
          this.closedTimes.push(moment(time).format('LT'))
        }
        times.push(obj)
        time = moment(time).add(this.constStep, 'minutes')
      }
      return times
    },
  },
  methods: {
    getDayOfWeek() {
      let day = moment(this.selectedDate).isoWeekday()
      day = day === 1 ? 'monday' : day === 2 ? 'tuesday' : day === 3 ? 'wednesday' : day === 4 ? 'thursday' : day === 5 ? 'friday' : day === 6 ? 'saturday' : 'sunday'
      return day
    }
  }
}
