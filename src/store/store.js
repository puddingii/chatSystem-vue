import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import chat from "./modules/chat";
import { saveUserInfo, getUserInfo } from "./modules/common/storage";
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
        /**
         * 유저정보를 저장한다.
         * 
         * @param {object} state 지역 변수를 담고 있는 객체
         * @param {object} userInfo 유저정보(id, nickname, avatar)
         */
        initUserInfo(state, userInfo) {
            const { loginId, nickname, avatar, chkRemember } = userInfo;
            state.loginId = loginId;
            state.nickname = nickname;
            state.avatar = avatar;
            if(chkRemember) {
                saveUserInfo(userInfo);
            } else {
                saveUserInfo();
            }
        },
        loadUserInfo(state) {
            const userInfo = getUserInfo();
            if(userInfo.chkRemember) {
                const { loginId, nickname, avatar } = userInfo;
                state.loginId = loginId;
                state.nickname = nickname;
                state.avatar = avatar;
            }
        }
    }
})