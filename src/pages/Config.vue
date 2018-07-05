<template lang="pug">
  div.config-wrap
    Header
      ul.config-list
        li.config-item
          router-link(:to="{ name: 'Main'}") 首页
        li.config-item(v-for="(item, index) in routeList" :key="index" v-bind:class="{select: item.name===currentRoute}")
          router-link(:to="{ name: item.name}") {{item.meta.title}}
    div.config-content
      router-view
</template>

<script>
  import Header from 'components/Header';
  import {Message} from 'element-ui';
  import api from 'api';
  import configRoutes from 'src/router/configRoutes'

  export default {
    data () {
      return {
        currentRoute: '',
        dialogFormVisible: false,
        userList: [],
        form: {
          userName: '',
          password: '',
        },
        routeList: configRoutes,

      }
    },
    watch:{
      $route(to){
        this.setCurrentRouteName(to && to.name);
      }
    },
    components: {
      Header,
    },
    computed:{
    },
    created(){
      this.setCurrentRouteName(this.$route.name);
    },
    methods:{
      setCurrentRouteName(name){
        this.currentRoute = this.currentRoute = name;;
      },
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
        &.select{
          background: $select-color;
        }
      }
    }
    .config-content{
      padding: 10px 100px;
    }
  }
</style>
