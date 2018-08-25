<template lang="pug">
  div.car-config-wrap
    div.config-item
      span.text 实时车辆显示内容:
      el-select(v-model="currentCar" placeholder="车辆" @change="onCarChange(currentCar)")
        el-option(v-for="item in carList" :key="item.licenseNumber" :label="item.licenseNumber" :value="item.licenseNumber")
      .select
        el-checkbox-group(v-model="liveDisItms")
          el-checkbox(:label="item.settingName" :value="item.settingCode" v-for="(item, index) in catSettingList" :key="index")
      el-button(type="primary" @click="onCarSet()") 提交
    div.config-item.video-config
      span.text 视频播放时长:
      .select
        el-input-number(v-model="form.videoTime" label="视频播放时长")
    div.submit-btn
      el-button(type="primary") 提交
</template>

<script>
  import api from 'api';
  export default {
    data () {
      return {
        currentCar: null,
        carList: [],
        form: {
          videoTime: 5,
          liveDisItms: [],
          hisDisItms: [],
        },
        liveDisItms: [],
        catSettingList: [
          {
            settingCode: 'SHOWVEDIO',
            settingName: '是否显示视频',
          },
          {
            settingCode: 'SHOWGOODS',
            settingName: '是否显示货物',
          },
          {
            settingCode: 'SHOWTEM',
            settingName: '是否显示温度',
          },
        ]
      }
    },
    components: {
    },
    computed:{
    },
    created(){
      this.getCarList();
    },
    methods:{
      getCarList(){
        api.main.getVehicles()
          .then(({data}) => {
            this.carList = data.data || [];
          })
          .catch(() => message.error('车辆数据获取失败,请刷新重试~'));
      },
      onCarChange(licenseNumber){
        this.liveDisItms = [];
        this.carList.forEach((item) => {
          if(item.licenseNumber === licenseNumber){
            item.vehicleSettingModelList.forEach((set) => {
              set.value && this.liveDisItms.push(set.settingName);
            })
          }
          console.log(this.liveDisItms);
        });
      },
      onCarSet(){
        if(!this.currentCar) return;
        let params = {
          licenseNumber: this.currentCar,
          settingModels: [],
        };
        this.catSettingList.forEach((item) => {
          const {settingCode, settingName} = item;
          params.settingModels.push({
            settingCode,
            settingName,
            value: this.liveDisItms.indexOf(item.settingName) === -1 ? false : true,
          });
        });
        api.config.setCarSetting(params)
          .then(({data}) => {
            this.$message({
              message: '配置成功',
              type: 'success',
              center: true
            });
            this.getCarList();
          });
      },
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
        margin: 0 10px;
      }
    }
    .submit-btn{
      margin-top: 10px;
    }
  }
</style>
