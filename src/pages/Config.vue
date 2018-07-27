<template lang="pug">
  div.config-wrap
    Header
      div.back
        router-link(:to="{ name: 'Main'}") 首页
    div.config-body
      .aside
        ul.config-list
          li.config-item(v-for="(item, index) in routeList" :key="index" v-bind:class="{select: item.name===currentRoute}")
            router-link(:to="{ name: item.name}")
              div.link {{item.meta.title}}
      .content
        router-view
</template>

<script>
  import Header from 'components/Header';
  import configRoutes from 'src/router/configRoutes'

  export default {
    data () {
      return {
        currentRoute: '',
        routeList: configRoutes,
      }
    },
    watch:{
      $route(to){
        this.setCurrentRouteName(to && to.name);
      }
    },
    components: {
      Header,
    },
    computed:{
    },
    created(){
      this.setCurrentRouteName(this.$route.name);
    },
    methods:{
      setCurrentRouteName(name){
        this.currentRoute = this.currentRoute = name;;
      },
    },
  }
</script>
<style lang="scss" scoped>
  .config-wrap{
    box-sizing: border-box;
    height: 100%;
      height: $header-height;
      .back{
        display: inline-block;
        height: 100%;
        color: #fff;
        line-height: $header-height;
        float: left;
        margin-left: 10px;
        cursor: pointer;
      }
    .config-body{
      position: absolute;
      top: $header-height;
      bottom: 0;
      width: 100%;
      background: #f7f7f7;
      padding: 10px;
      box-sizing: border-box;
      .aside{
        height: 100%;
        float: left;
        width: 200px;
        background: #fff;
        border: 1px solid $border-color-gray;
        margin-right: 10px;
        .config-list{
          height: 100%;
          .config-item{
            color: #000;
            height: $header-height;
            line-height: $header-height;
            &.select,&:hover{
              color: $font-color-blue;
              background: #f3faff;
            }
            .link{
              height: 100%;
            }
          }
        }
      }
      .content{
        border: 1px solid $border-color-gray;
        border-left: none;
        height: 100%;
        overflow: hidden;
        background: #fff;
        box-sizing: border-box;

      }
    }
  }
</style>
