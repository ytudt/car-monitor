<template lang="pug">
  .main-wrap
    Header
      ul.tab-list.clr
        li.tab-item.fl 总览
        li.tab-item.fl(@click="showCarList()")
          el-dropdown
            span.el-dropdown-link 目标车辆信息
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                .content(@click="carInfo=item.carNumber") {{item.carNumber}}
        li.tab-item.fl
          el-dropdown
            span.el-dropdown-link 轨迹回放
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                span.el-dropdown-link(@click="showTrack(item.carNumber)") {{item.carNumber}}
                el-dropdown()
                  span.el-dropdown-link {{item.licenseNumber}}
                  el-dropdown-menu(slot="dropdown")
                    el-dropdown-item
                      ul.clr
                        li.fl 日期
                        li.fl 车次
                <!--.content(@click="carInfo=item.licenseNumber") -->
        li.tab-item.fl
          router-link(:to="{ name: 'Config'}") 车辆配置
    CarDetail(v-if="carInfo" :carInfo="carInfo")
    .map-wrap(id="container" tabindex="0")
</template>

<script>
  import axios from 'axios';
  import {Message} from 'element-ui';
  import Header from 'components/Header';
  import CarDetail from 'components/CarDetail';
  export default {
    name: 'Main',
    components: {
      Header,
      CarDetail
    },
    data () {
      return {
        carInfo: null,
        carList: [],
        pathSimplifierIns: null,
      }
    },
    created(){
      this.getCarList();
    },
    mounted(){
      let map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:12,
        center: [116.397428, 39.90923]
      });
      AMap.plugin(['AMap.ToolBar'],
        function(){
          map.addControl(new AMap.ToolBar());
        });

      AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
        this.initCar(map, SimpleMarker);
      });

      //加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
      this.initPage(map, PathSimplifier);
      });
    },
    methods: {
      getCarList(){
        axios.get('/api/vehicles')
          .then(({data}) => {
            let carList = data.data || [];
            carList.forEach((item, index) => {
              item.position = [item.lng, item.lat];
            });
            this.carList = carList;
          })
          .catch((err) => {
            Message({
              type: 'error',
              message: '车辆数据获取失败,请刷新重试~',
            });
          });
      },
      initCar(map, SimpleMarker){
        for(let i =0 ; i < this.carList.length; i++){
          let car = this.carList[i];
          //创建SimpleMarker实例
          let marker = new SimpleMarker({

            //前景文字
            // iconLabel: 'A',

            //图标主题
            iconTheme: 'default',

            //背景图标样式
            iconStyle: car.online ? 'red' : 'blue',
            label: {
              content: car.carNumber,
              offset: new AMap.Pixel(40, 0)
            },

            //...其他Marker选项...，不包括content
            map: map,
            position: car.position
          });

          AMap.event.addListener(marker,'click',(e) =>{
            this.showCarDetail = true;
            this.carInfo = e.target.G.label.content;
            this.pathSimplifierIns.hide();
          });
        }

      },
      initPage(map, PathSimplifier){
        //创建组件实例
        this.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'red',
              lineWidth: 6,
              dirArrowStyle: true
            }
          }
        });
      },
      showCarList(){

      },
      showTrack(cardId){
       this.getCarTrack(cardId);


      },
      getCarTrack(cardId){
        this.pathSimplifierIns.show();
        axios.get(`api/vehicle/${cardId}`)
        .then(({data}) => {
          let path = [];
          data && data.data.forEach((item) => {
            path.push([item.lng, item.lat]);
          });
          this.pathSimplifierIns.setData([{
            name: '车辆轨迹',
            path,
          }]);
          //创建一个巡航器
          var navg = this.pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
            {
              loop: true, //循环播放
              speed: 100000
            });
          navg.start();
        });
      },
    },
    beforeRouteEnter(to, from, next){
      next();
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
        .el-dropdown-link{
          color: #fff;
        }
      }
    }
    #container{
      height: 100%;
    }
  }
</style>
