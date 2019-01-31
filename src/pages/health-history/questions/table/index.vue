<template>
<div v-loading="loading" element-loading-text="Loading...">
  <el-dialog v-if="dialogEdit" :visible.sync="dialogEdit" title="Edit question" width="800px" :append-to-body="true">
    <edit :form="form" @questionsChanged="questionsChanged"></edit>
  </el-dialog>
  <el-dialog v-if="dialogDelete" :visible.sync="dialogDelete" title="Delete question" width="320px" :append-to-body="true">
    <el-button v-loading="loading" :disabled="loading" @click="deleteItem()" round type="primary">Confirm</el-button>
    <el-button @click="closeDialogDelete()" round>Cancel</el-button>
  </el-dialog>
  <el-form :inline="true" label-position="top">
    <el-form-item label="Search:">
      <el-input v-model="search"
                prefix-icon="el-icon-search">
      </el-input>
    </el-form-item>
    <el-form-item label="Per page:">
      <el-select v-model="perPage" style="width: 100px;">
        <el-option v-for="item in perPages" :label="item.value" :value="item.value" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <b-table
    :data="getFilteredData"
    :paginated="true"
    :per-page="perPage"
    :current-page.sync="currentPage"
    :striped="true"
    :hoverable="true"
    v-loading="loading"
    element-loading-text="Loading..."
  >
    <template slot-scope="props">
      <b-table-column field="value" label="Question" sortable centered>
        {{ props.row.value }}
      </b-table-column>
      <b-table-column field="questionCategoryFormat" label="Category" sortable centered>
        {{ props.row.questionCategoryFormat }}
      </b-table-column>
      <b-table-column field="questionType" label="Type" sortable centered>
        {{ props.row.questionType }}
      </b-table-column>
      <b-table-column field="created" label="Date created" sortable centered>
        {{ props.row.created }}
      </b-table-column>
      <b-table-column label="Operations" width="100" centered>
        <el-button class="operation-button" size="mini" type="info" icon="el-icon-edit" circle @click="editItem(props.row)"></el-button>
        <el-button class="operation-button" size="mini" type="danger" icon="el-icon-delete" circle @click="openDialogDelete(props.row.id)"></el-button>
      </b-table-column>
    </template>
  </b-table>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import gm from '@/services/GlobalMethods'
import edit from './edit'

export default {
  components: {
    edit
  },
  data () {
    return {
      questions: [],
      tableName: 'Questions',
      form: {},
      search: '',
      perPage: 5,
      currentPage: 1,
      cols: [
        {
          prop: 'value',
          label: 'Question',
          width: '500'
        },
        {
          prop: 'questionCategoryFormat',
          label: 'Category'
        },
        {
          prop: 'questionType',
          label: 'Type'
        },
        {
          prop: 'created',
          label: 'Date created'
        }
      ],
      searchKeys: ['value', 'questionCategoryFormat', 'questionType', 'created'],
      loading: false,
      dialogEdit: false,
      dialogDelete: false,
      endpoint: 'questions/',
      perPages: [
        {
          id: 0,
          value: 5
        },
        {
          id: 1,
          value: 10
        },
        {
          id: 2,
          value: 15
        },
        {
          id: 3,
          value: 20
        },
      ]
    }
  },
  computed: {
    getFilteredData() {
      let array = []
      this.questions.forEach(t => {
        let found = this.searchKeys.findIndex(key => t[key] && t[key].toLowerCase().includes(this.search.toLowerCase()))
        if (found !== -1)
          array.push(t)
      })
      return array
    },
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
      ]).then(([acct, perms]) => {
        this.afterFetch()
      }, () => {
        this.loading = false
      })
    },
    afterFetch() {
      this.questions = gm.fromVuex('questions')
      this.questionCategories = gm.fromVuex('questionCategories')
      this.setData()
      this.loading = false
    },
    setData() {
      this.questions.forEach(q => {
        let found = this.questionCategories.find(category => category.id === q.questionCategoryId)
        q.questionCategoryFormat = found ? found.name : 'no data'
      })
    },
    editItem(form) {
      this.form = gm.deepClone(form)
      this.dialogEdit = true
    },
    openDialogDelete(id) {
      this.form.id = id
      this.dialogDelete = true
    },
    deleteItem() {
      this.loading = true
      http.delete(`${this.endpoint}${this.form.id}`).then(() => {
        this.dialogDelete = false
        this.fetchData()
        this.form = {}
      }).catch(() => {
        this.loading = false
      })
    },
    closeDialogDelete() {
      this.dialogDelete = false
    },
    questionsChanged() {
      this.dialogEdit = false
      this.form = {}
      this.fetchData()
    }
  }
}

</script>
