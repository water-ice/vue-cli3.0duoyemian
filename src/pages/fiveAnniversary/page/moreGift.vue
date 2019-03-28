<template>
  <div :class="['morePage',{isIos:isIos}]">
    <div :class="['topbar',{'isIos':isIos}]">
      <span class="left" @click="goBack"></span>
      <span class="mid">{{ type === 'virtual' ? '虚拟礼品' : '实物礼品'}}</span>
      <span class="right" v-if="type !== 'virtual' " @click="setAddress">收货地址</span>
    </div>
    <modal-com :visible.sync="addressShow" :headTxt="`设置收货地址`" :message="`奖品将在活动结束后7个工作日寄出`">
      <div class="set">
        <input v-model="form.name" :class="{'isWarning':!check.name}" type="text" :placeholder="check.name?'点此输入收货人姓名':'收货人姓名不能为空'">
        <input maxlength="11" v-model="form.phone" :class="{'isWarning':!check.phone}" type="text" :placeholder="check.phone?'点此输入收货人手机号码':'请输入正确的手机号码'">
        <textarea v-model="form.address" :class="['address',{'isWarning':!check.address}]" type="text" :placeholder="check.address?'详细地址:省、市、县、街道、市小区、门牌号':'详细地址不能为空'"/>
      </div>
      <div class='action' slot='footer'>
        <div class="secondary" @click="cancel">取消</div>
        <div class="major" @click="confirm">确定</div>
      </div>
    </modal-com>
    <div class="rowWrap">
    <div class="row" v-for="(arr, index) in showlist" :key="index">
      <div class="col" v-for="item in arr" :key="item.id">
        <img :src="item.goodsImg || '/favicon.ico'" alt="null" />
        <!-- <div class="count" v-if="item.count < 100">{{ `${item.count}份` }}</div> -->
        <div class="name">
          {{ item.goodsName }}
        </div>
        <div class="tip">
          {{ item.costEnergy }}能量
        </div>
        <div class="button" v-if="item.canGet === 1 && item.count > 0" @click="getGift(item)">
          {{ item.btnDesc || '立即兑换'}}
        </div>
        <div class="button disabled" v-else>
          {{ item.btnDesc || '已兑完'}}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { isIos } from 'plat-utils/src/systemInfo';
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import Toast from '../../../components/Toast';

export default {
  name: 'moreGifts',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      alllist: [],
      addressShow: false,
      form: {
        name: '',
        phone: '',
        address: '',
      },
      isIos,
      check: {
        name: true,
        phone: true,
        address: true,
      },
    };
  },
  methods: {
    // 设置收货地址
    setAddress() {
      zybLog.send({ type: 'setAddress' });
      this.addressShow = true;
    },
    // 回退
    goBack() {
      hybrid('exit');
    },
    // 兑换礼品
    getGift(good) {
      zybLog.send({ type: `getGift-${good.goodsName}` });
      this.$modal({ headTxt: '兑换奖励', message: `确定消耗${good.costEnergy}能量值兑换？` }).then(() => {
        zybLog.send({ type: `getGift-${good.goodsName}-confirm` });
        this.$fetch({
          url: '/activity/fiveyears/exchangegoods',
          data: {
            goodsId: good.id,
          },
          method: 'POST',
          formType: true,
        }).then((res) => {
          const message = res.errNo === 0 ? '领取成功!' : '领取失败';
          zybLog.send({ type: `getGift-${good.goodsName}-sucess` });
          Toast(message);
          this.init();
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    // cancel
    cancel() {
      this.addressShow = false;
    },
    // 确认地址
    confirm() {
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
            this.addressShow = false;
          }
        });
      }
    },
    // 初始化取数据
    init() {
      this.$fetch({
        url: '/activity/fiveyears/goodslistpage',
      }).then((res) => {
        if (this.type === 'virtual') {
          this.alllist = res.data.result['3'];
        } else {
          this.alllist = res.data.result['2'];
        }
      });
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    // 将数组分成三个一组，便于展示
    showlist() {
      const result = [];
      for (let i = 0, len = this.alllist.length; i < len; i += 3) {
        result.push(this.alllist.slice(i, i + 3));
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.morePage {
  font-size: .36rem;
  color: black;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &.isIos {
    padding-top: 24px;
    box-sizing: border-box;
  }
  .set {
    input,.address{
      width: 4.8rem;
      height: .8rem;
      border-radius: .15rem;
      outline: none;
      border: 1px solid #999;
      padding: 0 .2rem;
      box-sizing: border-box;
      margin: 0 auto;
      display: block;
      margin-top: .3rem;
    }
    .isWarning {
      border: 1px solid #ff513e;
    }
    .address {
      height: 2rem;
      padding: .2rem;
      box-sizing: border-box;
    }
  }
  .action {
    margin: 0 auto;
        width: 5rem;
        div {
          text-align: center;
          height: .8rem;
          border-radius: .4rem;
          display: inline-block;
          margin: 0 auto;
          font-size: .28rem;
          color: #fff;
          line-height: .8rem;
        }
    .secondary {
      width: 2rem;
      background: #00c5ff
    }
    .major {
      width: 2.5rem;
      background: #ff503d;
      margin-left: .5rem;
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
      margin-top: 24px;
    }
    .left {
      position: absolute;
      display: inline-block;
      width: .4rem;
      height: .4rem;
      left: .3rem;
      top: 50%;
      margin-top: -.15rem;
      background: url('../img/arrow.png') no-repeat;
      background-size: contain;
    }
    .mid {
      color: #333
    }
    .right {
      position: absolute;
      right: .3rem;
      font-size: .3rem;
      color: rgb(0, 195, 255);
    }
  }
  .rowWrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
    padding-top: 1rem;
    -webkit-overflow-scrolling: touch;
  }
  .row {
    margin-top: .2rem;
    width: 6.8rem;
    margin: .1rem auto;
    .col {
      position: relative;
      display: inline-block;
      width: 2.2rem;
      vertical-align: top;
      margin-right: .1rem;
      background-color: rgb(255, 255, 255);
      border-radius: .12rem;
      box-shadow: 0 .04rem 0.1rem 0 rgba($color: #000000, $alpha: .06);
      img {
        height: 2.2rem;
        width: 2.2rem;
      }
      .count {
        width: .74rem;
        line-height: .36rem;
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgb(255, 78, 60);
        border-radius: 0 0 0 .2rem;
        font-size: .2rem;
        color: white;
        text-align: center;
      }
      .name {
        line-height: .4rem;
        font-size: .2rem;
        color: black;
        text-align: center;
        margin-top: .05rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tip {
        font-size: .2rem;
        color: rgb(255, 78, 60);
        text-align: center;
        line-height: .3rem;
      }
      .button {
        width: 1.2rem;
        border-radius: .24rem;
        background-color: rgb(255, 76, 59);
        color: white;
        font-size: .24rem;
        text-align: center;
        line-height: .48rem;
        margin: .1rem auto;
        border-width: .01rem;
        border-style: solid;
      }
      .button.disabled {
        background-color: rgb(255, 255, 255);
        color: rgb(204, 204, 204);
        border-color: rgb(204, 204, 204);
      }
    }
    .col:nth-child(3) {
      margin-right: 0;
    }
    .col:nth-child(1) {
      margin-left: 0;
    }
  }
}
</style>
