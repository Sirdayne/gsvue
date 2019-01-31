// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'

import 'reset-css'
import './styles/css/material-design-iconic-font.min.css'

import Buefy from 'buefy'
import './styles/buefy-theme.scss'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(Buefy, { defaultIconPack: 'fa' })

import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, {
  locale
})

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import VueDragDrop from 'vue-drag-drop'
Vue.use(VueDragDrop)

import './styles/main.styl'
import './styles/fx.styl'
import './styles/ui-fixes.styl'
import './styles/media.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
