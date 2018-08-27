<template lang="pug">
  div.car-config-wrap
    div.config-item
      span.text 实时车辆显示内容:
      el-select(v-model="currentCar" placeholder="选择车辆..." @change="onCarChange(currentCar)")
        el-option(v-for="item in carList" :key="item.licenseNumber" :label="item.licenseNumber" :value="item.licenseNumber")
      .select
        el-checkbox-group(v-model="liveDisItms")
          el-checkbox(:label="item.settingName" :value="item.settingCode" v-for="(item, index) in catSettingList" :key="index")
      el-button(type="primary" @click="onCarSet()" :disabled="!currentCar") 提交
    div.config-item.video-config
      span.text 视频播放时长:
      .select
        el-input-number(v-model="videoTime" label="视频播放时长")
      el-button(type="primary" @click="onConfigSet") 提交
</template>

<script>
  import {mapGetters} from 'vuex';
  import _ from 'lodash';
  import api from 'api';
  import message from 'util/message'
  import {globConfigMap} from 'constant';
  import store from 'store';

  console.log(globConfigMap);

  export default {
    data () {
      return {
        videoTime: 0,
        currentCar: null,
        carList: [],
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
    watch: {
     configList(){
       this.getVideoTime();
     },
    },
    computed:{
      ...mapGetters([
        'globalParams',
      ]),
      configList(){
        return this.globalParams.configList;
      },
      configMap(){
        return this.globalParams.configMap;
      },
    },
    created(){
      this.getCarList();
      this.getVideoTime();
    },
    methods:{
      getVideoTime(){
        let result = 0;
        this.configList.forEach((item) => {
          if(item.settingCode === globConfigMap.VIDEO_PLAY_TIME){
            result = parseInt(item.value);
          }
        });
        this.videoTime = result;
      },
      getCarList(){
        api.main.getVehicles()
          .then(({data}) => {
            this.carList = data.data || [];
          })
          .catch(() => message.error('全局数据获取失败,请刷新重试~'));
      },
      onCarChange(licenseNumber){
        this.liveDisItms = [];
        this.carList.forEach((item) => {
          if(item.licenseNumber === licenseNumber){
            item.vehicleSettingModelList.forEach((set) => {
              set.value && this.liveDisItms.push(set.settingName);
            })
          }
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
            value: this.liveDisItms.indexOf(item.settingName) === -1 ? '' : true,
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
      onConfigSet(){
        let config = _.cloneDeep(this.configMap.videoPlayTime);
        config.value = this.videoTime;
        store.dispatch('updateConfigMap', {key: 'videoPlayTime', config});
        api.config.setGloblConfig(this.configList)
          .then(() => {
            this.$message({
              message: '配置成功',
              type: 'success',
              center: true
            });
          });
      },
    },
  }
</script>
<style lang="scss">
  .car-config-wrap{
    background: #fff;
    .submit-btn{
      margin-top: 10px;
    }
  }
</style>
