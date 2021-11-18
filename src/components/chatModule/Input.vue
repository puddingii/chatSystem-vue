<template>
    <div class="input-group">
        <input type="text" @keydown.enter="onClickSend" v-model="chatValue" class="form-control" placeholder="Chat Input" aria-describedby="btnGroupAddon">
        <button @click="onClickSend" class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("chat");

export default {
    data() {
        return {
            chatValue: ""
        }
    },
    computed: {
        ...mapState(["nickname", "avatar"])
    },
    methods: {
        onClickSend() {
            if(this.chatValue === "" || !this.chatValue) {
                return;
            }
            const userInfo = { nickname: this.nickname, avatar: this.avatar, value: this.chatValue };
            this.$store.commit("chat/sendMsg", userInfo);
            this.chatValue = "";
        }
    }
}
</script>