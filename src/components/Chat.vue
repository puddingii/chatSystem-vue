<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader></ChatHeader>
            <ChatBody></ChatBody>
            <ChatInput></ChatInput>
            <ChatFooter></ChatFooter>
            <ChatToast></ChatToast>
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