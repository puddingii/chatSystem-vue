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
        /**
         * 메시지를 보낼 때 사용하는 함수로 input값이 없으면 아무것도 하지 않는다.
         * 메시지를 보냈다면 해당 Input칸은 비워준다.
         */
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