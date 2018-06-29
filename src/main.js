// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App'
import {router} from './router'
import axios from 'axios'
import store from './store'
import {sStorageGet} from './common/storage_sj'

Vue.use(iView, axios)
axios.interceptors.request.use(function (config) {
  config.headers['x-access-token'] = sStorageGet('Token')
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
