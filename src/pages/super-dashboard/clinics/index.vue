<template>
<div v-loading="loading" element-loading-text="Loading...">
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
      <b-table-column field="name" label="Name" sortable centered>
        {{ props.row.name }}
      </b-table-column>
      <b-table-column label="Operations" width="250" centered>
        <el-button class="operation-button" size="mini" type="primary" icon="el-icon-zoom-in" circle @click="viewDetail(props.row.id)"></el-button>
        <el-button class="operation-button super-button" size="mini" type="primary" round @click="toRouteDoctors(props.row.id)">doctors</el-button>
        <el-button class="operation-button super-button" size="mini" type="primary" round @click="toRoutePatients(props.row.id)">patients</el-button>
      </b-table-column>
    </template>
  </b-table>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'

export default {
  data () {
    return {
      tableName: 'Clinics',
      perPage: 5,
      currentPage: 1,
      form: {},
      search: '',
      searchKeys: ['name'],
      loading: false,
    }
  },
  computed: {
    getFilteredData() {
      let array = []
      this.getClinics.forEach(t => {
        let found = this.searchKeys.findIndex(key => t[key] && t[key].toLowerCase().includes(this.search.toLowerCase()))
        if (found !== -1)
          array.push(t)
      })
      return array
    },
    getClinics() {
      return this.$store.getters.getClinics
    }
  },
  methods: {
    viewDetail(id) {
      this.$router.push(`/super-dashboard/clinics/${id}`)
    },
    toRouteDoctors(id) {
      this.$router.push(`/super-dashboard/clinics/${id}/doctors/`)
    },
    toRoutePatients(id) {
      this.$router.push(`/super-dashboard/clinics/${id}/patients/`)
    },
  }
}

</script>
