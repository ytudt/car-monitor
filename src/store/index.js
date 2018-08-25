import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {
  token: '',
  userInfo: {},
  configList: [],
};

const mutations = {
  'UPDATE_USERINFO'(state, userInfo) {
    state.userInfo = userInfo;
  },
  'UPDATE_CONFIG'(state, configList){
    state.configList = configList;
  },
};

const actions = {
  updateToken({commit}, params = {}) {
    commit('UPDATE_PARAMS', params);
  },
  updateUserInfo({commit}, params = {}) {
    commit('UPDATE_USERINFO', params);
  },
  updateConfig({commit}, configList){
    commit('UPDATE_CONFIG', configList);
  },
};

const getters = {
  globalParams(state) {
    return state;
  },
};
const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
});
export default store;
