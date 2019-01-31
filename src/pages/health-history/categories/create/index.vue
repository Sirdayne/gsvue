<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  h2(style="margin-bottom: 30px;") Create new category
  el-form-item(label="Name")
    el-input.input-width(v-model="form.name", :class="{'input-error': validation.name}")
  el-form-item(label="Order")
    el-input-number(v-model="form.order", :min="0", size="mini")
  el-form-item
    el-button(@click="prepareForm()", type="primary", round, :disabled="form.name.length === 0") Create
</template>

<script>
import { EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import msgHandler from '@/services/msgHandler'
import ValidationMixin from '@/mixins/ValidationMixin'

export default {
  data () {
    return {
      form: {
        order: 0,
        name: ''
      },
      validation: {
        name: false
      },
      loading: false,
      endpoint: 'questionCategories/'
    }
  },
  mixins: [
    ValidationMixin
  ],
  watch: {
    'form.name' (val) {
      this.validation.name = val.length > 0 ? !this.validCharsNumbers(val) : false
    },
  },
  methods: {
    postData() {
      this.loading = true
      http.post(this.endpoint, this.form).then(() => {
        msgHandler.showSuccess('Category created')
        this.nullForm()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    prepareForm() {
      if (this.validation.name) {
        msgHandler.showMessage('Special symbols not allowed in name of category')
      } else {
        this.postData()
      }
    },
    nullForm() {
      this.form = {
        order: 0,
        name: ''
      }
    },
    getLabelPosition() {
      return window.innerWidth > 1000 ? 'right' : 'top'
    },
  }
}
</script>
