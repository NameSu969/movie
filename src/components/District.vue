<template>
  <!-- 区选择 -->
  <div class="district">
    <div class="cinema-list-tag">
      <ul class="cinema-list-tag-nav">
        <li @click="isSelect = !isSelect">
          <span class="cinema-list-tag-name">{{ name }}</span>
          <span class="iconfont icon-down"></span>
        </li>
        <li>
          <span class="cinema-list-tag-name">APP订票</span>
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
</template>

<script>
export default {
  name: "District",
  props: ["name", "districts","districtId"],
  data() {
    return {
      isSelect: false,
    };
  },
  methods: {
    hanlderCheck(id) {
      console.log(id);
      this.$emit("update:districtId", id);
      this.isSelect = false;
    },
  },
  mounted() {
    document.addEventListener("scroll", () => {
      this.isSelect = false;
    });
  },
};
</script>

<style lang="less" scoped>
.district {
  position: sticky;
  top: 45px;
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
      width: 33.33%;
      text-align: center;
      border-bottom: 1px solid #f9f9f9;
    }
  }
}
.filter-box {
  position: fixed;
  top: 94px;
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
</style>