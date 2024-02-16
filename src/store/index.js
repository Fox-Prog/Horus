import { createStore } from "vuex";

export default createStore({
  state: {
    lines: [],
    clients: [],
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
  },
  modules: {},
});
