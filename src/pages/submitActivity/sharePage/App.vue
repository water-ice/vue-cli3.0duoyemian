<template>
  <div class="container">
    <div class="msg">
      <img src="./resource/default.png" alt="" class="avatar">
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
    <div class="qcode">
      <div class="pic-wrapper">
        <img src="./resource/qcode.png" alt="" class="qcode-pic">
      </div>
      <p>扫码进入作业帮</p>
      <p>参与狂欢</p>
    </div>
  </div>
</template>
<script>
import urlExt from 'plat-utils/src/url';

import AwardList from '../component/awardList.vue';

export default {
  data() {
    return {
      result: {
        userInfo: {},
      },
    };
  },
  created() {
    this.getInitData();
  },
  methods: {
    getInitData() {
      const boxLevel = urlExt.getQuery('boxLevel');
      this.$fetch({
        type: 'get',
        url: '/activity/composition/compcontributeshare',
        params: {
          boxLevel,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          this.result = res.data;
        }
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
  height: 15.3rem;
  background: url('./resource/bg.jpg') 0 0 no-repeat;
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
    .one-award {
      margin-top: .1rem;
    }
  }
  .bottom-tip {
    text-align: center;
    font-size: .2rem;
    color: #fff;
    margin-top: .4rem;
  }
  .qcode {
    margin: 2.7rem auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .pic-wrapper {
      border: .06rem solid  #df2108;
      background: #fff;
      width: 1.6rem;
      height: 1.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      width: 1.2rem;
    }
    p {
      text-align: center;
      font-size: .24rem;
      color: #fff;
      line-height: .38rem;
      &:first-child {
        margin-top: .18rem;
      }
    }
  }
}
</style>

