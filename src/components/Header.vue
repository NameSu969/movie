<template>
  <header class="header">
    <div class="city">
      <router-link to="/city" tag="span" class="city-name">{{nowCity.name}}</router-link>
      <span class="iconfont icon-down"></span>
    </div>
    <div class="title">
      <h1 class="info-col">{{ title }}</h1>
    </div>
    <div class="search">
      <slot name="iconfont"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    title: {
      type: String,
      default: "爱看电影",
    },
    nowCity: {
      type: Object,
    }
  },
};
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  height: 45px;
  width: 100%;
  line-height: 45px;
  background-color: #fff;
  border-bottom: 1px solid #f9f9f9;
  z-index: 15;
  .city {
    position: absolute;
    top: 0;
    left: 0;
    width: 70px;
    height: 45px;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
  }
  .title {
    margin-left: 70px;
    margin-right: 60px;
    h1 {
      font-size: 14px;
      color: #000;
      text-align: center;
    }
  }
  .search {
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    font-size: 14px;
    text-align: center;
  }
}
.fixedHeader {
  position: fixed;
  top: 0;
}
</style>