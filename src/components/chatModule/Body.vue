<template>
    <div ref="chatBoard" class="card-body chatBoard">
        <ul class="chatBoardUl">
            <li :class="chkUser(log)" v-for="log in this.$store.state.chatLogs" class="chatLogForm">
                <div v-if="chkUser(log) === 'myLog'" class="logForm">
                    <div class="myLogBorder border rounded">{{log.value}}</div>
                </div>
                <span v-else-if="chkUser(log) === 'systemLog'" class="systemChatLog border rounded">System - {{log.value}}</span>
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
export default {
    data() {
        return {
        }
    },
    updated() {
        this.$refs.chatBoard.scrollTop = this.$refs.chatBoard.scrollHeight - this.$refs.chatBoard.clientHeight;
    },
    methods: {
        chkUser(userInfo) {
            if(userInfo.nickname === this.$store.state.nickname) 
                return "myLog";
            else if(userInfo.nickname === "SYSTEM")
                return "systemLog";
            else
                return "anotherUserLog";
        }
    }
}
</script>

<style>
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

li {
    list-style-type: none;
    text-align: left;
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
    max-width: 230px;
}

.chatLogForm {
    margin-bottom: 10px;
}

.rounded {
    padding: 2px;
}
</style>