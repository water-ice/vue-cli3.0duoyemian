<template>
  <div class="wrap">
    <img src="./resource/headerBg.png" alt="作业帮学子卡" class="headerBg">
    <!-- wealth -->
    <div class="wealth">
      <img src="./resource/flag.png" class="flag">
      <!-- wItem -->
      <div class="wItem" v-for="(item,index) in wealths" :key="index">
        <div class="head">
          <div class="name">
            权益
            <span class="bName">{{index+1}}</span>
          </div>
        </div>
        <div class="title">
          {{item.titleStart}}
          <span class="big">{{item.titleBig}}</span>
          {{item.titleEnd}}
        </div>
        <img :src="item.bg" class="bg">
        <div class="detail">{{item.detail}}</div>
      </div>
    </div>
    <!-- receive -->
    <div class="receive" v-for="(item,index) in receives" :key="index">
      <div class="rTitle">{{item.whiteTitle}}<span class="gold">{{item.title}}</span>
      </div>
      <div class="rContent" v-if="item.title!=='流程'" v-html="item.content"></div>
      <div :class="['path',index === 1? 'pathList':'']" v-else>
        <div class="line" v-for="(it,index) in item.content" :key="index" v-html="it"></div>
      </div>
    </div>
    <!-- question -->
    <div class="question">
      <div class="qTitle">问题<span class="gold">咨询</span>
      </div>
      <div class="cons" v-for="(item,index) in questions" :key="index">
        <div class="cTitle">{{item.title}}</div>
        <div class="content" v-if="index!==2">{{item.content}}</div>
        <div class="content" v-else>
          {{item.content1}}
          <span class="gold">{{item.gold1}}</span>
          {{item.content2}}
          <span class="gold">{{item.gold2}}</span>
        </div>
      </div>
    </div>
    <!-- btn -->
    <div class="btn">
      <div class="btnText" @click="receive">{{btnText}}</div>
    </div>
    <!-- bubble -->
    <div class="bubble" @touchmove="e => {e.preventDefault()}" v-show="bubble" @click="close">
      <div class="popup" v-show="popShow"></div>
      <div class="wxpay" v-show="wxShow">
        <div class="msg">90元会员需支付{{msg}}领取</div>
        <div class="confirm" @click="clickToPay">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import InvokeApp from 'plat-utils/src/invokeApp';
import { isIos, inApp } from 'plat-utils/src/systemInfo';
import Toast from '../../components/Toast/index';
import iconGift from './resource/gift.png';

export default {
  name: 'chinatelecom2019',
  data() {
    return {
      wealths: [
        {
          titleStart: '送价值',
          titleBig: '209元',
          titleEnd: '的作业帮一课名师直播课',
          bg: require('./resource/bg-one.jpg'),
          detail:
            '北上广名师直播教学，资深学习顾问1对1电话家访，为你定制专享学习计划',
        },
        {
          titleStart: '价值',
          titleBig: '90元',
          titleEnd: '作业帮VIP会员',
          bg: require('./resource/bg-two.jpg'),
          detail: '难题不会随时拍照搜题，百万题目视频讲解免费观看',
        },
      ],
      receives: [
        {
          whiteTitle: '领取',
          title: '资格',
          content:
            '此福利为中国电信作业帮学子卡用户专享，每个用户可领取 1次，其他用户不可领取。如已办理学子卡但提示无资格领取，请联系为您办理业务的电信客户经理。<br/><br/>中国电信作业帮学子卡目前为陕西、吉林、湖南、山西、河北、河南等部分省市试运营业务（各省将陆续逐步上线），尚未规模上市。是否可办理，敬请咨询当地电信，关注您所在学校的校内外当地电信宣传。',
        },
        {
          whiteTitle: '领取',
          title: '流程',
          content: [
            '使用中国电信学子卡手机号注册作业帮APP账号。',
            `打开作业帮APP并用学子卡登陆，在我的 - 活动中心<img src="${iconGift}" style="height: 0.3168rem;width: 0.384rem; vertical-align: text-bottom;margin-right: 2px;margin-left:2px;" />，进入活动页面`,
            '点击领取福利按钮，获得课程权益；成功支付后，自动返回本页面，获得VIP会员权益。',
          ],
        },
        {
          whiteTitle: '领取',
          title: '规则',
          content:
            '已办理中国电信学子卡的用户可直接领取免费课程权益。<br/>3个月免费会员权益需支付0.01-0.1元进行激活。自第 4 个月起，恢复原价 15 元/月。可随时取消。<br/>会员权益支付与否不影响课程权益领取。',
        },
        {
          whiteTitle: '会员权益',
          title: '支付激活方式',
          content:
            // eslint-disable-next-line
            "<b>安卓用户：</b>赠送的作业帮 VIP 会员，自激活第1天起的前 3 个月（即90天），每月仅需支付 0.01 元，自动扣费，可随时取消。<br/><br/><b>苹果用户：</b>苹果用户由于IOS系统的支付限制，只能通过学币支付，1 个学币 1 毛钱，即您只需要支付 1 毛钱即可享受 3 个月会员权益。单次充值至少1元。"
        },
        {
          whiteTitle: '权益',
          title: '发放方式',
          content:
            // eslint-disable-next-line
            "<b>（1）课程权益：</b>权益领取成功后，课程将由作业帮一课资深学习顾问 1 对 1 电话发放，发放成功后，可登陆作业帮，点击我 - 我的一课 - 我的课程进行查看，预约上课时间开始前半小时即可进入直播间，准备上课。<br/><br/><b>（2）VIP 会员权益：</b>成功支付后即刻生效，打开作业帮APP- 我的 -VIP会员中心即可开始使用。"
        },
      ],
      questions: [
        {
          title: '我为什么不能领取福利呢？',
          content:
            '此福利为中国电信联合作业帮发起，为作业帮学子卡用户专属福利，其他用户可到各地电信营业厅办理作业帮学子卡后参与领取',
        },
        {
          title: '课程和 VIP 如何发放呢？',
          content:
            '课程将由作业帮一课老师电话回访发放；VIP会员成功支付后即刻到账，打开作业帮APP-我的-VIP会员中心即可使用权益',
        },
        {
          title: '',
          content1: '关于作业帮权益的其他特殊情况，可咨询作业帮客服',
          gold1: '4006110100',
          content2: '。关于中国电信学子卡的其他疑问，可咨询当地电信客服',
          gold2: '10000',
        },
      ],
      btnText: '点击领取福利',
      common: {
        province: '北京市',
        city: '北京市',
        os: 'android',
        vc: Number,
        area: '北京市',
      },
      unablePay: false,
      extInfo: { fromChannel: '' },
      bubble: false,
      popShow: false,
      wxShow: false,
      url: '',
      msg: '0.01元',
      status: '',
      serverId: Number,
      itemId: Number,
    };
  },
  created() {
    this.init();
    this.extInfo.fromChannel = this.getFrom('from');
    hybrid('swapBack', { enabled: false });
  },
  methods: {
    getFrom(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      return r !== null ? unescape(r[2]) : '';
    },
    init() {
      this.url = '';
      if (inApp) {
        zybLog.send({ type: 'chinatelecom2019', app: 'inapp' });
        this.btnText = '点击领取福利';
        // 获取公参
        hybrid('common', {}, (res) => {
          this.common = {
            province: res.province,
            city: res.city,
            os: res.os,
            vc: res.vc,
            area: res.area,
          };
          // 系统版本号判断
          if (isIos) {
            this.unablePay = res.vc < 257;
          } else {
            this.unablePay = res.vc < 545;
          }
        });
      } else {
        zybLog.send({ type: 'chinatelecom2019', app: 'outapp' });
        this.btnText = '下载作业帮';
      }
    },
    // 点击领取福利
    receive() {
      const url = '/activity/vip/chinatelecom2019';
      if (this.btnText === '下载作业帮') {
        // 端外
        zybLog.send({ type: 'btnClick', app: 'outapp' });
        this.openApp();
      } else {
        // 端内
        zybLog.send({ type: 'btnClick', app: 'inapp' });
        hybrid('is_login', {}, (res1) => {
          if (res1.isLogin) {
            // 已登陆
            this.$fetch(url).then((res) => {
              if (res.errNo === 0) {
                const state = res.data.status;
                if (state === 0) {
                  // 未注册，弹窗提示不具有领取资格
                  this.wxShow = false;
                  this.bubble = true;
                  this.popShow = true;
                } else if (state === 1) {
                  // 已注册，可以领取，跳转支付页面
                  this.toPay();
                } else {
                  // 已领取，弹窗提示
                  Toast({
                    message: '您已领取过福利了',
                    duration: '2000',
                  });
                }
              }
            });
          } else {
            // 未登录
            hybrid('loginForResult', {}, (res2) => {
              if (res2.result) {
                window.location.reload();
              }
            });
          }
        });
      }
    },
    // 拉取支付
    toPay() {
      this.$fetch({
        method: 'get',
        params: this.common,
        url: '/activity/vip/chinatelecomwelfare',
      }).then((res) => {
        if (res.errNo === 0) {
          if (res.data.status === 0) {
            // 跳转通用支付页面
            this.serverId = res.data.product.payServiceId;
            this.itemId = res.data.product.payItemId;
            // 端上支付
            this.msg = '1学币';
            this.popShow = false;
            this.bubble = true;
            this.wxShow = true;
          } else if (this.unablePay) {
            hybrid('toast', { text: '作业帮版本低，请先升级' });
          } else {
            // 跳转支付中间页
            const fee = res.data.product.price;
            const items = `${res.data.product.payServiceId}_${
              res.data.product.payItemId
            }_1`;
            this.url = `https://www.zybang.com/support/pay/h5pay?fee=${fee}&items=${items}&extInfo=${encodeURI(JSON.stringify(this.extInfo))}`;
            this.status = '1';
            this.msg = '0.01元';
            this.popShow = false;
            this.bubble = true;
            this.wxShow = true;
          }
        }
      });
    },
    // 点击确定跳转支付
    clickToPay() {
      if (this.status === '1') {
        // wxpay
        hybrid('openWindow', {
          url: this.url,
        });
      } else {
        // 通用支付
        hybrid('platformPay', { serverId: this.serverId, itemId: this.itemId }, () => {
          hybrid('toast', { text: '恭喜你，购买成功' });
        });
      }
    },
    close() {
      this.bubble = false;
      this.wxShow = false;
      this.popShow = false;
    },
    // 端外 处理
    openApp() {
      // 端外打开app
      const naLink = `homework://com.baidu.homework/web?url=${encodeURIComponent(window.location.href)}`;
      InvokeApp({
        downloadLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        yybLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        nativeLinkIos: naLink,
        nativeLinkAndroid: naLink,
        universalLink: `//oia.zybang.com/download/?page=${encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${window.location.href}`)}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@function rem($px) {
  $ui: 750;
  @return $px / (100/ (720 / $ui)) + rem;
}
// 文字前后的伪元素样式
@mixin preClass {
  content: " ";
  display: inline-block;
  width: rem(16);
  height: rem(7);
  background-color: $white;
  vertical-align: middle;
}
$gold: #e1c4ab;
$white: #fff;

.wrap {
  position: relative;
  width: 100%;
  background-color: #765bff;
  user-select: none;
  .headerBg {
    width: 100%;
    height: auto;
  }
  // wealth
  .wealth {
    position: relative;
    width: 89.15%;
    height: rem(1225);
    margin: rem(-110) auto 0;
    background: url("./resource/redBg.png") no-repeat;
    background-size: 100% auto;
    z-index: 1;
    transform: translateX(-0.05%);
    padding-top: rem(84);
    .flag {
      position: absolute;
      width: rem(264);
      height: auto;
      left: 45%;
      z-index: 10;
      margin-top: rem(-84);
    }
    // wItem
    .wItem {
      width: 90.3%;
      height: rem(521);
      margin: 0 auto;
      background-color: #fff;
      border-radius: rem(20);
      .head {
        width: 100%;
        height: rem(71);
        background-color: #f8f1e3;
        border-radius: rem(20) rem(20) 0 0;
        .name {
          line-height: rem(71);
          font-size: rem(40);
          color: #987328;
          font-weight: bold;
          text-align: center;
          margin: 0 auto;
          letter-spacing: 1px;
          &::before {
            display: inline-block;
            content: " ";
            height: rem(27);
            width: rem(42);
            margin-right: rem(30);
            background: url("./resource/ball.png") no-repeat;
            background-size: contain;
          }
          &::after {
            display: inline-block;
            content: " ";
            height: rem(27);
            width: rem(42);
            margin-left: rem(30);
            background: url("./resource/ball.png") no-repeat;
            background-size: contain;
            transform: rotate(180deg);
          }
          .bName {
            position: relative;
            top: 0.03rem;
            font-size: rem(56);
          }
        }
      }
      .title {
        margin-top: rem(31);
        font-size: rem(25);
        line-height: rem(25);
        text-align: center;
        color: #987328;
        .big {
          font-size: rem(33);
          font-weight: bold;
          margin: 0.1rem;
        }
      }
      .bg {
        display: block;
        width: 95.2%;
        height: auto;
        margin: rem(33) auto 0;
      }
      .detail {
        width: 86%;
        margin: rem(38) auto 0;
        font-size: rem(25);
        line-height: rem(36);
        text-align: center;
        color: #000;
      }
      &:nth-child(3) {
        margin-top: rem(52);
      }
    }
  }
  // receive
  .receive {
    width: rem(608);
    height: auto;
    margin: 0 auto;
    color: $white;
    letter-spacing: rem(1);
    .rTitle {
      font-size: rem(33.33);
      font-weight: bold;
      line-height: rem(33.33);
      text-align: center;
      margin-bottom: rem(37);
      .gold {
        color: $gold;
      }
      &::before {
        @include preClass;
        margin-right: rem(10);
      }
      &::after {
        @include preClass();
        margin-left: rem(10);
      }
    }
    .rContent {
      font-size: rem(25);
      line-height: rem(40);
      padding-bottom: rem(74);
    }
    .path {
      font-size: rem(25);
      line-height: rem(40);
      padding-bottom: rem(74);
    }
    .pathList {
      counter-reset: pathList 0;
      .line {
        counter-increment: pathList;
        padding-left: rem(44);
        .rImg {
          height: rem(33);
          width: rem(40);
        }
        &::before {
          content: counter(pathList);
          display: inline-block;
          width: rem(34);
          height: rem(34);
          background-color: $white;
          color: #765bff;
          border-radius: 50%;
          text-align: center;
          line-height: rem(34);
          margin-left: rem(-44);
          margin-right: rem(10);
        }
      }
    }
  }
  // question
  .question {
    width: rem(608);
    letter-spacing: rem(1);
    height: auto;
    margin: 0 auto;
    .qTitle {
      font-size: rem(33.33);
      font-weight: bold;
      line-height: rem(33.33);
      text-align: center;
      margin-bottom: rem(37);
      color: $white;
      .gold {
        color: $gold;
      }
      &::before {
        @include preClass;
        margin-right: rem(10);
      }
      &::after {
        @include preClass();
        margin-left: rem(10);
      }
    }
    .cons {
      &::after {
        display: block;
        content: " ";
        width: rem(580);
        height: rem(2);
        background-color: $gold;
        margin-bottom: rem(30);
      }
      .cTitle {
        color: $gold;
        font-size: rem(25);
        font-weight: bold;
        margin-bottom: rem(20);
      }
      .content {
        color: $white;
        font-size: rem(25);
        line-height: rem(40);
        margin-bottom: rem(20);
        .gold {
          color: $gold;
        }
      }
    }
    .cons:nth-child(4) {
      padding-bottom: rem(218);
      &::after {
        display: none;
      }
      .content {
        margin-bottom: 0;
      }
    }
  }
  // btn
  .btn {
    // display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: rem(128);
    background-color: $white;
    z-index: 1000;
    line-height: rem(128);
    text-align: center;
    .btnText {
      display: inline-block;
      width: rem(686);
      height: rem(84);
      margin: 0 auto;
      background-color: #fbc70e;
      border-radius: rem(40);
      text-align: center;
      font-size: rem(40);
      line-height: rem(80);
      color: #a53f12;
    }
  }
  // bubble
  .bubble {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.6);
    .popup {
      position: fixed;
      width: rem(500);
      height: rem(438);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1002;
      background: url("./resource/msg.png") no-repeat;
      background-size: contain;
    }
    .wxpay {
      position: fixed;
      width: rem(680);
      height: rem(733);
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      z-index: 1002;
      background: url("./resource/wxpay.png") no-repeat;
      background-size: contain;
      .msg {
        font-size: rem(26);
        color: #666;
        line-height: 1;
        text-align: center;
        margin:rem(586) auto 0;
      }
      .confirm {
        width: rem(600);
        height: rem(84);
        background-color: #e42b21;
        font-size: rem(40);
        color: #fff;
        line-height: rem(84);
        text-align: center;
        border-radius: rem(42);
        margin: rem(20) auto 0;
      }
    }
  }
}
</style>

