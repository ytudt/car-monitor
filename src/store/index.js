import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {};

const actions = {};

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
