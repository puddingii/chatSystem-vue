<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader @onClickExit="onClickExit"></ChatHeader>
            <ChatBody></ChatBody>
            <div class="input-group">
                <input type="text" @keydown.enter="sendChat()" v-model="chatValue" class="form-control" placeholder="Chat Input" aria-describedby="btnGroupAddon">
                <button @click="sendChat()" class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
                <button @click="sendLike()" class="input-group-text btn btn-danger" id="btnGroupAddon">👍</button>
            </div>
            <div class="card-footer text-muted">@ GeonYeong</div>
        </div>
    </div>
</template>

<script>
import ChatHeader from "./chatModule/Header.vue";
import ChatBody from "./chatModule/Body.vue";

export default {
    name: "Chat",
    data() {
        return {
            chatValue: ""
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
        },
        sendLike() {
            this.$store.commit("sendLike");
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
    components: {
        ChatHeader,
        ChatBody
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
</style>