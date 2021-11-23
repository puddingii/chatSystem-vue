import DataManager from "./common/storage.js";
const dataManager = new DataManager();

const actions = {
    /**
     * Log DB에서 최근 Loginid를 가져와서 만약 기억된 상태라면 해당 LoginId로 유저정보를 User DB에서
     * 꺼내온 뒤 Login Page의 Input을 채워준다.
     *
     * @param {import("vuex").Store} commit Vuex store의 actions인자 안에 있는 commit
     */
    async loadAndInitUserInfo({ commit }) {
        try {
            const { loginId, isRemembered, isError } = await dataManager.getLoginLog();
            if(isError) {
                throw new Error("[DB] 에러");
            }
            if(isRemembered) {
                const { isError, userInfo } = await dataManager.getUserInfo(loginId);
                if(isError) {
                    throw new Error("[DB] 에러");
                }
                commit("initUserInfo", userInfo, { root: true });
            } else {
                commit("initUserInfo", undefined, { root: true });
            }
        } catch(e) {
            console.log(e);
        }
    },
    /**
     * 만약 정보를 기억하는 boolean이 true라면 loginId를 Log DB에 저장하고 해당 정보들을 User DB에 저장하거나 업데이트한다.
     * 만약 false라면 유저 정보에 대한 값들을 공백으로 초기화시킨다.
     *
     * @param {null} null 쓰이지 않는 인자값
     * @param {object} userInfo 로그인 아이디, 닉네임, 아바타, 정보를 기억할지의 Boolean값을 담은 Object
     */
    async checkAndSaveUserInfo(_, userInfo) {
        const { loginId, chkRemember } = userInfo;
        try {
            if(chkRemember) {
                const isError = await dataManager.saveUserInfo(userInfo);
                if(isError) {
                    throw new Error("[DB] 에러");
                }
            }
            const isError = await dataManager.saveLoginLog(loginId, chkRemember);
            if(isError) {
                throw new Error("[DB] 에러");
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
