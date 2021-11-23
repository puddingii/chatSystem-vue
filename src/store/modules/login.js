import { getUserInfo, saveUserInfo } from "./common/storage";
import axios from "axios";

const actions = {
    async loadAndInitUserInfo({ commit }) {
        const { loginId } = getUserInfo();
        try {
            if(loginId) {
                const response = await axios.post("http://localhost:4040/user/get", { loginId });
                if(response.status === 200) {
                    const { 
                        data: { userInfo } 
                    } = response; 
                    commit("initUserInfo", userInfo, { root: true });
                } else {
                    throw new Error("DB Get 에러");
                }
            } else {
                commit("initUserInfo", undefined, { root: true });
            }
        } catch(e) {
            console.log(e);
        }
    },
    async checkAndSaveUserInfo({}, userInfo) {
        const { chkRemember } = userInfo;
        try {
            if(chkRemember) {
                saveUserInfo({ loginId: userInfo.loginId });
                const response = await axios.post("http://localhost:4040/user/update", userInfo);
                if(response.status !== 201) {
                    throw new Error("DB Update 에러");
                }
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