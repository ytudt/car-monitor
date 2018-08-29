import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {};

function initState(state) {
  state.token = '';
  state.menuList = null;
  state.userInfo = {};
  state.configList = [];
  state.configMap = {};
}
initState(state);

const mutations = {
  'UPDATE_USERINFO'(state, userInfo) {
    state.userInfo = userInfo;
  },
  'UPDATE_CONFIG_LIST'(state, configList){
    state.configList = configList;
    configList.forEach((item) => {
      state.configMap[item.settingCode] = item;
    });
  },
  'UPDATE_CONFIG_MAP'(state, params){
    const {key, config} = params;
    state.configMap[key] = config;
    state.configList = [];
    for(let key in state.configMap){
      state.configList.push(config);
    }
  },
  'UPDATE_MENU_LIST'(state, menuList){
    state.menuList = [];
    menuList.forEach((menu) => {
      state.menuList.push(menu.id);
    });
  },
  'INIT_STATE'(state){
    initState(state);
  },
};

const actions = {
  updateToken({commit}, params = {}) {
    commit('UPDATE_PARAMS', params);
  },
  updateUserInfo({commit}, params = {}) {
    commit('UPDATE_USERINFO', params);
  },
  updateConfigList({commit}, configList){
    commit('UPDATE_CONFIG_LIST', configList);
  },
  updateConfigMap({commit}, params = {}){
    commit('UPDATE_CONFIG_MAP', params);
  },
  updateMenulist({commit}, menuList = []){
    commit('UPDATE_MENU_LIST', menuList);
  },
  initState({commit}){
    commit('INIT_STATE');
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
