import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import ENV from "../config";
Vue.use(Vuex);

const SYSTEM_ID = "SYSTEM";
const MAX_VIEW_CNT = 3;

export const store = new Vuex.Store({
    state: {
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
        toastContainer: null,
        bootstrapToasts: [],
        startCnt: 0
    },
    getters: {
        getCountLog(state) {
            return state.chatLogs.length;
        }
    },
    mutations: {
        initToastContainer(state, container) {
            state.toastContainer = container;
        },
        showAllAlertMsg(state) {
            for(let i = 0; i < state.bootstrapToasts.length; i++) {
                const toastClass = state.bootstrapToasts[i]._element.classList;
                if(!toastClass.contains("show")) {
                    state.bootstrapToasts.forEach((toast) => {
                        toast.show();
                    });
                    return;
                }
            }
            state.bootstrapToasts.forEach((toast) => {
                toast.hide();
            });
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
        enterRoom(state) {
            const packet = {
                cmd: "reqRoomEnter",
                mem_id: state.loginId,
                chat_name: state.nickname,
                mem_photo: state.avatar
            };
            state.socket.emit("message", packet, (ack) => {
                if(ack.success === "n") {
                    state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "Failed to send message!"});
                }
            });
        },
        exitRoom(state) {
            state.socket.disconnect();
        },
        listenSocketEvent(state) {
            state.socket.on("connect", () => {
                state.networkStatus = true;
            });
            state.socket.on("disconnect", (reason) => {
                state.socket.connect();
                if(state.socket.disconnected) {
                    this.networkStatus = false;
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
                            }
                            else {
                                state.chatLogs.push({ nickname: SYSTEM_ID, avatar: false, value: "Failed to room out!"});
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
            /* 임시 테스트 */
            // fetch("https://devsol6.club5678.com:6666/sendalert/user/test1", {
            //     method: "POST",
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ "msg": userInfo.value })
            // });
            state.alertMsg.push(userInfo.value);
        },
        sendLike(state) {
            state.socket.emit("message", { cmd: "sendLike" })
        },
        onJoinButton(state, userInfo) {
            const { loginId, nickname, avatar } = userInfo;
            state.loginId = loginId;
            state.nickname = nickname;
            state.avatar = avatar;
        }
    },
    actions: {
    }
})