<template>
  <!-- 影院电影清单 -->
  <div class="schedule-container">
    <Top :title="cinemainfo.name">
      <div class="btn-back" @click="$router.push('/cinemas')">
        <span class="iconfont icon-back"></span>
      </div>
    </Top>
    <div class="schedule-wrap">
      <div class="cinema-info">
        <div class="tags" v-if="cinemainfo.services" @click="$router.push('/cinema/'+cinemainfo.cinemaId)">
          <div
            class="tag"
            v-for="service in cinemainfo.services"
            :key="service.name"
          >
            {{ service.name }}
          </div>
          <div class="more">
            <div class="iconfont icon-next"></div>
          </div>
        </div>
        <div class="address">
          <span class="iconfont icon-weibiaoti102"></span>
          <div class="address-des text-hidden">
            {{ cinemainfo.address }}
          </div>
          <span class="iconfont icon-tel"></span>
        </div>
      </div>
      <!-- 影片列表 -->
      <div class="film-list">
        <div class="film-list-wrap" ref="filmListWrap">
          <div class="film-swiper" ref="swiper">
            <div
              class="film-swiper-item"
              v-for="item in films"
              :key="item.filmId"
              :class="{ 'film-active': item.filmId === nowFilm[0].filmId }"
              @click="selectFilm(item.filmId)"
            >
              <div class="film-poster">
                <img :src="item.poster" alt="" />
              </div>
              <p class="film-name">{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div
          class="film-list-bg"
          v-if="nowFilm.length"
          :style="{ backgroundImage: `url(${nowFilm[0].poster})` }"
        ></div>
      </div>
      <!-- 影片信息 -->
      <div
        class="film-info"
        v-if="nowFilm.length"
        @click="$router.push('/film/' + nowFilm[0].filmId)"
      >
        <div class="film-hd text-hidden">
          <span class="film-name"> {{ nowFilm[0].name }} </span>
          <span class="film-grade"> {{ nowFilm[0].grade }}分 </span>
        </div>
        <div class="film-desc text-hidden">
          {{ nowFilm[0].category }} | {{ nowFilm[0].runtime }}分钟 |
          {{ nowFilm[0].director }} | {{ nowFilm[0].actors | formatActors }}
        </div>
        <div class="more">
          <span class="iconfont icon-next"></span>
        </div>
      </div>
      <keep-alive>
        <router-view :nowFilm="nowFilm" :showDate.sync="showDate" @update:price="$emit('update:price',$event)"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
export default {
  name: "Cinema",
  components: {
    Top,
  },
  data() {
    return {
      cinemainfo: {},
      films: [],
      nowFilm: [],
      showDate: 0,
      result: 0,
    };
  },
  mounted() {
    this.$root.isLoading = true;
    const cinemaId = this.$route.params.cinemaId;
    const filmId = this.$route.params.filmId;

    this.swiper();

    //   影院信息
    this.$http({
      url: "/gateway/?cinemaId=" + cinemaId,
      headers: {
        "X-Host": "mall.film-ticket.cinema.info",
      },
    }).then((respone) => {
      this.cinemainfo = respone.data.data.cinema;
      this.result++;
    });

    //   影院清单
    this.$http({
      url: "/gateway/?cinemaId=" + cinemaId,
      headers: {
        "X-Host": "mall.film-ticket.film.cinema-show-film",
      },
    }).then((respone) => {
      if (!respone.data.data.films.length) {
        this.result++;
        console.log("空数据", this.result);
        return;
      }
      this.films = respone.data.data.films;
      this.result++;
      //   电影id不存在默认第一部电影
      if (!filmId) {
        this.nowFilm = [respone.data.data.films[0]];
        this.showDate = respone.data.data.films[0].showDate[0];
      } else {
        //   存在筛选检测
        this.films.forEach((item) => {
          if (item.filmId == filmId) {
            this.nowFilm = [item];
            this.showDate = item.showDate[0];
          }
        });
      }
    });
  },
  methods: {
    swiper() {
      var filmListWrap = this.$refs.filmListWrap;
      var swiper = this.$refs.swiper;

      //自身宽度/2 + 外边距
      var clientW = document.documentElement.clientWidth / 2 - 37.5;
      swiper.style["left"] = +clientW + "px";
      // 自适应位置
      window.addEventListener("resize", () => {
        clientW = document.documentElement.clientWidth / 2 - 37.5;
        swiper.style["left"] = +clientW + "px";
      });
      var startX = 0,
        moveX = 0,
        currentX = 0,
        endX = 0;
      var isDown = false;

      filmListWrap.addEventListener("touchstart", (e) => {
        startX = e.changedTouches[0].pageX;
        isDown = true;
      });
      filmListWrap.addEventListener("touchmove", (e) => {
        if (isDown) {
          moveX = e.changedTouches[0].pageX;
          //结束坐标 = 移动坐标 - 点击坐标 + 当前坐标
          endX = moveX - startX + currentX;
          swiper.style["left"] = +(clientW + endX) + "px";
        }
      });

      filmListWrap.addEventListener("touchend", () => {
        // ( 盒子宽度 / 2 ) - 轮播总宽度
        var targetX = 37.5 - swiper.offsetWidth;
        currentX = endX;
        if (currentX >= 0) currentX = 0;

        if (currentX <= targetX) currentX = targetX + 57.5;

        // 当前轮播盒子偏移量
        swiper.style["left"] = +(clientW + currentX) + "px";
      });
    },
    selectFilm(filmId) {
      this.$router.push(
        `/cinema/${this.$route.params.cinemaId}/film/${filmId}`
      );
    },
  },
  beforeRouteUpdate(to, from, next) {
    const filmId = to.params.filmId;
    this.films.forEach((item) => {
      if (item.filmId == filmId) {
        this.nowFilm = [item];
        this.showDate = item.showDate[0];
      }
    });
    next();
  },
  watch: {
    result() {
      if (this.result == 2) {
        this.$root.isLoading = false;
        this.result = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.schedule-container {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 10;
}
.schedule-wrap {
  .cinema-info {
    .tags {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 15px 15px;
      font-size: 12px;
      color: #3983ff;
      border-bottom: 1px solid #f9f9f9;
      .tag {
        padding: 0 3px;
        margin: 0 2px;
        color: #3983ff;
        border: 1px solid#3983ff;
      }
      .more {
        margin-left: 5px;
        .iconfont {
          font-size: 12px;
        }
      }
    }
    .address {
      height: 50px;
      display: flex;
      padding: 0 15px;
      justify-content: space-between;
      align-items: center;
      .address-des {
        font-size: 14px;
        padding: 0 10px;
      }
      .iconfont {
        font-size: 14px;
      }
    }
  }
  .film-list {
    position: relative;
    padding: 20px 0;
    overflow: hidden;
    .film-list-wrap {
      position: relative;
      height: 130px;
      .film-swiper {
        position: absolute;
        display: flex;
        .film-swiper-item {
          height: 110px;
          width: 75px;
          margin-right: 20px;
          margin-top: 10px;
          .film-poster {
            transition: all 0.2s linear;
            transform: scale(1);
            overflow: hidden;
            img {
              height: 110px;
              width: 100%;
              vertical-align: middle;
            }
          }
          .film-name {
            margin-top: 3px;
            color: #fff;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          &.film-active {
            .film-poster {
              filter: blur(0);
              border: 2px solid #fff;
              transform: scale(1.2);
            }
            .film-name {
              font-size: 0;
            }
          }
        }
      }
    }
    .film-list-bg {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: #fff no-repeat center;
      background-size: cover;
      filter: blur(10px);
      z-index: -1;
    }
  }
}
.film-info {
  position: relative;
  padding: 16px 0;
  background: #fff;
  border-bottom: 1px solid #f9f9f9;
  .film-hd {
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
    .film-grade {
      color: #ff5f16;
      margin-left: 10px;
    }
  }
  .film-desc {
    padding: 0 50px;
    font-size: 14px;
    color: #797d82;
    span {
      margin: 0 3px;
    }
  }
  .more {
    position: absolute;
    right: 25px;
    top: 25px;
    .iconfont {
      color: #797d82;
      font-size: 12px;
      font-weight: bold;
    }
  }
  // &:before {
  //   content: "";
  //   position: absolute;
  //   top: -9px;
  //   left: calc(50% - 9px);
  //   width: 18px;
  //   height: 18px;
  //   transform: rotate(45deg);
  //   background: #fff;
  // }
}
</style>