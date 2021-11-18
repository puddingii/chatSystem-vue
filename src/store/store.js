import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import login from "./modules/chat";
import chat from "./modules/chat";
Vue.use(Vuex);

const SYSTEM_ID = "SYSTEM";
const MAX_VIEW_CNT = 12;

export const store = new Vuex.Store({
    modules: {
        // login,
        chat
    }
})