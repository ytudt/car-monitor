<template>
  <div class="main">
    <button id="btn-livePlayAll" @click="openVideo">播放</button>
    <button id="btn-liveStop" @click="puaseVideo()">停止</button>
    <div class="left" v-show="false">
      <br /> simID：
      <input id="simId-live" type="text" v-model="carIdMap[carNumber]" />
      <br /> 设备类型：
      <input id="devType-live" type="text" value="0" />
      <br /> 通道号：
      <select id="devChn-live" style="width:80px;">
        <option value="1" data-vid="">1</option>
        <option value="2" data-vid="">2</option>
        <option value="3" data-vid="">3</option>
        <option value="4" data-vid="">4</option>
      </select>
      <br /> 播放器ID：
      <select id="playerNum-live" style="width:50px;" v-model="max">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
    <div class="right">
      <div class="container">
        <div id="flashContent" style="width:100%;height:100%">
          <p>
            点击图标安装flash播放视频
          </p>
          <a href="http://www.adobe.com/go/getflashplayer">
          <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {videoInfo, timeMap, globConfigMap} from 'constant';
  import {mapGetters} from 'vuex';

  let objFlash = bsjflashobj;
   export default {
    props: {
      carInfo: {
        type: Object,
      },
    },
    data () {
      return {
        max: '1',
      }
    },
    watch: {
      carNumber(){
        this.autoPlay();
      },
    },
    computed:{
      ...mapGetters([
        'globalParams',
      ]),
      configList(){
        return this.globalParams.configList;
      },
      videoTime: {
        get(){
          let result = 0;
          this.configList.forEach((item) => {
            if(item.settingCode === globConfigMap.VIDEO_PLAY_TIME){
              result = parseInt(item.value);
            }
          });
          console.log(result);
          return result;
        },
        set(){},

      },
      carNumber(){
        return this.carInfo.licenseNumber;
      },
      carIdMap(){
        return videoInfo.carIdMap;
      },
      videoServerUrl(){
        return videoInfo.videoServerUrl;
      },
    },
    mounted(){
      this.initVideo();
      this.autoPlay();

    },
    methods:{
      initVideo(){
          objFlash.init("flashContent", 4, () => {}, "", 0);
      },
      autoPlay(){
        let timer = setInterval(() => {
          if(objFlash.live && objFlash.live.open && flashobj && flashobj.open){
            clearInterval(timer);
            setTimeout(() => {
              this.openVideo();
            }, 2000);
          }
        }, 1000);
      },
      puaseVideo(){
        for(let i = 1; i <= 4; i++){
          objFlash.live.close(i);
        }
      },
      openVideo(){
        setTimeout(() => {
          this.puaseVideo();
        }, this.videoTime * 1000);
        const {carIdMap, carNumber} = this;
        let src = this.videoServerUrl;
        let max = this.max;
        let simID = carIdMap[carNumber];
        let sessionID = objFlash.getDateUnix();
        let devType = '0';
        let param = {};
        for(let i = 1; i <=4 ; i++){
          param = {
            simID,
            sessionID,
            devType,
            devChn: i,
          }
          this.puaseVideo();
          objFlash.live.open(src, param, this.carNumber, max);
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .main {
    width: 100%;
    margin: 3px;
    margin: 0 auto;
  }

  .right {
    width: 100%;
    height: 400px;
    margin: 1px;
    text-align: left;
    float: left;
  }

  .container {
    height: 95%;
    border: 1px solid blue;
    margin: 1px;
  }
</style>
