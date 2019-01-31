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
  <div class="alpino-table" v-loading="loading">
    <div class="alpino-card" v-for="(user, index) in getFilteredData" :key="index">
      <div class="alpino-card-img">
        <img src="https://thememakker.com/templates/alpino/main/assets/images/sm/avatar1.jpg" alt="">
      </div>
      <div class="alpino-card-title">{{ user.firstName }} {{ user.lastName}}</div>
      <social></social>
      <p>{{ user.email }}</p>
      <el-button size="mini" icon="el-icon-zoom-in" style="margin-top: 15px;" @click="viewDetail(user.id)"></el-button>
    </div>
  </div>
  <div v-if="false">
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
        <b-table-column field="firstName" label="First name" sortable centered>
          {{ props.row.firstName }}
        </b-table-column>
        <b-table-column field="lastName" label="Last name" sortable centered>
          {{ props.row.lastName }}
        </b-table-column>
        <b-table-column field="email" label="Email" sortable centered>
          {{ props.row.email }}
        </b-table-column>
        <b-table-column label="Details" width="100" centered>
          <el-button class="operation-button" size="mini" type="primary" icon="el-icon-zoom-in" circle @click="viewDetail(props.row.id)"></el-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import social from '@/components/social'

export default {
  name: 'Doctors',
  components: { social },
  data () {
    return {
      perPage: 5,
      currentPage: 1,
      tableData: [],
      tableName: 'Doctors',
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
      endpoint: 'doctors/',
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
    viewDetail(id) {
      this.$router.push(`/dashboard/doctors/${id}`)
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
