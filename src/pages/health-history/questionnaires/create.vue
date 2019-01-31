<template lang="pug">
.workspace-container
  .simple-container
    .simple-container
      .question-option
        el-select(v-model="patientId", placeholder="Patient", style="width: 257px;", clearable, filterable, :disabled="loading")
          el-option(v-for="item in patients", :label="item.formatName", :value="item.id", :key="item.id")
      .question-option
        el-button(@click="clearForm()") Clear questionnaire
    .simple-container(v-for="category in questionCategories")
      .cloud-container(style="margin-top: 20px;")
        .main-subtitle {{ category.name }}
        .questionnaire(:class="category.class")
          .question(v-if="question.questionCategoryId === category.id", v-for="question in form", :key="question.id", :class="{'rerender': rerender}")
            .label {{ question.value }}
            .value(v-if="question.questionType === 'DIGIT'")
              el-input-number(v-model="question.answer", :min="0", size="mini", :disabled="loading", @change="reRender()")
            .value(v-else-if="question.questionType === 'BINARY'")
              el-radio-group(v-model="question.answer", :disabled="loading", @change="reRender()")
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
              el-date-picker(v-if="false", v-model="question.answer", placeholder="Pick a date", format="MM/dd/yyyy", :disabled="loading")
              el-input(v-model="question.answer", placeholder="mm/dd/YYYY", v-mask="'##/##/####'", size="mini", :disabled="loading", @change="reRender()")
            .value(v-else)
              el-input(v-model="question.answer", :class="{'input-error': question.valid}", size="mini", :disabled="loading", @change="validate(question)")
    el-button(:loading="loading", :disabled="!patientId", @click="validateData()", style="margin-top: 30px;") Submit
</template>

<script>
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
      patientId: null,
      answer: false,
      loading: false,
      radioYes: "Yes",
      radioNo: "No",
      rerender: false,
    }
  },
  created() {
    this.fetchData()
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
      this.patients = gm.fromVuex('patients')
      this.questionCategories = gm.fromVuex('questionCategories')
      this._setData()
      this.setCacheForm()
      this.loading = false
    },
    setCacheForm() {
      const states = localStorage.getItem('questionnaire')
      const answers = JSON.parse(states)
      this.form = answers && answers.length > 0 ? answers : gm.fromVuex('questions')
    },
    validateData() {
      let found = this.form.findIndex(item => item.valid)
      if (found === -1) {
        this._postData()
      } else {
        msgHandler.showMessage("Allowed only +()#,'- with length no more than 40 symbols")
      }
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
      this.cacheForm()
      this.rerender = !this.rerender
    },
    clearForm() {
      this.form.forEach(item => item.answer = '')
      this.reRender()
      localStorage.removeItem('questionnaire')
    },
    cacheForm() {
      const states = JSON.stringify(this.form)
      localStorage.setItem('questionnaire', states)
    },
  }
}

</script>
