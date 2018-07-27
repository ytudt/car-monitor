<template lang="pug">
  div.car-config-wrap
    div.config-item
      span.text 实时车辆显示内容:
      .select
        el-checkbox-group(v-model="form.liveDisItms")
          el-checkbox(label="复选框 A")
          el-checkbox(label="复选框 B")
          el-checkbox(label="复选框 C")
    div.config-item
      span.text 轨迹回放显示内容:
      .select
        el-checkbox-group(v-model="form.hisDisItms")
          el-checkbox(label="复选框 A")
          el-checkbox(label="复选框 B")
          el-checkbox(label="复选框 C")
    div.config-item.video-config
      span.text 视频播放时长:
      .select
        el-input-number(v-model="form.videoTime" label="视频播放时长")
    div.submit-btn
      el-button(type="primary") 提交
</template>

<script>
  export default {
    data () {
      return {
        form: {
          videoTime: 5,
          liveDisItms: [],
          hisDisItms: [],
        },
      }
    },
    components: {
    },
    computed:{
    },
    created(){
    },
    methods:{
    },
  }
</script>
<style lang="scss">
  .car-config-wrap{
    background: #fff;
    .config-item{
      border-bottom: 1px solid $border-color-gray;
      padding: 20px 0;
      text-align: left;
      padding-left: 50px;
      .text{
        display: inline-block;
        margin-right: 10px;
        font-size: 14px;
        color: #606266;
      }
      .select{
        display: inline-block;
      }
    }
    .submit-btn{
      margin-top: 10px;
    }
  }
</style>
