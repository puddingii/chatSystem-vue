import axios from "axios";

export default class DataManager {
    /**
     * 가장 최신 Log를 가져온다.
     *
     * @returns {(Promise<{loginId:string, isRemembered:boolean, isError:boolean}>)} Log정보, 에러유무가 들어있는 객체
     */
    async getLoginLog() {
        try {
            const logResponse = await axios.post("http://localhost:4040/login-log/get");
            const {
                data: { loginId = "", isRemembered = false },
                status
            } = logResponse;

            if(status !== 200) {
                throw new Error("[DB] Login Log Get 에러");
            }
            return { loginId, isRemembered, isError: false };
        } catch(e) {
            console.log(e);
            return { loginId: "", isRemembered: false, isError: true };
        }
    }

    /**
     * 로그를 저장하고 에러 유무를 반환한다.
     *
     * @param {string} loginId 로그인 아이디
     * @param {boolean} isRemembered 저장했는지 확인하는 값
     * @returns {Promise<boolean>} 에러 유무
     */
    async saveLoginLog(loginId, isRemembered) {
        try {
            const logResponse = await axios.post("http://localhost:4040/login-log/save", { loginId, isRemembered });
            if(logResponse.status !== 201) {
                throw new Error("[DB] Login Log Update 에러");
            }
            return false;
        } catch(e) {
            console.log(e);
            return true;
        }
    }

    /**
     * loginId에 해당하는 유저 정보를 가져와서 반환한다.
     *
     * @param {string} loginId
     * @returns {Promise<{userInfo: object, isError:boolean}>} 유저 정보와 에러 유무 반환
     */
    async getUserInfo(loginId) {
        try {
            const userResponse = await axios.post("http://localhost:4040/user/get", { loginId });
            const {
                data: { userInfo } ,
                status
            } = userResponse;
            if(status !== 200) {
                throw new Error("[DB] UserInfo Get 에러");
            }
            return { userInfo, isError: false };
        } catch(e) {
            console.log(e);
            return { userInfo: {}, isError: true };
        }
    }

    /**
     * 유저정보를 저장하고 에러 유무를 반환한다.
     *
     * @param {object} userInfo 유저정보가 들어있는 객체
     * @returns {Promise<boolean>} 에러 유무
     */
    async saveUserInfo(userInfo) {
        try {
            const userResponse = await axios.post("http://localhost:4040/user/update", userInfo);
            if(userResponse.status !== 201) {
                throw new Error("[DB] User Update 에러");
            }
            return false;
        } catch(e) {
            console.log(e);
            return true;
        }
    }
}
