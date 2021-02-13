<template>
  <div class="city-box">
    <Top title="城市列表" :isShow="false">
    <div class="btn-back" @click="$router.go(-1)">
        <span class="iconfont icon-back"></span>
     </div>
     </Top>
    <div class="search-box">
      <div class="search-wrap">
        <span class="iconfont icon-search"></span>
        <input
          type="text"
          placeholder="输入城市名或拼音"
          class="search-input"
          @focus="isCancel = true"
        />
      </div>
    </div>
    <div class="city-list">
      <div class="now-city">
        <h2>当前城市</h2>
        <ul>
          <li v-if="nowCity">{{nowCity.name}}</li>
          <li v-else>定位失败</li>
        </ul>
      </div>
      <div class="hot-city">
        <h2>热门城市</h2>
        <ul>
          <li v-for="hot in hotCity" :key="hot.cityId" @click="handlerCity(hot)">{{ hot.name }}</li>
        </ul>
      </div>
      <div class="city-item" v-for="citys in cityList" :key="citys.index">
        <h2>{{ citys.index }}</h2>
        <ul>
          <li v-for="item in citys.list" :key="item.cityId" @click="handlerCity(item)">{{ item.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
export default {
  name: "City",
  props: ['nowCity'],
  components: {
    Top,
  },
  data: function () {
    return {
      cityList: [],
      hotCity: [],
      isCancel: false,
    };
  },
  mounted() {

    // 拿缓存
    var loCityList = window.localStorage.getItem("cityList");
    var loHotCity = window.localStorage.getItem("hotCity");

    // this.$emit("update:nowCity",this.nowCity);
    // 走缓存
    if (loCityList && loHotCity) {
      this.cityList = JSON.parse(loCityList);
      this.hotCity = JSON.parse(loHotCity)
    } else {
      this.$http({
        url: "/gateway?k=380492",
        headers: {
          "X-Host": "mall.film-ticket.city.list",
        },
      }).then((res) => {
        if (res.status === 200) {
          this.formatCitys(res.data.data.cities);
        }
      });
    }
  },
  methods: {
    formatCitys: function (citys) {
      var _that = this;
      // 拿到首字母
      citys.forEach((item, i) => {
        var firstLetter = item.pinyin.substring(0, 1).toUpperCase();
        if (toCom(firstLetter)) {
          this.cityList.push({
            index: firstLetter,
            list: [{ name: item.name, cityId: item.cityId }],
          });
        } else {
          this.cityList.forEach((item) => {
            if (item.index === firstLetter) {
              item.list.push({ name: citys[i].name, cityId: citys[i].cityId });
            }
          });
        }
        if (item.isHot === 1) {
          this.hotCity.push({ name: item.name, cityId: item.cityId });
        }
      });

      // 城市排序
      this.cityList.sort((a, b) => {
        return a.index - b.index
      });

      function toCom(firstLetter) {
        for (var i = 0; i < _that.cityList.length; i++) {
          if (_that.cityList[i].index === firstLetter) {
            return false;
          }
        }
        return true;
      }

      // 本地存储城市列表
      window.localStorage.setItem("cityList", JSON.stringify(this.cityList));
      window.localStorage.setItem("hotCity", JSON.stringify(this.hotCity));
    },
    handlerCity: function(city){ 
        window.localStorage.setItem("nowCity",JSON.stringify(city));
        // 传值
        this.$emit("update:nowCity",city);
        this.$router.push('/films/nowPlaying'); 
    }
  },
};
</script>

<style lang="less" scoped>
.city-box {
  position: relative;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 10;
}
.search-box {
  position: sticky;
  top: 45px;
  padding: 10px 14px;
  background: #f4f4f4;
  z-index: 10;
  .search-wrap {
    height: 30px;
    border-radius: 5px;
    background: #fff;
    .iconfont {
      float: left;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 16px;
    }
    .search-input {
      float: right;
      height: 30px;
      width: calc(100% - 40px);
      border: 0;
      font-size: 14px;
    }
  }
}

.city-list {
  h2 {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: left;
    color: #797d82;
  }
  .now-city {
    padding: 15px;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 86px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 10px;
        margin-bottom: 15px;
        color: #000;
        color: #fff;
        background: #ff4958;
        border-radius: 5px;
      }
    }
  }
  .hot-city {
    padding: 0 15px;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      li {
        width: 86px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 15px;
        color: #fff;
        background: #3983ff;
        border-radius: 5px;
      }
    }
  }
  .city-item {
    h2 {
        text-align: left;
      padding-left: 15px;
      background: #f4f4f4;
    }
    ul {
      margin: 0 20px;
        text-align: left;
      li {
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;
      }
    }
  }
}
</style>