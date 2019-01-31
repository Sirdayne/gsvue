<template>
  <div class="dashboard-container">
    <el-form :inline="true">
      <el-form-item>
        <h2>{{ tableName }}</h2>
      </el-form-item>
      <el-form-item class="el-search">
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
        <b-table-column v-for="col in cols" :key="col.id" :field="col.prop" :label="col.label" sortable centered>
          {{ props.row[col.prop] }}
        </b-table-column>
        <b-table-column label="Operations"  width="180" centered>
          <el-button size="mini" type="primary" @click="editHealthHistory(props.row.id)">health history</el-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'

export default {
  data () {
    return {
      tableData: [],
      tableName: 'Questionnaires',
      currentPage: 1,
      perPage: 5,
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
      endpoint: 'patients',
      loading: true
    }
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    editHealthHistory(id) {
      this.$router.push(`/health-history/questionnaires/edit?patientId=${id}`)
    },
    fetchData() {
      this.loading = true
      http.get(this.endpoint).then(data => {
        this.tableData = data ? data : []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
  }
}
</script>
