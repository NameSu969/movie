<template>
  <div class="film-wrap">
    <header class="header">
      <div class="back">
        <span class="iconfont icon-back" @click="$router.go(-1)"></span>
      </div>
      <div class="title">
        <h1 class="text-hidden" v-if="filmInfo">{{ filmInfo.name }}</h1>
      </div>
      <div class="search">
        <span
          class="iconfont icon-search"
          @click="$router.push('/cinemas/search')"
        ></span>
      </div>
    </header>
    <!-- 放票时间表 -->
    <div class="date-list">
      <Slide>
        <ul class="date-list-wrap">
          <li
            class="date-list-item"
            :class="{ active: showDate.showDate == nowDate.showDate }"
            v-for="showDate in showCinemas"
            :key="showDate.showDate"
            @click="selectShowDate(showDate)"
          >
            {{ showDate.showDate | formatWeek }}
            {{ showDate.showDate | formatDate }}
          </li>
        </ul>
      </Slide>
    </div>
    <!-- 区选择 -->
    <div class="district">
      <div class="cinema-list-tag">
        <ul class="cinema-list-tag-nav">
          <li @click="isSelect = !isSelect">
            <span class="cinema-list-tag-name">{{name}}</span>
            <span class="iconfont icon-down"></span>
          </li>
          <li>
            <span class="cinema-list-tag-name">最近去过</span>
            <span class="iconfont icon-down"></span>
          </li>
        </ul>
      </div>
      <!-- 区筛选 -->
      <div class="filter-box" ref="filterBox" v-show="isSelect">
        <div class="filter-wrap">
          <ul class="district-list">
            <li
              v-for="item in districts"
              :key="item.districtId"
              :class="{ selected: item.districtId === districtId }"
              @click="hanlderCheck(item.districtId)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 影院列表 -->
    <div class="cinema-list-wrap">
      <ul class="cinema-list">
        <li
          class="cinema-list-item"
          v-for="cinema in nowdistrict"
          :key="cinema.cinemaId"
          @click.stop="
            $router.push(
              '/cinema/' + cinema.cinemaId + '/film/' + filmInfo.filmId
            )
          "
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
              <span class="distance"
                >距离{{ cinema.Distance.toFixed(2) }}km</span
              >
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Slide from "@/components/Slide.vue";
export default {
  name: "Film",
  props: ["nowCity"],
  components: {
    Slide,
  },
  data() {
    return {
      isSelect: false,
      districts: [],  //分区
      filmInfo: {},
      showCinemas: {}, //时间表数据
      cinemaList: [], //影院列表
      nowDate: 0, //当前选中时间
      districtId: "",  //当前区
      name: '全城'
    };
  },
  methods: {
    hanlderCheck(id) {
      this.districtId = id
      this.isSelect = false;
    },
    getCinemaList(cinemaIds) {
      //请求当前时间影院
      this.$root.isLoading = true;
      this.districts = [{ name: "全城", districtId: "" }];

      this.$http({
        method: "post",
        url: "/gateway",
        headers: {
          "X-Host": "mall.film-ticket.cinema.batch-cinema",
        },
        data: {
          cityId: this.nowCity.cityId,
          cinemaIds: cinemaIds,
        },
      }).then((respone) => {
        this.cinemaList = respone.data.data.cinemas;
        this.$root.isLoading = false;

        //   默认全城
        this.districtId = "";
        // 获取城市分区
        var arrName = [];
        this.cinemaList.forEach((item) => {
          if (!arrName.includes(item.districtName)) {
            arrName.push(item.districtName);
            this.districts.push({
              name: item.districtName,
              districtId: item.districtId,
            });
          }
        });
      });
    },
    selectShowDate(showDate) {
      this.nowDate = showDate;
      this.getCinemaList(showDate.cinemaList.join(","));
    },
  },
  mounted() {
    this.$root.isLoading = true;
    var cityId = this.nowCity.cityId;
    var filmId = this.$route.params.filmId;

    // 请求电影信息
    this.$http({
      url: `/gateway?filmId=${filmId}`,
      headers: {
        "X-Host": "mall.film-ticket.film.info",
      },
    }).then((respone) => {
      this.filmInfo = respone.data.data.film;
    });

    // 时间表请求
    this.$http({
      url: `/gateway/?filmId=${filmId}&cityId=${cityId}&k=5932231`,
      headers: {
        "X-Host": "mall.film-ticket.cinema.film-show-cinema",
      },
    }).then((respone) => {
      this.$root.isLoading = false;
      this.showCinemas = respone.data.data.showCinemas;
      this.nowDate = respone.data.data.showCinemas[0];
      // 请求当前时间影院
      this.getCinemaList(this.nowDate.cinemaList.join(","));
    });
  },
  computed: {
    // 监听城市区
    nowdistrict() {
      //筛选数据 默认全城
      return this.cinemaList.filter((item) => {
        // ''  ==> 全城
        if (this.districtId === "") {
          this.name = "全城";
          return this.cinemaList;
        }
        // 按返回ID筛选
        // return item.districtId === this.districtId;
        if (item.districtId === this.districtId) {
          this.name = item.districtName;
          return item.districtId;
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.film-wrap {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 10;
}
.header {
  position: sticky;
  top: 0;
  width: 100%;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #f9f9f9;
  background: #fff;
  z-index: 99;
  .back {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 16px;
    margin-left: 15px;
    background: rgba(255, 255, 255, 0.85);
  }
  .title {
    margin: 0 50px;
    h1 {
      font-size: 16px;
      text-align: center;
    }
  }
  .search {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 16px;
    margin-right: 15px;
  }
}
.date-list {
  position: sticky;
  top: 45px;
  height: 50px;
  overflow: hidden;
  background: #fff;
  z-index: 99;
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
        color: #ff5f16;
        border-bottom: 2px solid #ff5f16;
      }
    }
  }
}
.district {
  position: sticky;
  top: 95px;
  z-index: 5;
  .cinema-list-tag {
    background: #fff;
    height: 50px;
    line-height: 50px;
    .cinema-list-tag-nav {
      position: relative;
      overflow: hidden;
      li {
        float: left;
        width: 50%;
        text-align: center;
        border-bottom: 1px solid #f9f9f9;
      }
    }
  }
  .filter-box {
    position: fixed;
    top: 144px;
    left: 0;
    right: 0;
    z-index: 99;
    background: #fff;
    .district-list {
      padding-top: 10px;
      margin-left: 10px;
      display: flex;
      flex-wrap: wrap;
      li {
        width: calc((100% - 40px) / 4);
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0 10px 15px 0;
        border-radius: 3px;
        font-size: 12px;
        color: #797d82;
        border: 1px solid #f3f5f6;
        overflow: hidden;
        &.selected {
          color: #ff5f16;
          border: 1px solid #ff5f16;
        }
      }
    }
  }
}
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