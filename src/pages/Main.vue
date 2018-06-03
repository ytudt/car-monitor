<template lang="pug">
  .main-wrap
    Header
      ul.tab-list.clr
        li.tab-item.fl 总览
        li.tab-item.fl()
          el-dropdown
            span.el-dropdown-link 目标车辆信息
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                .content(@click="onCarClick(item.carNumber)") {{item.carNumber}}
        li.tab-item.fl
          el-dropdown
            span.el-dropdown-link 轨迹回放
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                span.el-dropdown-link(@click="showPath(item.carNumber)") {{item.carNumber}}
                el-dropdown()
                  span.el-dropdown-link {{item.licenseNumber}}
                  el-dropdown-menu(slot="dropdown")
                    el-dropdown-item
                      ul.clr
                        li.fl 日期
                        li.fl 车次
                <!--.content(@click="carNumber=item.licenseNumber") -->
        li.tab-item.fl
          router-link(:to="{ name: 'Config'}") 车辆配置
    CarDetail(v-if="carNumber" :carNumber="carNumber")
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
        carNumber: null,
        carList: [],
        map: null,
        pathSimplifierIns: null,
      }
    },
    created(){
      this.getCarList();
    },
    mounted(){
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:12,
        center: [116.397428, 39.90923]
      });
      let {map} = this;
      AMap.plugin(['AMap.ToolBar'], () => map.addControl(new AMap.ToolBar()));
      AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => this.initPath(map, PathSimplifier));
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
            AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => this.initCarList(this.map, SimpleMarker));
          })
          .catch(() => {
            Message({
              type: 'error',
              message: '车辆数据获取失败,请刷新重试~',
            });
          });
      },
      initCarList(map, SimpleMarker){
        for(let i =0 ; i < this.carList.length; i++){
          let car = this.carList[i];
          //创建SimpleMarker实例
          let marker = new SimpleMarker({
            iconTheme: 'default',
            iconStyle: car.online ? 'red' : 'blue',
            label: {
              content: car.carNumber,
              offset: new AMap.Pixel(40, 0)
            },
            map: map,
            position: car.position
          });

          AMap.event.addListener(marker,'click',(e) =>{
            this.onCarClick(e.target.G.label.content);
          });
        }

      },
      onCarClick(carNumber){
        this.showCarDetail = true;
        this.carNumber = carNumber;
        this.pathSimplifierIns.hide();
      },
      initPath(map, PathSimplifier){
        this.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            return pathData.path;
          },
          renderOptions: {
            pathLineStyle: {
              strokeStyle: 'red',
              lineWidth: 6,
              dirArrowStyle: true
            }
          }
        });
      },
      showPath(cardId){
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
          this.setPath(path);
        });
      },
      setPath(path, option = {}){
        let {speed, loop} = option;
        loop = loop || true;
        speed = speed || 100000;
        this.pathSimplifierIns.setData([{
          name: '车辆轨迹',
          path,
        }]);
        this.pathSimplifierIns.createPathNavigator(0,
          {loop, speed,}).start();
      },
    },
  }
</script>
<style lang="scss">
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
