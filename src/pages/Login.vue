<template lang="pug">
.login-wrap
  Header
  .form-wrap
    el-form
      el-form-item(label="用户名")
        el-input(v-model="userName")
      el-form-item(label="密码")
        el-input(:type="passwordType" v-model="password")
        span.show-password(@click="showPassword=!showPassword") {{showPassword ? 'HIDE' : 'SHOW'}}
    el-button(type="primary" :disabled="!userName&&!password") 登录
</template>

<script>
  import MD5 from 'md5';
  import Header from 'components/Header';
  export default {
    name: 'Login',
    components: {
      Header
    },
    data () {
      return {
        showPassword: false,
        userName: '',
        password: '',
      }
    },
    computed:{
      passwordType(){
        return this.showPassword ? '' : 'password';
      },
    },
    created(){
      console.log(MD5('123'));
    },
  }
</script>
<style scoped lang="scss">
  .form-wrap{
    width: 400px;
    .show-password{
      position: absolute;
      right: 10px;
      color: #666;
    }
  }
</style>
