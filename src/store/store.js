import Vue from "vue";
import Vuex from "vuex";
import "regenerator-runtime";

import ENV from "../config";
Vue.use(Vuex);

const SYSTEM_ID = "SYSTEM"

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
        chatLogs: []
    },
    getters: {
        getCountLog(state) {
            return state.chatLogs.length;
        }
    },
    mutations: {
        enterRoom(state) {
            const packet = {
                cmd: "reqRoomEnter",
                mem_id: state.loginId,
                chat_name: state.nickname,
                mem_photo: state.avatar
            };
            state.socket.emit("message", packet, (ack) => {
                if(ack.success === "n") {
                    state.chatLogs.push({ loginId: SYSTEM_ID, avatar: false, value: "Failed to send message!"});
                }
            });
        },
        exitRoom(state) {
            state.socket.disconnect();
        },
        listenSocketEvent(state ) {
            state.socket.on("connect", () => {
                state.networkStatus = true;
                console.log(`Socket connection : ${state.networkStatus}`);
            });
            state.socket.on("disconnect", (reason) => {
                state.socket.connect();
                console.log(state.socket.disconnected, reason)
                console.log(`Socket is disconnected : ${state.networkStatus}`);
            });
            state.socket.on("error", (err) => {
                state.chatLogs.push({ loginId: SYSTEM_ID, avatar: false, value: `${err.msg} - 퇴장 후 다시 들어와주세요.`});
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
                                state.chatLogs.push({ loginId: SYSTEM_ID, avatar: false, value: "Failed to room out!"});
                            }
                        });
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