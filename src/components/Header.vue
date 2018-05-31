<template lang="pug">
  .header-wrap
    .company-ingo
      .img 公司logo
      span.name 北京*****公司
    slot
    .logout(v-if="showLogOut" @click="logOut") 退出登录
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed:{
      showLogOut(){
        return Cookies.get('token');
      },
    },
    methods:{
      logOut(){
        Cookies.remove('token');
        this.$router.push({
          name: 'Login',
        });
      },
    },
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
    .logout{
      color: #fff;
      float: right;
      height: 100%;
      line-height: 60px;
      cursor: pointer;
    }
  }
</style>
