import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import chat from "./modules/chat";
import login from "./modules/login";
Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        chat,
        login
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
        /**
         * 유저정보를 저장한다.
         *
         * @param {object} state 지역 변수를 담고 있는 객체
         * @param {{loginId: string, nickname: string, avatar: string}} userInfo 유저정보(id, nickname, avatar)
         */
        initUserInfo(state, userInfo = { loginId: "", nickname: "", avatar: "" }) {
            const { loginId, nickname, avatar } = userInfo;
            state.loginId = loginId;
            state.nickname = nickname;
            state.avatar = avatar;
        }
    }
})
