<template>
    <main class="form-signin">
        <div>
            <h1 class="h3 mb-3 fw-normal">Login</h1>
            <h3 class="mb-3 errorMsg"></h3>
            <div class="form-floating">
                <input class="form-control" id="floatingId" type="text" name="loginId" placeholder="Login Id" v-model="loginId" />
                <label for="floatingId">Id</label>
            </div>
            <div class="form-floating">
                <input class="form-control" id="floatingNick" type="text" name="nickname" placeholder="Nickname" v-model="nickname" />
                <label for="floatingNick">Nickname</label>
            </div>
            <div class="form-floating">
                <input class="form-control" id="floatingAvatar" type="text" name="avatarLink" placeholder="Avatar Link" v-model="avatar" />
                <label for="floatingAvatar">Avatar</label>
            </div>
            <router-link to="/" @click.native="onClickButton({ loginId, nickname, avatar })" class="w-100 btn btn-lg btn-primary" type="button">Join</router-link>
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
            avatar: ""
        }
    },
    methods: {
        onClickButton(dataInfo) {
            this.$store.commit("chat/enterRoom", dataInfo);
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

button {
    margin-top: 10px;
}

</style>