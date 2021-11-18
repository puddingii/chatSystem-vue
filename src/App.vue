<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      
    }
  },
  created() {
    this.$store.commit("chat/listenSocketEvent");
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}
</style>
