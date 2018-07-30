<template lang="pug">
  div.order-wrap
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
    div.content
      el-table(:data="orderList"  align="center" header-cell-class-name="background-f5")
        el-table-column(label="货物名")
          template(slot-scope="scope")
            span {{scope.row.goodsName}}
        el-table-column(label="数量")
          template(slot-scope="scope")
            span {{scope.row.quantity}}
        el-table-column(label="客户名称")
          template(slot-scope="scope")
            span {{scope.row.customerName}}

</template>

<script>
  import message from 'util/message'
  import api from 'api';
  import {videoInfo} from 'constant'
  import {getYMD} from 'util'

  export default {
    data () {
      return {
        orderList: [],
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
            this.orderList = data;
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
