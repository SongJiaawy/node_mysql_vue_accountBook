import {sStorageSet} from '../common/storage_sj'

export const actions = {
  getInitDate ({commit, state}, data) {
    commit('getGrossAmount', data)
  },
  changeMain ({commit}, isMain) {
    sStorageSet({'isMain': isMain})
    commit('changeMain', isMain)
  },
  changeTimeValue ({commit}, timeValue) {
    commit('changeTimeValue', timeValue)
  },
  getMyAccountList ({commit}) {
    commit('getMyAccountList')
  },
  setUsername ({commit}, username) {
    commit('setUsername', username)
  },
  logOut ({commit}, router) {
    commit('logOut', router)
  },
  wageIncome ({commit}, date) {
    commit('wageIncome', date)
  },
  manageIncome ({commit}, date) {
    commit('manageIncome', date)
  },
  otherIncome ({commit}, date) {
    commit('otherIncome', date)
  }
}
