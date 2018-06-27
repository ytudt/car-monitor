<template lang="pug">
  div.user-wrap
    h1 用户列表
    el-table(:data="userList"  align="center")
      el-table-column(label="用户名")
        template(slot-scope="scope")
          span {{scope.row.userName}}
      el-table-column(label="用户角色")
        template(slot-scope="scope")
          span {{scope.row.roleName}}
      el-table-column(label="创建时间")
        template(slot-scope="scope")
          span {{scope.row.createTime}}
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(size="mini" @click="handleEdit(scope.$index, scope.row)") 编辑
          el-button(size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)") 删除
    div.add-user
      el-button(size="medium" @click="handleAddUser()" type="primary") 新增
    el-dialog(:title="dialogTitle" :visible.sync="dialogFormVisible" @close="initForm()")
      el-form(:model="form" label-width="60px")
        el-form-item(label="用户名")
          el-input(v-model="form.userName")
        el-form-item(label="密码")
          el-input(v-model="form.password")
        el-form-item(label="角色")
          el-select(v-model="form.roleId" placeholder="请选择")
            el-option( v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId")
      div.dialog-footer
        el-button(@click="dialogFormVisible = false") 取消
        el-button(:disabled="disableAddBtn" type="primary" @click="handleSubmitUser()") 确定
</template>

<script>
  import {Message} from 'element-ui';
  import MD5 from 'md5';
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
          id: '',
          userName: '',
          password: '',
          roleId: '',
          roleName: '',
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
            let roleList = data.data || [];
            this.setRoleList(roleList);
          });
      },
      handleEdit(index, user){
        this.dialogTitle = '编辑用户';
        this.dialogFormVisible = true;
        api.config.getRoles()
          .then(({data}) => {
            let roleList = data.data || [];
            this.setRoleList(roleList);
            const {id, userName, roleId} = user;
            this.form.id = id;
            this.form.userName = userName;
            this.form.roleId = roleId;
          });

      },
      setRoleList(roleList){
        roleList.forEach((item) => {
          item.roleId = item.id;
        });
        this.roleList = roleList;
      },
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
        let {id, password, userName, expirationTime, roleId} = this.form;
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
