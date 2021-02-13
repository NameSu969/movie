<template>
  <div class="nav-bar">
    <router-link to="/films" tag="div" class="films active">
      <span class="iconfont icon-movie"></span>
      <span>电影</span>
    </router-link>
    <router-link to="/cinemas" tag="div"  class="cinemas">
      <span class="iconfont icon-cinema"></span>
      <span>影院</span>
    </router-link>
    <router-link to="/leaderBoard" tag="div"  class="leaderBoard">
      <span class="iconfont icon-paixing"></span>
      <span>票房</span>
    </router-link>
    <router-link to="/personal" tag="div"  class="personal">
      <span class="iconfont icon-caidaniconwodehui"></span>
      <span>我的</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style lang="less" scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-top: 1px solid #f9f9f9;
  background: #f9f9f9;
  display: flex;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 25%;
    height: 50px;
    font-size: 14px;
    text-align: center;
    color: #797d82;
    .iconfont {
      width: 100%;
      font-size: 24px;
      font-weight: normal;
      display: block;
    }
    &.router-link-active {
      color: #3983ff;
    }
  }
}
</style>