<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader @onClickLike="sendLike" @onClickExit="onClickExit"></ChatHeader>
            <ChatBody></ChatBody>
            <ChatInput @onClickSend="sendChat"></ChatInput>
            <ChatFooter></ChatFooter>
        </div>
    </div>
</template>

<script>
import ChatHeader from "./chatModule/Header.vue";
import ChatBody from "./chatModule/Body.vue";
import ChatInput from "./chatModule/Input.vue";
import ChatFooter from "./chatModule/Footer.vue";

export default {
    name: "Chat",
    data() {
        return {
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
        sendChat(value) {
            if(value === "" || !value) {
                return;
            }
            const userInfo = { nickname: this.$store.state.nickname, avatar: this.$store.state.avatar, value };
            this.$store.commit("sendMsg", userInfo);
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
        ChatBody,
        ChatInput,
        ChatFooter
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