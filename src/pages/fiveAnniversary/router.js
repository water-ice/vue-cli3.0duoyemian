import Vue from 'vue';
import Router from 'vue-router';
import Home from './page/Home.vue';

Vue.use(Router);
const router = new Router({
  mode: 'hash',
  base: '/fiveAnniversary',
  routes: [
    {
      path: '/',
      redirect: '/Home/Study',
    },
    {
      path: '/Home',
      name: 'Home',
      meta: { title: '作业帮五周年' },
      component: Home,
      children: [{
        path: 'Study',
        component: () => import(/* webpackChunkName: "Study" */ './components/Study.vue'),
        meta: { title: '作业帮五周年' },
      },
      {
        path: 'Energy',
        component: () => import(/* webpackChunkName: "Energy" */ './components/Energy.vue'),
        meta: { title: '作业帮五周年' },
      },
      {
        path: 'Team',
        component: () => import(/* webpackChunkName: "Team" */ './components/Team.vue'),
        name: 'Team',
        meta: { title: '作业帮五周年' },
      },
      {
        path: 'Gift',
        component: () => import(/* webpackChunkName: "Gift" */ './components/Gift.vue'),
        meta: { title: '作业帮五周年' },
      },
      ],
    },
    {
      path: '/Share',
      name: 'Share',
      meta: { title: '邀您组队' },
      component: () => import(/* webpackChunkName: "Share" */ './page/Share.vue'),
    },
    {
      path: '/MyEnergy',
      name: 'MyEnergy',
      meta: { title: '我的能量' },
      component: () => import(/* webpackChunkName: "MyEnergy" */ './page/MyEnergy.vue'),
    },
    {
      path: '/minorHome',
      name: 'minorHome',
      meta: { title: '五周年练习分会场' },
      component: () => import(/* webpackChunkName: "MyEnergy" */ './page/minorHome.vue'),
    },
    {
      path: '/moreVirtual',
      component: () => import(/* webpackChunkName: "Gift" */ './page/moreGift.vue'),
      meta: { title: '更多礼品' },
      props: {
        type: 'virtual',
      },
    },
    {
      path: '/moreEntity',
      component: () => import(/* webpackChunkName: "Gift" */ './page/moreGift.vue'),
      meta: { title: '更多能量' },
      props: {
        type: 'entity',
      },
    },
    {
      path: '/recievedGifts',
      component: () => import(/* webpackChunkName: "reGift" */ './page/recievedGifts.vue'),
      meta: { title: '已领取的礼品' },
      name: 'recievedGifts',
    },
    {
      path: '/raccoonEnglish',
      component: () => import(/* webpackChunkName: "reGift" */ './page/raccoonEnglish.vue'),
      meta: { title: '浣熊英语分会场' },
      name: 'raccoonEnglish',
    },
    {
      path: '/Video',
      component: () => import(/* webpackChunkName: "video" */ './page/Video.vue'),
      meta: { title: '作业帮五周年生日' },
      name: 'Video',
    },
  ],
});
router.afterEach((to) => {
  /* 路由发生变化修改页面 title */
  document.title = to.meta.title;
  if (to.meta.title) {
    if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      const hackIframe = document.createElement('iframe');
      hackIframe.style.display = 'none';
      hackIframe.src = `https://www.zybang.com/zuoyebang/activity/plat-activity/couponRules/couponrules.html?r=${Math.random()}`;
      document.body.appendChild(hackIframe);
      setTimeout(() => {
        document.body.removeChild(hackIframe);
      }, 300);
    }
  }
});

export default router;

