<template>
    <div class='main'>
        <div class='mainBg'>
          <div class='rollContain' v-if='listLen>0'>
            <div class='rollContent'>
              <img src='./resource/laba.png' class='icon'>
              <div class='roll'>
                <rolling :len='listLen' :time='1'>
                  <li class='info' v-for='(item, index) in successList' :key='index'><span class='userName'>{{item}}</span><span>刚刚拼团成功</span></li>
                </rolling>
              </div>
            </div>
          </div>
        </div>
        <div class='introduce'>
          <carousel :detail='false'></carousel>
        </div>
        <div class='rule'></div>
        <div class='footer'>
          <div class='btn leftBtn' @click='singleBuy'>
            <p class='firstLine'><span>{{single.price}}元/</span>月</p>
            <p>单独购买</p>
          </div>
          <div class='btn rightBtn'>
            <div v-if='currentGroupId.length > 0' @click='openDetail' class='checkBtn'>
              查看我的拼团
            </div>
            <div v-else @click='groupBuy'>
              <p class='firstLine'><span>{{group.price}}元/</span>月</p>
              <p>开{{maxPersonNum}}人团</p>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

import Carousel from './components/Carousel.vue';
import Rolling from '../../components/Rolling/Rolling.vue';

export default {
  components: { Rolling, Carousel },
  data() {
    return {
      currentGroupId: '', // 当前团id
      maxPersonNum: 3, // 最大参团人数
      successList: [], // 拼团成功list
      listLen: 0, // 拼团成功数量
      extInfo: '', // 支付额外参数
      userIsLogin: 0, // 是否登录
      single: { // 单人购买数据结构
        serviceId: 0,
        itemId: 0,
        price: 15,
      },
      group: { // 拼团购买数据结构
        serviceId: 0,
        itemId: 0,
        price: 9.9,
      },
      uid: '', // 用户uid-打点用
      source: '', // 入口来源-打点用
    };
  },
  created() {
    this.getIndexData();
    this.source = this.getQueryString('from') || 'vipGroup';
    hybrid('swapBack', { enabled: false });
    this.sendLog('main-view');
  },
  methods: {
    getQueryString(name) { // 获取url中指定参数值
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    getIndexData() {
      return this.$fetch.get('/activity/vipgroupon/index')
        .then((res) => {
          if (res.errNo === 0) {
            this.uid = res.data.uid;
            this.userIsLogin = res.data.userIsLogin;
            this.successList = res.data.successTxtList;
            this.single = res.data.singleProduct;
            this.group = res.data.groupProduct;
            this.maxPersonNum = res.data.maxPersonNum;
            this.currentGroupId = res.data.doingGroupId;
            this.extInfo = res.data.extInfo;
            this.listLen = res.data.successTxtList.length;
          }
        });
    },
    singleBuy() {
      this.sendLog('main-buy-single');
      this.buyHandler(0, this.single.serviceId, this.single.itemId);
    },
    groupBuy() {
      this.sendLog('main-buy-group');
      this.buyHandler(1, this.group.serviceId, this.group.itemId);
    },
    buyHandler(type, serviceid, itemid) {
      if (this.userIsLogin === 0) {
        hybrid('loginForResult', {}, (res) => {
          if (res.result) {
            window.location.reload();
          }
        });
        return;
      }
      const parmas = {
        serverId: serviceid,
        itemId: itemid,
      };
      if (type === 1) { // 团购
        parmas.PAY_EXT = this.extInfo;
      }
      hybrid('platformPay', parmas, (res) => {
        this.getIndexData().then(() => {
          const hasSearch = window.location.href.indexOf('?') >= 0;
          const path = `${window.location.href.replace('spellGroup', 'spellDetail')}${hasSearch ? '&' : '?'}inApp=1&orderId=${res.orderId}&type=0&share=0&from=${this.source}`;
          if (type === 1) {
            this.sendLog('inApp-pay-group-success');
            hybrid('openWindow', {
              url: path,
              hideNav: 0,
            });
          } else {
            this.sendLog('inApp-pay-single-success');
          }
        });
      });
    },
    openDetail() {
      const hasSearch = window.location.href.indexOf('?') >= 0;
      const path = `${window.location.href.replace('spellGroup', 'spellDetail')}${hasSearch ? '&' : '?'}inApp=1&groupId=${this.currentGroupId}&type=1&share=0&from=${this.source}`;
      hybrid('openWindow', {
        url: path,
        hideNav: 0,
      });
    },
    sendLog(logType) {
      zybLog.send({
        type: logType,
        uid: this.uid,
        from: this.source,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  background: #ff403f;
  padding-bottom: 1.2rem;

  .mainBg {
    width: 100%;
    height: 10.34rem;
    background: url('./resource/mainBg.png') no-repeat;
    background-size: 100% auto;

    .rollContain {
      padding-top: 0.83rem;

      .rollContent {
        width: 3.8rem;
        height: 0.36rem;
        margin: 0 auto;
        border-radius: 0.15rem;
        background: #f63a37;

        .icon {
          width: 0.27rem;
          height: 0.19rem;
          margin: 0.09rem 0 0 0.3rem;
          vertical-align: top;
        }

        .roll {
          display: inline-block;
          margin-left: 0.13rem;
          width: 3rem;
          height: 100%;

          .info {
            line-height: 0.36rem;
            color: #fff;
            margin-top: 0.1rem;

            span {
              display: inline-block;
              vertical-align: top;
              font-size: 0.2rem;
            }
            .userName {
              max-width: 1.5rem;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

.introduce {
  margin: -2rem auto 0;
}
.rule {
  width: 7.2rem;
  height: 4.02rem;
  margin: 0 auto;
  background:  url('./resource/info.jpg') no-repeat;
  background-size: contain;
}

.footer {
  position: fixed;
  bottom: 0;
  .btn {
    font-size: 0.2rem;
    text-align: center;

    .firstLine {
      padding-top: 0.2rem;

      span {
        font-size: 0.3rem;
        font-weight: bold;
      }
    }
  }

  .leftBtn {
    float: left;
    width: 2.2rem;
    height: 1rem;
    color: #434242;
    background: #fff;
  }

  .rightBtn {
    width: 5rem;
    height: 1rem;
    margin-left: 2.2rem;
    color: #b42313;
    background: #f7d306;

    .checkBtn {
      font-size: 0.3rem;
      line-height: 1rem;
      font-weight: bold;
    }
  }
}
</style>
