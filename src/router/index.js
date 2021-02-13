import Vue from 'vue'
import VueRouter from 'vue-router'
import Films from '@/views/Films';
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/films/nowPlaying' },
  { path: '/films',component: Films ,
  children: [
    { path:'/', redirect: '/films/nowPlaying'},
    { path: 'nowPlaying',component: ()=> import('@/views/Films/nowPlaying')},
    { path: 'comingSoon',component: ()=> import('@/views/Films/comingSoon')}
  ]
  },
  { path: '/film/:filmId',components: {detail: ()=> import('@/views/Film/Detail')}},
  { path: '/film/:filmId/cinemas',component: ()=> import('@/views/Film') },
  { path: '/cinemas',component: ()=> import('@/views/Cinemas'),
    children: [
      { path: 'search',component: ()=> import('@/views/Cinemas/Search') },
    ]
  },
  { path:'/cinema/:cinemaId',component: ()=> import('@/views/Cinema/ServiceInfo')},
  { path: '/cinema/:cinemaId/film',component: ()=> import('@/views/Cinema'),
    children: [
      { path: '/', component: ()=> import("@/views/Cinema/Schedule")},
      { path: '/cinema/:cinemaId/film/:filmId',component: ()=> import("@/views/Cinema/Schedule")}
    ]
  },
  { path: '/personal',component: ()=> import('@/views/Personal'),
    children: [
      { path: 'collects',component: ()=> import('@/views/Personal/Collects')}
    ]
  },
  { path: '/leaderBoard',component: ()=> import('@/views/LeaderBoard') },
  { path: '/city',component: ()=> import('@/views/City')},
  { path: '/schedule/:scheduleId',component: ()=> import('@/views/buyTickets') },
  { path: '/*',redirect: '/films/nowPlaying'}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
