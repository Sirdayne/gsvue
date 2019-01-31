<template>
<div v-loading="loading" element-loading-text="Loading...">
  <el-dialog v-if="dialogEdit" :visible.sync="dialogEdit" title="Edit category" width="800px" :append-to-body="true">
    <edit :form="form" @questionCategoriesChanged="questionCategoriesChanged"></edit>
  </el-dialog>
  <el-dialog v-if="dialogDelete" :visible.sync="dialogDelete" title="Delete category" width="320px" :append-to-body="true">
    <el-button v-loading="loading" :disabled="loading" @click="deleteItem()" round type="primary">Confirm</el-button>
    <el-button @click="closeDialogDelete()" round>Cancel</el-button>
  </el-dialog>
  <el-form :inline="true" label-position="top">
    <el-form-item label="Search:">
      <el-input v-model="search"
                prefix-icon="el-icon-search">
      </el-input>
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
      <b-table-column field="name" label="Name" sortable centered>
        {{ props.row.name }}
      </b-table-column>
      <b-table-column field="order" label="Order" width="40" sortable centered>
        {{ props.row.order }}
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

import http from '@/services/httpQuery'
import gm from '@/services/GlobalMethods'
import edit from './edit'

export default {
  components: {
    edit
  },
  data () {
    return {
      perPage: 5,
      currentPage: 1,
      categories: [],
      tableName: 'Question categories',
      form: {},
      search: '',
      cols: [
        {
          prop: 'name',
          label: 'Name'
        },
        {
          prop: 'order',
          label: 'Order',
          width: '300'
        }
      ],
      searchKeys: ['name'],
      loading: false,
      dialogEdit: false,
      dialogDelete: false,
      endpoint: 'questionCategories/'
    }
  },
  computed: {
    getFilteredData() {
      let array = []
      this.categories.forEach(t => {
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
      http.get(this.endpoint).then((data) => {
        this.categories = data ? data : [{id: 1, name: 'Health history'}]
        this.loading = false
      }).catch(() => {
        this.categories = [{id: 1, name: 'Health history'}]
        this.loading = false
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
    questionCategoriesChanged() {
      this.dialogEdit = false
      this.form = {}
      this.fetchData()
    }
  }
}

</script>
