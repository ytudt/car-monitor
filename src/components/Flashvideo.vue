<template>
  <div class="flash-video-wrap">
    <div class="container">
      <div id="flashContent" style="width:100%;height:100%">
        <p>
          点击下方logo安装Flash
        </p>
        <a href="http://www.adobe.com/go/getflashplayer">
          <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        carNumber: '京Q83YC7',
      }
    },
    computed:{
    },
    mounted(){
      this.initVideo();

    },
    methods:{
      initVideo(){
        let objFlash = bsjflashobj;
        console.log(objFlash);
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
    // $('#beginTime').datetimepicker({
    //   lang: 'ch',
    //   timepicker: false,
    //   scrollInput: false,
    //   format: 'Y-m-d H:i',
    //   formatDate: 'Y-m-d H:i',
    // });
    // $("#endTime").datetimepicker({
    //   lang: 'ch',
    //   timepicker: false,
    //   scrollInput: false,
    //   format: 'Y-m-d H:i',
    //   formatDate: 'Y-m-d H:i',
    // });
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
</style>
