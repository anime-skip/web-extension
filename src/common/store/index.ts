import Vue from 'vue';
import Vuex from 'vuex';
import { mutations } from './mutations';
import * as actions from './actions';
import getters from './getters';
import { initialState } from './state';

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState,
  mutations,
  actions,
  getters,
});
