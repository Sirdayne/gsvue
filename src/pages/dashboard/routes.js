const Statistics = () => import('@/pages/dashboard/statistics')
const Doctors = () => import('@/pages/dashboard/doctors')
const DoctorsView = () => import('@/pages/dashboard/doctors/view')
const Patients = () => import('@/pages/dashboard/patients')
const PatientsView = () => import('@/pages/dashboard/patients/view')

module.exports = [
  {
    path: '/',
    component: Statistics,
    meta: {
      title: 'Statistics'
    },
  },
  {
    path: 'doctors',
    component: Doctors,
    meta: {
      title: 'Doctors'
    },
  },
  {
    path: 'doctors/:id',
    component: DoctorsView,
    meta: {
      title: 'Doctors detail'
    },
  },
  {
    path: 'patients',
    component: Patients,
    meta: {
      title: 'Patients'
    },
  },
  {
    path: 'patients/:id',
    component: PatientsView,
    meta: {
      title: 'Patients detail'
    },
  },
  {
    path: ':page',
    redirect: '/dashboard',
  },
]
