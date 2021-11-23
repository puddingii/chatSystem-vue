import axios from "axios";

export default class DataManager {
    async getLoginLog() {
        try {
            const logResponse = await axios.post("http://localhost:4040/login-log/get");
            const { 
                data: { loginId, isRemembered },
                status
            } = logResponse;
            
            if(status !== 200) {
                throw new Error("[DB] Login Log Get 에러");
            }
            return { loginId, isRemembered, isError: false };
        } catch(e) {
            console.log(e);
            return { isError: true };
        }
    }
    async saveLoginLog(loginId, isRemembered) {
        try {
            const logResponse = await axios.post("http://localhost:4040/login-log/save", { loginId, isRemembered });
            if(logResponse.status !== 201) {
                throw new Error("[DB] Login Log Update 에러");
            }
            return { isError: false };
        } catch(e) {
            console.log(e);
            return { isError: true };
        }
    }
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
            return { isError: true };
        }
    }
    async saveUserInfo(userInfo) {
        try {
            const userResponse = await axios.post("http://localhost:4040/user/update", userInfo);
            if(userResponse.status !== 201) {
                throw new Error("[DB] User Update 에러");
            }
            return { isError: false };
        } catch(e) {
            console.log(e);
            return { isError: true };
        }
    }
}