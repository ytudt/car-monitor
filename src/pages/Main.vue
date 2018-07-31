<template lang="pug">
  .main-wrap
    Header.header
      ul.tab-list.clr
        li.tab-item.fl()
          el-dropdown
            span.el-dropdown-link 目标车辆信息
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                .content(@click="onCarClick(item)") {{item.licenseNumber}}
        li.tab-item.fl.history-tab 轨迹回放
          ul.car-list
            li.car-item(v-for="(item, index) in carList" :key="index"
                        @mouseenter="getTripList(item)")
              span {{item.licenseNumber}}
              ul.data-list(v-if="item.showDate")
                li.data-item(v-for="(trip, i) in item.tripList" @click="onTripClick(trip, item)" v-if="item.tripList && item.tripList.length") {{trip.createTime}}
                li.data-item(v-if="!item.tripList") 加载中...
                li.data-item(v-if="item.tripList && !item.tripList.length") 无数据...
        li.tab-item.fl
          router-link(:to="{ name: 'userConfig'}") 配置台
    CarDetail(v-if="carInfo" :carInfo="carInfo" @close="carInfo=null")
    .map-wrap()
      div(id="container")
</template>

<script>
  import axios from 'axios';
  import api from 'api';
  import {extend} from 'util';
  import message from 'util/message'
  import {timeMap} from "constant";
  import Header from 'components/Header';
  import CarDetail from 'components/CarDetail';
  export default {
    name: 'Main',
    components: {
      Header,
      CarDetail,
    },
    data () {
      return {
        showCarDetail: false,
        carInfo: null,
        carList: [],
        map: null,
        pathSimplifierIns: null,
        refreshTimer: null,
      }
    },
    created(){
      this.initCarList();
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
    beforeDestroy(){
      clearInterval(this.refreshTimer);
    },
    methods: {
      initCarList(){
        api.main.getVehicles()
        .then(({data}) => {
          let carList = data.data || [];
          carList.forEach((item) => {
            item.tripList = null;
            item.showDate = false;
          });
          this.refreshCarLocation(carList);
        })
        .catch(() => message.error('车辆数据获取失败,请刷新重试~'));
      },
      refreshCarLocation(carList){
        AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
          this.getCarLocation(carList)
            .then(() => {
              this.setMarker(this.map, SimpleMarker);
            });
          this.refreshTimer = setInterval(() => {
            this.getCarLocation(carList)
              .then(() => {
                this.setMarker(this.map, SimpleMarker);
              });
          }, timeMap.carRefreshTime);
        });
      },
      getCarLocation(carList){
        let promises = Promise.all(carList.map((car) => {
          return new Promise((resolve, reject) => {
            api.main.getLocation({
              licenseNumber: car.licenseNumber,
            })
            .then((res) => {
              car = extend(car, res.data.data);
              car.position = [car.lng, car.lat];
              this.carList = carList;
              resolve();
            })
            .catch(() => reject());
          });
        }));
        return promises;
      },
      setMarker(map, SimpleMarker){
        for(let i =0 ; i < this.carList.length; i++){
          let car = this.carList[i];
          let isOnline = car.state && car.state.indexOf('ACC熄火') === -1;
          car.marker && (map.remove(car.marker));
          //创建SimpleMarker实例
          car.marker = new SimpleMarker({
            iconTheme: 'default',
            iconStyle: isOnline ? 'red' : 'blue',
            label: {
              content: car.licenseNumber,
              offset: new AMap.Pixel(40, 0)
            },
            map: map,
            position: car.position
          });
          AMap.event.removeListener(car.marker,'click',this.handleCarClick);
          AMap.event.addListener(car.marker,'click',this.handleCarClick);
        }
      },
      handleCarClick(e){
        for(let item of this.carList){
          if(item.licenseNumber === e.target.G.label.content){
            return this.onCarClick(item);
          }
        }
      },
      onCarClick(carInfo){
        this.carInfo = null;
        this.$nextTick(() => {
          this.carInfo = carInfo;
          this.pathSimplifierIns.hide();
        });

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
      getTripList(car){
        let {licenseNumber, tripList} = car;
        this.setShowDate(car);
        if(tripList) return;
        api.main.getTripList({licenseNumber})
          .then(({data}) => car.tripList = data.data || [])
          .catch(() => car.tripList = [])
      },
      setShowDate(car){
        this.carList.forEach((item) => item.showDate = false);
        car.showDate = true;
      },
      onTripClick(trip, car){
        let tripId = trip.id;
        car.showDate = false;
        api.main.getTripPois({tripId})
          .then(({data}) => {
          let path = [];
          data.data && data.data.forEach((item) => {
            item.lat && item.lng && path.push([item.lng, item.lat]);
          });
          this.setPath(path, {loop: false})
        });
      },
      setPath(path, option = {}){
        let {speed, loop} = option;
        loop = loop || false;
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
    position: relative;
    box-sizing: border-box ;
    .header{
      height: $header-height;
    }
    .map-wrap{
      width: 100%;
      position: absolute;
      top: $header-height;
      bottom: 0px;
      left: 0px;
    }
    .tab-list{
      color: #fff;
      display: inline-block;
      float: left;
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
    .history-tab{
      .car-list{
        display: none;
        position: absolute;
        z-index: 10;
        background: #fff;
        .car-item{
          position: relative;
          line-height: 40px;
          padding: 0 5px;
          &:hover{
            background: #ecf5ff;
            .data-list{
              display: block;
            }
          }
          span{
            color: #666;
          }
          .data-list{
            width: 200%;
            background: #fff;
            position: absolute;
            top: 0;
            right: 0;
            color: #666;
            transform: translate(100%, 0);
            .data-item{
              &:hover{
                background: #ecf5ff;
              }
            }
          }
        }
      }
      &:hover{
        .car-list{
          display: block;
        }
      }
    }

    #container{
      height: 100%;
    }
  }
</style>
