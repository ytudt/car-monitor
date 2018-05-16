<template lang="pug">
  .main-wrap
    Header
      ul.tab-list.clr
        li.tab-item.fl 总览
        li.tab-item.fl 目标车辆信息
        li.tab-item.fl 轨迹回放
        li.tab-item.fl 车辆配置
      .logout(@click="logOut") 退出登录
    .map-wrap(id="container" tabindex="0")
</template>

<script>
  import Header from 'components/Header';
  import Cookies from 'js-cookie';
  export default {
    name: 'Main',
    components: {
      Header
    },
    data () {
      return {
      }
    },
    mounted(){
      console.log(this._);
      let map = new AMap.Map('container', {
        resizeEnable: true,
        zoom:11,
        center: [116.397428, 39.90923]
      });
      //加载SimpleMarker
      AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {

        var iconTheme = 'default';

        //内置的样式
        var iconStyles = SimpleMarker.getBuiltInIconStyles(iconTheme);

        //获取一批grid排布的经纬度
        var lngLats = getGridLngLats(map.getCenter(), 5, iconStyles.length, 130, 70);
        console.log(lngLats);

        for (var i = 0, len = lngLats.length; i < len; i++) {
          console.log(iconStyles[i]);

          new SimpleMarker({
            // iconTheme: iconTheme,
            iconStyle: 'blue', // 'red', 'blue'
            //图标文字
            iconLabel: {
              //A,B,C.....
              // innerHTML: String.fromCharCode('A'.charCodeAt(0) + i),
              style: {
                //颜色, #333, red等等，这里仅作示例，取iconStyle中首尾相对的颜色
                // color: iconStyles[len - 1 - i]
              }
            },

            //显示定位点
            //showPositionPoint:true,

            map: map,
            position: lngLats[i],
            label: {
              content: '测试',
              offset: new AMap.Pixel(27, 25)
            }
          });
        }

      });

      /**
       * 返回一批网格排列的经纬度

       * @param  {AMap.LngLat} center 网格中心
       * @param  {number} colNum 列数
       * @param  {number} size  总数
       * @param  {number} cellX  横向间距
       * @param  {number} cellY  竖向间距
       * @return {Array}  返回经纬度数组
       */
      function getGridLngLats(center, colNum, size, cellX, cellY) {

        var pxCenter = map.lnglatToPixel(center);

        var rowNum = Math.ceil(size / colNum);

        var startX = pxCenter.getX(),
          startY = pxCenter.getY();

        cellX = cellX || 70;

        cellY = cellY || 70;


        var lngLats = [];

        for (var r = 0; r < rowNum; r++) {

          for (var c = 0; c < colNum; c++) {

            var x = startX + (c - (colNum - 1) / 2) * (cellX);

            var y = startY + (r - (rowNum - 1) / 2) * (cellY);

            lngLats.push(map.pixelToLngLat(new AMap.Pixel(x, y)));

            if (lngLats.length >= size) {
              break;
            }
          }
        }
        return lngLats;
      }
    },
    methods: {
      logOut(){
        Cookies.remove('token');
        this.$router.push({
            name: 'Login',
        });

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
        &:active{
          color: #ccc;
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
