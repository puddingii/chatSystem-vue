import DataManager from "./common/dataManager.js";
const dataManager = new DataManager();

/** @type {import ('vuex').ActionTree<>} */
const actions = {
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
     * @param {{loginId: string, nickname: string, avatar: string, isRemembered: boolean}} userInfo 로그인 아이디, 닉네임, 아바타, 정보를 기억할지의 Boolean값을 담은 Object
     */
    async checkAndSaveUserInfo(_, userInfo) {
        const { loginId, isRemembered } = userInfo;
        try {
            if(isRemembered) {
                const isError = await dataManager.saveUserInfo(userInfo);
                if(isError) {
                    throw new Error("[DB] 에러");
                }
            }
            const isError = await dataManager.saveLoginLog(loginId, isRemembered);
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
