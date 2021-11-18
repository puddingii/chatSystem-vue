<template>
    <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 11" ref="toastContainer">
            <div v-for="(toast, index) in this.alertMsg" :key="index" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
                <div class="d-flex">
                    <div class="toast-body">
                        {{toast}}
                    </div>
                    <button @click="onCloseToast(index)" type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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
            beforeCntToast: 0
        }
    },
    mounted() {
        this.$store.commit("chat/initToastContainer", this.$refs.toastContainer);
    },
    updated() {
        const toasts = this.toastContainer.querySelectorAll(".toast");
        const updatedToastCnt = this.cntAlertMsg;

        if(this.beforeCntToast < updatedToastCnt) {
            const addedToast = toasts[toasts.length - 1];
            this.$store.commit("chat/updateAndShowAlert", addedToast);
        }            
        this.beforeCntToast = updatedToastCnt;
    },
    computed: {
        ...mapState(["alertMsg", "toastContainer"]),
        ...mapGetters(["cntAlertMsg"])
    },
    methods: {
        ...mapMutations({
            onCloseToast: "deleteToast"
        })
    }
}
</script>