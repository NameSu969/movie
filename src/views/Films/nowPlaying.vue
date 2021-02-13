<template>
  <div class="nowPlaying-list-content">
    <van-list
      class="nowPlaying-wrap"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onload"
      offset="100"
      :immediate-check= false
    >
      <ul class="nowPlaying-list">
        <li
          class="nowPlaying-item"
          v-for="film in nowPlaying"
          :key="film.filmId"
          @click="handlerToDetail(film.filmId)"
        >
          <a href="javascript:void(0);" class="film-wrap">
            <!-- 电影海报图 -->
            <div class="film-img">
              <img :src="film.poster" />
            </div>
            <!-- 电影信息 -->
            <div class="film-info">
              <!-- 电影名称 -->
              <div class="film-name text-hidden">
                <span class="name">{{ film.name }}</span>
                <span class="type">{{ film.filmType.name }}</span>
              </div>
              <!-- 电影评分 -->
              <div class="film-grade text-hidden">
                评分
                <span class="grade">{{ film.grade || "暂无评分" }}</span>
              </div>
              <!-- 电影主演 -->
              <div class="film-actors text-hidden">
                <span class="actors"
                  >主演：{{ film.actors | formatActors }}</span
                >
              </div>
              <!-- 电影信息 -->
              <div class="film-detail text-hidden">
                <span class="label">{{ film.runtime }}分钟</span>
              </div>
            </div>
            <!-- 预售 -->
            <div
              class="film-buy"
              @click.stop="$router.push(`/film/${film.filmId}/cinemas`)"
            >
              购票
            </div>
          </a>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
import Vue from "vue";
import { List } from "vant";
Vue.use(List);

export default {
  name: "nowPlaying",
  props: ["nowCity"],
  data() {
    return {
      nowPlaying: [],
      loading: false,
      finished: false,
      total: 0,  //数据总长度
      pageNum: 1,
    };
  },
  mounted() {
    this.getFilms();
  },
  methods: {
    getFilms() {
      this.$root.isLoading = true;
      this.$http({
        url:
          "/gateway?cityId=" +
          this.nowCity.cityId +
          "&pageNum="+this.pageNum+"&pageSize=10&type=1",
        headers: {
          "X-Host": "mall.film-ticket.film.list",
        },
      }).then((respone) => {
        this.nowPlaying = [...this.nowPlaying, ...respone.data.data.films];
        this.$root.isLoading = false;
        this.loading = false;
        this.total = respone.data.data.total
      });
    },
    handlerToDetail(id) {
      this.$router.push("/film/" + id);
    },
    onload() {
      this.loading = true;
      this.pageNum++
      // 加载状态结束
      if(this.nowPlaying.length >= this.total){
        this.finished = true;
        return
      }
      this.getFilms();
    },
  },
  beforeRouteEnter (to, from, next) {
    console.log(to);
    next(vm => {
      window.localStorage.setItem('nowCity',JSON.stringify(vm.nowCity));
    })
  }
};
</script>

<style lang="less" scoped>
.nowPlaying-wrap {
  overflow: hidden;
  position: relative;
}
.nowPlaying-list-content {
  margin-bottom: 50px;
  .nowPlaying-list {
    margin-left: 14px;
    margin-right: 14px;
    .nowPlaying-item {
      padding: 14px 0;
      border-bottom: 1px solid #f9f9f9;
      background: #fff;
      .film-wrap {
        display: flex;
        align-items: center;
        overflow: hidden;
        .film-img {
          float: left;
          width: 66px;
          height: 93px;
          background: #f9f9f9;
        }
        .film-info {
          float: left;
          flex: 1;
          width: calc(100% - 116px);
          padding: 10px;
          font-size: 14px;
          text-align: left;
          color: #797d82;
          .film-name {
            font-size: 16px;
            color: #000;
            .type {
              padding: 0 5px;
              margin-left: 5px;
              font-size: 12px;
              color: #fff;
              border-radius: 5px;
              background: #ff4958;
            }
          }
          .film-grade {
            margin: 5px 0;
            color: #797d82;
            .grade {
              color: #ff5f16;
            }
          }
        }
        .film-buy {
          float: right;
          width: 50px;
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          text-align: center;
          color: #fff;
          background: #3983ff;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>