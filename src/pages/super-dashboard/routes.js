const Clinics = () => import('@/pages/super-dashboard/clinics')
const ClinicsView = () => import('@/pages/super-dashboard/clinics/view')
const Doctors = () => import('@/pages/super-dashboard/doctors')
const Patients = () => import('@/pages/super-dashboard/patients')

module.exports = [
  {
    path: 'clinics',
    component: Clinics,
    meta: {
      title: 'Clinics'
    },
  },
  {
    path: 'clinics/:id',
    component: ClinicsView,
    meta: {
      title: 'Clinic details'
    },
  },
  {
    path: 'clinics/:id/doctors/',
    component: Doctors,
    meta: {
      title: 'Clinic doctors'
    },
  },
  {
    path: 'clinics/:id/patients/',
    component: Patients,
    meta: {
      title: 'Clinic patients'
    },
  },
  {
    path: ':page',
    redirect: 'clinics',
  },
]
