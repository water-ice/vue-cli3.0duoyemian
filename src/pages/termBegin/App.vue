<template>
  <div class="wrap">
    <!-- header -->
     <header>
      <div class="rules" @click="show('rule')">
        <b>活动规则</b>
      </div>
      <img src="./resource/header.jpg" alt="" class="head-img">
    </header>
    <!-- coupons -->
    <div class="coupons">
      <!-- one -->
      <div class="coupon-one" @click="choose('pay',products[0])">
        <div class="name">新用户专享</div>
        <div class="detail">
          连续包月
          <span class="detail-red">
            <s>原价30元/月</s>
          </span>
        </div>
        <div class="btn">立即开通</div>
      </div>
      <!-- two -->
      <div class="coupon-two" @click="choose('pay',products[1])">
        <div class="name">折合10元/月</div>
        <div class="detail">
          40元/4个月
          <span class="detail-red">
            <s>原价120元</s>
          </span>
        </div>
        <div class="btn">立即开通</div>
      </div>
      <!-- three -->
      <div class="coupon-three" @click="choose('pay',products[2])">
        <div class="name">折合8.3元/月</div>
        <div class="detail">
          119元/12个月
          <span class="detail-red">
            <s>原价360元</s>
          </span>
        </div>
        <div class="btn">立即开通</div>
      </div>
    </div>
    <!-- group -->
    <div class="group">
      <!-- gift -->
      <div class="gift" v-for="(item,index) in 4" :key="index"></div>
      <div class="text">
        通过本活动购买任意会员，可获得以上礼包
        <br>&lceil; 超越 &rfloor; 笔记礼盒，仅购买
        <span class="bgtext">年费会员</span>可获得
      </div>
      <!-- address -->
      <div class="address" @click="choose('add')">
        <u>填写地址>></u>
      </div>
    </div>
    <!-- lucky -->
    <div class="lucky">
      <!-- notice-bar -->
      <div class="notice" v-if="len>0">
        <rolling :len="len" :time="1" delayTime="2">
          <li class="text" v-for="(item,index) in list" :key="index">
            恭喜{{item.uname}} 获得
            <span class="purple">{{item.prizeName}}</span>
          </li>
        </rolling>
      </div>
      <div class="elseNotice" v-else></div>
      <!-- sudoku -->
      <div class="sudoku">
        <lucky
          :success="success"
          :addressDetaill="addressDetaill"
          @doSomeThing="doSomeThing"
          :status="status"
          :luckDrawCount="luckDrawCount"
        ></lucky>
      </div>
      <!-- record&addressbtn -->
      <div class="record-btn">
        <div class="record" @click="choose('record')">我的获奖记录>></div>
        <div class="address-btn" @click="choose('add')">地址填写>></div>
      </div>
      <div class="tips">开通会员后分享活动 抽奖次数额外+1</div>
      <div class="share">
        <div class="share-btn" @click="choose('toShare')">分享给同学</div>
      </div>
    </div>
    <!-- swiper -->
    <swiper @touchstart="holdExit(0)" @touchend="holdExit(1)" @touchcancel="holdExit(3)"></swiper>
    <!-- privilege -->
    <div class="privilege" @click="log"></div>
    <!-- dialog -->
    <termBeginDialog
      v-if="success"
      @changeVisible="changeVisible"
      @doSomeThing="doSomeThing"
      :prizeList="prizeList"
      :item="item"
      :dialogShow="dialogShow"
      :addressDetaill="addressDetaill"
    ></termBeginDialog>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import { inWeChat, inQQ, inApp, isIos } from 'plat-utils/src/systemInfo';
import InvokeApp from 'plat-utils/src/invokeApp';
import lucky from './component/lucky.vue';
import swiper from './component/swiper.vue';
import termBeginDialog from './component/termBeginDialog.vue';
import rolling from '../../components/Rolling/Rolling.vue';

export default {
  name: 'termBegin',
  components: {
    lucky,
    rolling,
    swiper,
    termBeginDialog,
  },
  data() {
    return {
      len: 0,
      // 获奖名单列表
      list: [],
      dialogShow: false,
      item: 'rule',
      // 获奖记录
      prizeList: [],
      addressDetaill: {
        phone: '',
        address: '',
        userName: '',
      },
      luckDrawCount: 0,
      products: [],
      extInfo: { fromChannel: '' },
      // 状态
      status: {
        isLogin: 0,
        wechat: false,
        app: false,
        qq: false,
      },
      success: false,
      // 公参
      common: {
        os: 'android',
        vc: 500,
      },
    };
  },
  created() {
    zybLog.send({ type: 'pagelook' });
    // 获取活动信息及状态初始化
    this.getActivity();
    this.extInfo.fromChannel = this.getFrom('from');
  },
  mounted() {
    window.fePageResume = () => {
      this.getActivity();
    };
  },
  methods: {
    holdExit(index) {
      if (!isIos) {
        hybrid('slidingExitState', {
          state: index,
        });
      }
    },
    getFrom(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      return r !== null ? unescape(r[2]) : '';
    },
    // 获取活动信息及状态初始化
    getActivity(tag) {
      if (inWeChat) {
        zybLog.send({ type: 'weixinlook' });
        this.status.wechat = true;
      } else {
        this.status.wechat = false;
      }
      if (inQQ) {
        zybLog.send({ type: 'qqlook' });
        this.status.qq = true;
      } else {
        this.status.qq = false;
      }
      if (inApp) {
        hybrid('common', {}, (res) => {
          this.common = {
            os: res.os,
            vc: res.vc,
          };
        });
        this.status.app = true;
      } else {
        this.status.app = false;
      }
      hybrid('is_login', {}, (res1) => {
        if (res1.isLogin) {
          this.status.isLogin = 1;
        } else {
          this.status.isLogin = 2;
        }
      });
      this.$fetch({
        method: 'get',
        params: { activityId: 'f91792aef02e52fa71d1f324b2926998' },
        url: '/activity/vip/activity',
      }).then((res) => {
        if (res.errNo === 0) {
          this.success = true;
          if (res.data.userInfo.length !== 0) {
            this.luckDrawCount = res.data.userInfo.luckDrawCount;
          } else {
            this.luckDrawCount = 0;
          }
          if (res.data.products.length !== 0) {
            this.products = res.data.products;
          }
          if (res.data.userInfo.addressInput === 1 && res.data.userInfo.phone === '') {
            if (tag) {
              return false;
            }
            this.show('addalert');
          }
          if (res.data.userInfo.phone) {
            // 赋值给弹框的表单信息
            const detail = res.data.userInfo;
            this.addressDetaill.userName = detail.userName;
            this.addressDetaill.address = detail.address;
            this.addressDetaill.phone = detail.phone;
          } else {
            this.addressDetaill = {
              phone: '',
              address: '',
              userName: '',
            };
          }
        }
      });
      // 获取 获奖用户列表
      this.$fetch({
        method: 'get',
        params: { rn: 20, activityId: 'f91792aef02e52fa71d1f324b2926998' },
        url: '/activity/vip/activityluckuser',
      }).then((res) => {
        if (res.errNo === 0) {
          this.list = res.data;
          this.len = res.data.length;
        }
      });
    },
    choose(i, item) {
      // 好多的打点 （*>.<*）
      if (i === 'pay') {
        if (item.payItemId === 993) {
          zybLog.send({ type: 'continuity' });
        } else if (item.payItemId === 100001) {
          zybLog.send({ type: 'four' });
        } else if (item.payItemId === 100002) {
          zybLog.send({ type: 'twelve' });
        }
      } else if (i === 'toShare') {
        zybLog.send({ type: 'sharebutton' });
      } else if (i === 'record') {
        zybLog.send({ type: 'thewinning' });
      } else if (i === 'add') {
        zybLog.send({ type: 'address' });
      }
      if (this.status.app) {
        if (this.status.isLogin === 1) {
          if (i === 'pay') {
            this.toPay(item);
          } else if (i === 'toShare') {
            this.toShare();
          } else {
            this.show(i);
          }
        } else {
          this.toLogin();
        }
      } else if (this.status.wechat) {
        this.$osg().then(() => {
        // eslint-disable-next-line
          alert('success')
        });
      } else {
        this.toApp();
      }
    },
    // 获取获奖记录
    getRecord() {
      this.$fetch({
        method: 'get',
        params: { activityId: 'f91792aef02e52fa71d1f324b2926998' },
        url: '/activity/vip/activityluckhistory',
      }).then((res) => {
        this.prizeList = res.data;
      });
    },
    // 支付
    toPay(item) {
      // 微信连续包月
      if (item.payItemId === 993) {
        this.$fetch({
          method: 'post',
          data: {
            activityId: 'f91792aef02e52fa71d1f324b2926998',
            itemId: item.payItemId,
            os: this.common.os,
            vc: this.common.vc,
          },
          url: '/activity/vip/activityisbuy',
          formType: true,
        }).then((res) => {
          if (res.errNo === 0) {
            if (res.data === 1) {
              // 允许购买，跳转微信支付
              const fee = item.price;
              const items = `${item.payServiceId}_${item.payItemId}_1`;
              const wxPayUrl = `https://www.zybang.com/support/pay/h5pay?fee=${fee}&items=${items}&extInfo=${encodeURI(JSON.stringify(this.extInfo))}`;
              hybrid('openWindow', {
                url: wxPayUrl,
              });
            }
          }
        });
      } else if (item.payItemId === 100001 || item.payItemId === 100002) {
        if (localStorage.getItem('localId')) {
          localStorage.removeItem('localId');
        }
        // 跳转通用支付
        this.commonPay(item);
      }
    },
    // commonPay
    commonPay(item) {
      localStorage.setItem('localId', item.payItemId);
      hybrid(
        'platformPay',
        { serverId: item.payServiceId, itemId: item.payItemId },
        (res) => {
          if (res.orderId) {
            const _id = localStorage.getItem('localId');
            this.termToast('恭喜你，购买成功!');
            if (_id === '100001') {
              zybLog.send({ type: 'fourbuy' });
            } else if (_id === '100002') {
              this.show('addalert');
              zybLog.send({ type: 'twelvebuy' });
            }
          }
        },
      );
    },
    // 跳转登陆
    toLogin() {
      hybrid('loginForResult', {}, (res2) => {
        if (res2.result) {
          window.location.reload();
        }
      });
    },
    // 打开弹窗
    show(item) {
      if (item === 'rule') {
        zybLog.send({ type: 'rule' });
      }
      if (item === 'record') {
        this.getRecord();
      }
      this.item = item;
      setTimeout(() => {
        this.dialogShow = true;
      }, 10);
    },
    // 关闭弹窗
    changeVisible(val) {
      const bool = val[0];
      this.dialogShow = bool;
      if (val[1] === 'toAdd') {
        setTimeout(() => {
          this.dialogShow = true;
          this.item = 'add';
        }, 300);
      }
    },
    log() {
      zybLog.send({ type: 'trailercard' });
    },
    doSomeThing(val) {
      if (val === 'openApp') {
        this.toApp();
      } else if (val === 'openLogin') {
        this.toLogin();
      } else if (val === 'refresh') {
        this.getActivity('refresh');
      }
    },
    // 主动分享按钮
    toShare() {
      hybrid(
        'share',
        {
          share_title: '作业帮VIP开学特惠，限时3折',
          share_text:
            '我刚开通VIP会员，拍照搜题讲解视频，全能免费看了，还领了知识礼包，你也快领吧',
          share_img:
            'https://yy-s.zuoyebang.cc/static/common/css/resource/logo_128x128_b10037d.png',
          share_url: window.location.href,
          share_origin: window.location.href,
          is_share: 'true',
        },
        (res) => {
          if (res.result === 1) {
            this.shareSuccess();
            if (res.shareType === 0 || res.shareType === 1) {
              zybLog.send({ type: 'qqshare' });
            }
            if (res.shareType === 2 || res.shareType === 3) {
              zybLog.send({ type: 'weixinshare' });
            }
          }
        },
      );
    },
    // 分享成功，添加次数
    shareSuccess() {
      this.$fetch({
        method: 'get',
        params: { activityId: 'f91792aef02e52fa71d1f324b2926998' },
        url: '/activity/vip/activityshare',
      }).then((res1) => {
        if (res1.errNo === 0) {
          this.getActivity();
        }
      });
    },
    // 唤起app
    toApp() {
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
    // toast
    termToast(i) {
      hybrid('toast', { text: i });
    },
    // end
  },
};
</script>

<style lang="scss" scoped>
@import "./mixin.scss";
@function rem($px) {
  @return $px / 100 + rem;
}
.wrap {
  width: 100%;
  position: relative;
  background-color: #ff4a50;
  user-select: none;
  // header {
  header{
    background-color: #fff;
    .head-img{
      width: 100%;
      height: 100%;
     }
    .rules {
      position: absolute;
      width: rem(112);
      height: rem(50);
      background-color: #74bff4;
      color: #3f37b1;
      font-size: rem(20);
      line-height: rem(50);
      text-align: center;
      border-top-left-radius: rem(25);
      border-bottom-left-radius: rem(25);
      top: rem(30);
      right: 0;
    }
  }
  // coupons
  .coupons {
    width: 100%;
    height: rem(713);
    background: url("./resource/couponsbg.jpg") no-repeat;
    background-size: contain;
    .coupon-one {
      display: inline-block;
      width: rem(314);
      height: rem(314);
      margin-left: rem(42);
      background: url("./resource/coupon-one.png") no-repeat;
      background-size: contain;
      .detail {
        @include detail(rem(24), rem(134), rem(24));
        .detail-red {
          @include detail-red(rem(24), #cc0108);
        }
      }
      .btn {
        animation: breath 0.4s ease-out infinite alternate;
        // $width,$height,$top,$right,$bottom,$left,$font,$radius
        @include dialogBtn(
          rem(232),
          rem(60),
          rem(28),
          0,
          0,
          rem(26),
          rem(28),
          rem(30),
          #df2128,
          #ffff26,
          #ffffaf,
          #ffe11b
        );
      }
    }
    .coupon-two {
      float: right;
      width: rem(334);
      height: rem(334);
      background: url("./resource/coupon-two.png") no-repeat;
      background-size: contain;
      transform: translateX(-12.57%);
      .detail {
        @include detail(rem(28), rem(134), rem(42));
        .detail-red {
          @include detail-red(rem(24), #cc0108);
        }
      }
      .btn {
        animation: breath 0.4s ease-out infinite alternate;
        @include dialogBtn(
          rem(232),
          rem(60),
          rem(28),
          0,
          0,
          rem(56),
          rem(28),
          rem(30),
          #df2128,
          #ffff26,
          #ffffaf,
          #ffe11b
        );
      }
    }
    .coupon-three {
      width: rem(630);
      height: rem(324);
      margin: rem(24) auto 0;
      background: url("./resource/coupon-three.png") no-repeat;
      background-size: contain;
      .name {
        padding-top: rem(12);
      }
      .detail {
        @include detail(rem(28), rem(134), rem(168));
        .detail-red {
          @include detail-red(rem(24), #cc0108);
        }
      }
      .btn {
        animation: breath 0.4s ease-out infinite alternate;
        // $width,$height,$top,$left,$font,$radius
        @include dialogBtn(
          rem(342),
          rem(64),
          rem(30),
          0,
          0,
          rem(144),
          rem(32),
          rem(32),
          #df2128,
          #ffff26,
          #ffffaf,
          #ffe11b
        );
      }
    }
  }
  // group
  .group {
    box-sizing: border-box;
    width: rem(660);
    height: rem(1150);
    margin: 0 auto;
    padding-top: rem(200);
    background: url("./resource/giftbg.png") no-repeat;
    background-size: contain;
    .gift {
      width: rem(660);
      &:nth-child(1) {
        height: rem(196);
        margin-bottom: rem(12);
        background: url("./resource/gift-one.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(2) {
        height: rem(185);
        background: url("./resource/gift-two.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(3) {
        height: rem(196);
        background: url("./resource/gift-three.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(4) {
        height: rem(231);
        background: url("./resource/gift-four.png") no-repeat;
        background-size: contain;
        transform: translateX(rem(14));
      }
    }
    .text {
      width: rem(520);
      text-align: center;
      margin: rem(-8) auto 0;
      color: #504ab7;
      font-size: rem(20);
      font-weight: bold;
      .bgtext {
        color: $bgcolor;
      }
    }
    .address {
      margin: rem(20) auto 0;
      color: $bgcolor;
      text-align: center;
      font-size: rem(20);
      font-weight: bold;
    }
  }
  // lucky
  .lucky {
    box-sizing: border-box;
    width: rem(660);
    height: rem(1140);
    margin: 0 auto;
    padding-top: rem(170);
    background: url("./resource/lucky/luckybg.png") no-repeat;
    background-size: contain;
    // notice
    .notice {
      font-size: rem(24);
      width: rem(368);
      line-height: rem(32);
      height: rem(32);
      margin: 0 auto rem(40);
      color: #333;
      font-weight: bold;
      text-align: center;
      .text {
        margin-top: 0.1rem;
        .purple {
          color: #cc0016;
        }
      }
    }
    .elseNotice {
      font-size: rem(24);
      width: rem(368);
      line-height: rem(32);
      height: rem(32);
      margin: 0 auto rem(40);
      color: #333;
      font-weight: bold;
      text-align: center;
    }
    // sudoku
    .sudoku {
      width: rem(580);
      height: rem(594);
      margin: 0 auto;
    }
    // btn
    .record-btn {
      width: rem(586);
      height: auto;
      margin: rem(20) auto rem(40);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      font-size: rem(28);
      color: white;
      .record {
        display: flex;
        width: rem(250);
        height: rem(56);
        align-items: center;
        justify-content: center;
        background: url("./resource/lucky/luckylist.png") no-repeat;
        background-size: contain;
      }
      .address-btn {
        display: flex;
        width: rem(200);
        height: rem(56);
        align-items: center;
        justify-content: center;
        background: url("./resource/lucky/inputaddress.png") no-repeat;
        background-size: contain;
      }
    }
    // tips
    .tips {
      width: rem(586);
      color: #3f37b1;
      font-size: rem(28);
      text-align: center;
      margin: 0 auto;
      font-weight: bold;
    }
    // share-btn
    .share {
      width: rem(586);
      margin: 0 auto;
      text-align: center;
      .share-btn {
        @include dialogBtn(
          rem(360),
          rem(70),
          rem(40),
          auto,
          0,
          auto,
          rem(32),
          rem(35),
          #df2128,
          #ffff26,
          #ffffaf,
          #ffe11b
        );
      }
    }
  }
  // privilege
  .privilege {
    width: rem(660);
    height: rem(860);
    margin: rem(56) auto 0;
    padding-bottom: rem(60);
    background: url("./resource/special.png") no-repeat;
    background-size: contain;
  }
}
</style>

