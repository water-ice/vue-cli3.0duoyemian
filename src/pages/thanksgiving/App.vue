<template>
  <div class='wrap'>
    <header>
    </header>
    <ul class="saleList">
      <li v-for="(item,index) in list" :key='index' @click="buy(item)"></li>
    </ul>
    <div class="details">
      <div class="head"></div>
      <div class="symbol"></div>
      <div class="swiper-container">
        <mt-swipe :auto='9000'>
          <mt-swipe-item>
            <img src="https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content1_4fa5500.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content2_8681dff.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content3_fd486fd.png" alt="">
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="intro">
      <div class="head"></div>
      <ul class="prizeList">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <div class="payRules">
      <header></header>
      <p>1.购买会员赠送的电子版作文包真题包，将于活动结束1周内，通过站内消息发放，请注意查收。<br>
2.购买半年会员后，会员时长将自动延长1个月，5分钟左右到账。<br>
3.购买年费会员赠送的高中数学大招礼盒，将于活动结束2周内发放，请购买后，到我的-设置-账号与安全-快递地址填写收货信息。<br>
4.开通后，在【我的】-【VIP会员中心】里会有所有VIP的特权服务，可免费使用。<br>
5.会员自购买之时起5分钟左右生效，若购买后，无法使用VIP特权，请重启作业帮APP，会员一经开通后不支持退款，特殊情况请联系客服4006110100。<br>
6.本活动最终解释权，归作业帮所有。</p>
    </div>
    <div class='bubble' @touchmove='e => {e.preventDefault()}' v-show="bubble" @click="bubble = false">
          <div class="guide"></div>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import share from 'plat-utils/src/share';
import InvokeApp from 'plat-utils/src/invokeApp';
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';

export default {
  name: 'thanksgiving',
  data() {
    return {
      list: [{ payServiceId: 31, payItemId: 1008 },
        { payServiceId: 31, payItemId: 1009 },
        { payServiceId: 31, payItemId: 1010 },
        { payServiceId: 31, payItemId: 1011 }],
      bubble: false,
    };
  },
  methods: {
    buy(it) {
      zybLog.send({ type: `thanks-giving-click${it.payItemId}` });
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            this.hybridBridge(it);
          } else {
            hybrid('loginForResult', {}, (res2) => {
              if (res2.result) {
                this.hybridBridge(it);
              }
            });
          }
        });
      } else if (inWeChat) {
        this.bubble = true;
        document.querySelector('.bubble').addEventListener('touchmove', (e) => {
          e.preventDefault();
        });
      } else {
        this.app();
      }
    },
    init() {
      share({
        url: window.location.href, // 分享链接，一般为当前页面的链接
        content: '购作业帮会员，享4重好礼，限时抢购！百万题目讲解视频免费听，赶紧上车!', // 分享内容
        title: '感恩节福利', // 分享标题
        pic: 'http://activity.page.picture.com/pic.png', // 分享缩略图
      });
      hybrid('swapBack', { enabled: false });
    },
    hybridBridge(it) {
      hybrid('platformPay', { serverId: it.payServiceId, itemId: it.payItemId }, () => {
        hybrid('toast', { text: '恭喜你，购买成功' });
        zybLog.send({ type: `thanks-giving-buy${it.payItemId}` });
        setTimeout(() => { window.location.reload(); }, 500);
      });
    },
    app() {
      // 端外打开app
      const naLink =
        `homework://com.baidu.homework/web?url=${
          encodeURIComponent(window.location.href)}`;
      InvokeApp({
        downloadLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        yybLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        nativeLinkIos: naLink,
        nativeLinkAndroid: naLink,
        universalLink:
          `//oia.zybang.com/download/?page=${
            encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${window.location.href}`)}`,
      });
    },
  },
  created() {
    this.init();
    zybLog.send({ type: 'thanksgiving' });
  },
  mounted() {
    this.$fetch('/activity/vip/thanksgiving').then((res) => {
      this.list = res.data.result.products;
    });
  },
};
</script>
<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 42rem;
  background: url("./resource/bg.png") no-repeat;
  background-size: 100% auto;
  position: relative;
  header {
    width: 100%;
    height: 6.9rem;
    background: url("./resource/header.png") no-repeat;
    background-size: contain;
  }
  .saleList {
    width: 100%;
    margin-top: 0.15rem;
    li {
      width: 7.2rem;
      height: 2.1rem;
      margin: 0.1rem auto 0;
      background: url("./resource/1.png") no-repeat;
      background-size: 100% auto;
    }
    li:nth-child(1) {
      background-image: url("./resource/1.png");
    }
    li:nth-child(2) {
      background-image: url("./resource/2.png");
    }
    li:nth-child(3) {
      background-image: url("./resource/3.png");
    }
    li:nth-child(4) {
      background-image: url("./resource/4.png");
    }
  }
  .details {
    width: 6.7rem;
    margin: 1rem auto 0;
    position: relative;
    height: 10rem;
    background: #f8cf9f;
    border-radius: 8px;
    box-shadow: 0 0 5px;
    .head {
      height: 1.75rem;
      width: 6rem;
      background: url("./resource/learn.png") no-repeat;
      background-size: contain;
      margin: 0 auto;
      position: relative;
      top: -0.7rem;
      border-bottom: 1px dashed #d5935d;
      overflow: hidden;
    }
  }
  .symbol {
    width: 6rem;
    height: 1.7rem;
    background: url("./resource/symbol.png") no-repeat;
    background-size: contain;
    margin: -0.3rem auto 0;
  }
  .intro {
    .head {
      width: 3.75rem;
      height: 0.55rem;
      background: url("./resource/prize.png") no-repeat;
      background-size: contain;
      margin: 0.8rem auto 0.4rem;
    }
    .prizeList {
      margin-top: 0.4rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid #8024e9;
      width: 6.25rem;
      margin: 0 auto;
      li {
        width: 6.25rem;
        margin: 0 auto;
        height: 1.36rem;
        background: url("./resource/24.png") no-repeat;
        background-size: contain;
      }
      li:nth-child(1) {
        background-image: url("./resource/24.png");
      }
      li:nth-child(2) {
        background-image: url("./resource/23.png");
      }
      li:nth-child(3) {
        background-image: url("./resource/22.png");
      }
      li:nth-child(4) {
        height: 2.1rem;
        background-image: url("./resource/21.png");
      }
    }
  }
  .payRules {
    header {
      height: 0.7rem;
      width: 4.2rem;
      margin: 0.5rem auto 0.1rem;
      background: url("./resource/rules.png") no-repeat;
      background-size: contain;
    }
    p {
      color: white;
      width: 6.5rem;
      margin: 0 auto;
      line-height: 0.4rem;
      font-size: 0.22rem;
    }
  }
  .swiper-container {
    width: 6.07rem;
    height: 6.15rem;
    margin: 0.3rem auto 0;
    overflow: hidden;
    .mint-swipe-item {
      width: 6rem;
      text-align: center;
    }
    img {
      width: 5rem;
      height: auto;
    }
  }
  .bubble {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.6);
    .guide {
      width: 7.2rem;
      height: 2.25rem;
      background: url("./resource/guide.png") no-repeat;
      background-size: contain;
      position: absolute;
      top: 10%;
    }
  }
  .mint-swipe-indicators {
    margin-top: 0.5rem;
  }
}
</style>

