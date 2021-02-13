<template>
  <!-- 选票买票 -->
  <div class="schedule">
    <Top v-if="info.cinema" :title="info.cinema.name">
      <div class="btn-back" @click="$router.go(-1)">
        <span class="iconfont icon-back"></span>
      </div>
    </Top>
    <div class="schedule-wrap">
      <div class="notice">
        <img src="@/assets/infom.png" alt="" />
        特殊时期已为您适当调整座位间安全距离，观影者需佩戴好口罩才可进场观看，感谢您的理解！
      </div>
      <div class="info" v-if="info.film">
        <div class="film-name">{{info.film.name}}</div>
        <div class="film-des">{{info.showAt | formatWeek}}{{info.showAt | formatDate}} {{ info.showAt | formatTime }} {{info.film.language}}{{info.imagery}}</div>
      </div>
      <div class="tips">
        <div class="broken">
          <span class="iconfont"></span>
          <span class="txt">不可选</span>
        </div>
        <div class="occupied">
          <span class="iconfont"></span>
          <span class="txt">已售</span>
        </div>
        <div class="hold">
          <span class="iconfont"></span>
          <span class="txt">已选</span>
        </div>
        <div class="empty">
          <span class="iconfont"></span>
          <span class="txt">可选</span>
        </div>
      </div>
      <!-- 选座表 -->
      <div class="seating-chart-wrap" ref="chart">
        <div class="seating-chart">
          <!-- 屏幕 -->
          <div class="screen" v-if="info.hall">{{info.hall.name}}</div>
          <!-- 坐标 -->
          <div class="axion-y" ref="axion">
              <div class="rowName" v-for="num in seats.height" :key="num">{{num}}</div>
          </div>
          <!-- 座位 -->
          <div class="map" ref="map">
              <div class="seats" ref="seats" v-if="seats">
                  <div class="seat" v-for="(seat,index) in seats.seats" :key="index" @click="handleSeat(seat,index)" ref="seatBox">
                      <div class="single" :class="{occupied:seat.isOccupied,broken:seat.isBroken}">
                        <!-- <span class="iconfont" :class="{'icon-search': seat.isBroken}"></span> -->
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <!-- 买座列表 -->
      <div class="seatlist" v-if="seatlist">
        <ul class="seat-wrap">
          <li class="seat-item" v-for="(seat,index) in seatlist" :key="index">
            <p class="seat-info">{{seat.rowNum}}排{{seat.columnNum}}座</p>
            <p class="seat-price">{{price}}元</p>
            <span class="iconfont icon-close" @click="hendleCancel(index)"></span>
          </li>
        </ul>
      </div>
      <div class="confirm-btn" @click="confirmBuy">
          <span v-if="!priceSum">请先选座</span>
          <span v-else>{{priceSum}}元，确认选座</span>
      </div>
    </div>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
export default {
  name: "buyTickets",
  components: {
    Top,
  },
  props: ['price'],
  data() {
    return {
      info: {},
      seats: {},
      msgCount: 0,  //已选座位数
      seatlist: [],  //选座信息
      priceSum: 0,
    };
  },
  mounted() {
    const scheduleId = this.$route.params.scheduleId;
    this.moveMap();

    this.$http({
      url: "/gateway/?scheduleId=" + scheduleId,
      headers: {
        "X-Host": "mall.film-ticket.schedule.info",
      },
    }).then((respone) => {
      this.info = respone.data.data.schedule;
      this.loadNum++
    });

    this.$http({
        url: '/gateway/?scheduleId='+scheduleId,
        headers: {
            'X-Host': 'mall.film-ticket.seat.list',
        }
    }).then( respone => {
        this.seats = respone.data.data.seatingChart;
        this.$nextTick(()=> {
            var seats = this.$refs.seats;
            for(var i=0;i<seats.children.length;i++){
                var col = this.seats.seats[i].columnNum - 1;
                var row = this.seats.seats[i].rowNum - 1;
                seats.children[i].style['left'] = col * 30 + 'px';
                seats.children[i].style['top'] = row * 30 + 'px';
            }
        })
    }).catch(()=>{
      alert('场次不存在或已关闭');
      this.$router.go(-1);
    })

  },
  methods: {
    moveMap(){
      var chart = this.$refs.chart;
      var map = this.$refs.map;
      var axion = this.$refs.axion;

      var startX = 0,endX = 0,currentX = 0;
      var startY = 0,endY = 0,currentY = 70;

      chart.addEventListener('touchstart',(e)=>{
        startX = e.changedTouches[0].pageX
        startY = e.changedTouches[0].pageY
      })
      chart.addEventListener('touchmove',(e)=>{
        var moveX = e.changedTouches[0].pageX
        var moveY = e.changedTouches[0].pageY
        endX = moveX - startX + currentX;
        endY = moveY - startY + currentY;
        map.style['transform'] = `translate(${endX}px,${endY}px)`
        axion.style['transform'] = `translate(${endX}px,${endY}px)`
      })
      chart.addEventListener('touchend',()=>{
        currentX = endX;
        currentY = endY;
        map.style['transform'] = `translate(${endX}px,${endY}px)`
        axion.style['transform'] = `translate(${endX}px,${endY}px)`
      })
    },
    handleSeat(seat,index){  // 选座
      var seatBox = this.$refs.seatBox;

      // 检测选择破埙或已售
      if(seat.isBroken || seat.isOccupied) return

      // 检测重复选择
      for(var i=0;i< this.seatlist.length;i++){
        if(index == this.seatlist[i].order) return
      }
      this.msgCount++;
      if(this.msgCount >4 ){
        alert('已到达座位最大限度');
        return
      }
      seatBox[index].children[0].classList.add('hold');

      console.log('第'+seat.rowNum+'排'+'第'+seat.columnNum+'座');
      this.seatlist.push({...seat,order:index});
      this.priceSum = 34 * this.msgCount
    },
    hendleCancel(i){  //取消选座
      var seatBox = this.$refs.seatBox;
      var order = this.seatlist[i].order;
      seatBox[order].children[0].classList.remove('hold');
      this.seatlist.splice(i,1);
      this.msgCount--
      this.priceSum = 34 * this.msgCount
    },
    confirmBuy(){  //确认购买
      this.seatlist.forEach( item => {
        this.seats.seats[item.order].isOccupied = true
      })
      // 选座完成，清空数据
      this.msgCount = 0;
      this.seatlist = [];
      this.priceSum = 0;
    }
  },
};
</script>

<style lang="less" scoped>
.schedule {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #fff;
  z-index: 99;
  .notice {
    display: flex;
    height: 58px;
    padding: 10px 15px;
    color: #e68e1a;
    font-size: 12px;
    text-align: left;
    background: #fbf4d8;
    z-index: 1;
    img {
      width: 15px;
      height: 15px;
      margin-top: 2px;
      margin-right: 5px;
    }
  }
  .info {
    padding: 15px;
    text-align: left;
    .film-name {
      font-size: 16px;
      line-height: 20px;
      color: #191a1b;
    }
    .film-des {
      margin-top: 5px;
      font-size: 12px;
      line-height: 18px;
      color: #797d82;
    }
  }
  .tips {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    font-size: 14px;
    background: #fff;
    .broken {
      margin-right: 10px;
    .iconfont {
          display: inline-block;
          width: 18px;
          height: 18px;
          background: #dcdcdc;
        }
        .txt {
          margin-left: 5px;
          line-height: 24px;
        }
    }
    .occupied {
      margin-right: 10px;
      .iconfont {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #ff4958;
      }
      .txt {
        margin-left: 5px;
        line-height: 24px;
      }
    }
    .hold {
      margin-right: 10px;
      .iconfont {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #3983ff;
      }
      .txt {
        margin-left: 5px;
        line-height: 24px;
      }
    }
    .empty {
      .iconfont {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: #0be881;
      }
      .txt {
        margin-left: 5px;
        line-height: 24px;
      }
    }
  }
  .seating-chart-wrap {
      position: absolute;
      top: 206px;
      height: calc(100vh - 221px);
      width: 100%;
      background: #f4f4f4;
      overflow: hidden;
      .seating-chart {
          position: relative;
          .screen {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            height: 30px;
            min-width: 300px;
            font-size: 16px;
            line-height: 30px;
            text-align: center;
            border-radius: 1px 1px 8px 8px;
            color: #fff;
            background: #dbdbdb;
            z-index: 3;
          }
          .axion-y {
            position: absolute;
            left: 10px;
            top: 70px;
            width: 15px;
            color: #fff;
            font-size: 12px;
            border-radius: 11.5px;
            background-color: #191a1b;
            opacity: .5;
            z-index: 1;
            .rowName {
                display: block;
                height: 25px;
                line-height: 25px;
                margin: 5px 0;
            }
          }
          .map {
      position: absolute;
      top: 70px;
      bottom: 95px;
      left: 30px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      background: #f4f4f4;
      .seats {
          position: relative;
          .seat {
              position: absolute;
              margin: 5px;
              .single {
                  width: 25px;
                  height: 25px;
                  line-height: 25px;
                  text-align: center;
                  color: #fff;
                  background: #7bed9f;
                  overflow: hidden;
                  &.occupied {
                    background: #ff4958;
                  }
                  &.hold {
                    background: #3983ff;
                  }
                  &.broken {
                    background: #dcdcdc;
                  }
              }
          }
      }
        }
      }
  }
  .seatlist {
    position: fixed;
    bottom: 45px;
    width: 100%;
    padding: 10px 15px;
    background: #fff;
    z-index: 5;
    .seat-wrap {
      display: flex;
      flex-wrap: wrap;
      .seat-item {
        position: relative;
        width: 80px;
        height: 45px;
        padding: 5px 20px 5px 0;
        margin-right: 5px;
        border: 1px solid #dcdcdc;
        .seat-info {
          font-size: 12px;
          color: #000;
        }
        .seat-price {
          font-size: 12px;
          color: red;
        }
        .iconfont {
          position: absolute;
          right: 5px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
  .confirm-btn {
      height: 45px;
      line-height: 45px;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 5;
      color: #fff;
      background: #3983ff;
  }
}
</style>