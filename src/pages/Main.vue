<template lang="pug">
  .main-wrap
    Header
      ul.tab-list.clr
        li.tab-item.fl 总览
        li.tab-item.fl(@click="showCarList()")
          el-dropdown
            span.el-dropdown-link 目标车辆信息
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in markArr" :key="index")
                .content(@click="carInfo=item.licenseNumber") {{item.licenseNumber}}
        li.tab-item.fl 轨迹回放
        li.tab-item.fl 车辆配置
      .logout(@click="logOut") 退出登录
    CarDetail(v-if="carInfo" :carInfo="carInfo")
    .map-wrap(id="container" tabindex="0")
</template>

<script>
  import Header from 'components/Header';
  import CarDetail from 'components/CarDetail';
  import Cookies from 'js-cookie';
  export default {
    name: 'Main',
    components: {
      Header,
      CarDetail
    },
    data () {
      return {
        carInfo: null,
        markArr: [],
        // showCarDetail: false,
      }
    },
    mounted(){
      let map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:11,
        center: [116.397428, 39.90923]
      });

      AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
        this.initCar(map, SimpleMarker);
      });
    },
    methods: {
      logOut(){
        Cookies.remove('token');
        this.$router.push({
            name: 'Login',
        });

      },
      initCar(map, SimpleMarker){
        this.markArr = [{
          status: 'oline',
          licenseNumber: '京79481274',
          position: [116.425285, 39.914989],
        }, {
          status: 'offline',
          licenseNumber: '京709034242',
          position: [116.455285, 39.954989],
        }];

        for(let i =0 ; i < this.markArr.length; i++){
          //创建SimpleMarker实例
          let marker = new SimpleMarker({

            //前景文字
            // iconLabel: 'A',

            //图标主题
            iconTheme: 'default',

            //背景图标样式
            iconStyle: 'red',
            label: {
              content: this.markArr[i].licenseNumber,
              offset: new AMap.Pixel(40, 0)
            },

            //...其他Marker选项...，不包括content
            map: map,
            position: this.markArr[i].position
          });

          AMap.event.addListener(marker,'click',(e) =>{
            console.log(e.target.G.label);
            this.showCarDetail = true;
            console.log(e.target.G.label);
            this.carInfo = e.target.G.label.content;
          });
        }

      },
      showCarList(){

      },
      test(){
        console.log('test');
      },
    },
  }
</script>
<style scoped lang="scss">
  @import '~core/styles/index';
  .main-wrap{
    height: 100%;
    .tab-list{
      color: #fff;
      display: inline-block;
      .tab-item{
        font-size: 14px;
        float: left;
        height: $header-height;
        line-height: $header-height;
        margin: 0 10px;
        cursor: pointer;
        /*&:active{*/
          /*color: #ccc;*/
        /*}*/
        /*&:hover{*/
          /*color: #ccc;*/
        /*}*/
        .el-dropdown-link{
          color: #fff;
        }
      }
    }
    .logout{
      color: #fff;
      float: right;
      height: 100%;
      line-height: 60px;
    }
    #container{
      height: 100%;
    }
  }
</style>
