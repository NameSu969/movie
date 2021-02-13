<template>
  <div class="search-container">
    <!-- <header class="header">
      <div class="left"></div>
      <div class="title">当前城市</div>
    </header> -->
    <div class="search-city">
      <div class="search-wrap">
        <span class="iconfont icon-search"></span>
        <input
          type="text"
          class="search-input"
          @input="searchCinema"
          v-model="cinemaKey"
          placeholder="输入影城名称"
        />
      </div>
      <div class="cancel">
        <span
          @click="
            $router.go(-1);
            $emit('update:isSearch', false);
            cinemaKey = '';
          "
          >取消</span
        >
      </div>
    </div>
    <CinemaList :cinemaList="findCinema" v-if="isShow" />
    <div class="nearby" v-else>
      <h2 class="title">离你最近</h2>
      <ul class="detail">
        <li class="item-detail" v-for="cinema in nearCinemas" :key="cinema.cinemaId" @click="handlerToCinema(cinema.cinemaId)">{{cinema.name}}</li>
      </ul>
    </div>
    <p v-show="!findCinema.length">没有该影院...</p>
  </div>
</template>

<script>
import CinemaList from "@/components/CinemaList.vue";

export default {
  name: "Search",
  props: ["cinemaList"],
  components: {
    CinemaList,
  },
  data() {
    return {
      cinemaKey: "",
      isShow: false,
      nearCinemas: [],
    };
  },
  methods: {
    searchCinema() {
      // 没有影院
      if (this.cinemaKey.trim() == "") {
        this.isShow = false;
        return;
      }
      // 影院存在显示
      this.isShow = true;
    },
    handlerToCinema(cinemaId){
      this.$router.push('/cinema/'+cinemaId+'/film')
    }
  },
  mounted() {
    var cityId = JSON.parse(window.localStorage.getItem('nowCity')).cityId;
    this.$http({
      url: `/gateway?cityId=${cityId}&ticketFlag=0`,
      headers: {
        'X-Host':' mall.film-ticket.cinema.list'
      }
    }).then( respone => {
      this.nearCinemas = respone.data.data.cinemas.splice(0,5);
    })
  },
  computed: {
    findCinema() {
      return this.cinemaList.filter((item) =>
        item.name.includes(this.cinemaKey)
      );
    },
  },
};
</script>
<style lang="less" scoped>
.search-container {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  z-index: 20;
  background: #fff;
}
.search-city {
  position: sticky;
  top: 0;
  display: flex;
  padding: 10px 15px;
  background-color: #ffffff;
  border-bottom: 1px solid #f9f9f9;
  z-index: 20;
  .search-wrap {
    flex: 1;
    height: 30px;
    background: #f4f4f4;
    .iconfont {
      float: left;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 18px;
    }
    .search-input {
      width: calc(100% - 30px);
      height: 30px;
      padding-left: 10px;
      font-size: 14px;
      color: #000;
      background: transparent;
    }
  }
  .cancel {
    float: right;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    margin-left: 10px;
  }
}
.nearby {
  padding: 20px 15px;
  text-align: left;
  border-bottom: 1px solid #f9f9f9;
  .title {
    font-size: 16px;
    color: #bdc0c5;
  }
  .detail {
    .item-detail {
      display: inline-block;
      margin-top: 10px;
      margin-right: 10px;
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 3px;
      background: #f9f9f9;
    }
  }
}
</style>