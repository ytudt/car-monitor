<template lang="pug">
  div.user-wrap
    el-table(:data="roleList"  align="center" header-cell-class-name="background-f5")
      el-table-column(label="角色名")
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
      el-button(size="medium" @click="handleAddRole()" type="primary") 新增
    el-dialog(:title="dialogTitle" :visible.sync="dialogFormVisible" @close="initForm()")
      el-form(:model="form" label-width="60px")
        el-form-item(label="角色名")
          el-input(v-model="form.roleName")
      div.dialog-footer
        el-button(@click="dialogFormVisible = false") 取消
        el-button(type="primary" @click="handleSubmitRole()" :disabled="!form.roleName") 确定
</template>

<script>
  import message from 'util/message'
  import api from 'api';
  export default {
    data () {
      return {
        dialogTitle: '新增角色',
        dialogFormVisible: false,
        roleList: [],
        form: {},

      }
    },
    created(){
      this.getRoleList();
      this.initForm();
    },
    methods:{
      getRoleList(){
        api.config.getRoles()
          .then(({data}) => {
            this.roleList = data && data.data || [];
            console.log(this.roleList);
          })
          .catch(() =>  message.error('获取用户列表,请刷新重试~'));
      },
      initForm() {
        this.form = {roleName: '', id: ''};
      },
      handleAddRole(){
        this.dialogTitle = '新增角色';
        this.dialogFormVisible = true;
      },
      handleEdit(index, role){
        this.dialogTitle = '编辑角色';
        this.dialogFormVisible = true;
        this.form.roleName = role.roleName;
        this.form.id = role.id;
      },
      handleDelete(index, role){
        this.$alert('', '确认删除该角色?', {
          confirmButtonText: '确定',
          callback: action => {
            api.config.delRole(role.id)
              .then(({data}) => {
                if(!data.success) return Promise.reject();
                this.$message({
                  type: 'info',
                  message: `删除角色${role.roleName}成功`
                });
                this.getRoleList();
            })
              .catch(() => message.error('删除角色失败,请重新尝试~'));
          }
        });
      },
      handleSubmitRole(){
        let form = this.form;
        let {roleName, id} = form;
        api.config.addRole({
          id,
          roleName,
        })
          .then(({data}) => {
            if(!data.success) return Promise.reject();
            this.getRoleList();
            this.dialogFormVisible = false;
            this.initForm();
          })
          .catch(() => {
            this.dialogFormVisible = false;
            this.initForm();
            message.error('新增角色失败,请重新尝试~')
          });
      },
    },
  }
</script>
<style lang="scss" scoped>
  .user-wrap{
    box-sizing: border-box;
    .add-user{
      margin-top: 20px;
    }
    .dialog-footer{
      margin-top: 20px;
    }
  }
</style>
