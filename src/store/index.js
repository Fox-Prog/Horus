import { createStore } from "vuex";

export default createStore({
  state: {
    lines: [],
    clients: [],
    expandStates: [],
    loader: {},
    loaderTime: 450,
    hourlyData: {},
    colorMode: "dark_mode",
    records: [],
    recStatus: "off",
  },
  getters: {},
  mutations: {
    addLine(state, line) {
      state.lines.push(line);
    },
    removeLine(state, line) {
      state.lines.splice(line, 1);
    },

    addClient(state, client) {
      state.clients.push(client);
    },
    removeClient(state, client) {
      state.clients.splice(client, 1);
    },

    setExpandState(state, data) {
      const existed = state.expandStates.find((st) => st.id === data.id);
      if (existed) {
        existed.state = data.state;
      } else {
        state.expandStates.push(data);
      }
    },

    setLoader(state, data) {
      state.loader = data;
    },

    setHourlyData(state, data) {
      state.hourlyData = data;
    },

    setColorMode(state, color) {
      state.colorMode = color;
    },

    addRecord(state, record) {
      state.records.push(record);
    },

    setRecord(state, playload) {
      const index = state.records.findIndex((c) => c.id === playload.id);
      if (index !== -1) {
        state.records[index] = playload;
      }
    },

    setRecStatus(state, status) {
      state.recStatus = status;
    },
  },
  actions: {
    addLine({ commit }, line) {
      commit("addLine", line);
    },
    removeLine({ commit }, line) {
      commit("removeLine", line);
    },

    addClient({ commit }, client) {
      commit("addClient", client);
    },
    removeClient({ commit }, client) {
      commit("removeClient", client);
    },

    setExpandState({ commit }, data) {
      commit("setExpandState", data);
    },

    setLoader({ commit }, data) {
      commit("setLoader", data);
    },

    setHourlyData({ commit }, data) {
      commit("setHourlyData", data);
    },

    setColorMode({ commit }, mode) {
      commit("setColorMode", mode);
    },

    addRecord({ commit }, record) {
      commit("addRecord", record);
    },

    setRecord({ commit }, playload) {
      commit("setRecord", playload);
    },

    setRecStatus({ commit }, status) {
      commit("setRecStatus", status);
    },
  },
  modules: {},
});
