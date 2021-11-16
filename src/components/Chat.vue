<template>
    <div class="container">
        <div class="card chatForm">
            <div class="card-header">
                <div class="row">
                    <button @click="onClickExit" class="btn btn-danger col-2">퇴장</button>
                    <ul class="list-group col-10 netStatus">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                네트워크 상태
                                <span class="badge bg-primary rounded-pill">{{ this.$store.state.networkStatus ? "On" : "Off" }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div ref="chatBoard" class="card-body chatBoard">
                <ul class="chatBoardUl">
                    <li :class="chkUser(log)" v-for="log in this.$store.state.chatLogs" class="chatLogForm">
                        <div v-if="chkUser(log) === 'myLog'" class="myLogForm">
                            <div class="myLogBorder border rounded">{{log.value}}</div>
                        </div>
                        <span v-else-if="chkUser(log) === 'systemLog'" class="systemChatLog border rounded">System - {{log.value}}</span>
                        <div class="anotherUserLogForm" v-else>
                            <img :src="log.avatar" class="avatarImg border rounded-circle">
                                {{log.nickname}}
                            <div class="d-flex">
                                <div class="anotherChatLog border rounded ">{{log.value}}</div>
                            </div>
                        </div>
                        
                    </li>
                </ul>
            </div>
            <div class="input-group">
                <input type="text" @keydown.enter="sendChat()" v-model="chatValue" class="form-control" placeholder="Chat Input" aria-describedby="btnGroupAddon">
                <button @click="sendChat()" class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
            </div>
            <div class="card-footer text-muted">@ GeonYeong</div>
        </div>
    </div>
</template>

<script>
const autofocus = (element) => {
    element.scrollTop = element.scrollHeight - element.clientHeight;
};

export default {
    name: "Chat",
    data() {
        return {
            chatValue: "",
            countLog: 0
        }
    },
    beforeCreate() {
        this.$store.commit("enterRoom");
    },
    methods: {
        onClickExit() {
            this.$store.commit("exitRoom");
            this.$router.push("/login");
        },
        sendChat() {
            if(this.chatValue === "") {
                return;
            }
            const userInfo = { nickname: this.$store.state.nickname, avatar: this.$store.state.avatar, value: this.chatValue };
            this.$store.commit("sendMsg", userInfo);
            this.chatValue = "";
            autofocus(this.$refs.chatBoard);
        },
        chkUser(userInfo) {
            if(userInfo.nickname === this.$store.state.nickname) 
                return "myLog";
            else if(userInfo.nickname === "SYSTEM")
                return "systemLog";
            else
                return "anotherUserLog";
        }
    },
    computed: {
        cnt_chatLog() {
            return this.$store.getters.getCountLog;
        }
    },
    watch: {
        cnt_chatLog() {
            autofocus(this.$refs.chatBoard);
        }
    }
}
</script>

<style scoped>
.chatForm {
    width: 450px;
    height: 800px;
    align-content: center;
    margin: 0 auto;
}

.card-header {
    background-color: white;
}

.netStatus{
    padding-right:0px;
}

.chatBoard {
    overflow-y: scroll;
    padding-left: 5px;
    padding-bottom:25px;
}

.chatBoardUl {
    padding-left: 10px;
}

.avatarImg {
    width: 20px;
    height: 20px;
    margin-right: 7px;
}

li {
    list-style-type: none;
    text-align: left;
}

.systemLog {
    text-align: center;
    color:green;
}
.myLog {
    display: flex;
    justify-content: right;
}
.anotherUserLog {
    text-overflow: ellipsis;
    max-width: 230px;
}

.chatLogForm {
    margin-bottom: 10px;
}

.myLogForm {
    max-width: 230px;
    padding: 3px;
}

.myLogBorder {
    background-color: #fdfda9;
}

.rounded {
    padding: 2px;
}

textarea {
    overflow: visible;
    max-width:200px;
}
</style>