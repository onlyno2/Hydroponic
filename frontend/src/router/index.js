import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Tracking from "../views/Tracking.vue";
import Device from "../views/Device.vue";
import Welcome from "../views/Welcome.vue";
import store from "../store";

Vue.use(VueRouter);

const ifNotAuthenticated = (to, from, next) => {
  if (store.getters.isHaveToken) {
    store.dispatch("validateToken").then(() => {
      if (store.getters.isAuthenticated) {
        next();
        return;
      } else next("/");
    });
  } else next("/");
};

const ifAuthenticated = async (to, from, next) => {
  if (store.getters.isHaveToken) {
    store.dispatch("validateToken").then(() => {
      if (!store.getters.isAuthenticated) {
        next();
        return;
      } else next("/home");
    });
  } else next();
};

const routes = [
  {
    path: "/",
    name: "Welcome",
    component: Welcome,
    beforeEnter: ifAuthenticated
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/tracking",
    name: "Tracking",
    component: Tracking,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/device",
    name: "Device",
    component: Device,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
    // beforeEnter: ifNotAuthenticated
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
    // beforeEnter: ifNotAuthenticated
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
