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
    recID: null,
    recValue: null,
  },
  getters: {},
  mutations: {
    // Lines
    addLine(state, line) {
      state.lines.push(line);
    },
    removeLine(state, line) {
      state.lines.splice(line, 1);
    },

    // Clients
    addClient(state, client) {
      state.clients.push(client);
    },
    removeClient(state, client) {
      state.clients.splice(client, 1);
    },

    // Expand panels
    setExpandState(state, data) {
      const existed = state.expandStates.find((st) => st.id === data.id);
      if (existed) {
        existed.state = data.state;
      } else {
        state.expandStates.push(data);
      }
    },

    // Loader
    setLoader(state, data) {
      state.loader = data;
    },

    // Set hourly
    setHourlyData(state, data) {
      state.hourlyData = data;
    },

    // Color
    setColorMode(state, color) {
      state.colorMode = color;
    },

    // Records
    addRecord(state, record) {
      state.records.push(record);
    },
    setRecord(state, playload) {
      const index = state.records.findIndex((c) => c.id === playload.id);
      if (index !== -1) {
        state.records[index] = playload;
      }
    },
    clearRecords(state) {
      state.records = [];
    },
    setRecStatus(state, status) {
      state.recStatus = status;
    },
    setRecID(state, ID) {
      state.recID = ID;
    },
    setRecValue(state, value) {
      state.recValue = value;
    },
  },
  actions: {
    // Lines
    addLine({ commit }, line) {
      commit("addLine", line);
    },
    removeLine({ commit }, line) {
      commit("removeLine", line);
    },

    // Clients
    addClient({ commit }, client) {
      commit("addClient", client);
    },
    removeClient({ commit }, client) {
      commit("removeClient", client);
    },

    // Expand panels
    setExpandState({ commit }, data) {
      commit("setExpandState", data);
    },

    // Loader
    setLoader({ commit }, data) {
      commit("setLoader", data);
    },

    // Set hourly
    setHourlyData({ commit }, data) {
      commit("setHourlyData", data);
    },

    // Color
    setColorMode({ commit }, mode) {
      commit("setColorMode", mode);
    },

    // Records
    addRecord({ commit }, record) {
      commit("addRecord", record);
    },
    setRecord({ commit }, playload) {
      commit("setRecord", playload);
    },
    clearRecords({ commit }) {
      commit("clearRecords");
    },
    setRecStatus({ commit }, status) {
      commit("setRecStatus", status);
    },
    setRecID({ commit }, ID) {
      commit("setRecID", ID);
    },
    setRecValue({ commit }, Value) {
      commit("setRecValue", Value);
    },
  },
  modules: {},
});
