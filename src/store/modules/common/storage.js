export const getUserInfo = () => {
    const userInfo = localStorage.getItem("userInfo");
    return JSON.parse(userInfo);
};

export const saveUserInfo = (userInfo = { loginId: false }) => {
    const toString = JSON.stringify(userInfo);
    localStorage.setItem("userInfo", toString);
}