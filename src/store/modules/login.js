import { getUserInfo, saveUserInfo } from "./common/storage";
import axios from "axios";

const actions = {
    async loadAndInitUserInfo({ commit }) {
        const { loginId } = getUserInfo();
        if(loginId) {
            const response = await axios.post("http://localhost:4040/user/get", { loginId });
            if(response.status === 200) {
                const { 
                    data: { userInfo } 
                } = response; 
                commit("initUserInfo", userInfo, { root: true });
            }
        } else {
            commit("initUserInfo", undefined, { root: true });
        }
    },
    async checkAndSaveUserInfo({}, userInfo) {
        const { chkRemember } = userInfo;
        try {
            if(chkRemember) {
                saveUserInfo({ loginId: userInfo.loginId });
                await axios.post("http://localhost:4040/user/update", userInfo)
            } else {
                saveUserInfo();
            }
        } catch(e) {
            console.log(e);
        }
    }
}

export default {
    namespaced: true,
    actions
}