<template>
  <div class="schedule-wrap">
    <!-- 放票时间表 -->
    <div class="date-list">
      <Slide>
        <ul class="date-list-wrap" v-if="nowFilm.length">
          <li
            class="date-list-item"
            v-for="show in nowFilm[0].showDate"
            :key="show"
            :class="{ active: showDate == show }"
            @click="selectDate(show)"
          >
            {{ show | formatDate }}
          </li>
        </ul>
      </Slide>
    </div>
    <div class="schedule-list">
      <ul class="schedule-list-wrap" v-if="showFilms">
        <li
          class="schedule-item"
          v-for="item in showFilms"
          :key="item.scheduleId"
          @click="handlerSchedule(item)"
        >
          <div class="time text-hidden">
            <div class="start-at">{{ item.showAt | formatTime }}</div>
            <div class="end-at">{{item.endAt | formatTime}}散场</div>
          </div>
          <div class="middle text-hidden">
            <div class="language">{{item.filmLanguage}}{{item.imagery}}</div>
            <div class="hall">{{item.hallName}}</div>
          </div>
          <div class="right text-hidden">
            <div class="buy-ticket">购票</div>
            <div class="lowest-price">￥{{item.salePrice / 100}}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 无场次 -->
    <div class="schedule-list-empty" v-if="!showFilms.length">
      <div class="img-wrap">
        <span class="iconfont icon-moviecamera"></span>
      </div>
      <div class="empty-tip">暂无场次</div>
    </div>
  </div>
</template>

<script>
import Slide from "@/components/Slide.vue";
export default {
  name: "Schedule",
  props: ["nowFilm", "showDate"],
  components: {
    Slide,
  },
  data() {
    return {
      showFilms: [],
      storageShow: [],
    };
  },
  methods: {
    selectDate(time) {
      this.getShowDate(time);
      this.$emit('update:showDate',time);
    },
    getShowDate(showDate) {
      this.$root.isLoading = true;
      var filmId = this.nowFilm[0].filmId;
      var cinemaId = this.$route.params.cinemaId;

      // 检测是否存在该电影数据
      for (var i = 0; i < this.storageShow.length; i++) {
        if (
          this.storageShow[i].filmId == filmId &&
          this.storageShow[i].date == showDate
        ) {
          this.$root.isLoading = false
          return;
        }
      }

      var random = Math.random().toString().substr(2,7);
      this.$http({
        url: `/gateway/?filmId=${filmId}&cinemaId=${cinemaId}&date=${showDate}&k=${random}`,
        headers: {
          "X-Host": "mall.film-ticket.schedule.list",
        },
      }).then((respone) => {
        console.log(respone.data.data);
        if(!respone.data.data){
          this.$root.isLoading = false;
          return
        }
        this.showFilms = respone.data.data.schedules;
        this.$root.isLoading = false;
        // 缓存以请求数据
        respone.data.data.schedules.forEach((data) => {
          this.storageShow.push({
            filmId: filmId,
            ...data,
            date: showDate,
          });
        });
      });
    },
    handlerSchedule(item){
      this.$router.push(`/schedule/${item.scheduleId}`)
      this.$emit('update:price',item.salePrice / 100)
    }
  },
  watch: {
    nowFilm() {
      this.getShowDate(this.showDate);
    },
    showDate(){
        var filmId = this.nowFilm[0].filmId;
        console.log('查找');

        this.showFilms = this.storageShow.filter(
            (item) => item.filmId == filmId && item.date == this.showDate
        );
    }
  },
};
</script>

<style lang="less" scoped>
.date-list {
  height: 50px;
  overflow: hidden;
  background: #fff;
  .date-list-wrap {
    display: flex;
    margin: 0 15px;
    border-bottom: 1px solid #f9f9f9;
    .date-list-item {
      flex: 0 0 120px;
      width: 120px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      text-align: center;
      &.active {
        color: #3983ff;
        font-weight: bold;
        border-bottom: 2px solid #3983ff;
      }
    }
  }
}

.schedule-list {
  background: #fff;
  .schedule-item {
    padding: 20px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    border-bottom: 1px solid #f9f9f9;
    .time {
      width: 100px;
      text-align: left;
      .end-at {
        margin-top: 5px;
        color: #797d82;
      }
    }
    .middle {
      width: calc(100% - 220px);
      margin: 0 5px;
      text-align: left;
      .hall {
        margin-top: 5px;
        color: #797d82;
      }
    }
    .right {
      height: 28px;
      width: 120px;
      line-height: 28px;
      .buy-ticket {
        float: right;
        width: 48px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        border: 1px solid #3983ff;
        background: #3983ff;
        border-radius: 15px;
      }
      .lowest-price {
        color: #ff4958;
        margin-right: 50px;
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
.schedule-list-empty {
  padding: 20px 0;
  color: #797d82;
  .iconfont {
      font-size: 58px;
  }
  .empty-tip {
    margin-top: 5px;
    font-size: 16px;
  }
}
</style>