<template lang="pug">
  div.config-wrap
    Header
      ul.config-list
        li.config-item
          router-link(:to="{ name: 'Main'}") 首页
        li.config-item
          router-link(:to="{ name: 'userConfig'}") 用户管理
        li.config-item
          router-link(:to="{ name: 'roleConfig'}") 角色管理
    router-view
</template>

<script>
  import Header from 'components/Header';
  import {Message} from 'element-ui';
  import api from 'api';
  export default {
    data () {
      return {
        dialogFormVisible: false,
        userList: [],
        form: {
          userName: '',
          password: '',
        },

      }
    },
    components: {
      Header,
    },
    computed:{
    },
    created(){
    },
    methods:{
      handleAddUser(){
        this.dialogFormVisible = true;
        console.log(123);
      },
      handleSubmitUser(){
        let form = this.form;
        let {expirationTime, password, roleId, userName} = form;
        console.log(456);
        api.user.addUser({
          userName,
          password,
        })
          .then(({data}) => {
            console.log(data);
          })
          .catch(() => {
            Message({
              type: 'error',
              message: '新增用户失败,请重新尝试~',
            });
          });
      },
    },
  }
</script>
<style lang="scss" scoped>
  .config-wrap{
    box-sizing: border-box;
    .config-list{
      .config-item{
        float: left;
        color: #fff;
        height: $header-height;
        line-height: $header-height;
        margin: 0 10px;
      }
    }
    .add-user{
      margin-top: 20px;
    }
  }
</style>
