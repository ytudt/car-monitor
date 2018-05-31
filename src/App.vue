<template lang="pug">
  keep-alive
    router-view(v-if="$route.meta.KeepAlive")
    router-view(v-else)
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
