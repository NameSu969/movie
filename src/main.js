import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from '@/plugin/axios.js'

Vue.prototype.$http = axios
Vue.config.productionTip = false

// 全局过滤器
// 演员过滤
Vue.filter('formatActors', function (actors) {
  if (!actors) return "暂无主演";
  return actors.map((item) => item.name).join(" ");
})
// 时间过滤  24小时
Vue.filter('formatTime', function (time) {
  return new Date(time * 1000).toLocaleTimeString("chinese", { hour12: false }).substr(0,5)
})
// 日期过滤  mm-nn
Vue.filter('formatDate', function (date) {
  return new Date(date * 1000)
    .toLocaleString("chinese", { hour12: false })
    .split(" ")[0]
    .substring(5)
    .replace("/", "月") + "日"
})
// 年份过滤  yyyy/mm/nn
Vue.filter('formatYear', function (date) {
  return new Date(date * 1000).toLocaleDateString()
})
// 过滤星期
Vue.filter('formatWeek',function(time){
  var day = new Date(time * 1000).getDay();
    if(day == 0) {
      return '周日'
    }else if(day == 1 ){
      return '周一'
    }else if(day == 2 ){
      return '周二'
    }else if(day == 3 ){
      return '周三'
    }else if(day == 4 ){
      return '周四'
    }else if(day == 5 ){
      return '周五'
    }else if(day == 6 ){
      return '周六'
    }
})
new Vue({
  router,
  render: h => h(App),
  data() {
    return {
      isLoading: false, //全局注册loading
    }
  },
}).$mount('#app')
