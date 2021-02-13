<template>
  <div class="film">
    <Header :nowCity="nowCity" title="爱看电影"/>
    <div class="tabs-bar">
      <ul class="tabs-nav">
        <li class="tabs-item">
          <router-link to="/films/nowPlaying">正在热映</router-link>
        </li>
        <li class="tabs-item">
          <router-link to="/films/comingSoon">即将上映</router-link>
        </li>
      </ul>
    </div>
    <keep-alive>
      <router-view :nowCity="nowCity"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "Films",
  props: ['nowCity'],
  components: {
    Header,
  },
};
</script>

<style lang="less" scoped>
.tabs-bar {
  position: sticky;
  top: 45px;
  width: 100%;
  z-index: 10;
  &.fixedHeader {
    position: fixed;
    top: 45px;
  }
  .tabs-nav {
    display: flex;
    height: 50px;
    background: #fff;
    border-bottom: 2px solid #f9f9f9;
    .tabs-item {
      flex: 1;
      text-align: center;
      a {
        height: 50px;
        line-height: 50px;
        display: inline-block;
        color: #000;
        &.router-link-exact-active {
          color: #3983ff;
          border-bottom: 2px solid #3983ff;
        }
      }
    }
  }
}

</style>