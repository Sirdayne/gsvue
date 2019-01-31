const List = () => import('@/pages/progress-notes/table')
const View = () => import('@/pages/progress-notes/view')
const Create = () => import('@/pages/progress-notes/create')

module.exports = [
  {
    path: 'list',
    component: List,
    meta: {
      title: 'List'
    },
  },
  {
    path: 'view/:id',
    component: View,
    meta: {
      title: 'Details'
    },
  },
  {
    path: 'create',
    component: Create,
    meta: {
      title: 'Create'
    },
  },
  {
    path: ':page',
    redirect: 'list',
  },
]
