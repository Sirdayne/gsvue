const QuestionsList = () => import('@/pages/health-history/questions/table')
const QuestionsCreate = () => import('@/pages/health-history/questions/create')
const CategoriesList = () => import('@/pages/health-history/categories/table')
const CategoriesCreate = () => import('@/pages/health-history/categories/create')
const HistoriesList = () => import('@/pages/health-history/questionnaires')
const HistoriesCreate = () => import('@/pages/health-history/questionnaires/create')
const HistoriesEdit = () => import('@/pages/health-history/questionnaires/edit')

module.exports = [
  {
    path: 'categories/list',
    component: CategoriesList,
    meta: {
      title: 'Categories list'
    },
  },
  {
    path: 'categories/create',
    component: CategoriesCreate,
    meta: {
      title: 'Create category'
    },
  },
  {
    path: 'questions/list',
    component: QuestionsList,
    meta: {
      title: 'Questions list'
    },
  },
  {
    path: 'questions/create',
    component: QuestionsCreate,
    meta: {
      title: 'Create question'
    },
  },
  {
    path: 'questionnaires/list',
    component: HistoriesList,
    meta: {
      title: 'Questionnaires list'
    },
  },
  {
    path: 'questionnaires/create',
    component: HistoriesCreate,
    meta: {
      title: 'Fill in questionnaire'
    },
  },
  {
    path: 'questionnaires/edit',
    component: HistoriesEdit,
    meta: {
      title: 'Edit questionnaire'
    },
  },
  {
    path: ':page',
    redirect: 'questionnaires/list',
  },
]
