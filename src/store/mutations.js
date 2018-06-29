import axios from 'axios'
import {sStorageSet} from '../common/storage_sj'

export const getGrossAmount = (state, data) => {
  let path = '/api/total?start=' + data.start + '&end=' + data.end
  axios.get(path).then(function (res) {
    state.amount = res.data.data
  })
}
export const changeMain = (state, isMain) => {
  state.isMain = isMain
}
export const subMenu = (state) => {
  state.subMenuChange = true
}
export const changeTimeValue = (state, timeValue) => {
  state.timeValue = timeValue
}
export const getMyAccountList = (state) => {
  let path = '/api/account/list'
  axios.get(path).then(function (res) {
    state.myAccountList = res.data.data
  })
}
let incomeData = (data, state) => {
  let path = `/api/income/list?start=${data.start}&end=${data.end}&type=${data.type}`
  axios.get(path).then(function (res) {
    state.incomeData = res.data.data
  })
}
export const wageIncome = (state, date) => {
  let params = date
  params.type = 'normal'
  incomeData(params, state)
}
export const manageIncome = (state, date) => {
  let params = date
  params.type = 'money_management'
  incomeData(params, state)
}
export const otherIncome = (state, date) => {
  let params = date
  params.type = ''
  incomeData(params, state)
}
export const setUsername = (state, username) => {
  state.username = username
}
export const logOut = (state, router) => {
  sStorageSet({'login': false})
  sStorageSet({'Token': ''})
  setTimeout(() => {
    router.push({name: 'login'})
    sessionStorage.clear()
  }, 300)
}
