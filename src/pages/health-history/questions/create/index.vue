<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  h2(style="margin-bottom: 30px;") Create new question
  el-form-item(label="Question")
    el-input.input-width(v-model="form.value", :class="{'input-error': validation.value}")
  el-form-item(label="Category")
    el-select(v-model="form.questionCategoryId", placeholder="Category")
      el-option(v-for="item in questionCategories", :label="item.name", :value="item.id", :key="item.id")
  el-form-item(label="Type")
    el-select(v-model="form.questionType", placeholder="Type")
      el-option(v-for="(item, index) in types", :label="item.value", :value="item.value", :key="index")
        .el-option-left {{ item.value }}
        .el-option-right {{ item.label }}
  el-form-item
    el-button(@click="prepareForm()", type="primary", round, :disabled="form.value.length === 0") Create
</template>

<script>
import { EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import msgHandler from '@/services/msgHandler'
import typesJSON from '@/pages/health-history/questions/types.json'
import ValidationMixin from '@/mixins/ValidationMixin'

export default {
  data () {
    return {
      form: {
        value: ''
      },
      validation: {
        value: ''
      },
      loading: false,
      questionCategories: [],
      types: [],
      endpoint: 'questions/',
    }
  },
  mixins: [
    ValidationMixin
  ],
  watch: {
    'form.value' (val) {
      this.validation.value = val.length > 0 ? !this.validCharsNumbers(val) : false
    },
  },
  created() {
    this.types = typesJSON
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      http.get('questionCategories').then((data) => {
        this.questionCategories = data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    postData() {
      this.loading = true
      http.post(this.endpoint, this.form).then(() => {
        msgHandler.showSuccess('Question created')
        this.nullForm()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    prepareForm() {
      if (this.validation.value) {
        msgHandler.showMessage('Special symbols not allowed in question')
      } else {
        this.postData()
      }
    },
    nullForm() {
      this.form = {
        value: ''
      }
    },
    getLabelPosition() {
      return window.innerWidth > 1000 ? 'right' : 'top'
    },
  }
}
</script>
