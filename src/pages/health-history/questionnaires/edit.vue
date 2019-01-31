<template lang="pug">
.workspace-container
  .simple-container
    .simple-container
      .question-title(style="padding: 10px 0; margin: 0;", v-loading="getLoading")
        span(v-if="showPatientName") {{ patientName }}
    .simple-container(v-for="category in questionCategories")
      .cloud-container(style="margin-top: 20px;")
        .main-subtitle {{ category.name }}
        .questionnaire(:class="category.class")
          .question(v-if="question.questionCategoryId === category.id", v-for="question in form", :key="question.id", :class="{'rerender': rerender}")
            .label {{ question.value }}
            .value(v-if="question.questionType === 'DIGIT'")
              el-input-number(v-model="question.answer", :min="0", size="mini", :disabled="getLoading", @change="reRender()")
            .value(v-else-if="question.questionType === 'BINARY'")
              el-radio-group(v-model="question.answer", :disabled="getLoading", @change="reRender()")
                el-radio(label="Yes")
                el-radio(label="No")
            .value(v-else-if="question.questionType === 'COMBINED'")
              el-input(v-model="question.answer", :disabled="loading", style="width: 100px; margin-right: 10px;", size="mini", @change="reRender()")
              span(v-if="question.answer && question.answer.length > 0")
                el-radio-group(v-model="radioYes", :disabled="true")
                  el-radio(label="Yes")
                  el-radio(label="No")
              span(v-else)
                el-radio-group(v-model="radioNo", :disabled="true")
                  el-radio(label="Yes")
                  el-radio(label="No")
            .value(v-else-if="question.questionType === 'DATE'")
              el-date-picker(v-if="false", v-model="question.answer", placeholder="Pick a date", format="MM/dd/yyyy", :disabled="getLoading")
              el-input(v-model="question.answer", placeholder="mm/dd/YYYY", v-mask="'##/##/####'", :disabled="getLoading", size="mini", @change="reRender()")
            .value(v-else)
              el-input(v-model="question.answer", :class="{'input-error': question.valid}", size="mini", :disabled="getLoading", @change="validate(question)")
    el-button(:loading="getLoading", :disabled="!patientId", @click="validateData()", style="margin-top: 30px;") Submit
</template>

<script>
import http from '@/services/httpQuery'
import gm from '@/services/GlobalMethods'
import httpMixin from '@/pages/health-history/questionnaires/mixins/httpMixin'
import msgHandler from '@/services/msgHandler'

export default {
  mixins: [
    httpMixin
  ],
  data () {
    return {
      questionCategories: [],
      patients: [],
      form: [],
      surveyResultViews: [],
      healthBackgroundId: null,
      patientId: null,
      showPatientName: false,
      patientName: '',
      answer: false,
      loading: false,
      healthBackgroundLoading: false,
      radioYes: "Yes",
      radioNo: "No",
      rerender: false,
      mode: 'edit'
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    getLoading() {
      return this.loading || this.healthBackgroundLoading
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      Promise.all([
        gm.fetchEntity('questions'),
        gm.fetchEntity('questionCategories'),
        gm.fetchEntity('patients'),
      ]).then(([acct, perms]) => {
        this.afterFetch()
      }, () => {
        this.loading = false
      })
    },
    afterFetch() {
      this.form = gm.fromVuex('questions')
      this.questionCategories = gm.fromVuex('questionCategories')
      this.patients = gm.fromVuex('patients')
      this._setData()
      this.setPatientId()
      this.loading = false
      this.fetchPatient()
    },
    setPatientId() {
      if (this.$route.query.patientId) {
        this.patientId = +this.$route.query.patientId
        const found = this.patients.find(patient => patient.id === this.patientId)
        this.patientName = found ? `${found.firstName} ${found.lastName}` : ''
        this.showPatientName = true
      } else if (this.$route.params.id) {
        this.patientId = +this.$route.params.id
      }
    },
    fetchPatient() {
      this.healthBackgroundLoading = true
      const patientId = this.$route.query.patientId ? this.$route.query.patientId : this.$route.params.id ? this.$route.params.id : null
      http.get(`patients/${patientId}/healthBackground`).then(data => {
        this.setForm(data)
      }).catch(() => {
        this.changeModeCreate()
        this.healthBackgroundLoading = false
      })
    },
    setForm(data) {
      if (data && data.surveyResultViews) {
        this.surveyResultViews = data && data.surveyResultViews ? data.surveyResultViews : []
        this.healthBackgroundId = data && data.id ? data.id : null
        this.form.forEach(f => {
          let found = this.surveyResultViews.find(srv => srv.questionView.id === f.id)
          if (found) {
            f.answer = found.answer
          }
        })
      } else {
        this.changeModeCreate()
      }
      this.healthBackgroundLoading = false
    },
    changeModeCreate() {
      this.mode = 'create'
    },
    validateData() {
      let found = this.form.findIndex(item => item.valid)
      if (found === -1) {
        if (this.mode === 'edit')
          this.putData()
        else
          this._postData()
      } else {
        msgHandler.showMessage("Allowed only +()#,'- with length no more than 40 symbols")
      }
    },
    putData() {
      this.loading = true
      let body = this._prepareData()
      const endpoint = `healthBackgrounds/${this.healthBackgroundId}`
      http.put(endpoint, body).then(() => {
        msgHandler.showSuccess('Successfully updated')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    validLength(str) {
      const maxLength = 40
      return str && str.length < maxLength ? true : false
    },
    validate(question) {
      const re = /^[a-zA-Z0-9()+#\-,' ]*$/;
      let output = re.test(question.answer) && this.validLength(question.answer)
      question.valid = !output
      this.reRender()
    },
    reRender() {
      this.rerender = !this.rerender
    },
  }
}

</script>
