<template>
  <div class="wrap" >
    <header></header>
    <!-- 优惠券 -->
    <div class="coupons">
      <div class="coupon" v-for="(item,index) in coupons" :key="index">
        <div class="coupon-date">
          <span class="bold">有效期:</span>
          <!-- {{item.receiveStatus === 1?'领取后当天有效':getTime(item.useEndTime)}} -->
          活动已结束
        </div>
        <div
          class="coupon-btn"
          ref="couponBtn"
          @click="getNow(item.couponId,item.receiveStatus,item.payItemId,index)"
        >{{item.receiveStatus===1?'立即领取':'立即使用'}}</div>
      </div>
    </div>
    <!-- vip -->
    <div class="vip">
      <div class="vip-item" v-for="(item,index) in vip" :key="index" @click="openNow(item)">立即开通</div>
    </div>
    <!-- group -->
    <div class="group">
      <div class="address">
        <p>
          社群+电子版作文试卷包,
          <span class="yellow">购买4个月及1年</span>套餐赠送；
        </p>
        <p>
          大栗帆布袋仅
          <span class="yellow">购买1年</span>套餐赠送。
        </p>
        <p>
          <span class="yellow" @click="addressMsg">点击填写收货地址>></span>
        </p>
      </div>
    </div>
    <!-- swiper -->
    <div class="swiper">
      <div class="swiper-content">
        <div class="items">
          <mt-swipe :auto="3000" class="swipitem">
            <mt-swipe-item v-for="(item,index) in swipers" :key="index">
              <div class="item-img">
                <img :src="item" alt>
              </div>
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="footer"></div>
    <p class="footer-p">
      1.使用优惠券点击支付后，却未最终支付，优惠券还在上个订单，半小时后可重新使用，所以开通时一定不要犹豫哦
      <br>2.社群+作文试卷包，仅此页面购买4个月及1年套餐赠送，活动结束1周通过站内消息发放，请注意查收
      <br>3.帆布袋仅此页面购买1年套餐赠送，活动结束2周发货，图案颜色随机，购买后，在此页面填写收货信息
      <br>4.优惠券仅限此页面商品使用，优惠券有效期只有1天，请尽快使用，享受优惠哦
      <br>5.开通后，在【我的】-【VIP会员中心】里有所有VIP特权服务，可免费使用
      <br>6.会员自购买之时起5分钟生效，若购买后，无法使用VIP特权，请重启作业帮APP，会员一经开通不支持退款，特殊情况请联系客服4006110100。
    </p>
    <!-- 提示 -->
    <div class="bubble" @touchmove="e => {e.preventDefault()}" v-show="bubble" @click="closeMsg">
      <div class="msg" v-show="msgShow">
        <div class="title">{{alert}}</div>
        <div class="msg-coupons" v-if="isCoupon">检测到
          <br>你还未领取优惠券
          <br>
          <span class="orange">
            用券立减
            <span class="big">
              <b>{{reducePrice}}</b>
            </span> 哦~
          </span>
        </div>
        <div class="msg-group" v-else>
          作业帮VIP{{groupNow.name}}QQ群
          <br>
          {{groupNow.qq}}
        </div>
        <div class="msg-btn" @click="join">{{clickText}}</div>
      </div>
      <!-- success msg -->
      <div class="success-msg" v-show="successShow">
        <div class="succ-title">领取成功</div>
        <div class="succ-msg">恭喜你获得</div>
        <div class="succ-coupon">
          <img :src="couponSrc" width="100%" alt="coupon">
        </div>
        <div class="succ-use" @click="useNow">立即使用</div>
        <div class="succ-limit">（限今日使用有效）</div>
      </div>
    </div>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import Toast from '../../components/Toast/index';
// QQ group info
const qqGroup = [
  {
    name: '小学',
    qq: 882037273,
    url: 'https://jq.qq.com/?_wv=1027&k=5E2WXOP',
  },
  {
    name: '初中',
    qq: 858793096,
    url: 'https://jq.qq.com/?_wv=1027&k=5Peld5C',
  },
  {
    name: '高中',
    qq: 772868427,
    url: 'https://jq.qq.com/?_wv=1027&k=5kHybmG',
  },
];

export default {
  name: 'christmas2018',
  data() {
    return {
      swipers: [
        require('./resource/swiper-one.png'),
        require('./resource/swiper-two.png'),
        require('./resource/swiper-three.png'),
      ],
      // 优惠券 coupons
      coupons: [
        { receiveStatus: 1, couponId: 21 },
        { receiveStatus: 1, couponId: 22 },
      ],
      // vip
      vip: [{}, {}, {}],
      bubble: false,
      // 检测未领取的提示框
      msgShow: false,
      // 领取成功提示框
      successShow: false,
      clickText: '点击领取',
      alert: '提示',
      isCoupon: true,
      reducePrice: '51',
      couponSrc: require('./resource/coupon15.png'),
      isAddressInput: 0,
      // 优惠券领取状态 1待领取 2已领取
      receiveStatus15: 1,
      receiveStatus51: 1,
      // id
      couponid: null,
      payitemid: null,
      receivestatus: 1,
      index: 0,
      groupStatus: 2,
      currentTime: null,
      clickHistory: true,
      over: true,
    };
  },
  created() {
    window.fePageResume = () => {
      if (!this.over) {
        const buySucc = localStorage.getItem('isSuccessBuyVIP');
        if (buySucc === '1') {
          this.alert = 'VIP进群提示';
          this.clickText = '点击进群';
          this.isCoupon = false;
          this.bubble = true;
          this.msgShow = true;
        }
        localStorage.removeItem('isSuccessBuyVIP');
      }
    };
    // 进入页面打点
    zybLog.send({ type: 'pv' });
    hybrid('swapBack', { enabled: false });
    hybrid('getuserinfo', {}, (res) => {
      if (res.gradeTxt) {
        if (res.gradeTxt.indexOf('前') !== -1) {
          this.groupStatus = 1;
        } else if (
          res.gradeTxt.indexOf('初') !== -1
        ) {
          this.groupStatus = 1;
        } else if (
          res.gradeTxt.indexOf('高') !== -1
        ) {
          this.groupStatus = 2;
        } else {
          this.groupStatus = 0;
        }
      } else {
        this.groupStatus = 1;
      }
    });
  },
  mounted() {
    // 获取用户的领券信息及套餐信息
    this.getInfo();
  },
  computed: {
    // 显示对应年级信息
    groupNow() {
      return qqGroup[this.groupStatus];
    },
  },
  methods: {
    // 解析url，获取from值,用于将from传到优惠券选择页面
    getFrom(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      return r !== null ? unescape(r[2]) : '';
    },
    // 获取用户的领券信息及套餐信息
    getInfo() {
      this.$fetch.get('/activity/vip/christmas2018').then((res) => {
        if (res.errNo === 0) {
          //  保存优惠券详情
          this.coupons = res.data.result.coupons;
          // 保存套餐详情
          this.vip = res.data.result.products;
          // 保存地址填写状态
          this.isAddressInput = res.data.result.addressInput;
          // 保存服务端当前时间
          this.currentTime = res.data.result.currentTime;
          // 保存优惠券领取状态
          this.receiveStatus15 = res.data.result.coupons[0].receiveStatus;
          this.receiveStatus51 = res.data.result.coupons[1].receiveStatus;
          this.coupons[0].payItemId = res.data.result.products[1].payItemId;
          this.coupons[1].payItemId = res.data.result.products[2].payItemId;
        }
      });
    },
    // 点击立即领取
    getNow(couponid, receiveStatus, payitemid, index) {
      if (!this.over) {
        hybrid('is_login', {}, (res1) => {
          if (res1.isLogin) {
            const receiveCouponUrl = '/activity/vip/receivecoupon';
            // 如果未领取
            if (receiveStatus === 1 && this.clickHistory) {
              this.clickHistory = false;
              setTimeout(() => {
                this.clickHistory = true;
              }, 3000);
              this.$fetch({
                url: receiveCouponUrl,
                method: 'post',
                data: {
                  couponId: couponid,
                },
                formType: true,
              }).then((res) => {
                if (res.errNo === 0) {
                  this.bubble = false;
                  this.msgShow = false;
                  // 领取成功 弹框
                  this.couponSrc = index === 0 ? require('./resource/coupon15.png') : require('./resource/coupon51.png');
                  this.bubble = true;
                  this.successShow = true;
                  this.payitemid = payitemid;
                  this.getInfo();
                } else {
                  Toast({
                    message: '领取失败',
                    duration: 1000,
                  });
                }
              });
              // 领取优惠券 打点
              zybLog.send({ type: 'getClick', coupon: couponid });
            } else {
            // 立即使用 打点
              zybLog.send({ type: 'useClick', coupon: couponid });
              // 已领取
              this.buy(payitemid);
            }
          } else {
            hybrid('loginForResult', {}, (res2) => {
              if (res2.result) {
                window.location.reload();
              }
            });
          }
        });
      } else {
        Toast({
          message: '活动已结束~',
          duration: 2000,
        });
      }
    },
    useNow() {
      this.buy(this.payitemid);
    },
    // 立即开通
    openNow(item) {
      if (!this.over) {
        hybrid('is_login', {}, (res1) => {
          if (res1.isLogin) {
            if (item.payItemId === 1020) {
            // 套餐点击开通 打点
              zybLog.send({
                type: 'vipClickOpen',
                clickVip: item.payItemId,
              });
              this.buy(item.payItemId);
            } else if (item.payItemId === 1021) {
            // 套餐点击开通 打点
              zybLog.send({
                type: 'vipClickOpen',
                clickVip: item.payItemId,
              });
              // 判断对应的优惠券是否已领取
              if (this.receiveStatus15 === 1) {
                this.reducePrice = '15';
                this.clickText = '点击领取';
                this.alert = '提示';
                this.isCoupon = true;
                // 设置id默认值
                this.couponid = this.coupons[0].couponId;
                this.index = 0;
                this.payitemid = item.payItemId;
                this.receivestatus = 1;
                this.bubble = true;
                this.msgShow = true;
              } else {
                this.buy(item.payItemId);
              }
            } else {
            // 套餐点击开通 打点
              zybLog.send({
                type: 'vipClickOpen',
                clickVip: item.payItemId,
              });
              if (this.receiveStatus51 === 1) {
                this.reducePrice = '51';
                this.clickText = '点击领取';
                this.alert = '提示';
                this.isCoupon = true;
                // 设置id默认值
                this.couponid = this.coupons[1].couponId;
                this.index = 1;
                this.payitemid = item.payItemId;
                this.receivestatus = 1;
                this.bubble = true;
                this.msgShow = true;
              } else {
                this.buy(item.payItemId);
              }
            }
          } else {
            hybrid('loginForResult', {}, (res2) => {
              if (res2.result) {
                window.location.reload();
              }
            });
          }
        });
      } else {
        Toast({
          message: '活动已结束~',
          duration: 2000,
        });
      }
    },
    join() {
      if (!this.over) {
        if (this.isCoupon) {
        // 未领券 点击领取
          zybLog.send({
            type: 'vipClickGet',
            getpayitemid: this.payitemid,
          });
          this.getNow(
            this.couponid,
            this.receivestatus,
            this.payitemid,
            this.index,
          );
        } else {
        // 进群打点
          zybLog.send({ type: 'joinGroup', group: this.groupName });
          setTimeout(() => {
            window.location.href = this.groupNow.url;
          }, 200);
        }
      } else {
        Toast({
          message: '活动已结束~',
          duration: 2000,
        });
      }
    },
    // 支付
    buy(payItemId) {
      let payUrl = window.location.origin;
      if (window.location.origin.indexOf('h5') !== -1) {
        payUrl = 'https://www.zybang.com';
      } else {
        payUrl = window.location.origin;
      }
      setTimeout(() => {
        hybrid('openWindow', {
          url: `${payUrl}/napi/api/energypackagev1?vipSelect=${payItemId}&vipPackage=181224&isBackPrevPage=1&from=${this.getFrom('from')}`,
        });
      }, 200);
    },
    // 填写收获地址
    addressMsg() {
      if (!this.over) {
        if (this.isAddressInput === 0) {
          Toast({
            message: '您未购买年费会员，不用填写收货地址哦~',
            duration: 2000,
          });
        } else {
          let addUrl = window.location.origin;
          if (window.location.origin.indexOf('h5') !== -1) {
            addUrl = 'https://www.zybang.com';
          } else {
            addUrl = window.location.origin;
          }
          // 填写收货地址打点
          zybLog.send({ type: 'address' });
          setTimeout(() => {
            hybrid('openWindow', { url: `${addUrl}/course/course/address` });
          }, 200);
        }
      } else {
        Toast({
          message: '活动已结束~',
          duration: 2000,
        });
      }
    },
    // 弹框全部关闭
    closeMsg() {
      this.bubble = false;
      this.msgShow = false;
      this.successShow = false;
    },
    // 计算剩余时间
    getTime(endTime) {
      const remainDate = parseInt(endTime, 10) - parseInt(this.currentTime, 10);
      const allMinutes = parseInt(remainDate / 60, 10);
      const hours = parseInt(allMinutes / 60, 10);
      const minutes = parseInt(allMinutes - (hours * 60), 10);
      return `剩${hours}时${minutes}分到期`;
    },
  },
};
</script>

<style lang="less" scope>
@keyframes breath {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.04);
  }
}
.wrap {
  position: relative;
  width: 100%;
  height: 51.76rem;
  background: url("./resource/bg.png") no-repeat;
  background-size: 100% auto;
  header {
    width: 100%;
    height: 8.78rem;
    background: url("./resource/header.png") no-repeat;
    background-size: contain;
  }
  // 优惠券 coupons
  .coupons {
    height: 3.68rem;
    width: 100%;
    margin: 0.05rem 0 0.2rem;
    .coupon {
      width: 6.4rem;
      height: 1.7rem;
      margin: 0rem auto 0.14rem;
      background: url("./resource/coupons/coupon1.png") no-repeat;
      background-size: contain;
      .coupon-date {
        float: left;
        // height: 0.24rem;
        // width: 2.54rem;
        margin: 1.1rem 0 0 1.45rem;
        font-size: 0.24rem;
        color: #666666;
        .bold {
          font-size: 0.24rem;
          font-weight: 600;
        }
      }
      // btn
      .coupon-btn {
        width: 1.3rem;
        height: 1.3rem;
        float: right;
        box-sizing: border-box;
        padding: 0.31rem;
        font-size: 0.28rem;
        line-height: 0.3rem;
        text-align: center;
        margin: 0.21rem 0.26rem 0rem 0rem;
        color: rgba(255, 255, 255, 0.8);
        background: url("./resource/coupons/coupon1-btn.png") no-repeat;
        background-size: contain;
        animation: breath 0.4s ease-out infinite alternate;
      }
    }
    .coupon:nth-child(2) {
      background: url("./resource/coupons/coupon2.png") no-repeat;
      background-size: contain;
      .coupon-btn {
        background: url("./resource/coupons/coupon2-btn.png") no-repeat;
        background-size: contain;
        color: #f60000;
      }
    }
  }
  // vip
  .vip {
    position: relative;
    width: 100%;
    height: 7.6rem;
    background: url("./resource/vipbg.png") no-repeat;
    background-size: contain;
    color: #fff;
    font-size: 0.32rem;
    z-index: 10;
    .vip-item:nth-child(1) {
      float: left;
      width: 2.37rem;
      height: 0.7rem;
      text-align: center;
      line-height: 0.58rem;
      background-color: #ff7800;
      border: 0.06rem #401aad solid;
      border-radius: 0.35rem;
      margin: 3.05rem 0 0 0.66rem;
      box-sizing: border-box;
    }
    .vip-item:nth-child(2) {
      float: left;
      width: 2.37rem;
      height: 0.7rem;
      text-align: center;
      line-height: 0.58rem;
      background-color: #ff7800;
      border: 0.06rem #401aad solid;
      border-radius: 0.35rem;
      margin: 3.05rem 0 0 0.98rem;
      box-sizing: border-box;
    }
    .vip-item:nth-child(3) {
      float: left;
      width: 3.47rem;
      height: 0.7rem;
      text-align: center;
      line-height: 0.58rem;
      background-color: #ff7800;
      border: 0.06rem #401aad solid;
      border-radius: 0.35rem;
      margin: 2.68rem 0 0 1.88rem;
      box-sizing: border-box;
    }
  }
  // group
  .group {
    width: 100%;
    height: 12.08rem;
    margin-top: -0.2rem;
    margin-bottom: 0.57rem;
    background: url("./resource/groupbg.png") no-repeat;
    background-size: contain;
    .address {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      width: 5.4rem;
      margin: 10.62rem 0 0 1rem;
      font-size: 0.2rem;
      color: #e7b9ff;
      text-align: center;
      p {
        margin-bottom: 0.16rem;
        .yellow {
          color: #fffc00;
        }
      }
      p:nth-child(3) {
        font-size: 0.24rem;
        margin-bottom: 0;
      }
    }
  }
  // swiper
  .swiper {
    width: 100%;
    height: 11.16rem;
    background: url("./resource/swiperbg.png") no-repeat;
    background-size: contain;
    .swiper-content {
      margin: 0 auto;
      padding-top: 3.9rem;
      .items {
        width: 5.6rem;
        height: 6.12rem;
        margin: 0 auto;
        overflow: hidden;
        .swipitem {
          .mint-swipe-indicators .is-active {
            background-color: #55149c;
            opacity: 0.5;
          }
        }
        .item-img {
          width: 5.06rem;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  // footer
  .footer {
    width: 100%;
    height: 0.68rem;
    background: url("./resource/footer.png") no-repeat;
    background-size: contain;
    margin-bottom: 0.48rem;
  }
  .footer-p {
    color: rgba(255, 255, 255, 0.8);
    width: 6.35rem;
    margin: 0 auto;
    line-height: 0.4rem;
    font-size: 0.24rem;
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
  }
  // msg
  .msg {
    position: fixed;
    width: 5.9rem;
    height: 6.47rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
    background: url("./resource/msg.png") no-repeat;
    background-size: contain;
    .title {
      position: absolute;
      font-size: 0.46rem;
      color: white;
      top: 2.06rem;
      left: 50%;
      transform: translate(-50%, 0%);
    }
    .msg-coupons {
      position: absolute;
      font-size: 0.32rem;
      line-height: 0.5rem;
      color: #666;
      text-align: center;
      top: 3.2rem;
      left: 50%;
      transform: translate(-50%, 0%);
      .orange {
        color: #ff6000;
        .big {
          font-size: 0.38rem;
        }
      }
    }
    .msg-group {
      position: absolute;
      font-size: 0.32rem;
      line-height: 0.7rem;
      color: #666;
      text-align: center;
      top: 3.2rem;
      left: 50%;
      transform: translate(-50%, 0%);
    }
    .msg-btn {
      position: absolute;
      font-size: 0.32rem;
      color: white;
      width: 4.6rem;
      height: 0.8rem;
      top: 5.3rem;
      left: 50%;
      border-radius: 0.4rem;
      background: #9431f2;
      transform: translate(-50%, 0%);
      text-align: center;
      line-height: 0.8rem;
    }
  }
  // success-msg
  .success-msg {
    position: fixed;
    width: 5.92rem;
    height: 7.92rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
    background: url("./resource/successmsg.png") no-repeat;
    background-size: contain;
    .succ-title {
      position: absolute;
      top: 2.27rem;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 0.46rem;
      color: #fff;
    }
    .succ-msg {
      position: absolute;
      top: 3.33rem;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 0.32rem;
      color: #ff6000;
    }
    .succ-coupon {
      position: absolute;
      width: 4.21rem;
      height: 1.64rem;
      top: 3.97rem;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .succ-use {
      position: absolute;
      width: 4.6rem;
      height: 0.8rem;
      top: 6.15rem;
      left: 50%;
      transform: translate(-50%, 0);
      background-color: #ff6000;
      border-radius: 0.5rem;
      text-align: center;
      font-size: 0.32rem;
      line-height: 0.8rem;
      color: #fff;
    }
    .succ-limit {
      position: absolute;
      top: 7.25rem;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 0.24rem;
      color: #666;
    }
  }
}
</style>

