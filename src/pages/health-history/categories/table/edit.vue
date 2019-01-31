<template lang="pug">
el-form(v-loading="loading", label-width="130px", :label-position="getLabelPosition()")
  el-form-item(label="Name")
    el-input.input-width(v-model="form.name")
  el-form-item(label="Order")
    el-input-number(v-model="form.order", :min="0", size="mini")
  el-form-item
    el-button(@click="putData()", type="primary", round) Save
</template>

<script>
import { EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'

export default {
  props: ['form'],
  data () {
    return {
      loading: false,
      endpoint: 'questionCategories/'
    }
  },
  methods: {
    putData() {
      this.loading = true
      http.put(this.endpoint + this.form.id, this.form).then(() => {
        this.$emit('questionCategoriesChanged')
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
