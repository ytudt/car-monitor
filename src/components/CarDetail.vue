<template lang="pug">
    h1(v-drag="") test
</template>

<script>
  import Draggable from 'vuedraggable'
  export default {
    name: 'CarDetail',
    props: {
      carInfo:{
        type: String,
      },
    },
    components: {
      Draggable
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~core/styles/index';
 h1{
   position: fixed;
   top: 200px;
   right: 20px;
   width: 100px;
   height: 100px;
   background: red;
   z-index: 1;
 }
</style>
