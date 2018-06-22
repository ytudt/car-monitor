<template lang="pug">

  .car-detail-wrap(v-drag="")
    ul.detail-key.clr
      li.fl 车牌号
      li.fl 司机
      li.fl 押运员1
      li.fl 押运员1
    ul.detail-value.clr
      li.fl 京N12124
      li.fl 张三
      li.fl 李四
      li.fl 王五
    .video-wrap 我是视频
      .container
        div(id="flashContent" style="width:100%;height:100%")
          p 看视频请打开大于11.1.0版本Adobe Flash Player
    el-table(:data="tableData")
      el-table-column(label="门店")
        template(slot-scope="scope")
          span {{scope.row.date}}
      el-table-column(label="货物件数")
        template(slot-scope="scope")
          span {{scope.row.date}}
      el-table-column(label="状态")
        template(slot-scope="scope")
          span {{scope.row.date}}
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
    div 车厢温度: -10℃

</template>

<script>
  import Draggable from 'vuedraggable'
  export default {
    name: 'CarDetail',
    props: {
      carNumber:{
        type: String,
      },
    },
    components: {
      Draggable
    },
    data () {
      return {
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
      // let pageHost = ((document.location.protocol == "https:") ? "https://" : "http://");
      // document.write("<a href='http://www.adobe.com/go/getflashplayer'><img src='" +
      //   pageHost +
      //   "www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' /></a>"
      // );
    },
    methods:{
      onDetailClick(){
        console.log(123);
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.car-detail-wrap{
   position: fixed;
   top: 200px;
   right: 20px;
  width: 400px;
   background: red;
   z-index: 1;
   background: #f4f4f4;
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
