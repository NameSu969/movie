<template>
  <div class="comingSoon-list-content">
    <van-list
      class="nowPlaying-wrap"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onload"
      offset="100"
      :immediate-check= false
    >
      <ul class="comingSoon-list">
        <li
          class="comingSoon-item"
          v-for="film in comingSoon"
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
                电影评分
                <span class="grade">{{ film.grade || '暂无评分'}}</span>
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
            <div class="film-buy" v-if="film.isPresale" @click.stop="$router.push(`/film/${film.filmId}/cinemas`)">预售</div>
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
  name: "ComingSoon",
  props: ['nowCity'],
  data() {
    return {
      comingSoon: [],
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
          "&pageNum="+this.pageNum+"&pageSize=10&type=2",
        headers: {
          "X-Host": "mall.film-ticket.film.list",
        },
      }).then((respone) => {
        this.comingSoon = [...this.comingSoon, ...respone.data.data.films];
        this.$root.isLoading = false;
        this.loading = false;
        this.total = respone.data.data.total
      });
    },
    handlerToDetail(id){
      this.$router.push("/film/" + id);
    },
    onload() {
      this.loading = true;
      this.pageNum++
      // 加载状态结束
      if(this.comingSoon.length >= this.total){
        this.finished = true;
        return
      }
      this.getFilms();
    },
  },
};
</script>

<style lang="less" scoped>
.comingSoon-wrap {
  overflow: hidden;
  position: relative;
}
.comingSoon-list-content {
  margin-bottom: 50px;
  .comingSoon-list {
    margin-left: 14px;
    margin-right: 14px;
    .comingSoon-item {
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
          background: #ff5f16;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>