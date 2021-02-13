<template>
  <div id="cinema">
    <Header :nowCity="nowCity" title="影院" v-if="!isSearch">
      <template v-slot:iconfont>
        <span class="iconfont icon-search" @click="hanlderSearch"></span>
      </template>
    </Header>
    <District :name="name" :districts="districts" :districtId.sync="districtId"/>
    <CinemaList v-if="!isSearch" :cinemaList="nowdistrict"/>

    <router-view
      :cinemaList="cinemaList"
      :isSearch.sync="isSearch"
    ></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import District from '@/components/District.vue'
import CinemaList from "@/components/CinemaList.vue"
export default {
  name: "Cinemas",
  props: ["nowCity"],
  components: {
    Header,
    District,
    CinemaList,
  },
  data() {
    return {
      cinemaList: [],
      districts: [],
      districtId: "",
      //   prevCityId: 0,
      isSearch: false,
      name: "全城",
    };
  },
  mounted() {
    this.$root.isLoading = true
    this.districts = [{ name: "全城", districtId: "" }];

    this.$http({
      url: "/gateway?cityId=" + this.nowCity.cityId + "&ticketFlag=1",
      headers: {
        "X-Host": "mall.film-ticket.cinema.list",
      },
    }).then((respone) => {
      this.$root.isLoading = false
      this.cinemaList = respone.data.data.cinemas;
      // window.localStorage.setItem('cinemas',JSON.stringify(this.cinemaList));
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
  methods: {
    hanlderSearch() {
      console.log("cinema");
      this.isSearch = true;
      this.$router.push("/cinemas/search");
    },
  },
};
</script>

<style lang="less" scoped>
</style>