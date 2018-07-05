<template lang="pug">
</template>

<script>
  import eventHub from 'util/eventHub';
  export default {
    data () {
      return {
      }
    },
    mounted(){
      eventHub.$on('show-alert', this.showMesBox)
    },
    beforeDestroy(){
      eventHub.$off('show-alert', this.showMesBox)
    },
    methods: {
      showMesBox(option = {}){
        if(!option) return;
        this.$alert(option.content || '', option.title || '', {
          confirmButtonText: option.submitText || '确定',
          callback: option.callback,
        });
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
