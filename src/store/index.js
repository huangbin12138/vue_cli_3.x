import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import state from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}
// Vue.use(Vuex);

const vuexPersisted = new createPersistedState({
  key: 'local',
  storage: window.localStorage,
  // 选择要存储的变量
  reducer: state => {
    let saveObj = {};
    [
    //
        'sanGuoKillList',
    ].map(key => {
      saveObj[key] = state[key];
    });
    return saveObj;
  },
});

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  plugins: [vuexPersisted]
})
