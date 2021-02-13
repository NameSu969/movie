<template>
  <div class="cinema-list-wrap">
    <ul class="cinema-list">
      <li
        class="cinema-list-item"
        v-for="cinema in cinemaList"
        :key="cinema.cinemaId"
        @click="$router.push('/cinema/'+cinema.cinemaId+'/film')"
      >
        <a href="javascript:;" class="cinema-item">
          <div class="cinema-info-lf text-hidden">
            <span class="cinema-name">{{ cinema.name }}</span>
            <span class="cinema-address">{{ cinema.address }}</span>
          </div>
          <div class="cinema-info-lr text-hidden">
            <span class="price"
              >￥{{ (cinema.lowPrice / 100).toFixed(1) }} 起</span
            >
            <span class="distance">距离{{ cinema.Distance.toFixed(2) }}km</span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CinemaList",
  props: ["cinemaList"],
};
</script>

<style lang="less" scoped>
.cinema-list-wrap {
  position: relative;
  margin-bottom: 50px;
}
.cinema-list {
  overflow: hidden;
  .cinema-list-item {
    padding: 20px 15px;
    border-bottom: 1px solid #f9f9f9;
    .cinema-item {
      display: block;
      font-size: 14px;
      overflow: hidden;
      .cinema-info-lf {
        float: left;
        width: calc(100% - 90px);
        text-align: left;
        color: #000;
        .cinema-address {
          display: block;
          color: #797d82;
          margin-top: 5px;
          font-size: 12px;
        }
      }
      .cinema-info-lr {
        float: right;
        width: 70px;
        text-align: center;
        color: #ff4958;
        .price {
          font-weight: bold;
        }
        .distance {
          display: block;
          color: #797d82;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>