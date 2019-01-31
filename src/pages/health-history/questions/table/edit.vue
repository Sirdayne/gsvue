<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  el-form-item(label="Question")
    el-input.input-width(v-model="form.value")
  el-form-item(label="Category")
    el-select(v-model="form.questionCategoryId", placeholder="Category")
      el-option(v-for="item in questionCategories", :label="item.name", :value="item.id", :key="item.id")
  el-form-item(label="Type")
    el-select(v-model="form.questionType", placeholder="Type")
      el-option(v-for="(item, index) in types", :label="item.value", :value="item.value", :key="index")
        .el-option-left {{ item.value }}
        .el-option-right {{ item.label }}
  el-form-item
    el-button(@click="putData()", type="primary", round) Save
</template>

<script>
import { EventBus} from '@/services/EventBus'
import typesJSON from '@/pages/health-history/questions/types.json'
import http from '@/services/httpQuery'

export default {
  props: ['form'],
  data () {
    return {
      loading: false,
      questionCategories: [],
      types: [],
      endpoint: 'questions/'
    }
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
    putData() {
      this.loading = true
      http.put(this.endpoint + this.form.id, this.form).then(() => {
        this.$emit('questionsChanged')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLabelPosition() {
      return window.innerWidth > 1000 ? 'right' : 'top'
    },
  }
}
</script>
