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
            span {{scope.row.customerName}}
        el-table-column(label="货物件数")
          template(slot-scope="scope")
            span {{scope.row.dispatchNubmer}}
        el-table-column(label="明细")
          template(slot-scope="scope")
            el-dropdown
              div.el-dropdown-link
                span 明细
                  i.el-icon-caret-bottom
                    el-dropdown-menu(slot="dropdown")
                        el-dropdown-item
                            ul.clr
                                li.fl 1
                                li.fl 2
                                li.fl 3
                        el-dropdown-item
                            ul.clr
                                li.fl 1
                                li.fl 2
                                li.fl 3
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
            this.orderList = data;
            let data0 = data[0] || {};
            this.carBasic = [data0];
          });
      },
    },
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
