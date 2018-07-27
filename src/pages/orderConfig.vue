<template lang="pug">
  div.header
    div.car-select
      el-select(v-model="selectCar" placeholder="选择车辆")
        el-option(v-for="(item, index) of carList"
        :key="index"
        :label="item.label"
        :value="item.value")
    div.time-select
      el-date-picker(v-model="selectTime"
                     type="date"
                    placeholder="选择日期")
    div.submit
      el-button(type="primary"
                @click="handleSubmit()"
                :disabled="!selectCar || !selectTime") 确定

</template>

<script>
  import message from 'util/message'
  import api from 'api';
  import {videoInfo} from 'constant'
  import {getYMD} from 'util'

  console.log(videoInfo);
  export default {
    data () {
      return {
        selectCar: '',
        selectTime: new Date(),
      }
    },
    computed:{
      carList(){
        let result = [];
        for (let item in videoInfo.carIdMap){
          result.push({
            value: item,
            label: item,
          });
        }
        return result;
      },
    },
    created(){
    },
    methods:{
      handleSubmit(){
        api.config.getOrder({
          licenseNumber: this.selectCar,
          dispatchDate: getYMD(this.selectTime),
        })
          .then(({data}) => {
            console.log(data);
          })
          .catch(() => message.error('获取订单,请重试~'));
      },

    },
  }
</script>
<style lang="scss" scoped>
  .car-select,.time-select{
    display: inline-block;
    margin: 10px;
  }
  .submit{
    margin-top: 20px;
  }
</style>
