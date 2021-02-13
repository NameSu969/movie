<template>
  <header class="header" :class="{ scrollHeader:isShow}">
    <slot>
    </slot>
    <div class="title">
      <h1>{{ title }}</h1>
    </div>
  </header>
</template>

<script>
export default {
  name: "Top",
  props: ["title",'isShow'],
};
</script>

<style lang="less" scoped>
.header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #f9f9f9;
  background: #fff;
  z-index: 99;
  .btn-back {
    position: absolute;
    width: 26px;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    text-align: center;
    margin-left: 15px;
    margin-top: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
  }
  .title {
    h1 {
      font-size: 16px;
      text-align: center;
    }
  }
}
.scrollHeader {
  position: fixed;
  border: 0;
  background: transparent;
  .title {
    h1 {
      font-size: 0;
    }
  }
}
</style>