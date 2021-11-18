import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import chat from "./modules/chat";
Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        chat
    },
    state: {
        loginId: "",
        nickname: "",
        avatar: ""
    },
    getters: {
        loginId(state) {
            return state.loginId;
        },
        nickname(state) {
            return state.nickname;
        },
        avatar(state) {
            return state.avatar;
        }
    },
    mutations: {
        initUserInfo(state, userInfo) {
            const { loginId, nickname, avatar } = userInfo;
            state.loginId = loginId;
            state.nickname = nickname;
            state.avatar = avatar;
        }
    }
})