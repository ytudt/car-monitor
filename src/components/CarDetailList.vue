<template lang="pug">
    div.car-detail-list
      div(v-if="disPlayItemMap.SHOWTEM" style="margin-bottom: 10px;") 车厢温度: {{carInfo.temp}}℃
      div.title
        label 车辆信息
      el-table(size="mini" :data="carBasic" align="center" border)
        el-table-column(label="车牌号")
          template(slot-scope="scope")
            span {{licenseNumber}}
        el-table-column(label="司机")
          template(slot-scope="scope")
            span {{scope.row.driver}}
        el-table-column(label="押运员")
          template(slot-scope="scope")
            span {{scope.row.escort}}
      div.title(style="margin-top: 10px;")
          label 货物信息
      el-table(size="mini" border :data="orderList" align="center" v-if="disPlayItemMap.SHOWGOODS")
        el-table-column(label="门店")
          template(slot-scope="scope")
            span {{scope.row.item.customerName}}
        el-table-column(label="货物件数")
          template(slot-scope="scope")
            span {{scope.row.item.count}}
        el-table-column(label="货物状态")
          template(slot-scope="scope")
            span {{scope.row.item.status_name}}
        el-table-column(label="明细")
          template(slot-scope="scope")
            el-dropdown
              span.el-dropdown-link(style="cursor: pointer;") 明细
                  i.el-icon-caret-bottom
              el-dropdown-menu(slot="dropdown")
                  el-dropdown-item(v-for="(n, i) in scope.row.list" :key="i")
                    div(style="text-align: left")
                      span(style="margin-right: 20px;") 货物：{{n.goodsName}}
                      span(style="margin-right: 20px;") 数量：{{n.dispatchNubmer}}
                      span 规格：{{n.goodsNorms}}
</template>

<script>
  import Draggable from 'vuedraggable'
  import api from 'api'

  export default {
    name: 'CarDetailList',
    props: {
      carInfo: {
        type: Object,
      },
    },
    components: {
      Draggable,
    },
    computed: {
      licenseNumber(){
        let licenseNumber = this.carInfo.licenseNumber;
        this.getOrderList(licenseNumber);
        return licenseNumber;
      },

      disPlayItemMap() {
        let result = {}
        this.ehicleSettingModelList && this.ehicleSettingModelList.forEach((item) => {
          result[item.settingCode] = item.value;
        });
        return result;
      },
    },
    data () {
      return {
        ehicleSettingModelList: [],
        carBasic: [1],
        orderList: [],
      }
    },
    mounted(){
      this.ehicleSettingModelList = this.carInfo.vehicleSettingModelList;

    },
    methods:{
      getOrderList(licenseNumber){
        let date = new Date();
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        api.main.getOrderList({
          licenseNumber,
          dispatchDate: `${Y}-${M}-${D}`,
        })
          .then(({data}) => {
            this.orderList = this.formatOrderList(data);
            let data0 = data[0] || {};
            this.carBasic = [data0];
          });
      },
      formatOrderList(data) {
        const carMap = {}
        data.forEach(i => {carMap[i.orderCode] = i})
        const baseArray = []
        for(let key in carMap) {
          const item = carMap[key]
          item.status_name = item.status === 10 ? '在途中' : item.status === 20 ? '已送达' : '--'
          const list = data.filter(f => f.orderCode === key)
          let count = 0
          list.forEach(i => {count += i.dispatchNubmer})
          item.count = count
          baseArray.push({
            item,
            list
          })
        }
        return baseArray
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .car-detail-list{
       margin-bottom: 20px;
       .el-table__header{
          th{
              background-color: #f8f8f8;
          }
       }
       .title{
           text-align: left;
           margin: 5px 0;
           label{
               font-weight: bolder;
           }
       }
    }
</style>
