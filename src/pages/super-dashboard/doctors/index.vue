<template>
<div v-loading="loading" element-loading-text="Loading...">
  <el-button @click="routerReturn()" style="margin-bottom: 30px;" type="primary" round>to Clinics</el-button>
  <h2 style="margin-bottom: 20px;">{{ tableName }}</h2>
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
      <b-table-column field="id" label="ID" width="40" sortable numeric>
        {{ props.row.id }}
      </b-table-column>
      <b-table-column  v-for="col in cols" :key="col.id" :field="col.prop" :label="col.label" sortable centered>
        {{ props.row[col.prop] }}
      </b-table-column>
    </template>
  </b-table>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpToken'

export default {
  data () {
    return {
      tableData: [],
      tableName: 'Doctors by clinic',
      perPage: 5,
      currentPage: 1,
      form: {},
      search: '',
      cols: [
        {
          prop: 'firstName',
          label: 'First name'
        },
        {
          prop: 'lastName',
          label: 'Last name'
        },
        {
          prop: 'email',
          label: 'Email'
        },
      ],
      searchKeys: ['firstName', 'lastName', 'email'],
      endpoint: 'clinics/',
      loading: false,
    }
  },
  created() {
    this.getData()
  },
  computed: {
    getFilteredData() {
      let array = []
      this.tableData.forEach(t => {
        let found = this.searchKeys.findIndex(key => t[key] && t[key].toLowerCase().includes(this.search.toLowerCase()))
        if (found !== -1)
          array.push(t)
      })
      return array
    },
  },
  methods: {
    getData() {
      this.loading = true
      http.get(this.endpoint + this.$route.params.id + '/doctors').then(data => {
        this.tableData = data ? data : []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    routerReturn() {
      this.$router.push('/super-dashboard/clinics/')
    },
  }
}

</script>
