/*global io, bootstrap */
import Swal from "sweetalert2";
import ENV from "../../config";

const SYSTEM_ID = "SYSTEM";
const MAX_VIEW_COUNT = 5;
let MY_ENTER_FLAG = false;

/**
 * 채팅내용을 보여주기 위한 log 추가 작업
 *
 * @param {{loginId: string, nickname: string, avatar: string, value: string}} logInfo 추가할 채팅 내용정보
 */
const addChatLogs = (logInfo) => {
    state.chatLogs.push(logInfo);
};

const state = {
    loginId: "",
    nickname: "",
    avatar: "",
    // @ts-ignore
    socket: io.connect(ENV.SOCKET_SERVER, {
        reconnection: false,
        transports: ['websocket']
    }),
    isNetworkConnected: false,
    chatLogs: new Array(),
    likeCount: 0,
    toastList: new Array(),
    bootstrapToastList: new Array(),
    showingToastList: new Array()
}

/** @type {import ('vuex').GetterTree<typeof state>} */
const getters = {
    toastList(state) {
        return state.toastList;
    },
    chatLogs(state) {
        return state.chatLogs;
    },
    likeCount(state) {
        return state.likeCount;
    },
    isNetworkConnected(state) {
        return state.isNetworkConnected;
    },
    toastCount(state) {
        return state.toastList.length;
    }
}

/** @type {import ('vuex').MutationTree<typeof state>} */
const mutations = {
    exitRoom(state) {
        addChatLogs({ loginId: SYSTEM_ID, nickname: SYSTEM_ID, avatar: "", value: "안녕히 가세요!"});
        state.socket.disconnect();
    },
    /**
     * Alert 메시지를 숨기는 함수
     *
     * @param {number} index 가리고 싶은 메시지의 위치(배열 위치)
     */
    hideToast(state, index) {
        const findIndex = state.showingToastList.findIndex(element => element === index);
        state.showingToastList.splice(findIndex, 1);
        state.bootstrapToastList[index].hide();
    },
    /**
     * 유저정보를 state 객체에 저장하고, 다른 변수들을 초기화 시킨다.
     *
     * @param {object} userInfo 유저정보를 담고 있는 객체
     */
    initRoomInfo(state, userInfo) {
        const { loginId, nickname, avatar } = userInfo;
        state.chatLogs = [];
        state.likeCount = 0;
        state.toastList = [];
        state.bootstrapToastList = [];
        state.loginId = loginId;
        state.nickname = nickname;
        state.avatar = avatar;
    },
    /**
     * 서버에서 오는 각종 메시지들을 읽고 처리하는 함수
     * Connect, Disconnect, Error, Message가 있으며
     * Message는 사용자의 메시지이벤트, 시스템이벤트, Alert이벤트, 좋아요버튼이벤트,
     * 강제퇴출이벤트가 있다.
     */
    listenSocketEvent(state) {
        state.socket.on("connect", () => {
            state.isNetworkConnected = true;
        });
        state.socket.on("disconnect", () => {
            if(state.socket.disconnected) {
                state.isNetworkConnected = false;
            }
        });
        state.socket.on("error", (err) => {
            addChatLogs({ loginId: SYSTEM_ID, nickname: SYSTEM_ID, avatar: "", value: `${err.msg} - 퇴장 후 다시 들어와주세요.`});
        });
        state.socket.on("message", (packet) => {
            switch(packet.cmd) {
                case ENV.RECEIVE_CHAT_MESSAGE:
                    if(packet.from.mem_id !== state.loginId) {
                        addChatLogs({
                          loginId: packet.from.mem_id,
                          nickname: packet.from.chat_name,
                          avatar: packet.from.mem_photo,
                          value: packet.msg
                      });
                    }
                    break;
                case ENV.RECEIVE_TOAST_MESSAGE: {
                    const { msg } = packet;
                    state.showingToastList.push(state.toastList.length);
                    state.toastList.push(msg);
                    break;
                }
                case ENV.RECEIVE_SYSTEM_MESSAGE: {
                    let isMyEnterMessage;
                    if(MY_ENTER_FLAG) {
                        MY_ENTER_FLAG = false;
                        break;
                    }
                    if(!isMyEnterMessage) {
                        addChatLogs({
                            loginId: SYSTEM_ID,
                            nickname: SYSTEM_ID,
                            avatar: "",
                            value: packet.msg
                        });
                    }
                    if(state.chatLogs.length === 1) {
                        MY_ENTER_FLAG = true;
                    }
                    break;
                }
                case ENV.RECEIVE_ROOM_OUT: {
                    const sendPacket = {
                        cmd: ENV.SEND_ROOM_OUT
                    };
                    state.socket.emit("message", sendPacket, (ack) => {
                        const log = { loginId: SYSTEM_ID, nickname: SYSTEM_ID, avatar: "", value: "" };
                        if(ack.success === "y") {
                            state.isNetworkConnected = false;
                            log.value = "연결 강제해제. 퇴장 후 다시 입장하세요";
                        } else {
                            log.value = "연결해제 에러!";
                        }
                        addChatLogs(log);
                    });
                    break;
                }
                case ENV.RECEIVE_LIKE:
                    state.likeCount++;
                    break;
                case ENV.RECEIVE_ALERT_MESSAGE: {
                    const { msg } = packet;
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    });

                    Toast.fire({
                        icon: 'info',
                        title: msg
                    })
                    break;
                }
            }
        });
    },
    /**
     * 이때까지 받았던 모든 Alert메시지를 보여준다. 다 보여져있는 상태라면 모두 다 닫고, 만약 일부만 닫힌
     * 상태라면 닫힌 메시지들을 전부 보여주게끔 한다.
     */
    showAllToasts(state) {
        let isAllShowed = true;
        for(let i = 0; i < state.bootstrapToastList.length; i++) {
            const toastClass = state.bootstrapToastList[i]._element.classList;
            if(!toastClass.contains("show")) {
                state.bootstrapToastList[i].show();
                isAllShowed = false;
            }
        }
        if(isAllShowed) {
            state.bootstrapToastList.forEach((toast) => {
                toast.hide();
            });
        }
    },
    /**
     * 메시지를 보낼 때 사용하는 함수로 서버에 패킷을 보내고
     * 채팅로그에 남기기 위해 배열에 Push하는 함수
     *
     * @param {string} inputValue 유저정보를 담고 있는 객체
     */
    sendMessage(state, inputValue) {
        const userInfo = {
          loginId: state.loginId,
          nickname: state.nickname,
          avatar: state.avatar,
          value: inputValue
        }
        const packet = {
            cmd: ENV.SEND_CHAT_MESSAGE,
            msg: userInfo.value
        }
        state.socket.emit("message", packet);
        addChatLogs(userInfo);
    },
    /**
     * 좋아요버튼 이벤트를 발생시키기 위해 서버에 패킷을 보내는 함수
     */
    sendLike(state) {
        state.socket.emit("message", { cmd: ENV.SEND_LIKE })
    },
    /**
     * 방에 들어가기 위한 함수로 소켓연결이 끊겨있다면 연결시켜주고
     * 유저정보가 담긴 패킷을 서버로 보낸다.
     */
    sendEnterPacket(state) {
        if(state.socket.disconnected) {
            state.socket.connect();
        }
        const packet = {
            cmd: ENV.SEND_ROOM_ENTER,
            mem_id: state.loginId,
            chat_name: state.nickname,
            mem_photo: state.avatar
        };
        state.socket.emit("message", packet, (ack) => {
            if(ack.success === "n") {
                addChatLogs({ loginId: SYSTEM_ID, nickname: SYSTEM_ID, avatar: "", value: "방 입장 실패!"});
            }
        });
    },
    /**
     * Alert메시지가 도착하면 오른쪽 아래에 메시지를 보여주는 함수
     * 만약 열려있는 메시지가 n개 이상이라면 제일 오래된 메시지를 지우고
     * 새 메시지를 보여준다.
     *
     * @param {Element} addedToast 추가할 alert 메시지
     */
    updateAndShowAlert(state, addedToast) {
        // @ts-ignore
        const bsToast = new bootstrap.Toast(addedToast);
        state.bootstrapToastList.push(bsToast);
        if(state.showingToastList.length > MAX_VIEW_COUNT) {
            const oldToastIndex = state.showingToastList[0];
            state.showingToastList.splice(0, 1);
            state.bootstrapToastList[oldToastIndex].hide();
        }
        bsToast.show();
    },
}

/** @type {import ('vuex').ActionTree<ReturnType <typeof state>>} */
const actions = {

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
