<template>
  <div class="gift_page">
    <div class="head">
      <span>我的能量: {{ energy }}</span>
      <span class="recievedGifts" @click="toRecievedGifts">
        已领取的礼品
        <img src="../img/arrow.png" alt=">">
      </span>
    </div>
    <div class="gift" v-for="(gifttype, index) in giftTypes" :key="index" :class="getClass(index)">
      <div class="title">
        <!-- {{ gifttype }} -->
        <span class="more" v-if="index === 1 || index === 2" @click="toMore(index)">更多</span>
        <img
          v-if="index === 1 || index === 2"
          @click="toMore(index)"
          src="../img/whiteArrow.png"
          alt=">"
        >
      </div>
      <div class="goods">
        <div class="good" v-for="good in showGoodsList[index+1]" :key="good.id">
          <img :src="$compress(good.goodsImg)" alt="null">
          <!-- <div class="count" v-if="good.count < 100">{{ `${good.count}份` }}</div> -->
          <div class="name">{{ good.goodsName }}</div>
          <div class="tip ellipsis" v-if="gifttype.value === 1">满{{ good.maxEnergy }}能量免费领</div>
          <div class="tip ellipsis" v-else>{{ good.costEnergy }}能量</div>
          <div
            class="button"
            v-if="good.canGet === 1 && good.count > 0"
            @click="getGift(good)"
          >{{ good.btnDesc || '立即兑换'}}</div>
          <div class="button disabled" v-else>{{ good.btnDesc || '已兑完'}}</div>
        </div>
      </div>
      <modal-com :visible.sync="addressShow" :headTxt="`设置收货地址`" :message="`奖品将在活动结束后7个工作日寄出`">
        <div class="set">
          <input
            v-model="form.name"
            :class="{'isWarning':!check.name}"
            type="text"
            :placeholder="check.name?'点此输入收货人姓名':'收货人姓名不能为空'"
          >
          <input
            maxlength="11"
            v-model="form.phone"
            :class="{'isWarning':!check.phone}"
            type="text"
            :placeholder="check.phone?'点此输入收货人手机号码':'请输入正确的手机号码'"
          >
          <textarea
            v-model="form.address"
            :class="['address',{'isWarning':!check.address}]"
            type="text"
            :placeholder="check.address?'详细地址:省、市、县、街道、市小区、门牌号':'详细地址不能为空'"
          />
        </div>
        <div class="action" slot="footer">
          <div class="secondary" @click="cancel2">取消</div>
          <div class="major" @click="confirm">确定</div>
        </div>
      </modal-com>
    </div>

    <modal-com :visible.sync="freeGiftShow" :headTxt="goodsName" :message="`恭喜您获得以下礼包`">
      <div class="en-list">
        <div class="list-item" v-for="item in freegifts" :key="item.goodsId">
          <div class="list-item-left">
            <img class="list-item-img" :src="item.goodsImg">
          </div>
          <div class="list-item-right">
            <p class="list-item-text ellipsis">{{item.goodsTitle}}</p>
            <p class="list-item-date ellipsis">{{item.goodsDesc}}</p>
          </div>
        </div>
      </div>
      <div class="div-turn">
        <span class="a-turn" @click="toReceived">
          劵已放入您的账户
          <span class="gift">已领取的礼包</span>
        </span>
      </div>
      <div class="action" slot="footer">
        <div class="secondary" @click="cancel">知道了</div>
      </div>
    </modal-com>
  </div>
</template>
<script>
// eslint-disable-next-line
import hybrid from "plat-utils/src/hybrid";
import zybLog from 'plat-utils/src/zybLog';
// eslint-disable-next-line
import { inWeChat, inApp } from "plat-utils/src/systemInfo";
// eslint-disable-next-line
import InvokeApp from "plat-utils/src/invokeApp";
import Bus from '../page/Bus/';

export default {
  name: 'Gift',
  computed: {
    // 在礼品兑换页展示的商品
    // 1学习礼包2虚拟礼品3实物礼包4帮帮币
    showGoodsList() {
      const result = {
        study: [],
        virtual: [],
        entity: [],
        BBMoney: [],
      };
      result.study = this.allGoodsList[1].slice(0, 3);
      result.virtual = this.allGoodsList[3].slice(0, 6);
      result.entity = this.allGoodsList[2].slice(0, 6);
      result.BBMoney = this.allGoodsList[4].slice(0, 3);
      const show = {
        1: result.study,
        2: result.virtual,
        3: result.entity,
        4: result.BBMoney,
      };
      return show;
    },
  },
  data() {
    return {
      freeGiftShow: false,
      goodsName: '五周年学习礼',
      hasAddress: false,
      addressShow: false,
      form: {
        name: '',
        phone: '',
        address: '',
      },
      check: {
        name: true,
        phone: true,
        address: true,
      },
      freegifts: [
        {
          goodsImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          goodsId: 6201,
          goodsTitle: '一课优惠券2',
          goodsDesc: '一课优惠券2',
        },
        {
          goodsImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          goodsId: 6203,
          goodsTitle: 'VIP：6元优惠券（满42元可用）',
          goodsDesc: 'VIP：6元优惠券（满42元可用）',
        },
        {
          goodsImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          goodsId: 6204,
          goodsTitle: '1对1：30元优惠券（满239元可用）',
          goodsDesc: '1对1：30元优惠券（满239元可用）',
        },
        {
          goodsImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          goodsId: 6205,
          goodsTitle: '帮帮币30',
          goodsDesc: '帮帮币30',
        },
      ],
      // 用户当前能量
      energy: 0,
      // 与后端保持一致,所有商品列表
      // 1.礼包，2实物，3虚拟，4福利
      allGoodsList: {
        1: [],
        2: [],
        3: [],
        4: [],
      },
      // 礼品类型
      giftTypes: [
        { name: '学习礼包', value: 1 },
        { name: '虚拟礼品', value: 2 },
        { name: '实物礼包', value: 3 },
        { name: '帮帮币', value: 4 },
      ],
    };
  },
  methods: {
    // 跳转到“已领取的礼包”
    toReceived() {
      hybrid('is_login', {}, (res) => {
        if (res.isLogin) {
          const before = window.location;
          hybrid('openWindow', {
            url: `${before.origin}${
              before.pathname
            }#/recievedGifts?hideNativeTitleBar=1`,
          });
        } else {
          this.openApp();
        }
      });
    },
    showfreeGiftList() {
      this.freeGiftShow = true;
    },
    cancel() {
      this.freeGiftShow = false;
    },
    // cancel
    cancel2() {
      this.addressShow = false;
    },
    // 确认地址
    confirm() {
      const { name, phone, address } = this.form;
      this.check.name = name !== '';
      this.check.phone = phone !== '' && /^\d{11}$/.test(phone);
      this.check.address = address !== '';
      if (!this.check.name || !this.check.phone || !this.check.address) {
        return 0;
      }
      if (name && phone && address) {
        this.$fetch({
          url: '/activity/fiveyears/adduseraddress',
          method: 'POST',
          data: this.form,
          formType: true,
        }).then((res) => {
          if (res.errNo === 0) {
            hybrid('toast', { text: '设置成功' });
            this.addressShow = false;
            this.hasAddress = true;
          }
        });
      }
    },
    // 兑换礼品
    getGift(good) {
      zybLog.send({ type: `getGift-${good.goodsName}` });
      this.$modal({
        headTxt: '兑换奖励',
        message:
          good.goodsType === 1
            ? `确定领取${good.goodsName}?`
            : `确定消耗${good.costEnergy}能量值兑换？`,
      })
        .then(() => {
          zybLog.send({ type: `getGift-${good.goodsName}-confirm` });
          console.log('this.hasAddress: ', this.hasAddress);
          if (good.goodsType !== 2 || this.hasAddress) {
            console.log('this-hasAddress-if');
            this.$fetch({
              url: '/activity/fiveyears/exchangegoods',
              data: {
                goodsId: good.id,
              },
              method: 'POST',
              formType: true,
            }).then((res) => {
              if (res.errNo === 0) {
                zybLog.send({ type: `getGift-${good.goodsName}-sucess` });
                this.goodsName = good.goodsName;
                this.freegifts = res.data.result;
                this.freeGiftShow = true;
                this.init();
                Bus.$emit('refresh');
              }
            });
          } else {
            console.log('this.hasAddress:no');
            this.addressShow = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 跳转
    toRecievedGifts() {
      zybLog.send({ type: 'toRecievedGifts' });
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            const before = window.location;
            hybrid('openWindow', {
              url: `${before.origin}${
                before.pathname
              }#/recievedGifts?hideNativeTitleBar=1`,
            });
          } else {
            hybrid('loginForResult', {}, (status) => {
              const login = status ? 1 : 0;
              this.isLogin = login;
              if (login) {
                this.$router.push('/Home/Gift');
              }
            });
          }
        });
      } else {
        this.openApp();
      }
    },
    // 动态赋class
    getClass(index) {
      if (index === 0) {
        return 'studyGift';
      } else if (index === 1) {
        return 'virtualGift';
      } else if (index === 2) {
        return 'entityGift';
      }
      return 'BBMoney';
    },
    // 唤醒App
    openApp() {
      if (inWeChat) {
        Bus.$emit('wxGuide');
      } else {
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
      }
    },
    // 去更多页
    toMore(index) {
      if (!inApp) {
        this.openApp();
        return 0;
      }
      const before = window.location;
      if (index === 1) {
        zybLog.send({ type: 'more-Virtual' });
        hybrid('openWindow', {
          url: `${before.origin}${
            before.pathname
          }#/moreVirtual?hideNativeTitleBar=1`,
        });
      } else {
        zybLog.send({ type: 'more-Entity' });
        hybrid('openWindow', {
          url: `${before.origin}${
            before.pathname
          }#/moreEntity?hideNativeTitleBar=1`,
        });
      }
    },
    // 初始化
    init() {
      this.$fetch({
        url: '/activity/fiveyears/mainpage',
      }).then((res) => {
        this.energy = res.data.result.currentEnergy;
        this.hasAddress = res.data.result.hasAddress;
      });
      this.$fetch({
        url: '/activity/fiveyears/goodslistpage',
      }).then((res) => {
        if (res.errNo === 0) {
          this.allGoodsList = res.data.result;
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.gift_page {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  margin-top: 0.4rem;
  min-width: 6rem;
  min-height: 5rem;
  .set {
    input,
    .address {
      width: 4.8rem;
      height: 0.8rem;
      border-radius: 0.15rem;
      outline: none;
      border: 1px solid #999;
      padding: 0 0.2rem;
      box-sizing: border-box;
      margin: 0 auto;
      display: block;
      margin-top: 0.3rem;
    }
    .isWarning {
      border: 1px solid #ff513e;
    }
    .address {
      height: 2rem;
      padding: 0.2rem;
      box-sizing: border-box;
    }
  }
  .action {
    margin: 0 auto;
    width: 5rem;
    div {
      text-align: center;
      height: 0.8rem;
      border-radius: 0.4rem;
      display: inline-block;
      margin: 0 auto;
      font-size: 0.28rem;
      color: #fff;
      line-height: 0.8rem;
    }
    .secondary {
      width: 2rem;
      background: #00c5ff;
    }
    .major {
      width: 2.5rem;
      background: #ff503d;
      margin-left: 0.5rem;
      &.only {
        display: block;
        margin: 0 auto;
      }
    }
  }
  .head {
    font-size: 0.24rem;
    .recievedGifts {
      float: right;
      img {
        width: 0.2rem;
        height: 0.2rem;
        transform: rotate(180deg) translate(0, -0.02rem);
        vertical-align: initial;
        margin: 0 0 0 0.05rem;
      }
    }
  }
  .gift {
    width: 6.6rem;
    border-radius: 0.12rem;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0.04rem 0.1rem 0 rgba($color: #000000, $alpha: 0.06);
    margin-bottom: 0.2rem;
    .title {
      font-size: 0.36rem;
      color: white;
      font-weight: bold;
      height: 0.88rem;
      line-height: 0.88rem;
      padding-left: 0.4rem;
      border-radius: 0.12rem 0.12rem 0 0;
      position: relative;
      .more {
        float: right;
        font-size: 0.24rem;
        margin-right: 0.45rem;
      }
      img {
        height: 0.15rem;
        width: 0.1rem;
        position: absolute;
        right: 0.3rem;
        top: 0.34rem;
      }
    }
    .goods {
      .good {
        position: relative;
        display: inline-block;
        width: 2.2rem;
        vertical-align: top;
        img {
          height: 2.2rem;
          width: 2.2rem;
        }
        .count {
          width: 0.74rem;
          line-height: 0.36rem;
          position: absolute;
          top: 0;
          right: 0;
          background-color: rgb(255, 78, 60);
          border-radius: 0 0 0 0.2rem;
          font-size: 0.24rem;
          color: white;
          text-align: center;
        }
        .name {
          line-height: 0.4rem;
          font-size: 0.24rem;
          color: black;
          text-align: center;
          margin-top: 0.05rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tip {
          font-size: 0.24rem;
          color: rgb(255, 78, 60);
          text-align: center;
          line-height: 0.3rem;
        }
        .button {
          width: 1.3rem;
          border-radius: 0.24rem;
          background-color: #ff4c3b;
          color: white;
          font-size: 0.26rem;
          text-align: center;
          line-height: 0.4rem;
          margin: 0.1rem auto;
          margin-bottom: 0.2rem;
          border-width: 1px;
          border-style: solid;
        }
        .button.disabled {
          background-color: rgb(255, 255, 255);
          color: rgb(204, 204, 204);
          border-color: rgb(204, 204, 204);
        }
      }
    }
  }
  .studyGift {
    margin-top: 0.3rem;
    .title {
      background: url("../img/01.png") no-repeat;
      background-size: 100% auto;
    }
    .goods {
      min-height: 1.6rem;
      width: 100%;
    }
  }
  .virtualGift {
    .title {
      background: url("../img/02.png") no-repeat;
      background-size: 100% auto;
    }
    .goods {
      min-height: 2.6rem;
      width: 100%;
    }
  }
  .entityGift {
    .title {
      background: url("../img/03.png") no-repeat;
      background-size: 100% auto;
    }
    .goods {
      min-height: 2.6rem;
      width: 100%;
    }
  }
  .BBMoney {
    .title {
      background: url("../img/04.png") no-repeat;
      background-size: 100% auto;
    }
    .goods {
      min-height: 1.6rem;
      width: 100%;
    }
  }
}
.text {
  font-weight: bold;
}
.en-list {
  font-size: 0.3rem;
  color: black;
  margin: 0.3rem 0 0.3rem 0;
  .list-item {
    margin: 0.2rem auto;
    height: 1.2rem;
    background-color: rgba(245, 245, 245, 0.565);
    // box-shadow: 0.04rem 0.1rem rgba(237, 237, 237, 0.5);
    border-radius: 0.12rem;
    margin-bottom: 0.2rem;
    color: rgb(83, 64, 60);
    .list-item-right {
      width: 3.5rem;
      height: 1rem;
      display: inline-block;
      vertical-align: middle;
      padding: 0.1rem 0.2rem;
      .list-item-text {
        margin-top: 0.1rem;
        font-size: 0.3rem;
        font-weight: bold;
      }
      .list-item-date {
        margin-top: 0.1rem;
        font-size: 0.24rem;
      }
    }
    .list-item-left {
      background-color: rgba(245, 245, 245, 0.565);
      border-radius: 0.12rem;
      width: 1.2rem;
      height: 1.2rem;
      display: inline-block;
      .list-item-img {
        padding: 0.15rem;
        width: 0.9rem;
        height: 0.9rem;
      }
    }
    .red {
      color: red;
    }
    .success {
      color: #67c23a;
    }
  }
}
.div-turn {
  text-align: center;
  .a-turn {
    font-size: 0.25rem;
    color: black;
    .gift {
      color: #00c0ff;
    }
  }
}
.action {
  margin: 0 auto;
  width: 5rem;
  text-align: center;
  div {
    text-align: center;
    height: 0.8rem;
    border-radius: 0.4rem;
    display: inline-block;
    margin: 0 auto;
    font-size: 0.28rem;
    color: #fff;
    line-height: 0.8rem;
  }
  .secondary {
    width: 2rem;
    background: #00c5ff;
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
