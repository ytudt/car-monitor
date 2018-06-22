<template lang="pug">
  div.user-wrap 用户列表
    el-table(:data="userList"  align="center")
      el-table-column(label="用户名")
        template(slot-scope="scope")
          span {{scope.row.userName}}
      el-table-column(label="创建时间")
        template(slot-scope="scope")
          span {{scope.row.createTime}}
      el-table-column(label="操作")
        template(slot-scope="scope")
          el-button(size="mini" @click="handleEdit(scope.$index, scope.row)") 编辑
          el-button(size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)") 删除
    div.add-user
      el-button(size="medium" @click="handleAddUser()" type="primary") 新增
    el-dialog(title="新增用户" :visible.sync="dialogFormVisible")
      el-form(:model="form")
        el-form-item(label="用户名")
          el-input(v-model="form.userName")
        el-form-item(label="密码")
          el-input(v-model="form.password")
      div.dialog-footer
        el-button(@click="dialogFormVisible = false") 取消
        el-button(type="primary" @click="handleSubmitUser()") 确定


</template>

<script>
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
    computed:{
    },
    created(){
      api.user.getUsers()
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
  .user-wrap{
    box-sizing: border-box;
    padding: 0 100px;
    .add-user{
     margin-top: 20px;
    }
  }
</style>
