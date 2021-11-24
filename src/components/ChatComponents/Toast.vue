<template>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11" ref="toastContainer">
            <div v-for="(toast, index) in this.alertMessages" :key="index" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
                <div class="d-flex">
                    <div class="toast-body">
                        {{toast}}
                    </div>
                    <button @click="handleCloseClick(index)" type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers("chat");

export default {
    data() {
        return {
            beforeToastCount: 0
        }
    },
    /**
     * 컴포넌트가 업데이트 될 때마다 실행하는 함수로 만약 새로운 서버 메시지가 왔다면 오른쪽 아래에 표시해준다.
     * 지울때도 update가 실행되므로 해당 로직은 업데이트 되기 전의 서버 메시지 수와 업데이트 된 후의 수를 비교해서
     * 실행이 안되도록 설정.
     */
    updated() {
        const toasts = this.$refs.toastContainer.querySelectorAll(".toast");
        const updatedToastCount = this.alertMessageCount;

        if(this.beforeToastCount < updatedToastCount) {
            const addedToast = toasts[toasts.length - 1];
            this.$store.commit("chat/updateAndShowAlert", addedToast);
        }
        this.beforeToastCount = updatedToastCount;
    },
    computed: {
        ...mapState(["alertMessages"]),
        ...mapGetters(["alertMessageCount"])
    },
    methods: {
        ...mapMutations({
            handleCloseClick: "hideToast"
        })
    }
}
</script>

<style scoped>
.toast-body {
    word-break: break-all;
    text-align: left;
}
</style>
