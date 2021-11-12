<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <button class="btn btn-danger col-2">퇴장</button>
                    <ul class="list-group col-10 netStatus">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="">
                                네트워크 상태
                                <span class="badge bg-primary rounded-pill">On</span>
                            </div>
                            
                        </li>
                    </ul>
                </div>
            </div>
            <div class="card-body">
                <ul>
                    <li></li>
                </ul>
            </div>
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Chat Input" aria-label="Input group example" aria-describedby="btnGroupAddon">
                <button class="input-group-text btn btn-primary" id="btnGroupAddon">></button>
            </div>
            <div class="card-footer text-muted">@ GeonYeong</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Chat",
    data() {
        return {
            
        }
    }
}
</script>

<style scoped>
.card {
    width: 450px;
    height: 800px;
    align-content: center;
    margin: 0 auto;
}

.card-header {
    background-color: white;
}

.netStatus{
    padding-right:0px;
}
</style>