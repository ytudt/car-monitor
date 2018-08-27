<template lang="pug">
  div.auth-config-wrap
    .config-item
      span.text 角色权限配置:
      el-select(v-model="currentRole" placeholder="选择角色..." @change="onRoleChange()")
        el-option(v-for="(item, index) in roleList" :key="item.index" :label="item.roleName" :value="item.id")
      .select
        el-checkbox-group(v-model="currentMenuList")
          el-checkbox(:label="item.id" v-for="(item, index) in menuList" :key="index") {{item.title}}
      el-button(type="primary" @click="onSubmit()" :disabled="!currentRole") 提交
</template>

<script>
  import api from 'api';
  import router from 'src/router';

  export default {
    name: '',
    props: {},
    data() {
      return {
        currentRole: null,
        roleList: [],
        currentMenuList: [],
      };
    },
    computed: {
      menuList(){
        let result = [];
        let routeList = router.options.routes;
        routeList.forEach((item) => {
          if (item.meta && item.meta.authId) {
            result.push({
              id: item.meta.authId,
              title: item.meta.title,
            });
          }
        });
        return result;

      },
    },
    created(){
      this.getRoleList();
    },
    methods: {
      getRoleList(){
        api.config.getRoles()
          .then(({data}) => {
            this.roleList = data && data.data || [];
          })
          .catch(() =>  message.error('获取用户列表,请刷新重试~'));
      },
      onRoleChange(){},
      onSubmit(){
        console.log(this.currentMenuList);
        if(!this.currentRole) return
        api.config.setMenus({
          menuIds: this.currentMenuList,
          roleId: this.currentRole
        })
          .then(() => {
            this.$message({
              message: '配置成功',
              type: 'success',
              center: true
            });
          }).catch(() => message.error('配置失败,请刷新重试~'));
      },
    },
  };
</script>

<style lang="scss" scoped="">
.auth-config-wrap{
  text-align: left;
  .select{
    display: inline-block;
    margin: 0 10px;
  }
}

</style>
