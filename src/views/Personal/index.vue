<template>
  <div id="personal">
    <header class="header">
      <div class="message">
        <span class="iconfont icon-msg-system"></span>
      </div>
      <div class="login-info">
        <div class="login-state">
          <span class="username">斯蒂芬·库里</span>
        </div>
        <div class="portrait">
          <img src="@/assets/20200412003454_eyutv.jpg" alt="" />
        </div>
      </div>
    </header>
    <section class="content">
      <ul class="nav-list">
        <li class="nav-list-item">
          <span class="iconfont icon-Ticket"></span>
          <span class="txt">我的电影票</span>
        </li>
        <li class="nav-list-item">
          <span class="iconfont icon-movie1"></span>
          <span class="txt">我看过的电影</span>
        </li>
        <router-link to="/personal/collects" tag="li" class="nav-list-item">
          <span class="iconfont icon-loveit"></span>
          <span class="txt">我喜欢的电影</span>
        </router-link>
        <li class="nav-list-item">
          <span class="iconfont icon-service"></span>
          <span class="txt">客服</span>
        </li>
        <li class="nav-list-item">
          <span class="iconfont icon-set1"></span>
          <span class="txt">账户设置</span>
        </li>
      </ul>
    </section>
    <router-view @update:collect="$emit('update:collect',$event)" @collect-film="$emit('collect-film',$event)"></router-view>
  </div>
</template>

<script>
export default {
  name: "Personal",
  mounted() {
    this.$root.isLoading = false
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 190px;
  padding: 15px 20px;
  background: #3983ff;
  .message {
    color: #fff;
    text-align: right;
  }
  .login-info {
    display: flex;
    justify-content: space-between;
    height: 85px;
    line-height: 85px;
    margin-top: 40px;
    .login-state {
      width: calc(100% - 100px);
      text-align: left;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      .username {
        font-size: 18px;
        color: #fff;
      }
    }
    .portrait {
      width: 85px;
      height: 85px;
      overflow: hidden;
      border-radius: 50%;
      background: #f9f9f9;
    }
  }
}
.content {
  margin-top: -10px;
  border-radius: 15px;
  margin-bottom: 94px;
  background: #fff;
  .nav-list {
    padding: 15px 0;
    text-align: left;
    .nav-list-item {
      padding: 15px 20px;
      border-bottom: 1px solid #f9f9f9;
      .iconfont {
        font-size: 16px;
      }
      .txt {
        margin-left: 15px;
        font-size: 14px;
      }
      .icon-Ticket {
        color: #ffa726;
      }
      .icon-movie1 {
        color: #9266f9;
      }
      .icon-loveit {
        color: red;
      }
      .icon-service {
        color: #16c2c2;
      }
      .icon-set1 {
        color: #666666;
      }
    }
  }
}
</style>