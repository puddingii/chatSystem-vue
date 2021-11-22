import { getUserInfo } from "./common/storage";

const actions = {
    loadAndSaveUserInfo({ commit }) {
        const userInfo = getUserInfo();
        if(userInfo.chkRemember) {
            commit("initUserInfo", userInfo, { root: true });
        }
    }
}

export default {
    namespaced: true,
    actions
}