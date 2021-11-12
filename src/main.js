import Vue from 'vue'
import VueRouter from 'vue-router';

import App from './App.vue'
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'
import { store } from "./store/store"

Vue.use(VueRouter);
const routes = [
  { path: "/", component: Chat },
  { path: "/login", component: Login }
];

const router = new VueRouter({
  routes,
  mode: "history"
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
