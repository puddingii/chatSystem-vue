import Vue from "vue";
import Vuex from "vuex";
import chatApp from "./modules/chatApp";
Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        chatApp
    }
})