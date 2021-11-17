<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader @onClickAlert="onClickAlert" @onClickLike="sendLike" @onClickExit="onClickExit"></ChatHeader>
            <ChatBody></ChatBody>
            <ChatInput @onClickSend="sendChat"></ChatInput>
            <ChatFooter></ChatFooter>
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast-container" ref="toastContainer">
                    <div v-for="(toast, index) in this.$store.state.alertMsg" :key="index" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                {{toast}}
                            </div>
                            <button @click="onCloseToast(index)" type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
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
        onClickExit() {
            this.$store.commit("exitRoom");
            this.$router.push("/login");
        },
        onClickAlert() {
            const toasts = this.$refs.toastContainer.querySelectorAll(".toast");
            toasts.forEach((toast) => {
                const toa = new bootstrap.Toast(toast);
                toa.show();
            });
        },
        onCloseToast(index) {
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