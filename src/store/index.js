import Vue from 'vue'
import Vuex from 'vuex'
import gm from '@/services/GlobalMethods'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    userLoading: true,
    clinicsLoading: true,
    logged: false,
    userInfo: null,
    tenant: null,
    clinics: [],
    navbar: true,
    //entities
    doctors: [],
    clients: [],
    operatories: [],
    appointments: [],
    schedule: [],
    questions: [],
    questionCategories: []
  },
  getters: {
    getEntity: (state) => entity => {
      entity = entity.toLowerCase()
      let result = gm.deepClone(state[entity])
      return result
    },
    getUserLoading: (state) => {
      return state.userLoading;
    },
    getClinicsLoading: (state) => {
      return state.clinicsLoading;
    },
    getLogged: (state) => {
      return state.logged;
    },
    getUserInfo: (state) => {
      return state.userInfo;
    },
    getClinics: (state) => {
      return state.clinics;
    },
    getTenant: (state) => {
      return state.tenant;
    },
    getNavbar: (state) => {
      return state.navbar
    }
  },
  mutations: {
    setEntity: (state, payload) => {
      payload.state = payload.state.toLowerCase()
      state[payload.state] = payload.data
    },
    setUserLoading: (state, payload) => {
      state.userLoading = payload;
    },
    setClinicsLoading: (state, payload) => {
      state.clinicsLoading = payload;
    },
    setLogged: (state, payload) => {
      state.logged = payload;
    },
    setUserInfo: (state, payload) => {
      state.userInfo = payload;
    },
    setClinics: (state, payload) => {
      state.clinics = payload;
    },
    setTenant: (state, payload) => {
      state.tenant = payload;
    },
    setNavbar: (state, payload) => {
      state.navbar = payload
    }
  },
  actions: {
    actionSetEntity: ({commit}, payload) => {
      commit("setEntity", {
        state: payload.state,
        data: payload.data
      })
    },
    actionSetUserLoading: ({commit}, payload) => {
      commit('setUserLoading', payload);
    },
    actionSetClinicsLoading: ({commit}, payload) => {
      commit('setClinicsLoading', payload);
    },
    actionSetLogged: ({commit}, payload) => {
      commit('setLogged', payload);
    },
    actionSetUserInfo: ({commit}, payload) => {
      commit('setUserInfo', payload);
    },
    actionSetClinics: ({commit}, payload) => {
      commit('setClinics', payload);
    },
    actionSetTenant: ({commit}, payload) => {
      commit('setTenant', payload);
    },
    actionSetNavbar: ({commit}, payload) => {
      commit('setNavbar', payload);
    },
  },
  modules: {

  }
});
