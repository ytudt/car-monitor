<template lang="pug">
.login-wrap(id="target")
  //Header
  el-card.box-card
      div.clearfix(slot="header")
        span 用户登录
      el-form(ref="form" :rules="rules" :model="form" label-width="100px")
          el-form-item(prop="userName" label="用户名：")
              el-input(v-model="form.userName" placeholder="请输入用户名")
          el-form-item(prop="password" label="密码：")
              el-input(type="password" v-model="form.password" placeholder="请输入密码" @keyup.enter="login")
          el-form-item(align="left")
              el-button(:disabled="btnDisable" type="primary" :loading="loading" @click="login") 立即登录
              el-button( @click="resetForm") 重置
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
        form: {
          userName: '',
          password: ''
        },
        loading: false,
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
      }
    },
    computed:{
      passwordType(){
        return this.showPassword ? '' : 'password';
      },
      btnDisable(){
        const {userName, password} = this.form;
        return !userName||!password;
      },

    },
    created(){
      document.addEventListener('keyup', this.enterLogin)
    },
    beforeDestroy(){
      document.removeEventListener('keyup', this.enterLogin)
    },
    methods:{
      enterLogin(e){
        e && e.keyCode === 13 && !this.btnDisable && this.login();
      },
      login(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.showPassword = false;
            api.login.doLogin({
              userName: this.form.userName,
              password: MD5(this.form.password),
            })
            .then(({data}) => {
               this.loading = false;
               if(!data || !data.success) return Promise.reject(data.message);
               Cookies.set('token', data.data, { expires: timeMap.tokenValidTime * 1 / 24 });
               this.$router.push({
                 name: 'Main',
               });
            })
            .catch((err) => {
               this.loading = false;
               let errMsg = err && isString(err) ? err : '登录失败,请检查网络重新尝试~';
               this.$message({
                 message: errMsg,
                 type: 'error',
                 center: true
               });
            });
          } else {
            return false;
          }
        });
      },
      resetForm() {
         this.$refs['form'].resetFields();
      }
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
    display: flex;
    align-items: center;
    justify-content: center;
    .box-card{
      width: 500px;
    }
  }
</style>
