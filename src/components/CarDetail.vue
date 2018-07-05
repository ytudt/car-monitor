<template lang="pug">

  .car-detail-wrap(v-drag="")
    .close
      .el-icon-close(@click="$emit('close')")
    el-table(:data="carBasic"  align="center")
      el-table-column(label="车牌号")
        template(slot-scope="scope")
          span {{licenseNumber}}
      el-table-column(label="司机")
        template(slot-scope="scope")
          span {{scope.row.driver}}
      el-table-column(label="押运员")
        template(slot-scope="scope")
          span {{scope.row.escort}}
    .video-wrap
      Flashvideo(:carInfo="carInfo")
    el-table(:data="orderList" align="center")
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
          <!--div(@click="onDetailClick()")-->
            <!--span 明细-->
            <!--i.el-icon-caret-bottom-->
    div 车厢温度: {{carInfo.temp}}

</template>

<script>
  import Draggable from 'vuedraggable'
  import Flashvideo from './Flashvideo'
  import api from 'api'
  export default {
    name: 'CarDetail',
    props: {
      carInfo: {
        type: Object,
      },
    },
    components: {
      Draggable,
      Flashvideo,
    },
    computed: {
      licenseNumber(){
        let licenseNumber = this.carInfo.licenseNumber;
        this.getOrderList(licenseNumber);
        return licenseNumber;
      },
    },
    data () {
      return {
        carBasic: [1],
        orderList: [],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    mounted(){

    },
    methods:{
      onDetailClick(){
      },
      getOrderList(licenseNumber){
        let date = new Date();
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        // TODO 这里先写死日期
        // let D = date.getDate();
        let D = 8;
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
.car-detail-wrap{
   position: fixed;
    top: 0;
   right: 20px;
  width: 600px;
   background: red;
   z-index: 1;
   background: #f4f4f4;
  padding: 10px;
  .close{
    height: 20px;
    text-align: right;
    .el-icon-close{
      cursor: pointer;
    }
  }

  .detail-key{
    margin-top: 10px;
  }
  .detail-key,.detail-value{
    width: 100%;
    li{
      width: 25%;
      text-align: center;
    }
  }
  .video-wrap{
    .video-list{
      width: 100%;
      .video-item{
        display: inline-block;
        width: 50%;
        height: 100px;
        background: red;

      }
    }
  }
 }
</style>
