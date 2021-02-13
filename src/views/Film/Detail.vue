<template>
  <div class="detail-wrap">
    <Top :title="details.name" :isShow="isShow">
      <div class="btn-back" @click="$router.go(-1)">
        <span class="iconfont icon-back"></span>
      </div>
    </Top>
    <div class="poster">
      <div class="poster-wrap">
        <img :src="details.poster" :title="details.name" />
      </div>
    </div>
    <!-- 电影信息 -->
    <div class="detail">
      <div class="title">
        <div class="film-name">
          <h2 class="name text-hidden">{{ details.name }}</h2>
          <span class="type" v-if="details.filmType">{{
            details.filmType.name
          }}</span>
        </div>
        <div class="film-grade" v-show="details.grade">
          <span class="grade">{{ details.grade }}</span
          >分
        </div>
      </div>
      <!-- 收藏 -->
      <div class="collect" @click="handlerCollect(details)">
        <span class="iconfont icon-love" v-show="!iscollect"></span>
        <span class="iconfont icon-loveit" v-show="iscollect"></span>
        <p>想看</p>
      </div>
      <div class="film-category">
        <span>{{ details.category }}</span>
      </div>
      <div class="film-premiere-time">
        <span>{{ details.premiereAt | formatYear }} 上映</span>
      </div>
      <div class="film-nation-runtime">
        <span>{{ details.runtime }}分钟</span>
      </div>
      <!-- 简述 -->
      <div class="synopsis" ref="synopsis">
        <span>{{ details.synopsis }}</span>
      </div>
      <!-- 查看全部 -->
      <div class="toggle">
        <span
          class="iconfont"
          :class="{ 'icon-less': isToggle, 'icon-down': !isToggle }"
          @click="toggle"
        ></span>
      </div>
    </div>
    <!-- 演员 -->
    <div class="actors">
      <h2>演职人员</h2>
      <div class="actors-list">
        <Slide>
          <ul class="actors-nav">
            <li
              class="actors-item"
              v-for="(actor, index) in details.actors"
              :key="index"
            >
              <img class="actors-img" :src="actor.avatarAddress" />
              <span class="actors-name text-hidden">{{ actor.name }}</span>
              <span class="actors-role text-hidden">{{ actor.role }}</span>
            </li>
            <div class="message" v-if="details.actors == null">
              暂无演职人员
            </div>
          </ul>
        </Slide>
      </div>
    </div>
    <!-- 剧照 -->
    <div class="photos">
      <div class="hd">
        <div class="btn-more">
          全部<span v-if="details.photos">({{ details.photos.length }})</span>
          <!-- {{detailsList.photos.length}} -->
          <span class="iconfont icon-next"></span>
        </div>
        <h2>剧照</h2>
      </div>
      <Slide>
        <ul class="photos-list" ref="photoWrap">
          <li
            class="photos-list-item"
            v-for="(photo, index) in details.photos"
            :key="index"
          >
            <img :src="photo" @click.stop="handlerPreview(index)" />
          </li>
          <div class="message" v-if="details.photos == null">暂无剧照</div>
        </ul>
      </Slide>
    </div>
    <a
      href="javascript:void(0);"
      v-if="details.isSale"
      class="buy-seat"
      @click.self="$router.push(`/film/${details.filmId}/cinemas`)"
      >选购买票</a
    >
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import Slide from "@/components/Slide.vue";
import { ImagePreview } from "vant";

export default {
  name: "Detail",
  components: {
    Top,
    Slide,
  },
  data: function () {
    return {
      details: [], //当前电影
      isShow: true,
      isToggle: false,
      iscollect: false, //收藏
      collects: JSON.parse(window.localStorage.getItem("collects")) || [],
    };
  },
  methods: {
    toggle: function () {
      if (!this.isToggle) {
        this.$refs.synopsis.style["height"] = "auto";
        this.isToggle = true;
      } else {
        this.$refs.synopsis.style["height"] = "38px";
        this.isToggle = false;
      }
    },
    handlerCollect(item) {
      // 收藏与取消
      this.iscollect = !this.iscollect;
      this.$emit("update:collect", item);
      // 决定收藏状态
      if (this.iscollect) {
        this.$emit("collect-film", true);
      } else {
        this.$emit("collect-film", false);
      }
    },
    cutState() {
      document.addEventListener("scroll", () => {
        var ttop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (ttop >= 90) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      });
    },
    handlerPreview(i) {
      ImagePreview({
        images: this.details.photos,
        closeable: true,
        startPosition: i,
        closeIconPosition: "top-left",
        loop: false,
      });
    },
  },
  mounted() {
    this.$root.isLoading = true;
    this.cutState();

    let filmId = this.$route.params.filmId;
    this.$http({
      url: "/gateway?filmId=" + filmId,
      headers: {
        "X-Host": "mall.film-ticket.film.info",
      },
    }).then((respone) => {
      this.details = respone.data.data.film;
      this.$root.isLoading = false;
    });

    // 收藏状态
    this.collects.forEach((item) => {
      if (item.filmId == filmId) {
        this.iscollect = true;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.detail-wrap {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 20;
}
.poster {
  .poster-wrap {
    position: relative;
    height: 57vw;
    overflow: hidden;
    background: #f9f9f9;
    img {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%);
    }
  }
}
.detail {
  position: relative;
  padding: 18px 15px;
  text-align: left;
  color: #797d82;
  background: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    .film-name {
      float: left;
      width: calc(100% - 50px);
      .name {
        float: left;
        max-width: calc(100% - 50px);
        font-size: 22px;
        color: #000;
      }
      .type {
        float: left;
        margin-left: 10px;
        font-size: 14px;
        padding: 0 5px;
        margin-top: 9px;
        color: #fff;
        background: #ff4958;
        border-radius: 3px;
      }
    }
    .film-grade {
      float: right;
      color: #ffb232;
      text-align: center;
      .grade {
        font-size: 18px;
      }
    }
  }
  .film-category {
    margin-top: 10px;
    font-size: 14px;
  }
  .film-premiere-time {
    margin-top: 5px;
    font-size: 14px;
  }
  .film-nation-runtime {
    margin-top: 5px;
    font-size: 14px;
  }
  .synopsis {
    margin-top: 18px;
    color: #797d82;
    font-size: 14px;
    height: 38px;
    overflow: hidden;
    background: #fff;
  }
  .toggle {
    color: #797d82;
    text-align: center;
    background: #fff;
    cursor: pointer;
  }
  .collect {
    position: absolute;
    right: 20px;
    top: 45px;
    height: 20px;
    margin: 0 5px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    span {
      font-size: 18px;
    }
    .icon-love {
      font-size: 20px;
    }
    .icon-loveit {
      color: red;
    }
  }
}
.actors {
  margin-top: 10px;
  overflow: hidden;
  background: #fff;
  h2 {
    padding: 20px 15px;
    font-size: 16px;
    text-align: left;
    color: #000;
  }
  .actors-nav {
    padding-left: 15px;
    padding-bottom: 15px;
    display: flex;
    .actors-item {
      width: 85px;
      min-width: 85px;
      margin-right: 15px;
      text-align: center;
      .actors-img {
        height: 110px;
        width: 85px;
        margin-bottom: 10px;
        background: #f9f9f9;
      }
      span {
        display: block;
      }
      .actors-role {
        color: #797d82;
      }
    }
  }
}
.photos {
  padding: 15px;
  margin-bottom: 60px;
  background: #fff;
  overflow: hidden;
  .hd {
    height: 40px;
    line-height: 40px;
    text-align: left;
    overflow: hidden;
    h2 {
      font-size: 20px;
    }
    .iconfont {
      font-size: 14px;
      font-weight: normal;
    }
    .btn-more {
      float: right;
      font-size: 14px;
      color: #797d82;
      cursor: pointer;
      .iconfont {
        vertical-align: initial;
      }
    }
  }
  .photos-list {
    display: flex;
    .photos-list-item {
      position: relative;
      height: 100px;
      width: 150px;
      min-width: 150px;
      margin-right: 10px;
      overflow: hidden;
      background: #f9f9f9;
      img {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }
}
.buy-seat {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  height: 48px;
  line-height: 48px;
  text-align: center;
  color: #fff;
  background: #3983ff;
  z-index: 10;
}
.message {
  height: 130px;
  width: 100%;
  line-height: 130px;
  text-align: center;
}
</style>