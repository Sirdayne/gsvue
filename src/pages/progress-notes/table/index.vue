<template>
<div v-loading="loading" element-loading-text="Loading...">
  <el-dialog v-if="dialogEdit" :visible.sync="dialogEdit" title="Edit progress note" width="800px" :append-to-body="true">
    <edit :form="form" :doctors="doctors" :patients="patients" @progressNotesChanged="progressNotesChanged"></edit>
  </el-dialog>
  <el-dialog v-if="dialogDelete" :visible.sync="dialogDelete" title="Delete progress note" width="320px" :append-to-body="true">
    <el-button v-loading="loadingNotes" :disabled="loadingNotes" @click="deleteProgressNote()" round type="primary">Confirm</el-button>
    <el-button @click="closeDialogDelete()" round>Cancel</el-button>
  </el-dialog>
  <el-form :inline="true" label-position="top">
    <el-form-item label="Patient:">
      <el-select v-model="selectedPatient" placeholder="Patient">
        <el-option v-for="item in patients" :label="item.formatName" :value="item.id" :key="item.id"/>
      </el-select>
    </el-form-item>
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
    v-loading="loadingNotes"
    element-loading-text="Loading..."
  >
    <template slot-scope="props">
      <b-table-column field="procedureDate" label="Date" sortable centered>
        {{ props.row.procedureDate }}
      </b-table-column>
      <b-table-column field="formatDoctor" label="Doctor" sortable centered>
        {{ props.row.formatDoctor }}
      </b-table-column>
      <b-table-column field="formatNote" label="Note" sortable centered>
        {{ props.row.formatNote }}
      </b-table-column>
      <b-table-column label="Operations"  width="180" centered>
        <el-button class="operation-button" size="mini" type="info" icon="el-icon-zoom-in" circle @click="viewDetail(props.row.id)"></el-button>
        <el-button v-if="isAdminRole || isEditable(props.row.doctorId)" class="operation-button" size="mini" type="info" icon="el-icon-edit" circle @click="editProgressNote(props.row.id)"></el-button>
        <el-button class="operation-button" size="mini" type="danger" icon="el-icon-delete" circle @click="openDialogDelete(props.row.id)"></el-button>
      </b-table-column>
    </template>
  </b-table>
  <xray :loading="loadingNotes"></xray>
</div>
</template>

<script>

import {EventBus} from '@/services/EventBus'
import http from '@/services/httpQuery'
import gm from '@/services/GlobalMethods'
import edit from '@/pages/progress-notes/table/edit'
import xray from '@/components/xray'

export default {
  components: {
    edit,
    xray
  },
  data () {
    return {
      perPage: 5,
      currentPage: 1,
      selectedPatient: null,
      selectedNote: null,
      progressNotes: [],
      doctors: [],
      patients: [],
      tableName: 'Progress notes',
      form: {},
      search: '',
      cols: [
        {
          prop: 'procedureDate',
          label: 'Date'
        },
        {
          prop: 'formatDoctor',
          label: 'Doctor'
        },
        {
          prop: 'formatNote',
          label: 'Note'
        },
      ],
      searchKeys: ['procedureDate', 'formatDoctor', 'formatNote'],
      loading: false,
      loadingNotes: false,
      dialogEdit: false,
      dialogDelete: false,
      endpoint: 'patients/'
    }
  },
  watch: {
    "selectedPatient" () {
      this.fetchProgressNotes()
    }
  },
  computed: {
    getFilteredData() {
      let array = []
      this.progressNotes.forEach(t => {
        let found = this.searchKeys.findIndex(key => t[key] && t[key].toLowerCase().includes(this.search.toLowerCase()))
        if (found !== -1)
          array.push(t)
      })
      return array
    },
    isAdminRole() {
      return gm.hasRole('ROLE_ADMIN') || gm.hasRole('ROLE_SYSTEM_ADMIN')
    },
    getUserInfo() {
      return this.$store.getters.getUserInfo
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    viewDetail(id) {
      this.$router.push(`/progress-notes/view/${id}`)
    },
    fetchData() {
      this.loading = true
      Promise.all([
        gm.fetchEntity('doctors'),
        gm.fetchEntity('patients')
      ]).then(([acct, perms]) => {
        this.afterFetch()
        }, () => {
        this.loading = false
      })
    },
    afterFetch() {
      this.doctors = gm.fromVuex('doctors')
      this.patients = gm.fromVuex('patients')
      this.setData()
      this.loading = false
    },
    setData() {
      this.patients.forEach(patient => {
        patient.formatName = `${patient.firstName} ${patient.lastName}`
      })
      this.doctors.forEach(doctor => {
        doctor.formatName = `${doctor.firstName} ${doctor.lastName}`
      })
      this.selectedPatient = this.patients && this.patients.length > 0 ? this.patients[0].id : null
    },
    fetchProgressNotes() {
      if (this.selectedPatient) {
        this.loadingNotes = true
        this.progressNotes = []
        const endpoint = `${this.endpoint}${this.selectedPatient}/progressNotes`
        http.get(endpoint).then((data) => {
          this.progressNotes = data
          this.setProgressNotes()
          this.loadingNotes = false
        }).catch(() => {
          this.loadingNotes = false
        })
      }
    },
    setProgressNotes() {
      const descriptionLength = 18
      this.progressNotes.forEach(p => {
        let doctor = gm.getEntity(this.doctors, p.doctorId)
        p.formatDoctor = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'No data'
        p.formatNote = p.noteView.note && p.noteView.note.length > descriptionLength ? `${p.noteView.note.slice(0, descriptionLength)}...` : p.noteView.note ? p.noteView.note : ''
      })
    },
    editProgressNote(id) {
      let progressNote = gm.getEntity(this.progressNotes, id)
      if (progressNote) {
        this.form = gm.deepClone(progressNote)
        this.dialogEdit = true
      }
    },
    openDialogDelete(id) {
      this.selectedNote = id
      this.dialogDelete = true
    },
    deleteProgressNote() {
      this.loadingNotes = true
      http.delete(`progressNotes/${this.selectedNote}`).then(() => {
        this.dialogDelete = false
        this.fetchProgressNotes()
        this.selectedNote = null
      }).catch(() => {
        this.loadingNotes = false
      })
    },
    closeDialogDelete() {
      this.dialogDelete = false
    },
    progressNotesChanged() {
      this.dialogEdit = false
      this.form = {}
      this.fetchProgressNotes()
    },
    isEditable(doctorId) {
      const out = doctorId === this.getUserInfo.id ? true : false
      return out
    }
  }
}

</script>

<style lang="stylus" scoped>
td
  padding 24px
</style>
