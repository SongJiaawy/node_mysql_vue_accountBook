import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import {sStorageGet} from '../common/storage_sj'

Vue.use(Router)
Vue.use(iView)

let routers = [{
  path: '/',
  name: 'log',
  component: resolve => require(['@/Main.vue'], resolve),
  children: [{
    path: 'main',
    name: 'main',
    component: resolve => require(['@/components/main-page.vue'], resolve)
  }, {
    path: 'wageIncome',
    name: '0-0',
    component: resolve => require(['@/components/income-grid.vue'], resolve)
  }, {
    path: 'manageIncome',
    name: '0-1',
    component: resolve => require(['@/components/income-grid.vue'], resolve)
  }, {
    path: 'otherIncome',
    name: '0-2',
    component: resolve => require(['@/components/income-grid.vue'], resolve)
  }, {
    path: 'creditExpend',
    name: '1-0',
    component: resolve => require(['@/components/expend-grid.vue'], resolve)
  }, {
    path: 'accountExpend',
    name: '1-1',
    component: resolve => require(['@/components/expend-grid.vue'], resolve)
  }, {
    path: 'manageExpend',
    name: '1-2',
    component: resolve => require(['@/components/expend-grid.vue'], resolve)
  }, {
    path: 'myAccount',
    name: '2',
    component: resolve => require(['@/components/my-account.vue'], resolve)
  }]
}, {
  path: '/login',
  name: 'login',
  component: resolve => require(['@/components/login.vue'], resolve)
}]
export const router = new Router({
  routes: routers
})
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (!sStorageGet('login') && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else if (sStorageGet('login') && to.name === 'login') {
    next({
      name: 'log'
    })
  } else {
    next()
  }
})

router.afterEach(route => {
  iView.LoadingBar.finish()
})
