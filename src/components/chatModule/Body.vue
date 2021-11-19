<template>
    <div ref="chatBoard" class="card-body chatBoard">
        <ul class="chatBoardUl">
            <li :class="logOwner(log)" v-for="(log, index) in this.chatLogs" :key="index" class="chatLogForm">
                <div v-if="logOwner(log) === 'myLog'" class="logForm">
                    <div class="myLogBorder border rounded">{{log.value}}</div>
                </div>
                <span v-else-if="logOwner(log) === 'systemLog'" class="systemChatLog border rounded">System - {{log.value}}</span>
                <div class="anotherUserLogForm" v-else>
                    <img :src="log.avatar" class="avatarImg border rounded-circle">
                        {{log.nickname}}
                    <div class="d-flex">
                        <div class="anotherChatLog border rounded logForm">{{log.value}}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("chat");

export default {
    updated() {
        this.$refs.chatBoard.scrollTop = this.$refs.chatBoard.scrollHeight - this.$refs.chatBoard.clientHeight;
    },
    computed: {
        ...mapState(["chatLogs", "nickname"])
    },
    methods: {
        /**
         * 유저 정보에서 닉네임을 가져와서 클래스 이름을 반환하는 함수
         * 
         * @param {object} userInfo 유저정보를 담고 있는 객체
         * @returns {string} 닉네임에 따른 클래스 지정
         */
        logOwner(userInfo) {
            if(userInfo.nickname === this.nickname) 
                return "myLog";
            else if(userInfo.nickname === "SYSTEM")
                return "systemLog";
            else
                return "anotherUserLog";
        }
    }
}
</script>

<style scoped>
.chatBoard {
    overflow-y: scroll;
    padding-left: 5px;
    padding-bottom: 0px;
}

.chatBoardUl {
    padding-left: 10px;
}

.avatarImg {
    width: 20px;
    height: 20px;
}

.logForm {
    max-width: 230px;
    padding: 3px;
}

.systemLog {
    text-align: center;
    color:green;
}

.myLog {
    display: flex;
    justify-content: right;
}

.myLogBorder {
    background-color: #fdfda9;
}

.anotherUserLog {
    text-align: left;
    max-width: 230px;
}

.chatLogForm {
    margin-bottom: 10px;
    list-style-type: none;
}

.rounded {
    padding: 2px;
}
</style>