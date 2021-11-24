<template>
    <main class="form-signin">
        <div>
            <img class="mb-4 border rounded-circle" alt="Your Avatar Image" :src="avatar" width="72" height="72">
            <h1 class="h3 mb-3 fw-normal">로그인</h1>
            <h3 class="mb-3 errorMsg"></h3>
            <div class="form-floating">
                <input class="form-control" id="floatingId" type="text" name="loginId" placeholder="Login Id" v-model="loginId" />
                <label for="floatingId">아이디</label>
            </div>
            <div class="form-floating">
                <input class="form-control" id="floatingNick" type="text" name="nickname" placeholder="Nickname" v-model="nickname" />
                <label for="floatingNick">닉네임</label>
            </div>
            <div class="form-floating">
                <input class="form-control" id="floatingAvatar" type="text" name="avatarLink" placeholder="Avatar Link" v-model="avatar" />
                <label for="floatingAvatar">아바타 URL</label>
            </div>
            <div class="checkbox mb-3">
                <label>
                    <input v-model="isRemembered" type="checkbox"> 유저 기억하기
                </label>
            </div>
            <router-link tag="button" to="/" @click.native="handleJoinClick({ loginId, nickname, avatar, isRemembered })" class="w-100 btn btn-lg btn-primary" type="button">참여하기</router-link>
        </div>
        <p class="mt-5 mb-3 text-muted">&copy; GeonYeong</p>
    </main>
</template>

<script>
export default {
    name: "Login",
    data() {
        return {
            loginId: "",
            nickname: "",
            avatar: "",
            isRemembered: false
        }
    },
    async beforeCreate() {
        // 사용자 정보가 저장되어 있는 상태라면 처음 로그인 창 Input에 불러온다.
        await this.$store.dispatch("login/loadAndInitUserInfo");
        this.loginId = this.$store.state.loginId;
        this.nickname = this.$store.state.nickname;
        this.avatar = this.$store.state.avatar;
        if(this.$store.state.loginId) {
            this.isRemembered = true;
        }
    },
    methods: {
        /**
         * 로그인을 하면 유저아이디를 store에 저장하고 채팅방에 참여한다.
         *
         * @param {object} dataInfo 유저정보(id, nickname, avatar)
         */
        handleJoinClick(dataInfo) {
            this.$store.commit("initUserInfo", dataInfo);
            this.$store.dispatch("login/checkAndSaveUserInfo", dataInfo);
            this.$store.dispatch("chat/enterRoom");
        }
    }
}
</script>

<style scoped>
.form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .checkbox {
    font-weight: 400;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[name="loginPassword2"] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.errorMsg {
    font-size: 15px;
    color: red;
}
</style>
