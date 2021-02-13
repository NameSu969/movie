<template>
  <div class="service-info">
      <Top :title="cinemaInfo.name">
          <div class="btn-back">
              <span class="iconfont icon-close" @click="$router.go(-1)"></span>
          </div>
      </Top>
      <div class="services">
          <div class="detail" v-for="service in cinemaInfo.services" :key="service.name">
              <div class="left">
                  {{service.name}}
              </div>
              <div class="right">
                  {{service.description}}
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import Top from '@/components/Top.vue'
export default {
    name: 'ServiceInfo',
    components: {
        Top
    },
    data() {
        return {
            cinemaInfo: {}
        }
    },
    mounted() {
        const cinemaId = this.$route.params.cinemaId;
        this.$http({
            url: '/gateway/?cinemaId='+cinemaId,
            headers: {
                'X-Host':'mall.film-ticket.cinema.info'
            }
        }).then( respone => {
            this.cinemaInfo = respone.data.data.cinema;
        })
    },
}
</script>

<style lang="less" scoped>
.service-info {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100vh;
    width: 100vw;
    background: #fff;
    z-index: 99;
    .services {
        margin-top: 50px;
        padding: 0 35px;
        .detail {
            margin-top: 20px;
            color: #797d82;
            font-size: 12px;
            text-align: left;
            overflow: hidden;
            .left {
                float: left;
                margin-right: 3px;
                padding: 0 6px;
                color: #3983ff;
                border: 1px solid #3983ff;
            }
            .right {
                margin-left: 70px;
            }
        }
    }
}
</style>