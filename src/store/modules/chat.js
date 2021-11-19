/*global io, bootstrap */
import ENV from "../../config";

const SYSTEM_ID = "SYSTEM";
const MAX_VIEW_CNT = 5;

const state = {
    loginId: "",
    nickname: "",
    avatar: "",
    socket: io.connect(ENV.SOCKET_SERVER, {
        reconnection: false,
        transports: ['websocket']
    }),
    networkStatus: false,
    chatLogs: [],
    cntLikes: 0,
    alertMsg: [],
    bootstrapToasts: [],
    showingToastIndexArr: []
}

const getters = {
    alertMsg(state) {
        return state.alertMsg;
    },
    chatLogs(state) {
        return state.chatLogs;
    },
    cntLikes(state) {
        return state.cntLikes;
    },
    networkStatus(state) {
        return state.networkStatus;
    },
    cntAlertMsg(state) {
        return state.alertMsg.length;
    }
}

const mutations = {
    /**
     * 이때까지 받았던 모든 Alert메시지를 보여준다. 다 보여져있는 상태라면 모두 다 닫고, 만약 일부만 닫힌
     * 상태라면 닫힌 메시지들을 전부 보여주게끔 한다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     */
    showAllAlertMsg(state) {
        let isAllShowed = true;
        for(let i = 0; i < state.bootstrapToasts.length; i++) {
            const toastClass = state.bootstrapToasts[i]._element.classList;
            if(!toastClass.contains("show")) {
                state.bootstrapToasts[i].show();
                isAllShowed = false;
            }
        }
        if(isAllShowed) {
            state.bootstrapToasts.forEach((toast) => {
                toast.hide();
            });
        }
    },
    /**
     * Alert메시지가 도착하면 오른쪽 아래에 메시지를 보여주는 함수
     * 만약 열려있는 메시지가 12개 이상이라면 제일 오래된 메시지를 지우고
     * 새 메시지를 보여준다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     * @param {Element} addedToast 추가할 alert 메시지
     */
    updateAndShowAlert(state, addedToast) {
        const bsToast = new bootstrap.Toast(addedToast);
        state.bootstrapToasts.push(bsToast);
        if(state.showingToastIndexArr.length > MAX_VIEW_CNT) {
            const oldToastIndex = state.showingToastIndexArr[0];
            state.showingToastIndexArr.splice(0, 1);
            state.bootstrapToasts[oldToastIndex].hide();
        }
        bsToast.show();
    },
    /**
     * Alert 메시지를 숨기는 함수
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     * @param {number} index 가리고 싶은 메시지의 위치(배열 위치)
     */
    hideToast(state, index) {
        const findIndex = state.showingToastIndexArr.findIndex(element => element === index);
        state.showingToastIndexArr.splice(findIndex, 1);
        state.bootstrapToasts[index].hide();
    },
    /**
     * 채팅방에서 나가기 위한 함수다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     */
    exitRoom(state) {
        state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "안녕히 가세요!"});
        state.socket.disconnect();
    },
    /**
     * 서버에서 오는 각종 메시지들을 읽고 처리하는 함수
     * Connect, Disconnect, Error, Message가 있으며
     * Message는 사용자의 메시지이벤트, 시스템이벤트, Alert이벤트, 좋아요버튼이벤트,
     * 강제퇴출이벤트가 있다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     */
    listenSocketEvent(state) {
        state.socket.on("connect", () => {
            state.networkStatus = true;
        });
        state.socket.on("disconnect", () => {
            if(state.socket.disconnected) {
                state.networkStatus = false;
            }
        });
        state.socket.on("error", (err) => {
            state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: `${err.msg} - 퇴장 후 다시 들어와주세요.`});
        });
        state.socket.on("message", (packet) => {
            console.log(packet);
            switch(packet.cmd) {
                case "rcvChatMsg":
                    if(packet.from.chat_name !== state.nickname) {
                        state.chatLogs.push({
                            nickname: packet.from.chat_name,
                            avatar: packet.from.mem_photo,
                            value: packet.msg
                        });
                    }
                    break;
                case "rcvSystemMsg": {
                    const splitMsg = packet.msg.split(" ");
                    const isMyEnterMsg = splitMsg[0] === state.nickname && splitMsg[3] === "입장하였습니다.";
                    if(!isMyEnterMsg) {
                        state.chatLogs.push({
                            nickname: SYSTEM_ID,
                            avatar: false,
                            value: packet.msg
                        });
                    }
                    break;
                }
                case "rcvRoomOut": {
                    const sendPacket = {
                        cmd: "reqRoomOut"
                    };
                    state.socket.emit("message", sendPacket, (ack) => {
                        if(ack.success === "y") {
                            state.networkStatus = false;
                            state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "연결 강제해제. 퇴장 후 다시 입장하세요"});
                        } else {
                            state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "연결해제 에러!"});
                        }
                    });
                    break;
                }
                case "rcvPlayLikeAni":
                    state.cntLikes++;
                    break;
                case "rcvAlertMsg": {
                    const { msg } = packet;
                    state.showingToastIndexArr.push(state.alertMsg.length);
                    state.alertMsg.push(msg);
                    break;
                }
            }
        });
    },
    /**
     * 메시지를 보낼 때 사용하는 함수로 서버에 패킷을 보내고
     * 채팅로그에 남기기 위해 배열에 Push하는 함수
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     * @param {object} userInfo 유저정보를 담고 있는 객체 
     */
    sendMsg(state, userInfo) {
        const packet = {
            cmd: "sendChatMsg",
            msg: userInfo.value
        }
        state.socket.emit("message", packet);
        state.chatLogs.push(userInfo);
    },
    /**
     * 좋아요버튼 이벤트를 발생시키기 위해 서버에 패킷을 보내는 함수
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     */
    sendLike(state) {
        state.socket.emit("message", { cmd: "sendLike" })
    },
    /**
     * 방에 들어가기 위한 함수로 소켓연결이 끊겨있다면 연결시켜주고
     * 유저정보가 담긴 패킷을 서버로 보낸다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     */
    sendEnterPacket(state) {
        if(state.socket.disconnected) {
            state.socket.connect();
        }
        const packet = {
            cmd: "reqRoomEnter",
            mem_id: state.loginId,
            chat_name: state.nickname,
            mem_photo: state.avatar
        };
        state.socket.emit("message", packet, (ack) => {
            if(ack.success === "n") {
                state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "방 입장 실패!"});
            }
        });
    },
    /**
     * 유저정보를 state 객체에 저장하고, 다른 변수들을 초기화 시킨다.
     * 
     * @param {object} state 지역 변수를 담고 있는 객체
     * @param {object} userInfo 유저정보를 담고 있는 객체
     */
    initRoomInfo(state, userInfo) {
        const { loginId, nickname, avatar } = userInfo;
        state.chatLogs = [];
        state.cntLikes = 0;
        state.alertMsg = [];
        state.bootstrapToasts = [];
        state.loginId = loginId;
        state.nickname = nickname;
        state.avatar = avatar;
    }
}

const actions = {
    /**
     * 방에 들어가기 위해 유저 정보를 저장하고, 저장한 유저정보로 채팅방에 접속한다.
     * 
     * @param {object} { commit, rootGetters } root의 Getter함수와 지역 상태의 mutations
     */
    enterRoom({ commit, rootGetters }) {
        commit("initRoomInfo", { loginId: rootGetters.loginId, nickname: rootGetters.nickname, avatar: rootGetters.avatar });
        commit("sendEnterPacket");
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}