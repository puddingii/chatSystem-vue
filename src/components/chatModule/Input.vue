<template>
    <div class="input-group">
        <input type="text" @keydown.enter="onClickSend" v-model="chatValue" class="form-control" placeholder="Chat Input" aria-describedby="btnGroupAddon">
        <button @click="onClickSend" class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chatValue: ""
        }
    },
    methods: {
        onClickSend() {
            this.$emit("onClickSend", this.chatValue);
            this.chatValue = "";
        }
    }
}
</script>