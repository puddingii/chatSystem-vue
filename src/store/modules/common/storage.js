export const getUserInfo = () => {
    let userInfo = localStorage.getItem("userInfo");
    if(!userInfo) {
        userInfo = { loginId: false };
    }
    return JSON.parse(userInfo);
};

export const saveUserInfo = (userInfo = { loginId: false }) => {
    const toString = JSON.stringify(userInfo);
    localStorage.setItem("userInfo", toString);
}