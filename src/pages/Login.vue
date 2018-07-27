<template lang="pug">
.login-wrap(id="target")
  //Header
  .form-wrap
    div.login-text 用户登录
    el-form
      el-form-item
        el-input(v-model="userName" placeholder="用户名")
      el-form-item
        el-input(:type="passwordType" v-model="password" placeholder="密码")
        span.show-password(@click="showPassword=!showPassword") {{showPassword ? 'HIDE' : 'SHOW'}}
    .btn-wrap
      button.btn(@click="login()") 登录
</template>

<script>
  import MD5 from 'md5';
  import Cookies from 'js-cookie';
  import api from 'api';
  import {timeMap} from 'constant'
  import {isString} from 'util'
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
        password: ''
      }
    },
    computed:{
      passwordType(){
        return this.showPassword ? '' : 'password';
      },
      btnDisable(){
        const {userName, password} = this;
        return !userName||!password;
      },

    },
    methods:{
      login(){
        if(this.btnDisable){
          return this.$message({
            message: '用户名或密码不能为空~',
            type: 'warning',
            center: true
          });
        }
        this.showPassword = false;
        api.login.doLogin({
          userName: this.userName,
          password: MD5(this.password),
        })
        .then(({data}) => {
          if(!data || !data.success) return Promise.reject(data.message);
          Cookies.set('token', data.data, { expires: timeMap.tokenValidTime * 1 / 24 });
          this.$router.push({
            name: 'Main',
          });
        })
        .catch((err) => {
          let errMsg = err && isString(err) ? err : '登录失败,请检查网络重新尝试~';
          this.$message({
            message: errMsg,
            type: 'error',
            center: true
          });
        });
      },
    },
  }
</script>
<style scoped lang="scss">
  .login-wrap{
    width: 100%;
    height: 100%;
    background: url("~assets/login-bg.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    padding-top: 200px;
    box-sizing: border-box;
    .form-wrap{
      width: 400px;
      background: #fff;
      margin: 0px auto;
      padding: 20px;
      border-radius: 10px;
      .login-text{
        color: #333;
        font-size: 20px;
        text-align: center;
        margin-bottom: 20px;
      }
      .show-password{
        position: absolute;
        right: 10px;
        color: #666;
        cursor: pointer;
      }
      .err-mes{
        color: red;
        font-size: 16px;
        text-align: center;
      }
      .btn-wrap{
        text-align: center;
        margin-top: 10px;
        .btn{
          border-radius: 5px;
          color: #fff;
          width: 100%;
          height: 40px;
          background: $base-color;
          outline: none;
        }
      }
    }
  }
</style>
