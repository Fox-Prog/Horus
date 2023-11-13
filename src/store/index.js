import { createStore } from "vuex";

export default createStore({
  state: {
    lines: [],
  },
  getters: {},
  mutations: {
    addLine(state, line) {
      state.lines.push(line);
    },
    removeLine(state, line) {
      state.lines.splice(line, 1);
    },
  },
  actions: {
    addLine({ commit }, line) {
      commit("addLine", line);
    },
    removeLine({ commit }, line) {
      commit("removeLine", line);
    },
  },
  modules: {},
});
