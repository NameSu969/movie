<template>
  <div id="movie-app">
    <Loading v-if="$parent.isLoading"/>
    <router-view :nowCity.sync="nowCity" :collect.sync="collect" @collect-film="hanlderCollect" :price.sync="price"></router-view>
    
    <router-view name="detail" :collect.sync="collect" @collect-film="hanlderCollect"></router-view>
    <NavBar/>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue'
import Loading from '@/components/Loading.vue'
export default {
  name: 'App',
  components: {
      NavBar,
      Loading
  },
  data() {
    return {
      nowCity: JSON.parse(window.localStorage.getItem('nowCity')) || {cityId:110100,name:'北京'},
      collect: [],
      collectFilms: JSON.parse(window.localStorage.getItem('collects')) || [],
      price: 0
    }
  },
  methods: {
    hanlderCollect(bool){
      if(bool){
        console.log('收藏');
        this.collectFilms.push(this.collect);
      }else {
        console.log('取消收藏');
        this.collectFilms = this.collectFilms.filter((item) => {
          // console.log(this.collect.filmId != item.filmId);
          return this.collect.filmId != item.filmId;
        })
      }
      // 缓存收藏
      window.localStorage.setItem('collects',JSON.stringify(this.collectFilms));
    }
  },
}
</script>

<style lang="less">
#movie-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.text-hidden{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.iconfont {
  font-weight: 600;
  vertical-align: middle;
}
</style>

