<template lang="pug">
  .header-wrap
    .company-ingo
      .logo
      span.name 北京*****公司
    slot
    .user-Name(@mouseenter="showSetWrap=true" @mouseleave="showSetWrap=false") 欢迎 {{userName}}
      span.pull-down-wrap
        i.pull-down
      .set-wrap(v-show="showSetWrap")
        .modify-password(@click="modifyPassword") 修改密码
        .log-out(@click="logOut") 退出登录
    .current-data {{currentTime}}
    el-dialog(title="修改密码" :visible.sync="dialogFormVisible")
      el-form(:model="form" label-width="60px")
        el-form-item(label="用户名")
          el-input(v-model="userName" readonly)
        el-form-item(label="密码")
          el-input(v-model="form.password")
      div.dialog-footer
        el-button(@click="dialogFormVisible = false") 取消
        el-button(type="primary" :disabled="!form.password" @click="handleSubmitUser()") 确定
</template>

<script>
  import Cookies from 'js-cookie';
  import {syeVersion} from 'constant';
  import {getYMD} from 'util';
  import api from 'api';
  import store from 'store';
  import MD5 from 'md5';
  import message from 'util/message';

  export default {
    name: 'HelloWorld',
    data () {
      return {
        userName: '',
        currentTime: '',
        showSetWrap: false,
        dialogFormVisible: false,
        form: {
          userName: 123,
          password: '',
        },
        syeVersion: syeVersion,
      }
    },
    computed:{
      showLogOut(){
        return Cookies.get('token');
      },
    },
    mounted(){
      setInterval(this.setTime, 1000);
      this.getUserInfo();
    },
    methods:{
      getUserInfo(){
        api.core.getUserInfo()
          .then(({data}) => {
            this.userName = data.data.userName;
            store.dispatch('updateUserInfo', data.data);
          });
      },
      setTime(){
        let vWeek,vWeek_s,vDay;
        vWeek = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
        let date =  new Date();
        let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();
        vWeek_s = date.getDay();
        this.currentTime = year + "年" + month + "月" + day + "日" + "\t" + hours + ":" + minutes +":" + seconds ;
      },
      logOut(){
        Cookies.remove('token');
        this.$router.push({
          name: 'Login',
        });
      },
      modifyPassword(){
        this.dialogFormVisible = true;

      },
      handleSubmitUser(){
        console.log(store.state.userInfo);
        let {id, userName, expirationTime, roleId} = store.state.userInfo;
        let password = this.form.password;
        api.config.addUser({
          id,
          roleId,
          userName,
          password: MD5(password),
          expirationTime,
          enable: true,
        })
          .then(({data}) => {
            if(!data.success) return Promise.reject();
            this.dialogFormVisible = false;
            this.logOut();
          })
          .catch(() => {
            message.error('修改密码失败,请重新尝试~');
            this.dialogFormVisible = false;
            this.initForm();
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
      .name{
        font-size: 14px;
        color: #ccc;
        height: $header-height;
        line-height: $header-height;
      }
      .version{
        color: #ccc;
        line-height: $header-height;
      }
    }
    .current-data,.user-Name{
      color: #fff;
      float: right;
      height: 100%;
      line-height: 60px;
    }
    .pull-down-wrap{
      display: inline-block;
      height: 20px;
      width: 40px;
      overflow: hidden;
      position: relative;
      top: 12px;
      .pull-down{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #ccc;
        background-size: 20px 20px;
        position: absolute;
        left: 10px;
        top: -10px;
        transform: rotate(45deg);
      }
    }
    .user-Name{
      cursor: pointer;
      margin-left: 10px;
      .set-wrap{
        background: #fff;
        position: absolute;
        z-index: 10;
        color: #666;
        .modify-password,.log-out{
          padding: 0 10px;
          line-height: 40px;
          &:hover{
            background: #f4f4f4
          }
        }
      }
    }
  }
</style>
