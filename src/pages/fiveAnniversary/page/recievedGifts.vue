<template>
  <div :class="['page',{'isIos':isIos}]">
    <div :class="['topbar',{'isIos':isIos}]">
      <span class="left" @click="goBack"></span>
      <span class="mid">已领取的礼品</span>
      <span class="right" @click="setAddress">收货地址</span>
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
        <div class="secondary" @click="cancel">取消</div>
        <div class="major" @click="confirm">确定</div>
      </div>
    </modal-com>
    <div :class="['wrapper',{'isIos':isIos}]">
      <ul class="en-list">
        <li class="list-item" v-for="item in gifts" :key="item.taskTitle">
          <div class="card">
            <img :src="item.goodsImg || '/favicon.ico'" alt="null" class="left">
            <div class="mid">
              <div class="name">{{ item.goodsName }}</div>
              <div class="expire">{{ item.goodsDesc }}</div>
            </div>
            <div class="right" v-if="item.jumpUrl.ios && !isIos" @click="lookAt(item)">查看</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { isIos } from "plat-utils/src/systemInfo";
// import scroll from '../../../components/scroll/scroll.vue';
// eslint-disable-next-line
import InvokeApp from "plat-utils/src/invokeApp";
// eslint-disable-next-line
import { inWeChat, inApp } from "plat-utils/src/systemInfo";
// eslint-disable-next-line
import hybrid from "plat-utils/src/hybrid";
import zybLog from 'plat-utils/src/zybLog';


export default {
  name: 'recievedGifts',
  components: {
    // scroll,
  },
  data() {
    return {
      isIos,
      // 数据源
      gifts: [
        // {
        //   goodsId: 3013,
        //   goodsName: '6元优惠券（满42元可用）',
        //   goodsType: 3,
        //   createTime: '2018-12-26 11:37:21',
        //   goodsDesc: '6元优惠券（满42元可用）',
        //   goodsImg: '',
        //   jumpUrl: {
        //     android: 'app://homework/mall/couponList',
        //     ios: 'iknowhybrid://goToCouponList',
        //   },
        // },
      ],
      // 收获地址
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
      // 分页信息
      pageInfo: {
        pn: 0,
        rn: 0,
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // cancel
    cancel() {
      this.addressShow = false;
    },
    // 确认地址
    confirm() {
      zybLog.send({ type: 'address-confirm' });
      const { name, phone, address } = this.form;
      this.check.name = (name !== '');
      this.check.phone = (phone !== '' && /^\d{11}$/.test(phone));
      this.check.address = (address !== '');
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
          }
          this.addressShow = false;
        });
      }
    },
    // 设置收货地址
    setAddress() {
      zybLog.send({ type: 'address-open' });
      this.addressShow = true;
    },
    // 回退
    goBack() {
      hybrid('exit');
    },
    //
    getData() {
      this.$fetch({
        url: `/activity/fiveyears/pagegetgoodsloglist?pn=${
          this.pageInfo.pn
        }&rn=${this.pageInfo.rn}`,
      }).then((res) => {
        if (res.errNo === 0) {
          this.gifts = res.data.result.list;
          this.form = res.data.result.address;
        }
      });
    },
    // 上滑展示更多
    scrollShowMore() {
      if (this.hasMore) {
        this.pn += 20;
        this.getData();
      }
    },
    // 点击查看
    lookAt(item) {
      zybLog.send({ type: `checkGood-${item.goodsName}` });
      let url = '';
      if (isIos) {
        url = item.jumpUrl.ios;
      } else {
        url = item.jumpUrl.android;
      }
      hybrid('APPJumpProtocol', {
        protocolString: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
  .topbar {
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    background-color: rgb(255, 255, 255);
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100vw;
    &.isIos {
      margin-top: 34px;
    }
    .left {
      position: absolute;
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      left: 0.3rem;
      top: 50%;
      margin-top: -0.2rem;
      background: url("../img/arrow.png") no-repeat;
      background-size: contain;
    }
    .mid {
      color: #333;
      font-size: 0.36rem;
    }
    .right {
      position: absolute;
      right: 0.3rem;
      font-size: 0.3rem;
      color: rgb(0, 195, 255);
    }
  }
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 1rem;
    -webkit-overflow-scrolling: touch;
    &.isIos {
      padding-top: 2rem;
    }
    .en-list {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      .list-item {
        .card {
          width: 6.6rem;
          height: 1.5rem;
          border-radius: 0.12rem;
          box-shadow: 0 0.04rem 0.1rem 0 rgba($color: #000000, $alpha: 0.06);
          background-color: rgb(255, 255, 255);
          margin: 0.2rem auto;
          .left {
            height: 1.5rem;
            width: 1.5rem;
          }
          .mid {
            margin-left: 0.1rem;
            display: inline-block;
            vertical-align: middle;
            width: 3.5rem;
            .name {
              font-size: 0.3rem;
              font-weight: bold;
            }
            .expire {
              color: #867b79;
              margin-top: 0.1rem;
              font-size: 0.2rem;
            }
          }
          .right {
            display: inline-block;
            color: rgb(255, 77, 59);
            width: 1.2rem;
            height: 0.6rem;
            border-radius: 0.3rem;
            border-color: rgb(255, 77, 59);
            font-size: 0.24rem;
            text-align: center;
            line-height: 0.6rem;
            border-width: 0.01rem;
            border-style: solid;
          }
        }
      }
    }
  }
}
</style>
