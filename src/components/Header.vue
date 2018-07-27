<template lang="pug">
  .header-wrap
    .company-ingo
      .logo
      span.name 北京*****公司
    slot
    .logout(v-if="showLogOut" @click="logOut") 退出登录
</template>

<script>
  import Cookies from 'js-cookie';
  import {syeVersion} from 'constant';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        syeVersion: syeVersion,
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
<style lang="scss">
  .header-wrap{
    padding: 0 20px;
    width: 100%;
    height:  $header-height;
    background: $base-color;
    .company-ingo {
      height: $header-height;
      float: left;
      color: #fff;
      .logo{
        background: url("~assets/logo.png");
        width: 80px;
        height: $header-height;
        background-size: 80px $header-height;
        background-repeat: no-repeat;
        display: inline-block;
        float: left;
      }
      .name,.img,.version{
        float: left;
        display: inline-block;
        margin-left: 5px;
      }
      /*.img{*/
        /*width: 90px;*/
        /*height: 100%*/
      /*}*/
      .name{
        font-size: 20px;
        height: $header-height;
        line-height: $header-height;
      }
      .version{
        color: #ccc;
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
