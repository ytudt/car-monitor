<template lang="pug">
  div.app-wrap
    router-view
    Dialog
</template>

<script>
import Dialog from 'components/Dialog';
export default {
  name: 'App',
  components:{
    Dialog,
  }
}
</script>

<style scoped lang="scss">
.app-wrap{
  height: 100%;
}
</style>
