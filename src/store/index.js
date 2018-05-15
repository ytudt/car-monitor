import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {
  token: '',
};

const actions = {
  updateToken({commit}, params = {}) {
    commit('UPDATE_PARAMS', params);
  },
};

const mutations = {};

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
