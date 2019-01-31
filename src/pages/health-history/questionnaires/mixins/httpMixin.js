import http from '@/services/httpQuery'
import msgHandler from '@/services/msgHandler'

export default {
  methods: {
    _setData() {
      this.questionCategories.sort((a, b) => a.order - b.order)
      this.questionCategories.forEach(category => {
        category.count = 0
        this.form.forEach(f => category.count += f.questionCategoryId === category.id ? 1 : 0)
        category.class = category.count <= 6 ? 'column-count-one' : category.count <= 10 ? 'column-count-two' : ''
      })
      this.patients.forEach(patient => {
        patient.formatName = `${patient.firstName} ${patient.lastName}`
      })
    },
    _prepareData() {
      let body = {surveyResultViews: []}
      this.form.forEach(f => {
        const id = f.id ? f.id : null
        let answer = null
        if (f.questionType === "DIGIT") {
          answer = f.answer ? f.answer.toString() : null
          body.surveyResultViews.push({
            answer: answer,
            questionView: {
              id: id
            }
          })
        } else {
          answer = f.answer ? f.answer : null
          body.surveyResultViews.push({
            answer: answer,
            questionView: {
              id: id
            }
          })
        }
      })
      return body
    },
    _postData() {
      let body = this._prepareData()
      this.loading = true
      http.post('healthBackgrounds/' + this.patientId, body).then(() => {
        msgHandler.showSuccess('Successfully filled in')
        localStorage.removeItem('questionnaire')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
  }
}
