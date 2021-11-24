<template>
    <div class="card-header">
        <div class="row">
            <router-link @click.native="handleExitClick" to="login" tag="button" class="btn btn-danger col-2">퇴장</router-link>
            <ul class="list-group col-10 netStatus">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        네트워크 상태
                        <span class="badge bg-primary rounded-pill">{{ this.isNetworkConnected ? "On" : "Off" }}</span>
                    </div>
                    <div>
                        <button class="btn btn-outline-primary position-relative likeBtn" @click="handleLikeClick">
                            👍
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
                                {{ this.likeCount }}
                                <span class="visually-hidden">Likes</span>
                            </span>
                        </button>
                        <button ref="alertBtn" type="button" data-bs-toggle="popover" class="btn btn-outline-primary position-relative"
                        title="Alert message" data-bs-content="And here's some amazing content. It's very engaging. Right?"
                        data-bs-trigger="hover focus" @click="handleAlertClick">
                            ✉️
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
                                {{ this.alertMessageCount }}
                                <span class="visually-hidden">Likes</span>
                            </span>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers("chat");

export default {
    computed: {
        ...mapState(["likeCount", "isNetworkConnected"]),
        ...mapGetters(["alertMessageCount"])
    },
    methods: {
        ...mapMutations({
            handleExitClick: "exitRoom",
            handleLikeClick: "sendLike",
            handleAlertClick: "showAllAlertMessagess"
        })
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

.likeBtn{
    margin-right: 5px;
}
</style>
