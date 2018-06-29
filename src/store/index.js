import Vue from 'vue'
import Vuex from 'vuex'
import Income from './modules/Income'
import Expend from './modules/Expend'
import * as mutations from './mutations'
import {actions} from './actions'

Vue.use(Vuex)

const state = {
  amount: {
    grossAmount: {},
    expend: {},
    income: {}
  },
  isMain: true,
  timeValue: [new Date(), new Date(new Date().getTime() + 60 * 60 * 24 * 1000)],
  myAccountList: [],
  incomeData: [],
  username: ''
}
export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  modules: {
    Income,
    Expend
  }
})
