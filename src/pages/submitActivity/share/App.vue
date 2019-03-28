<template>
  <div class="container">
    <div class="msg">
      <img :src="result.userInfo.avatar ? $compress(result.userInfo.avatar, true) : defaultAvatar" class="avatar">
      <span class="name">{{result.userInfo.nickName}}</span>
      <p>我在作业帮参与<span class="spec-msg">作文投稿跨年狂欢周</span><br>
      投稿过审{{result.submitNum}}篇，开启了{{result.boxLevel}}星礼盒，获得</p>
    </div>
    <div class="award-box">
      <award-list
      :desc="result.desc"
      :pic="result.pic"
      :boxLevel="result.boxLevel"></award-list>
    </div>
    <div class="bottom-bt" @click="share" v-if="!isIos">
    </div>
    <div class="placeholder" v-if="isIos"></div>
  </div>
</template>
<script>
import urlExt from 'plat-utils/src/url';
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import { isIos } from 'plat-utils/src/systemInfo';

import AwardList from '../component/awardList.vue';

export default {
  data() {
    return {
      result: {
        userInfo: {},
      },
      isIos,
      defaultAvatar: require('./resource/default.png'),
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      const boxLevel = urlExt.getQuery('boxLevel');
      const type = urlExt.getQuery('type');
      this.$fetch({
        type: 'get',
        url: type ? '/activity/composition/compcontributeshare' : '/activity/composition/compositiongetreward',
        params: {
          boxLevel,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          this.result = res.data;
        }
      });
    },
    share() {
      hybrid('common', {}, (res) => {
        hybrid('getuserinfo', {}, (resp) => {
          zybLog.send({
            type: 'shareCard',
            module: 'activity-vue',
            uid: resp.cuid,
            cuid: res.cuid,
          });
        });
      });
      const boxLevel = urlExt.getQuery('boxLevel');
      const href = `${window.location.origin}/plat/activity-vue/submitActivitySharePage.html?boxLevel=${boxLevel}`;
      hybrid('share', {
        share_text_weibo: href,
        share_style: 1,
        share_url: href,
      });
    },
  },
  components: {
    AwardList,
  },
};
</script>
<style lang="less">
body {
  background-color: #f64129;
}
.container {
  height: 13.58rem;
  background: url('./resource/bg.png') 0 0 no-repeat;
  background-size: 100% auto;
  overflow: hidden;
  .msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 5.3rem;
    .avatar {
      width: 1rem;
      border-radius: 50%;
      margin-bottom: .2rem;
    }
    .name {
      font-size: .28rem;
      color: #666;
      margin-bottom: .2rem;
    }
    p {
      text-align: center;
      font-size: .24rem;
      line-height: .36rem;
      color: #666;
      span{
        color: #f22121;
      }
    }
  }
  .award-box {
    height: 2.31rem;
    margin-top: .24rem;
  }
  .bottom-bt {
    width: 2.4rem;
    margin: .4rem auto 0;
    height: .9rem;
    background: url('./resource/share.png') 0 0 no-repeat;
    background-size: 100% auto;
  }
  .placeholder {
    height: .9rem;
    margin-top: .4rem;
  }
  .bottom-tip {
    text-align: center;
    font-size: .2rem;
    color: #fff;
  }
}
</style>
