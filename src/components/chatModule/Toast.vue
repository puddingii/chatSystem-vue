<template>
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
</template>

<script>
export default {

}
</script>