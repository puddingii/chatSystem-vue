<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader @onClickAlert="showAllAlertMsg" @onClickLike="sendLike" @onClickExit="exitRoom"></ChatHeader>
            <ChatBody></ChatBody>
            <ChatInput @onClickSend="sendChat"></ChatInput>
            <ChatFooter></ChatFooter>
            <ChatToast @onCloseToast="deleteToast" @updatedAlertMsg="updateAndShowAlert"></ChatToast>
        </div>
    </div>
</template>

<script>
import ChatHeader from "./chatModule/Header.vue";
import ChatBody from "./chatModule/Body.vue";
import ChatInput from "./chatModule/Input.vue";
import ChatFooter from "./chatModule/Footer.vue";
import ChatToast from "./chatModule/Toast.vue";

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
        exitRoom() {
            this.$store.commit("exitRoom");
            this.$router.push("/login");
        },
        showAllAlertMsg() {
            this.$store.commit("showAllAlertMsg");
        },
        deleteToast(index) {
            this.$store.commit("deleteToast", index);
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
        updateAndShowAlert(addedToast) {
            this.$store.commit("updateAndShowAlert", addedToast);
        }
    },
    components: {
        ChatHeader,
        ChatBody,
        ChatInput,
        ChatFooter,
        ChatToast
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