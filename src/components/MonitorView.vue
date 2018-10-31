<template lang="pug">
    div.monitor-view
      div(style=" font-weight: bolder; text-align: left; margin-bottom: 10px;")
          span(style="margin-right: 20px;") 车牌号：{{license}}
          span(style="margin-right: 20px;") 设备号：{{simId}}
          el-button(size="mini" type="default" v-if="isPlay" @click="close") 停止
          el-button(size="mini" type="primary" v-else @click="open") 播放
      div(:id="containerEleId")
</template>

<script>
  export default {
    name: "MonitorView",
    props: ['license', 'simId'],
    data() {
      return {
        userkey: 'd1d5614b-5947-4745-b73f-482fa9c23ac8',
        baseURL: 'wss://videostream.car900.com/',
        playList: [],
        player: null,
        containerEleId: 'container',
        channel: [1, 2, 3, 4],
        protocolType: 2,
        isPlay: false
      }
    },
    methods: {
      // 创建视频控件
      createPlayer() {
        const that = this;
        that.player ? that.player.destroy() : null;
        that.player = new byskplayer({
          id: that.containerEleId,
          isReal: true,
          isRecord: false,
          userId: 'BA05',
          userkey: that.userkey,
          baseURL: that.baseURL
        });
        that.player.poster = '/poster.png';  //设置预览图片
        that.player.setPlayerNum(4);  //设置视频画面
      },
      open() {
        const that = this;
        that.isPlay = true;
        const obj = that.playList.find(p => p.device == device && p.channel == channel);
        if (obj) return; //已经在播放的则不能再播放
        const tidObj = that.player.allocate(that.channel.length); //根据通道数申请
        if (tidObj.flag === 1) {
          //申请成功
          const params = {
            device: that.simId, //终端号
            channel: that.channel.join(), //通道号 （1~8）
            protocolType: that.protocolType, //协议类型，1：GF-1078，2：GA系列
            plate: that.license,//车牌号（可选
          };
          that.player.real.open(tidObj.ids, params, res => {
            console.log(res);
          });
          that.playList.push(...tidObj.ids.map((p, i) => {
            return {
              ...params,
              channel: that.channel[i]
            };
          }));
        } else {
          //申请失败
          that.$message.error('申请失败');
        }
      },
      // 关闭
      close: function () {
        const that = this;
        for (let i = 0; i < that.channel.length; i++) {
          const item = that.channel[i];
          let index = that.playList.findIndex(p => p.device == that.simId && p.channel == item);
          let obj = that.playList[index];
          if (obj) that.player.real.close(obj.tid, {
            device: obj.device,
            channel: obj.channel,
            protocolType: obj.protocolType
          }, res => {
            console.log(res);
          });
          that.playList.splice(index, 1);
        }
        that.isPlay = false;
      }
    },
    created() {
      this.$nextTick(() => {
        this.createPlayer();
      });
    }
  }
</script>

<style scoped>
    .monitor-view{
        height: 400px;
        margin-bottom: 50px;
    }
</style>
