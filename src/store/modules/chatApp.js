const state = {
    loginId: "",
    nickname: "",
    avatar: ""
}

const getters = {
    getLoginId(state) {
        return state.loginId;
    },
    getNickname(state) {
        return state.nickname;
    },
    getAvatar(state) {
        return state.avatar;
    }
}

const mutations = {
    onJoinButton(state, userInfo) {
        const { loginId, nickname, avatar } = userInfo;
        state.loginId = loginId;
        state.nickname = nickname;
        state.avatar = avatar;
        console.log(state.loginId, state.nickname, state.avatar);
        console.log(this.$route)
        this.$route.push("/");
    }
}

export default {
    state,
    getters,
    mutations
}