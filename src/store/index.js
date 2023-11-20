import { createStore } from "vuex";

export default createStore({
  state: {
    lines: [],
    forms: [{ id: 0, status: false }],
  },
  getters: {},
  mutations: {
    addLine(state, line) {
      state.lines.push(line);
    },
    removeLine(state, line) {
      state.lines.splice(line, 1);
    },

    addForm(state, form) {
      state.forms.push(form);
    },
    updateForm(state, data) {
      const index = state.forms.findIndex((f) => f.id === data.id);
      if (index !== -1) {
        state.forms[index] = data;
      }
    },
    removeForm(state, form) {
      state.forms.splice(form, 1);
    },
  },
  actions: {
    addLine({ commit }, line) {
      commit("addLine", line);
    },
    removeLine({ commit }, line) {
      commit("removeLine", line);
    },

    addForm({ commit }, form) {
      commit("addForm", form);
    },
    updateForm({ commit }, data) {
      commit("updateForm", data);
    },
    removeForm({ commit }, form) {
      commit("removeForm", form);
    },
  },
  modules: {},
});
