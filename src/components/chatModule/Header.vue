<template>
    <div class="card-header">
        <div class="row">
            <button @click="onClickExit" class="btn btn-danger col-2">퇴장</button>
            <ul class="list-group col-10 netStatus">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        네트워크 상태
                        <span class="badge bg-primary rounded-pill">{{ this.$store.state.networkStatus ? "On" : "Off" }}</span>
                    </div>
                    <span class="btn btn-outline-primary position-relative">
                        👍
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
                            {{ this.$store.state.cntLikes }}
                            <span class="visually-hidden">Likes</span>
                        </span>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        onClickExit() {
            this.$emit("onClickExit");
        }
    }
}
</script>

<style scoped>
.card-header {
    background-color: white;
}

.netStatus{
    padding-right:0px;
}
</style>