<template>
    <div class="container">
        <div class="card chatForm">
            <ChatHeader></ChatHeader>
            <ChatBody></ChatBody>
            <ChatInput></ChatInput>
            <ChatFooter/>
            <ChatToast></ChatToast>
        </div>
    </div>
</template>

<script>
import ChatHeader from "./ChatComponents/Header.vue";
import ChatBody from "./ChatComponents/Body.vue";
import ChatInput from "./ChatComponents/Input.vue";
import ChatFooter from "./ChatComponents/Footer.vue";
import ChatToast from "./ChatComponents/Toast.vue";

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