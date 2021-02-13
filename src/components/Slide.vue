<template>
    <div class="slide-wrap" ref="swiper">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: "Slide",
  mounted() {
    // 获取DOM对象
    let w = this.$refs.swiper;
    // 变量存储
    var startX = 0, //点击坐标
      currentX = 0, //当前坐标
      resultX = 0; //结束坐标
    var isDown = true; //是否按下
    var target = 0; //目标偏移

    w.addEventListener("touchstart", function (e) {
      startX = e.touches[0].pageX;
      isDown = true;
      //   目标坐标 = DOM对象总宽度 + DOM对象可视宽度
      target = -this.scrollWidth + this.clientWidth;
    });
    w.addEventListener("touchmove", function (e) {
      if (isDown) {
        var moveX = e.touches[0].pageX;
        //结束坐标 = 移动坐标 - 点击坐标 + 当前坐标
        resultX = moveX - startX + currentX;
        this.style["transform"] = `translateX(${resultX}px)`;
      }
    });
    w.addEventListener("touchend", function () {
      //当前坐标等于结束下标
      currentX = resultX;
      isDown = false; //状态结束停止移动
      if (currentX > 0) currentX = 0;
      if (currentX < target) currentX = target;
      this.style["transform"] = `translateX(${currentX}px)`;
    });
  },
};
</script>

<style>
.slide-wrap {
    /* transition:all .3s; */
}
</style>