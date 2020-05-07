import axios from "axios";
import router from "../../router";

export default {
  state: {
    user: {},
    token: localStorage.getItem("user-token") || ""
  },
  getters: {
    isAuthenticated: (state) => !!state.user.name,
    isHaveToken: (state) => !!state.token,
    getUserInfo: (state) => state.user
  },
  mutations: {
    // update User info
    UPDATE_USER_INFO: (state, { user }) => {
      return (state.user = user);
    },
    // update LeftBar status
    UPDATE_TOKEN: (state, { token }) => {
      return (state.token = token);
    }
  },
  actions: {
    login: async ({ commit }, payload) => {
      try {
        let response = await axios.post("http://localhost:3000/users/login", payload);
        if (response.status === 200) {
          // store user token
          localStorage.setItem("user-token", response.data.token);
          commit("UPDATE_TOKEN", response.data);
          commit("UPDATE_USER_INFO", response.data);
          axios.defaults.headers.common["Authorization"] = response.data.token;
          router.push("/home");
          return true;
        } else return false;
      } catch (error) {
        // if the request fails, remove any possible user token if possible
        localStorage.removeItem("user-token");
        return false;
      }
    },
    register: async ({ commit }, payload) => {
      try {
        let response = await axios.post("http://localhost:3000/users", payload);
        if (response.status === 200) {
          commit("UPDATE_TOKEN", response.data);
          commit("UPDATE_USER_INFO", response.data);
          return true;
        }
      } catch (error) {
        return false;
      }
    },
    validateToken: async ({ commit }) => {
      try {
        let response = await axios.get("http://localhost:3000/users/me");
        commit("UPDATE_USER_INFO", response.data);
        return true;
      } catch (error) {
        console.log("validateToken", error);
        return false;
      }
    },
    logout: async ({ commit }) => {
      try {
        let response = await axios.post("http://localhost:3000/users/me/logout");
        if (response.data.success) {
          // remove token in localStorage
          localStorage.removeItem("user-token");
          // Reset state
          let data = {
            user: {},
            token: ""
          };
          commit("UPDATE_USER_INFO", data);
          commit("UPDATE_TOKEN", data);
          router.push("/");
        }
      } catch (error) {
        return error;
      }
    },
    logoutAll: async ({ commit }) => {
      try {
        let response = await axios.post("http://localhost:3000/users/me/logoutall");
        if (response.data.success) {
          // remove token in localStorage
          localStorage.removeItem("user-token");
          // Reset state
          let data = {
            user: {},
            token: ""
          };
          commit("UPDATE_USER_INFO", data);
          commit("UPDATE_TOKEN", data);
          router.push("/");
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
