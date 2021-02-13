<template>
  <div class="collects-container">
    <Top title="我喜欢的电影">
      <div class="btn-back" @click="$router.go(-1)">
        <span class="iconfont icon-back"></span>
      </div>
    </Top>
    <div class="collects-list-content">
      <div class="message-box" v-if="collectFilms.length <= 0">
        <p class="iconfont icon-movie"></p>
        <span>你还没喜欢的电影，快去找找吧~~</span>
      </div>
      <ul class="collects-list" v-else>
        <li
          class="collects-item"
          v-for="item in collectFilms"
          :key="item.filmId"
        >
          <!-- 电影海报图 -->
          <div class="film-img">
            <img :src="item.poster" />
          </div>
          <!-- 电影信息 -->
          <div class="film-info">
            <!-- 电影名称 -->
            <div class="film-name text-hidden">
              <span class="name">{{ item.name }}</span>
            </div>
            <!-- 电影评分 -->
            <div class="film-grade text-hidden">
              电影评分
              <span class="grade">{{ item.grade || "暂无评分" }}</span>
            </div>
            <!-- 上映时间 -->
            <div class="film-premiere-time">
              <span>{{ item.premiereAt | formatYear }} 上映</span>
            </div>
            <!-- 电影信息 -->
            <div class="film-detail text-hidden">
              <span class="label"
                >{{ item.nation }} | {{ item.runtime }}分钟</span
              >
            </div>
            <!-- 电影主演 -->
            <div class="film-actors text-hidden">
              <span class="actors">主演：{{ item.actors | formatActors }}</span>
            </div>
          </div>
          <!-- 收藏操作 -->
          <div class="collects-btn">
            <span class="iconfont icon-loveit" @click="handlerCollects(item)"></span>
            <p>取消收藏</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
export default {
  name: "Collects",
  components: {
    Top,
  },
  data() {
    return {
      collectFilms: JSON.parse(window.localStorage.getItem("collects")) || [],
    };
  },
  methods: {
    handlerCollects(item) {
      var isCancel = confirm("确定取消收藏吗？");
      // 取消收藏状态
      if (isCancel) {
        location.reload();//手动刷新缓存
        this.$emit("update:collect",item);
        this.$emit("collect-film", false);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.collects-container {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 99;
}
.collects-list-content {
  .collects-list {
    margin-left: 14px;
    margin-right: 14px;
    background: #fff;
    .collects-item {
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 14px 0;
      border-bottom: 1px solid #f9f9f9;
      background: #fff;
      .film-img {
        float: left;
        width: 99px;
        height: 140px;
        background: #f9f9f9;
      }
      .film-info {
        float: left;
        flex: 1;
        width: calc(100% - 180px);
        padding: 10px;
        font-size: 14px;
        text-align: left;
        color: #797d82;
        .film-name {
          font-size: 16px;
          color: #000;
        }
        .film-grade {
          margin: 5px 0;
          color: #797d82;
          .grade {
            color: #ff5f16;
          }
        }
      }
      .collects-btn {
        float: right;
        width: 80px;
        // height: 26px;
        line-height: 26px;
        font-size: 14px;
        text-align: center;
        color: #000;
        border-radius: 15px;
        .iconfont {
          color: red;
          font-size: 30px;
        }
      }
    }
  }
}
.message-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  font-size: 14px;
  color: #797d82;
  transform: translate(-50%, -50%);
  .iconfont {
    font-size: 58px;
    margin-bottom: 5px;
    color: #797d82;
  }
}
</style>