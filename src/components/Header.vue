<template lang="pug">
  .header-wrap
    .company-ingo
      .img 公司logo
      span.name 北京*****公司
    slot
</template>

<script>
  export default {
    name: 'HelloWorld',
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
  .header-wrap{
    padding: 0 20px;
    width: 100%;
    height:  $header-height;
    background: $base-color;
    .company-ingo {
      height: $header-height;
      float: left;
      color: #fff;
      .name,.img{
        float: left;
      }
      .img{
        display: inline-block;
        width: 90px;
        height: 100%
      }
      .name{
        font-size: 20px;
        height: $header-height;
        line-height: $header-height;
      }
    }
  }
</style>
