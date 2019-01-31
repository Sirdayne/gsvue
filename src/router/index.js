import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/services/Auth'
import gm from '@/services/GlobalMethods'
import roles from '@/router/roles.json'

import MainPage from '@/pages/MainPage'
import Authorization from '@/pages/Authorization'
import Registration from '@/pages/Registration'
import DoctorConfirmPassword from '@/pages/DoctorConfirmPassword'
import ForgotPassword from '@/pages/ForgotPassword'
import Profile from '@/pages/profile'
import Appointments from '@/pages/appointments'
import Dashboard from '@/pages/dashboard'
import DashboardRoutes from '@/pages/dashboard/routes'
import ProgressNotes from '@/pages/progress-notes'
import ProgressNotesRoutes from '@/pages/progress-notes/routes'
import SuperDashboard from '@/pages/super-dashboard'
import SuperDashboardRoutes from '@/pages/super-dashboard/routes'
import HealthHistory from '@/pages/health-history'
import HealthHistoryRoutes from '@/pages/health-history/routes'
import Contact from '@/pages/contact'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/sign-in',
      name: 'Authorization',
      component: Authorization,
      meta: {
        banLogged: true
      },
    },
    {
      path: '/users/password',
      name: 'Password confirmation',
      component: DoctorConfirmPassword,
    },
    {
      path: '/forgot-password',
      name: 'Forgot password',
      component: ForgotPassword,
      meta: {
        banLogged: true
      },
    },
    {
      path: '/sign-up',
      name: 'Registration',
      component: Registration,
      meta: {
        banLogged: true
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        loginRequired: true
      }
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/patients',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        loginRequired: true,
        roles: roles.primary
      },
      children: [...DashboardRoutes],
    },
    {
      path: '/super-dashboard',
      redirect: '/super-dashboard/patients',
      name: 'Super-dashboard',
      component: SuperDashboard,
      meta: {
        loginRequired: true,
        roles: roles.system
      },
      children: [...SuperDashboardRoutes],
    },
    {
      path: '/progress-notes',
      redirect: '/progress-notes/table',
      name: 'Progress Notes',
      component: ProgressNotes,
      meta: {
        loginRequired: true,
        roles: roles.primary
      },
      children: [...ProgressNotesRoutes],
    },
    {
      path: '/appointments',
      name: 'Appointments',
      component: Appointments,
      meta: {
        loginRequired: true,
        roles: roles.primary
      },
    },
    {
      path: '/health-history',
      redirect: '/health-history/histories',
      name: 'Health History',
      component: HealthHistory,
      meta: {
        loginRequired: true,
        roles: roles.primary
      },
      children: [...HealthHistoryRoutes],
    },
    {
      path: '/:page',
      redirect: '/',
    },
  ]
})

router.beforeEach((to, from, next) => {
  let roles = []
  to.matched.forEach(page => {
    if (page.meta.roles)
      page.meta.roles.forEach(role => {
        let found = roles.findIndex(r => r === role)
        if (found === -1)
          roles.push(role)
      })
  })
  const hasRole = roles.length > 0 ? roles.findIndex(role => gm.hasRole(role)) !== -1 : false

  const loginRequired = to.matched.some(page => page.meta.loginRequired)

  const banLogged = to.matched.some(page => page.meta.banLogged)

  if (loginRequired && !Auth.isLogged()) {
    Auth.logoutWithoutRedirect()
    next('/sign-in')
  } else
  if (banLogged && Auth.isLogged()) {
    next('/')
  } else if (roles.length > 0 && !hasRole) {
    next('/')
  } else {
    next()
  }
})

export default router
