import ENV from "../../config";

const SYSTEM_ID = "SYSTEM";
const MAX_VIEW_CNT = 12;

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
    toastContainer: null,
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
    toastContainer(state) {
        return state.toastContainer;
    },
    cntAlertMsg(state) {
        return state.alertMsg.length;
    }
}

const mutations = {
    initToastContainer(state, container) {
        state.toastContainer = container;
    },
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
    updateAndShowAlert(state, addedToast) {
        const bsToast = new bootstrap.Toast(addedToast);
        state.bootstrapToasts.push(bsToast);

        if(state.bootstrapToasts.length > MAX_VIEW_CNT) {
            for(let i = 0; i < state.bootstrapToasts.length - MAX_VIEW_CNT; i++)
                state.bootstrapToasts[i].hide();
        }
        bsToast.show();
    },
    deleteToast(state, index) {
        state.bootstrapToasts[index].hide();
    },
    exitRoom(state) {
        state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "안녕히 가세요!"});
        state.socket.disconnect();
    },
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
                case "rcvSystemMsg":
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
                case "rcvRoomOut":
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
                case "rcvPlayLikeAni":
                    state.cntLikes++;
                    break;
                case "rcvAlertMsg":
                    const { msg } = packet;
                    state.alertMsg.push(msg);
                    break;
            }
        });
    },
    sendMsg(state, userInfo) {
        const packet = {
            cmd: "sendChatMsg",
            msg: userInfo.value
        }
        state.socket.emit("message", packet);
        state.chatLogs.push(userInfo);
    },
    sendLike(state) {
        state.socket.emit("message", { cmd: "sendLike" })
    },
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
    setUserInfo(state, userInfo) {
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
    enterRoom({ commit, rootGetters }) {
        commit("setUserInfo", { loginId: rootGetters.loginId, nickname: rootGetters.nickname, avatar: rootGetters.avatar });
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