import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import { store } from "./store/store";
import router from "./routes";

Vue.use(VueRouter);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
