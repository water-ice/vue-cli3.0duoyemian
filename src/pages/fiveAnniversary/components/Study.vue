<template>
  <div class="studyPage">
    <div class="cards">
      <div :class="`card card_${index+1 === 4?((grade<2)?4:7):index+1}`" v-for="(text, index) in texts" :key="index" @click="turnToMinorHome(index,text.url)"/>
    </div>
  </div>
</template>
<script>
import { inApp } from 'plat-utils/src/systemInfo';
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import Bus from '../page/Bus/';


export default {
  data() {
    return {
      grade: '',
      texts: [
        {
          name: '一课',
          url: 'https://www.zybang.com/skyfire/springsale/index?from=in_zyb_wznks_sell_1&lastfrom=in_zyb_wznks_sell_1',
        },
        {
          name: '1对1',
          url: 'https://www.zybang.com/apollo/activity/fifthyear?from=main',
        },
        {
          name: 'VIP',
          url: `${window.location.origin}/plat/activity-vue/anniBranch.html?from=mian`,
        },
        {
          name: '浣熊(练习)',
          url: '',
        },
        {
          name: '商城',
          url: 'https://www.zybang.com/static/yike-sell-operational/hummingbird.html?actId=2095&from=mian',
        },
        {
          name: '图书分会场',
          url: 'https://www.zybang.com/static/yike-sell-operational/hummingbird.html?actId=2176&from=mian',
        },
      ],
    };
  },
  methods: {
    turnToMinorHome(index, url) {
      zybLog.send({
        type: `childGround-${index}`,
      });
      let realUrl = url;
      if (url === '') {
        realUrl = Bus.userInfo.grade < 2 ? `${window.location.origin}${window.location.pathname}#/raccoonEnglish` : `${window.location.origin}${window.location.pathname}#/minorHome`;
      }
      if (index === 5) {
        const date = new Date().getDate();
        switch (date) {
          case 9:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61915';
            break;
          case 11:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61993';
            break;
          case 14:
          case 15:
          case 16:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61994';
            break;
          case 17:
          case 18:
          case 19:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61995';
            break;
          case 20:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61996';
            break;
          default:
            realUrl = 'https://www.zybang.com/feeds/api/feeddetail?articleId=61915';
        }
      }
      if (inApp) {
        hybrid('openWindow', {
          url: realUrl,
        });
      } else {
        window.location.href = realUrl;
      }
    },
  },
  created() {
    this.$fetch({
      url: '/activity/fiveyears/mainpage',
    }).then((res) => {
      this.grade = res.data.result.grade;
    });
  },
};
</script>
<style lang="scss" scoped>
.studyPage {
  .cards {
    margin-top: 0.35rem;
    .card {
      background: url('../img/five_1.png') no-repeat;
      background-size: 100% auto;
      &.card_1 {
        background-image:url('../img/five_1.jpg');
      }
      &.card_2 {
        background-image:url('../img/five_2.png');
      }
      &.card_3 {
        background-image:url('../img/five_3.png');
      }
      &.card_4 {
        background-image:url('../img/five_4.png');
      }
      &.card_5 {
        background-image:url('../img/five_5.png');
      }
      &.card_6 {
        background-image:url('../img/five_6.png');
      }
      &.card_7 {
        background-image:url('../img/five_7.png');
      }
      margin: 0.2rem auto;
      position: relative;
      width: 6.74rem;
      height: 2rem;
      border-radius: 0.12rem;
      box-shadow: 0 0.04rem 0.1rem 0 rgba($color: #000000, $alpha: 0.06);
      background-color: rgb(255, 64, 64);
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .logo {
        height: 1.4rem;
        width: 1.02rem;
        left: 4.61rem;
      }
    }
  }
}
</style>
