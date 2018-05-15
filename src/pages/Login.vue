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
    div.err-mes(v-if="showPassword") 用户名或密码错误
    el-button(type="primary" :disabled="!userName||!password" @click="login()") 登录
</template>

<script>
  import MD5 from 'md5';
  import Cookies from 'js-cookie';
  import api from 'api';
  import Header from 'components/Header';

  console.log(Cookies);
  export default {
    name: 'Login',
    components: {
      Header
    },
    data () {
      return {
        showPassword: true,
        userName: '',
        password: '',
        loginError: false,
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
    methods:{
      login(){
        this.showPassword = false;
        api.login.doLogin({
          userName: this.userName,
          password: MD5(this.password),
        })
        .then(({data}) => {
          if(!data || !data.success) return this.showPassword = true;
          Cookies.set('token', data.data, { expires: 6 * 1 / 24 });
          this.$router.push({
            name: 'Index',
          });
        })
        .catch(() => {
          this.$message({
            message: '登录失败,请检查网络重新尝试~',
            type: 'error',
            center: true
          });
        });
      },
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
      cursor: pointer;
    }
    .err-mes{
      color: red;
    }
  }
</style>
