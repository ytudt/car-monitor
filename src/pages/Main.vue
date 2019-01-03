<template lang="pug">
  .main-wrap
    Header.header
      ul.tab-list.clr
        li.tab-item.fl()
          el-dropdown
            span.el-dropdown-link.first 目标车辆信息
            el-dropdown-menu(slot="dropdown")
              el-dropdown-item(v-for="(item, index) in carList" :key="index")
                .content(@click="onCarClick(item)") {{item.licenseNumber}}
        li.tab-item.fl.history-tab
          span(@click="dialogFormVisible=true") 轨迹回放
          el-dialog(title="轨迹回放" :visible.sync="dialogFormVisible" width="70%" v-if="dialogFormVisible" )
            .speed-wrap
              el-radio(v-model="speedFlag" label="true") 二倍速
            ul.car-list
              .title 车辆列表
              li.car-item(v-for="(item, index) in carList" :key="index" @click="onHisCarClick(item)" v-bind:class="{active: currentHisCar===item}") {{item.licenseNumber}}
            .data-piker
              .title 车次时间
              el-date-picker(v-model="hisDate"
                            type="date"
                            @change="getTripList"
                            placeholder="选择时间")
            ul.out-list
              .title 车次列表
              li.out-item(v-for="(item, index) in hisOutList" :key="index" @click="onTripClick(item)") {{item.createTime}}
              div(v-if="!hisOutList.length") 无车次...
          ul.car-list(v-if="false")
            li.car-item(v-for="(item, index) in carList" :key="index"
                        @mouseenter="getTripList(item)")
        li.tab-item.fl
          router-link(:to="{ name: 'userConfig'}" v-if="showConfig") 配置台
    <!--CarDetail(v-if="carInfo" :carInfo="carInfo" @close="carInfo=null")-->
    el-dialog(class="carinfo-dialog" title="实时车辆" :visible.sync="carInfoVisible" width="70%" @close="thisLicenseNumber = null")
        el-tabs(v-model="tabsActiveName")
            el-tab-pane(label="视频" name="1")
                MonitorView(v-if="thisLicenseNumber" :simId="thisSimId" :license="thisLicenseNumber")
            el-tab-pane(label="货物" name="2")
                CarDetailList(v-if="carInfo" :carInfo="carInfo")
    .map-wrap()
      div(id="container")
</template>

<script>
  import api from 'api';
  import {extend, getYMD} from 'util';
  import message from 'util/message'
  import {videoInfo, timeMap, menuMap} from "constant";
  import Header from 'components/Header';
  import CarDetailList from 'components/CarDetailList';
  import MonitorView from 'components/MonitorView';
  import {mapGetters} from 'vuex';

  export default {
    name: 'Main',
    components: {
      Header,
      CarDetailList,
      MonitorView
    },
    computed: {
      ...mapGetters([
        'globalParams',
      ]),
      showConfig(){
        return this.globalParams.menuList && this.globalParams.menuList.indexOf(menuMap.config) !== -1;
      },
    },
    data () {
      return {
        speedFlag: '',
        dialogFormVisible: false,
        hisDate: '',
        currentHisCar: null,
        hisOutList: [],
        showCarDetail: false,
        map: null,
        carInfo: null,
        carList: [],
        refreshTimer: null,
        pathSimplifierIns: null,
        carInfoVisible: false,
        tabsActiveName: '1',
        thisLicenseNumber: null,
        thisSimId: null
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
            .then(({data}) => {
              car = extend(car, data.data);
              const p = GPS.gcj_encrypt(car.lat, car.lng);
              car.position = [p.lon, p.lat];
              // car.position = [car.lng, car.lat];
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
          let isOnline = car.state && (car.state.indexOf('ACC熄火') === -1 && car.state.indexOf('停车') === -1);
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
          this.carInfoVisible = true;
          this.carInfo = carInfo;
          this.thisLicenseNumber = carInfo.licenseNumber;
          this.thisSimId = videoInfo.carIdMap[this.thisLicenseNumber];
          this.pathSimplifierIns.hide();
        });

      },
      initPath(map, PathSimplifier){
        this.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, //所属的地图实例
          getPath: function(pathData) {
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
        if(tripList) return;
        api.main.getTripList({licenseNumber})
          .then(({data}) => car.tripList = data.data || [])
          .catch(() => car.tripList = [])
      },
      onTripClick(trip){
        console.log(trip);
        this.dialogFormVisible = false;
        let tripId = trip.id;
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
        speed = this.speedFlag ? 60000 : 30000;
        this.pathSimplifierIns.setData([{name: '车辆轨迹', path}]);
        this.pathSimplifierIns.createPathNavigator(0, {loop, speed,}).start();
      },
      onHisCarClick(car){
        this.currentHisCar = car;
        this.getTripList();
      },
      getTripList(){
        if(!this.currentHisCar || !this.hisDate) return;
        const {licenseNumber} = this.currentHisCar;
        let date = getYMD(this.hisDate);
        api.main.getTripList({licenseNumber, date})
          .then(({data}) => {
            this.hisOutList = data.data;
          })
          .catch(() => this.hisOutList = [])
      }
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
      .tab-item,.el-dropdown-link.first{
        font-size: 16px;
      }
      .tab-item{
        float: left;
        height: $header-height;
        line-height: $header-line-height;
        padding: 10px;
        cursor: pointer;
        .el-dropdown-link{
          color: #fff;
        }
      }
      .tab-item:hover{
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
    .history-tab{
      .speed-wrap{
        text-align: left;
        padding-left: 100px;
        border-bottom: 1px solid #ddd;
      }
      .el-dialog__body{
        padding: 0;
      }
      .el-dialog__header{
        padding-bottom: 0;
      }
      .car-list,.data-piker,.out-list{
        padding-top: 10px;
        display: inline-block;
        width: 33.3%;
        vertical-align: top;
        .title{
          font-size: 18px;
          line-height: 22px;
        }
      }
      .car-list,.data-piker{
        border-right: 1px solid #ddd;
        height: 400px;
      }
      .car-list{
        background: #fff;
      }
      .car-item,.out-item{
        position: relative;
        padding: 0 5px;
        font-size: 14px;
        line-height: 30px;
        &:hover,&.active{
          background: #ecf5ff;
        }
        span{
          color: #666;
        }
      }
    }
    #container{
      height: 100%;
    }
    .carinfo-dialog .el-dialog__body{
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
