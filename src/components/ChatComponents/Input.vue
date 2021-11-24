<template>
    <div class="input-group">
        <input type="text" @keydown.enter="handleSendClick" v-model="inputValue" class="form-control" placeholder="Chat Input" aria-describedby="btnGroupAddon">
        <button @click="handleSendClick" class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState } = createNamespacedHelpers("chat");

export default {
    data() {
        return {
            inputValue: ""
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
        handleSendClick() {
            if(this.inputValue === "" || !this.inputValue) {
                return;
            }
            this.$store.commit("chat/sendMessage", this.inputValue);
            this.inputValue = "";
        }
    }
}
</script>
