<template lang="pug">
  div.user-wrap
    h1 用户列表
    el-table(:data="userList"  align="center")
      el-table-column(label="用户名")
        template(slot-scope="scope")
          span {{scope.row.userName}}
      el-table-column(label="创建时间")
        template(slot-scope="scope")
          span {{scope.row.createTime}}
      el-table-column(label="操作")
        template(slot-scope="scope")
          <!--el-button(size="mini" @click="handleEdit(scope.$index, scope.row)") 编辑-->
          el-button(size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)") 删除
    div.add-user
      el-button(size="medium" @click="handleAddUser()" type="primary") 新增
    el-dialog(:title="dialogTitle" :visible.sync="dialogFormVisible")
      el-form(:model="form" label-width="60px")
        el-form-item(label="用户名")
          el-input(v-model="form.userName")
        el-form-item(label="密码")
          el-input(v-model="form.password")
        el-form-item(label="角色")
          el-select(v-model="form.roleId" placeholder="请选择")
            el-option(v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId")
      div.dialog-footer
        el-button(@click="dialogFormVisible = false") 取消
        el-button(:disabled="disableAddBtn" type="primary" @click="handleSubmitUser()") 确定


</template>

<script>
  import {Message} from 'element-ui';
  import api from 'api';
  export default {
    data () {
      return {
        dialogTitle: '新增用户',
        dialogFormVisible: false,
        userList: [],
        roleList: [],
        form: {},

      }
    },
    computed:{
      disableAddBtn(){
        const {userName, password, roleId} = this.form;
        return !userName || !password || !roleId;
      },
    },
    created(){
      this.getUserList();
      this.initForm();
    },
    methods:{
      initForm(){
        this.form = {
          userName: '',
          password: '',
          roleId: '',
          expirationTime: '',
        };
      },
      getUserList(){
        api.config.getUsers()
          .then(({data}) => {
            this.userList = data && data.data || [];
          })
          .catch(() => {
            Message({
              type: 'error',
              message: '获取用户列表,请刷新重试~',
            });
          });
      },
      handleAddUser(){
        this.dialogFormVisible = true;
        this.dialogTitle = '新增用户';
        api.config.getRoles()
          .then(({data}) => {
            console.log(data);
            let roleList = data.data || [];
            roleList.forEach((item) => {
              item.roleId = item.id;
            });
            this.roleList = data.data;
          });
      },
      // handleEdit(index, user){
      //   this.dialogFormVisible = true;
      //   this.dialogTitle = '编辑用户';
      //   api.config.getRoles()
      //     .then(({data}) => {
      //       console.log(data);
      //       this.roleList = data.data;
      //     });
      //   const {userName, password, roleId} = user;
      //   this.form = {
      //     userName,
      //     password,
      //     roleId,
      //   };
      // },
      handleDelete(index, user){
        this.$alert('', '确认删除该用户?', {
          confirmButtonText: '确定',
          callback: action => {
            api.config.delUser(user.id)
              .then(({data}) => {
                if(!data.success) return Promise.reject();
                this.$message({
                  type: 'info',
                  message: `删除用户${user.userName}成功`
                });
                this.getUserList();
              })
              .catch(() => {
                Message({
                  type: 'error',
                  message: '删除用户失败,请重新尝试~',
                });
              });
          }
        });
      },
      handleSubmitUser(){
        let form = this.form;
        let {roleId, password, userName, expirationTime} = form;
        api.config.addUser({
          roleId,
          userName,
          password,
          expirationTime,
        })
          .then(({data}) => {
            if(!data.success) return Promise.reject();
            this.getUserList();
            this.dialogFormVisible = false;
            this.initForm();
          })
          .catch(() => {
            Message({
              type: 'error',
              message: '新增用户失败,请重新尝试~',
            });
            this.dialogFormVisible = false;
            this.initForm();
          });
      },
    },
  }
</script>
<style lang="scss" scoped>
  .user-wrap{
    box-sizing: border-box;
    padding: 10px 100px 0;
    .add-user{
      margin-top: 20px;
    }
    el-form-item{
      margin-top: 10px;
    }
    .dialog-footer{
      margin-top: 20px;
    }
  }
</style>
