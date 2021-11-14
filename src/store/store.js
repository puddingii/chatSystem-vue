import Vue from "vue";
import Vuex from "vuex";
import chatApp from "./modules/chatApp";
Vue.use(Vuex);

export const store = new Vuex.Store({
    // modules: {
    //     chatApp
    // },
    state: {
        loginId: "",
        nickname: "",
        avatar: ""
    },
    mutations: {
        onJoinButton(state, userInfo) {
            const { loginId, nickname, avatar } = userInfo;
            state.loginId = loginId;
            state.nickname = nickname;
            state.avatar = avatar;
        }
    }
})