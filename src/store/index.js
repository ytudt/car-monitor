import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {
  token: '',
  userInfo: {},
};

const mutations = {
  'UPDATE_USERINFO'(state, userInfo) {
    state.userInfo = userInfo;
  },
};

const actions = {
  updateToken({commit}, params = {}) {
    commit('UPDATE_PARAMS', params);
  },
  updateUserInfo({commit}, params = {}) {
    commit('UPDATE_USERINFO', params);
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
