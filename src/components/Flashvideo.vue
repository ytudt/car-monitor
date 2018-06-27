<template>
  <div class="main">
    <button id="btn-livePlayAll">播放所有</button>
    <div class="left" v-show="false">
      实时：
      <br /> url：
      <input id="url-live" type="text" v-model="videoServerUrl"/>
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
      <button id="btn-livePlay">播放</button>
      <!--<button id="btn-livePlayAll">播放所有</button>-->
      <br /> 播放器ID：
      <select id="playerNum-live" style="width:50px;">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button id="btn-liveStop">停止</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <hr /> 回放：
      <br /> url：
      <input id="url-replay" type="text" v-model="videoServerUrl"/>
      <br /> simID：
      <input id="simId-replay" type="text" v-model="carIdMap[carNumber]" />
      <br /> 设备类型：
      <input id="devType-replay" type="text" value="0" />
      <br /> 通道号：
      <select id="devChn-replay" style="width:150px;">
        <option value="1" data-vid="">1</option>
        <option value="2" data-vid="">2</option>
        <option value="3" data-vid="">3</option>
        <option value="4" data-vid="">4</option>
      </select>
      <br /> 开始时间：
      <input id="beginTime" type="text" />
      <br /> 结束时间：
      <input id="endTime" type="text" />
      <br /> 当前页：
      <select id="dd_page">
        <option value="0">1</option>
      </select>
      <button id="btn_searchFile">查询文件</button>
      <br /> 当前文件：
      <select id="dd_file"></select>
      <button id="btn_play">播放</button>
      <br /> 播放器ID：
      <select id="playerNum-Replay" style="width:50px;">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <button id="btn_stopReplay">停止</button>
      <br />
      <br />
      <label style="color:red">注：同一设备只能同时回放一路视频</label>
    </div>
    <div class="right">
      <!--<div class="banner">-->
        <!--<button onclick="setLayout(1)">1</button>-->
        <!--<button onclick="setLayout(4)">4</button>-->
        <!--<button onclick="setLayout(9)">9</button>-->
        <!--<button onclick="setLayout(16)">16</button>-->
      <!--</div>-->
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
  import Cookies from 'js-cookie';
  import {videoInfo} from 'constant';
   export default {
    props: {
      carInfo: {
        type: Object,
      },
    },
    data () {
      return {
      }
    },
    computed:{
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

    },
    methods:{
      initVideo(){
        var carNumber = this.carNumber;
        let objFlash = bsjflashobj;
        $(function () {
          $("#simId-replay").attr("data-session", objFlash.getDateUnix());
          $("#simId-live").attr("data-session", objFlash.getDateUnix());
          initDatetime();
          objFlash.init("flashContent", 4, flashCallback, "", 0);
          $("#btn-livePlay").click(function () {
            var param = {
              "simID": $("#simId-live").val(),
              "sessionID": $("#simId-live").attr("data-session"),
              "devType": $("#devType-live").val(),
              "devChn": $("#devChn-live").val()
            };
            var src = $("#url-live").val();
            objFlash.live.open(src, param, carNumber, 1);
          });

          $("#btn-liveStop").click(function () {
            var videoId = $("#playerNum-live").find("option:selected").text();
            objFlash.live.close(parseInt(videoId));

          });
          //
          $("#btn-livePlayAll").click(function () {
            var src = $("#url-live").val();
            var max = $("#devChn-live").val();
            var param = {
              "simID": $("#simId-live").val(),
              "sessionID": $("#simId-live").attr("data-session"),
              "devType": $("#devType-live").val(),
              "devChn": 1
            };
            objFlash.live.open(src, param, carNumber, max);
          });

          $("#btn_searchFile").click(function () {
            $("#dd_file").empty();
            var src = $("#url-replay").val();
            var stime = objFlash.getDateUnix(new Date($("#beginTime").val().replace("T", " ")));
            var etime = objFlash.getDateUnix(new Date($("#endTime").val().replace("T", " ")));
            if (!stime || !etime || etime - stime < 0) {
              alert("时间有误");
              return;
            }
            var param = {
              "simID": $("#simId-replay").val(),
              "sessionID": $("#simId-replay").attr("data-session"),
              "devType": $("#devType-replay").val(),
              "devChn": $("#devChn-replay").val(),
              "beginTime": stime,
              "endTime": etime,
              "page": $("#dd_page").val()
            };
            objFlash.playback.searchFiles(src, param, function (fileObj) {
              console.log(fileObj)
              var files = fileObj.files;
              $("#dd_page").empty();
              if (fileObj && fileObj.files && fileObj.count > 0) {
                for (var index = 1; index <= fileObj.pageCount; index++) {
                  $("#dd_page").append("<option value='" + (index <= 1 ? 0 : index) +
                    "'>" + index + "</option>");
                }
                $("#dd_page").val(fileObj.page <= 1 ? 0 : fileObj.page);
                for (var index = 0; index < files.length; index++) {
                  $("#dd_file").append("<option value='" + index + "' data-stime='" +
                    files[index].stime + "' data-etime='" + files[index].etime +
                    "' title='" + objFlash.UnixToDate(files[index].stime).toJSON()
                      .replace("T", " ").substring(0, 19) + "-" + objFlash.UnixToDate(
                      files[index].etime).toJSON().replace("T", " ").substring(
                      0, 19) + "'>" + files[index].filename + "</option>");
                }
              } else {
                alert("未查询到文件");
                $("#dd_page").append("<option value=0>0</option>");
              }
            });
          });

          $("#btn_play").click(function () {
            var vid = $("#devChn-replay option:selected").attr("data-vid");
            var secoption = $("#dd_file option:selected");
            var stime = secoption.attr("data-stime");
            var etime = secoption.attr("data-etime");
            var index = secoption.val();
            var src = $("#url-replay").val();
            var param = {
              "simID": $("#simId-replay").val(),
              "sessionID": $("#simId-replay").attr("data-session"),
              "fileName": $("#dd_file").find("option:selected").text(),
              "devType": $("#devType-replay").val(),
              "devChn": $("#devChn-replay").val(),
              "beginTime": stime,
              "endTime": etime,
              "curTime": "0",
              "page": $("#dd_page").val()
            };
            vid = objFlash.playback.open(src, param, carNumber);
          });

          $("#btn_stopReplay").click(function () {
            var videoId = $("#playerNum-Replay").find("option:selected").text();
            objFlash.playback.close(parseInt(videoId));
          });

          $("#simId-replay").change(function () {
            $("#simId-replay").attr("data-session", objFlash.getDateUnix());
          });

          $("#simId-live").change(function () {
            $("#simId-live").attr("data-session", objFlash.getDateUnix());
          });

        });
      },
    },
  }

  function setLayout(videoCount) {
    objFlash.setLayout(videoCount);
    $("#playerNum-live").empty();
    $("#playerNum-Replay").empty();
    for (var i = 1; i <= videoCount; i++) {
      console.log(i)
      $("#playerNum-live").append("<option value='" + i + "'>" + i + "</option>");
      $("#playerNum-Replay").append("<option value='" + i + "'>" + i + "</option>");

    }

  }

  function initDatetime() {
    var n = new Date();
    n.setHours(n.getHours() + 8);
    $("#endTime").val(n.toJSON().substring(0, 16).replace("T", " "));
    n.setDate(n.getDate() - 1);
    $("#beginTime").val(n.toJSON().substring(0, 16).replace("T", " "));
  }

  function flashCallback(type, param, videoId, data) {
    switch (type) {
      case "playEnd":
        //
        break;
      case "selectedVideoId": //选择播放ID videoId
        break;
      case "openFail":
        //
        break;
      case "openOk":
        //
        console.log(param.simID + "," + param.devChn + "," + videoId);
        break;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .main {
    width: 100%;
    /*height: 750px;*/
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
