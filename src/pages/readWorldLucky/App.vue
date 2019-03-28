<template>
  <div class="wrap">
    <!-- bar start -->
    <div :class="['bar',{'isIos':isIos}]">
      <div class="return" @click="locationTo('back')">
        <zyb-icon name="arrow-l" size="0.4rem"/>
      </div>
      <div class="bar-title">阅读世界学习礼</div>
      <div class="link-reward" @click="locationTo('rewards','toPage')">
        我的奖品
        <div class="tooltip" v-if="tooltip">
          <div class="arrow"></div>请填写收货地址
        </div>
      </div>
    </div>
    <!-- bar end -->
    <!-- head start -->
    <div class="head">
      <div class="rules" @click="open('1')">规则</div>
      <div class="activity-date">活动时间：3月26日 ~ 4月3日</div>
      <div class="roll">
        中奖通知:
        <div class="notice">
          <rolling :len="len" :time="3" delayTime="0" v-if="prizeList.length>0">
            <li class="text" v-for="(item,index) in prizeList" :key="index">
              <span class="limit">{{item.randomName}}</span>
              获得
              <span class="purple">{{item.award.awardName}}</span>
            </li>
          </rolling>
        </div>
      </div>
      <div class="readBox">
        <b>我的读书卡:</b>
        <span class="big">{{userInfo.bookCard}}</span>
        张
        <div class="bottom"></div>
      </div>
      <img src="./resource/header.jpg" alt class="head-img">
    </div>
    <!-- head end -->
    <!-- group start -->
    <div class="group">
      <div
        :class="['groupBox',item.extraAmount===0?'zero-bg':'normal-bg']"
        v-for="(item,index) in products"
        :key="index"
        @click="toPay(item,index)"
      >
        <div class="group-box-title" v-show="item.extraAmount!==0">{{item.type|typeFormatter}}</div>
        <div class="detail">
          <div class="title">{{item.amount}}张读书卡</div>
          <div class="present" v-show="item.extraAmount!==0">
            <i>+赠{{item.extraAmount}}张</i>
          </div>
          <div class="chance">
            +
            <span class="b">{{item.drawTimes}}</span>次礼盒开启机会
          </div>
        </div>
        <div class="price">
          <div class="discount" v-if="item.type===2">
            <s>原价{{item.originPrice}}</s>
          </div>
          <div class="btn">
            <span class="btn-big">{{item.price}}</span>元
          </div>
        </div>
      </div>
    </div>
    <!-- group end -->
    <!-- lucky start -->
    <div class="lucky" ref="lucky">
      <div class="readBox luckyBox">
        <b>开启礼盒次数越多，奖品越大哦!</b>
        <div class="bottom"></div>
      </div>
      <div class="lucky-draw">
        <div class="num-box">
          <div class="number">{{userInfo.usableDrawTimes}}</div>
          <div class="number-text">剩余开启次数</div>
        </div>
      </div>
      <div class="shadow">
        <div class="lucky-btn" @click="openLucky('1')">开启1次</div>
      </div>
      <div class="shadow-right">
        <div class="lucky-btn" @click="openLucky('5')">开启5次</div>
      </div>
    </div>
    <!-- lucky end -->
    <!-- box start -->
    <div class="box">
      <div class="readBox times-box">
        <b>当前已开启:</b>
        <span class="big">{{userInfo.hasDrawTimes}}</span>
        次
        <div class="bottom"></div>
      </div>
      <div class="gift-box">
        <div class="box-one" v-for="(item,index) in rewards" :key="index">
          <div class="title1">开启{{item.needNum}}次礼盒</div>
          <div class="title2">奖励</div>
          <div class="title3">
            <span class="title3-big">{{item.rewardNum}}</span>张读书卡
          </div>
          <div
            :class="['box-btn',{'box-gray-btn':item.gray}]"
            @click="getBookCard(item.needNum,item.gray)"
          >{{item.text}}</div>
        </div>
      </div>
      <!-- copyright  start-->
      <div class="copyright" v-if="!fromOut">作业帮阅读世界</div>
      <!-- copyright end -->
    </div>
    <!-- box end -->
    <!-- fixed start-->
    <div class="fixed" v-if="fromOut">
      <div class="fixed-btn" @click="toReadWorld()">前往阅读世界</div>
    </div>
    <!-- fixed end -->
    <!-- dialog start -->
    <transition name="fade">
      <div class="dialog" @touchmove="e => {e.preventDefault()}" v-show="dialogShow">
        <div class="dialog-pop">
          <div class="head" v-if="dialogType!=='3'">
            <div class="title" v-if="dialogType==='1'">活动规则</div>
            <div class="title" v-else-if="dialogType==='2'">恭喜获得</div>
            <div class="title" v-else-if="dialogType==='4'">获得开启机会</div>
          </div>
          <div class="content" v-if="dialogType!=='3'">
            <!-- 规则 -->
            <div v-if="dialogType==='1'">
              <div class="rules" v-for="(item,index) in rules" :key="index">{{item}}</div>
              <div class="btn" @click="close">知道了</div>
            </div>
            <!-- 奖品弹框 -->
            <div class="get-rewards" v-if="dialogType==='2'">
              <div class="rewards-list">
                <div class="rewards-item" v-for="(item,index) in awards" :key="index">
                  <img :src="item.img" alt class="item-img">
                  <div :class="['text',{'colord':item.isEntity}]">{{item.awardName}}</div>
                </div>
              </div>
              <div class="get-text">
                还可以开启
                <span class="red">{{userInfo.usableDrawTimes}}</span>次
              </div>
              <div
                :class="['btn-left',{'box-gray-btn':!luckyOne}]"
                @click="openAgain('1','again')"
              >再开启1次</div>
              <div
                :class="['btn-right',{'box-gray-btn':!luckyFive}]"
                @click="openAgain('5','again')"
              >再开启5次</div>
              <div class="link">
                奖品已放至
                <div class="href" @click="locationTo('rewards')">我的奖品 ></div>
              </div>
            </div>
            <!-- 提示框 -->
            <div class="alert" v-if="dialogType==='4'">
              <div class="alert-text">恭喜你，读书卡购买成功</div>
              <div class="alert-text">获得{{userInfo.usableDrawTimes}}次礼盒开启机会</div>
              <div class="alert-btn-left" @click="close">取消</div>
              <div class="alert-btn-right" @click="toLucky">开启礼盒</div>
            </div>
            <!-- 登陆提示框 -->
            <div class="alert" v-if="dialogType==='5'">
              <div class="alert-text">登录可查看更多活动信息~</div>
              <div class="alert-btn-left" @click="locationTo('back','log')">返回</div>
              <div class="alert-btn-right" @click="toLogin">去登陆</div>
            </div>
          </div>
          <div class="cancel" @click="close" v-if="dialogType!=='3'&&dialogType!=='5'"></div>
          <!-- 领取读书卡 -->
          <div class="get-card" v-if="dialogType==='3'">
            <div class="card-title">恭喜获得{{rewardsNum}}张读书卡</div>
            <img src="./resource/light.png" class="card-img">
            <div class="btn" @click="close">知道了</div>
            <div class="notice">
              奖品已放至
              <div class="link" @click="locationTo('rewards','dialog')">我的奖品 ></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- dialog end -->
    <!-- end -->
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import { isIos } from 'plat-utils/src/systemInfo';
import zybLog from 'plat-utils/src/zybLog';
import rolling from '../../components/Rolling/Rolling.vue';

export default {
  name: 'readWorldLucky',
  components: { rolling },
  data() {
    return {
      rules: [
        '活动时间：2019年3月26日-4月3日',
        '购买读书卡可以获得开启礼包机会，不同档位对应不同的开启机会',
        '累计开启一定次数还可获得固定奖励',
        '奖品包含：360儿童手表，DK儿童百科全书，晨光儿童水彩笔，读书卡，帮帮币',
        '实物奖励会在活动结束后7日内内发放',
        '若活动期间退费则收回奖励；若奖励已消耗，则退款金额需扣除奖励等值金额',
      ],
      len: 0, // 中奖列表数量
      prizeList: [
        // 中奖列表
      ],
      rewards: [
        // 累计开启次数信息 needNum 开启次数，rewardNum 奖励
        {
          needNum: '10',
          rewardNum: '5',
          gray: true,
          text: '领取奖励',
          got: 0,
        },
        {
          needNum: '20',
          rewardNum: '10',
          gray: true,
          text: '领取奖励',
          got: 0,
        },
      ],
      rewardsNum: 0, // 获得读书卡张数
      awards: [
        // 获奖列表
      ],
      dialogShow: false, // 弹框
      dialogType: '1', // 弹框类型1规则 2奖品 4提示
      // 用户基础数据
      userInfo: {
        bookCard: 0, // 当前读书卡数量
        usableDrawTimes: 0, // 可开启次数
        hasDrawTimes: 0, // 已开启次数
        purchaseState: 1,
        reviveBookcardStatus: [],
      },
      products: [
        {
          classId: 1,
          amount: 3,
          extraAmount: 0,
          price: 6,
          originPrice: 6,
          actId: 0,
          recommend: 0,
          type: 0,
          discount: 0,
          itemId: 1,
          serviceId: 22,
          drawTimes: 2,
        },
        {
          classId: 5,
          amount: 9,
          extraAmount: 3,
          price: 18,
          originPrice: 18,
          actId: 0,
          recommend: 0,
          type: 0,
          discount: 0,
          itemId: 2,
          serviceId: 22,
          drawTimes: 8,
        },
        {
          classId: 10,
          amount: 24,
          extraAmount: 16,
          price: 48,
          originPrice: 48,
          actId: 0,
          recommend: 0,
          type: 0,
          discount: 0,
          itemId: 3,
          serviceId: 22,
          drawTimes: 20,
        },
      ],
      fromOut: true, // 来源为阅读世界外时为true
      tooltip: false,
      isIos,
      canLucky: true,
      // end
    };
  },
  filters: {
    typeFormatter(val) {
      if (val === 1) {
        return '买赠';
      } else if (val === 2) {
        return '折扣';
      } else if (val === 9) {
        return '首次';
      } else if (val === 0) {
        return '推荐';
      }
    },
  },
  computed: {
    // luckytimes
    luckyOne() {
      if (this.userInfo.usableDrawTimes >= 1) {
        return true;
      }
      return false;
    },
    luckyFive() {
      if (this.userInfo.usableDrawTimes >= 5) {
        return true;
      }
      return false;
    },
  },
  created() {
    zybLog.send({ type: 'homePageLook' });
    // 本地测试，无需登陆， this.diffOrigin();  this.getData();
    hybrid('is_login', {}, (res1) => {
      if (res1.isLogin) {
        // 获取数据;
        this.getData();
        // 判断来源;
        this.diffOrigin();
        this.dialogShow = false;
      } else {
        this.dialogShow = true;
        this.dialogType = '5';
        zybLog.send({ type: 'loginDialog' });
      }
    });
  },
  methods: {
    // 跳转阅读世界
    toReadWorld() {
      hybrid('APPJumpProtocol', {
        protocolString: 'app://homework/push/link?to=cartoon_book',
      });
    },
    // 判断来源
    diffOrigin() {
      const ori = this.getFrom('from');
      if (
        ori === 'ask_ad_banner' ||
        ori === 'study_banner' ||
        ori === ' study_dialog' ||
        ori === 'push' ||
        ori === 'splash'
      ) {
        this.fromOut = true;
      } else {
        this.fromOut = false;
      }
    },
    // 截取url参数
    getFrom(name) {
      const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
      const r = window.location.search.substr(1).match(reg);
      return r !== null ? unescape(r[2]) : '';
    },
    // 累计礼盒数据处理
    newRewards() {
      // 依赖userinfo中的reviveBookcardStatus进行领取状态初始化 -1则未领取
      this.rewards[0].got = this.userInfo.reviveBookcardStatus.indexOf('8');
      this.rewards[1].got = this.userInfo.reviveBookcardStatus.indexOf('9');
      // 按钮状态初始化
      this.rewards.forEach((item) => {
        const newI = item;
        // 未领取状态
        if (newI.got === -1) {
          // 进行文案设置， 次数满足与不满足
          if (this.userInfo.hasDrawTimes >= newI.needNum) {
            // 次数满足
            newI.gray = false;
            newI.text = '领取奖励';
          } else {
            // 次数不满足
            newI.gray = true;
            // 次数为负数
            if (this.userInfo.hasDrawTimes < newI.needNum) {
              const num = newI.needNum - this.userInfo.hasDrawTimes;
              newI.text = `还差${num}次`;
            } else {
              newI.text = '领取奖励';
            }
          }
        } else {
          newI.gray = true;
          // 进行文案设置， 已领取
          newI.text = '已领取';
        }
      });
    },
    // 数据初始化
    getData(item) {
      // 获取用户基本数据
      this.$fetch({
        method: 'get',
        url: '/macan/activity/PurchaseBookCardPrizeDraw',
      }).then((res) => {
        if (res.errNo === 0) {
          const keys = Object.keys(this.userInfo);
          keys.forEach((key) => {
            this.userInfo[key] = res.data.userInfo[key];
          });
          this.products = res.data.goodList.products;
          // 刷新礼盒次数 数据
          this.newRewards();
          if (item === '2') {
            this.open('2');
          } else if (item === '4') {
            this.open('4');
          }
        }
      });
      // 获取中奖记录数据
      this.$fetch({
        method: 'get',
        url: '/macan/activity/PurchaseBookCardPrizeDrawRandomRecord',
        params: { rn: 10 },
      }).then((res1) => {
        if (res1.errNo === 0) {
          this.prizeList = [];
          this.prizeList = res1.data.records;
          this.len = res1.data.records.length;
        }
      });
    },
    // 再一次抽奖
    openAgain(time) {
      zybLog.send({ type: 'luckyAgainClick' });
      this.close();
      setTimeout(() => {
        this.openLucky(time);
      }, 300);
    },
    // 抽奖
    openLucky(time) {
      zybLog.send({ type: 'luckyClick' });
      if (time === '1') {
        if (this.luckyOne) {
          if (this.canLucky === false) {
            return false;
          }
          this.canLucky = false;
          this.$fetch({
            url: '/macan/activity/PurchaseBookCardPrizeDrawStart',
            method: 'get',
            params: { times: time },
          })
            .then((res) => {
              setTimeout(() => {
                this.canLucky = true;
              }, 400);
              if (res.errNo === 0) {
                // code 码提示暂未处理
                if (res.data.code === 0) {
                  res.data.awards.forEach((i) => {
                    const item = i;
                    if (
                      item.awardId === 1 ||
                      item.awardId === 2 ||
                      item.awardId === 3
                    ) {
                      this.tooltip = true;
                      item.isEntity = true;
                    } else {
                      item.isEntity = false;
                    }
                  });
                  this.awards = res.data.awards;
                  this.getData('2');
                }
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.canLucky = true;
              }, 400);
            });
          // 获取奖品信息,弹框
        } else {
          this.termToast('机会不足，购买读书卡可获取');
        }
      } else if (time === '5') {
        if (this.luckyFive) {
          // 获取奖品信息,弹框
          if (this.canLucky === false) {
            return false;
          }
          this.canLucky = false;
          this.$fetch({
            url: '/macan/activity/PurchaseBookCardPrizeDrawStart',
            method: 'get',
            params: { times: time },
          })
            .then((res) => {
              setTimeout(() => {
                this.canLucky = true;
              }, 400);
              if (res.errNo === 0) {
                // code 码提示暂不处理
                if (res.data.code === 0) {
                  res.data.awards.forEach((i) => {
                    const item = i;
                    if (
                      item.awardId === 1 ||
                      item.awardId === 2 ||
                      item.awardId === 3
                    ) {
                      this.tooltip = true;
                      item.isEntity = true;
                    } else {
                      item.isEntity = false;
                    }
                  });
                  this.awards = res.data.awards;
                  this.getData('2');
                }
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.canLucky = true;
              }, 400);
            });
        } else {
          this.termToast('机会不足，购买读书卡可获取');
        }
      }
    },
    // toPay
    toPay(item, index) {
      if (index === 0) {
        zybLog.send({ type: 'firstLevelClick' });
      } else if (index === 1) {
        zybLog.send({ type: 'secondLevelClick' });
      } else if (index === 2) {
        zybLog.send({ type: 'thirdLevelClick' });
      }
      hybrid(
        'platformPay',
        { serverId: item.serviceId, itemId: item.itemId },
        (res) => {
          if (res.orderId) {
            // 通知各方支援
            hybrid('bookCardSync');
            this.$fetch({
              method: 'get',
              url: '/macan/mall/paysuccess',
              params: { orderId: res.orderId },
            }).then((r1) => {
              if (r1.errNo === 0) {
                this.getData('4');
              }
            });
          }
        },
      );
    },
    // 页面跳转
    locationTo(url, log) {
      if (log === 'log') {
        zybLog.send({ type: 'returnClick' });
      } else if (log === 'toPage') {
        zybLog.send({ type: 'rewardsPageTopClick' });
      } else if (log === 'dialog') {
        zybLog.send({ type: 'rewardsPageDialogClick' });
      }
      const hre = window.location.origin;
      if (url === 'rewards') {
        hybrid('openWindow', {
          url: `${hre}/plat/activity-vue/readWorldRewards.html`,
        });
        this.tooltip = false;
      } else if (url === 'back') {
        if (isIos) {
          hybrid('exit', { closeCurrent: 1 });
        } else {
          hybrid('exit');
        }
      }
    },
    // 领取读书卡
    getBookCard(num, gray) {
      zybLog.send({ type: 'gitfTimesClick' });
      if (!gray) {
        let newNum = 8;
        let newRewardsNum = 5;
        if (num === '10') {
          newNum = 8;
          newRewardsNum = 5;
        } else if (num === '20') {
          newNum = 9;
          newRewardsNum = 10;
        }
        this.$fetch({
          method: 'get',
          url: '/macan/activity/purchasebookcardprizedrawrecivebookcard',
          params: {
            awardId: newNum,
          },
        }).then((res) => {
          if (res.errNo === 0) {
            // 领取成功
            if (res.data.code === 0) {
              this.open('3');
              this.rewardsNum = newRewardsNum;
              this.getData();
            }
          }
        });
      }
    },
    // 跳转登陆
    toLogin() {
      zybLog.send({ type: 'toLoginClick' });
      hybrid('loginForResult', {}, (res2) => {
        if (res2.result) {
          window.location.reload();
        }
      });
    },
    // 关闭弹窗
    close() {
      this.dialogShow = false;
    },
    // 打开弹窗
    open(item) {
      if (item === '1') {
        zybLog.send({ type: ' ruleClick' });
      } else if (item === '2') {
        zybLog.send({ type: ' luckyDialog' });
      } else if (item === '3') {
        zybLog.send({ type: ' giftTimesDialog' });
      } else if (item === '4') {
        zybLog.send({ type: ' openBoxClick' });
      }
      this.dialogType = item;
      this.dialogShow = true;
    },
    // 跳转到抽奖
    toLucky() {
      this.dialogShow = false;
      const element = this.$refs.lucky;
      const { offsetTop } = element;
      document.documentElement.scrollTop = 1;
      const body = document.documentElement.scrollTop
        ? document.documentElement
        : document.body;
      const { scrollTop } = body;
      const DURATION = 0.3;
      const frames = Math.round((DURATION * 1000) / 16);
      let count = 0;
      const animate = () => {
        body.scrollTop += (offsetTop - scrollTop) / frames;
        if (++count < frames) {
          window.requestAnimationFrame(animate);
        }
      };
      setTimeout(() => {
        animate();
      }, 200);
    },
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8, 0.8);
  }
  100% {
    transform: scale(1, 1);
  }
}

.wrap {
  width: 100%;
  position: relative;
  color: #ccc;
  user-select: none;
  .bar {
    width: 100%;
    height: rem(96);
    color: #333333;
    background-color: #fff;
    padding: 0 rem(30);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .return {
      width: rem(110);
      height: rem(40);
    }
    .bar-title {
      font-size: rem(36);
    }
    .link-reward {
      position: relative;
      font-size: rem(28);
      .tooltip {
        position: absolute;
        width: rem(240);
        height: rem(60);
        font-size: 14px;
        border-radius: 8px;
        color: #fff;
        line-height: rem(60);
        text-align: center;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10001;
        right: 0;
        .arrow {
          top: 4px;
          right: 16px;
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(0, 0, 0, 0.7);
          top: -5px;
        }
      }
    }
    @media only screen and (device-width: 375px) and (device-height: 812px) {
      &.isIos {
        margin-top: 0.78rem;
      }
    }
    @media only screen and (device-width: 414px) and (device-height: 896px) {
      &.isIos {
        margin-top: 0.78rem;
      }
    }
  }
  .head {
    width: 100%;
    height: 100%;
    position: relative;
    .rules {
      box-sizing: border-box;
      position: absolute;
      width: rem(96);
      height: rem(48);
      background-color: #3db24e;
      color: #fff;
      font-size: rem(24);
      line-height: rem(48);
      padding-left: rem(30);
      border-top-left-radius: rem(24);
      border-bottom-left-radius: rem(24);
      top: rem(30);
      right: 0;
    }
    .activity-date {
      color: #3c963b;
      font-size: rem(24);
      font-weight: bold;
      position: absolute;
      top: rem(336);
      left: 50%;
      transform: translateX(-50%);
    }
    .roll {
      position: absolute;
      top: rem(392);
      left: rem(120);
      width: rem(476);
      height: rem(74);
      background: url("./resource/rollBg.png") no-repeat;
      background-size: contain;
      text-align: center;
      font-size: rem(24);
      line-height: rem(74);
      color: #b97410;
      font-weight: bold;
      .notice {
        display: inline-block;
        height: rem(24);
        width: rem(300);
        transform: translateY(rem(2));
        .text {
          display: flex;
          .limit {
            display: inline-block;
            width: rem(100);
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .purple {
            display: inline-block;
          }
        }
      }
    }
    .head-img {
      width: 100%;
      height: 100%;
    }
  }
  .group {
    position: relative;
    width: 100%;
    height: rem(550);
    background: url("./resource/cardBg.png") no-repeat;
    background-size: contain;
    box-sizing: border-box;
    padding-top: rem(24);
    .normal-bg {
      background: url("./resource/boxBg.png") no-repeat;
    }
    .zero-bg {
      background: url("./resource/zeroBg.png") no-repeat;
    }
    .groupBox {
      width: rem(602);
      height: rem(166);
      border-radius: rem(20);
      background-size: contain;
      margin: 0 auto rem(16);
      position: relative;
      &:nth-child(3) {
        margin-bottom: 0;
      }
      .group-box-title {
        font-size: rem(20);
        color: #fff;
        position: absolute;
        top: rem(10);
        left: rem(4);
        transform: rotate(-45deg);
      }
      .detail {
        display: inline-block;
        margin: rem(36) 0 0 rem(40);
        .title {
          display: inline-block;
          color: #333;
          margin-right: rem(18);
          font-size: rem(32);
        }
        .present {
          display: inline-block;
          color: #fff;
          font-size: rem(24);
          width: rem(110);
          height: rem(34);
          line-height: rem(34);
          text-align: center;
          background-color: #ffaf00;
          border-radius: rem(17);
        }
        .chance {
          margin-top: rem(14);
          color: #666;
          font-size: rem(24);
          .b {
            font-size: rem(32);
          }
        }
      }
      .price {
        float: right;
        line-height: rem(166);
        margin-right: rem(30);
        .discount {
          display: inline-block;
          color: #666;
          font-size: rem(20);
          margin-right: rem(10);
        }
        .btn {
          display: inline-block;
          width: rem(150);
          height: rem(66);
          line-height: rem(66);
          text-align: center;
          font-size: rem(26);
          border-radius: rem(33);
          background: linear-gradient(180deg, #ffec38, #ffd32d);
          color: #b97410;
          .btn-big {
            font-size: rem(40);
          }
        }
      }
    }
  }
  .lucky {
    width: 100%;
    height: rem(810);
    background: url("./resource/luckyBg.jpg") no-repeat;
    background-size: contain;
    position: relative;
    .luckyBox {
      top: rem(150);
    }
    .lucky-draw {
      width: 100%;
      height: rem(528);
      background: url("./resource/lucky.png") no-repeat;
      background-size: contain;
      position: absolute;
      top: rem(214);
      left: rem(0);
      .num-box {
        width: 100%;
        height: rem(470);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: column;
        .number {
          font-size: rem(56);
          color: #fff;
        }
        .number-text {
          font-size: rem(20);
          color: #fff;
        }
      }
    }
    .shadow {
      position: absolute;
      z-index: 20;
      top: rem(706);
      left: rem(72);
      width: rem(272);
      height: rem(86);
      border-radius: rem(43);
      box-shadow: 2px 8px 30px #4ea24a;
      .lucky-btn {
        width: 100%;
        height: 100%;
        border-radius: rem(43);
        font-size: rem(32);
        text-align: center;
        line-height: rem(84);
        font-weight: bold;
        @include btn(#b9740f, #ffec38, #ffd32c, #ada74f);
      }
      .gray-btn {
        @include btn(#cccccc, #f2f1f1, #e6e6e6, #93ad8e);
      }
    }
    .shadow-right {
      position: absolute;
      z-index: 20;
      top: rem(706);
      left: rem(380);
      width: rem(272);
      height: rem(86);
      border-radius: rem(43);
      box-shadow: 2px 8px 30px #4ea24a;
      .lucky-btn {
        width: 100%;
        height: 100%;
        border-radius: rem(43);
        font-size: rem(32);
        color: #b9740f;
        text-align: center;
        line-height: rem(84);
        font-weight: bold;
        @include btn(#b9740f, #ffec38, #ffd32c, #ada74f);
      }
      .gray-btn {
        @include btn(#cccccc, #f2f1f1, #e6e6e6, #93ad8e);
      }
    }
  }
  .box {
    width: 100%;
    height: rem(665);
    background: url("./resource/boxBg.jpg") no-repeat;
    background-size: contain;
    position: relative;
    .times-box {
      top: rem(150);
    }
    .gift-box {
      position: absolute;
      top: rem(224);
      width: rem(602);
      height: rem(312);
      left: 50%;
      margin-left: rem(-301);
      display: flex;
      justify-content: space-between;
      .box-one {
        width: rem(282);
        height: rem(312);
        background-color: #fff;
        border-radius: rem(20);
        box-shadow: inset -2px -2px 0px #dcf4d6, 2px 2px 4px #5cb94c;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title1 {
          margin-top: rem(34);
          color: #5fc55e;
          font-size: rem(24);
        }
        .title2 {
          margin-top: rem(22);
          color: #999;
          font-size: rem(20);
          text-align: center;
          &::before {
            content: " ";
            display: inline-block;
            width: rem(80);
            height: 2px;
            vertical-align: middle;
            background-color: #e6e6e6;
            margin-right: rem(10);
          }
          &::after {
            content: " ";
            display: inline-block;
            width: rem(80);
            height: 2px;
            vertical-align: middle;
            background-color: #e6e6e6;
            margin-left: rem(10);
          }
        }
        .title3 {
          margin-top: rem(26);
          font-size: rem(32);
          color: #333333;
          font-weight: bold;
          .title3-big {
            font-size: rem(48);
          }
        }
        .box-btn {
          margin-top: rem(26);
          width: rem(150);
          height: rem(66);
          font-size: rem(28);
          line-height: rem(66);
          text-align: center;
          border-radius: rem(33);
          @include subBtn(#b97410, #ffec38, #ffd32c);
        }
        .box-gray-btn {
          @include subBtn(#cccccc, #f2f1f1, #e6e6e6);
        }
      }
    }
    .copyright {
      width: 100%;
      color: #1f7b1e;
      font-size: rem(28);
      position: absolute;
      bottom: rem(36);
      text-align: center;
      &::before {
        content: " ";
        display: inline-block;
        width: rem(180);
        height: 1px;
        vertical-align: middle;
        background-color: #1f7b1e;
        margin-right: rem(24);
      }
      &::after {
        content: " ";
        display: inline-block;
        width: rem(180);
        height: 1px;
        vertical-align: middle;
        background-color: #1f7b1e;
        margin-left: rem(24);
      }
    }
  }
  .fixed {
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: rem(98);
    background-color: #fff;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .fixed-btn {
      width: rem(660);
      height: rem(80);
      font-size: rem(32);
      line-height: rem(80);
      text-align: center;
      border-radius: rem(40);
      font-weight: bold;
      @include btn(#b9740f, #ffec38, #ffd32c, #ada74f);
    }
  }
  // end
}
// dialog
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background: rgba(20, 32, 17, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  .dialog-pop {
    width: rem(562);
    height: auto;
    color: white;
    z-index: 1002;
    animation: bounce-in 0.25s;
    transform-origin: center center;
    .head {
      width: rem(520);
      height: rem(90);
      margin: 0 auto;
      background: url("./resource/ruleTitle.png") no-repeat;
      background-size: contain;
      .title {
        font-size: rem(36);
        color: white;
        width: 100%;
        line-height: rem(90);
        text-align: center;
        vertical-align: middle;
      }
    }
    .content {
      box-sizing: border-box;
      padding: rem(50);
      width: 100%;
      height: auto;
      background-color: #fff;
      border-radius: 10px;
      counter-reset: ruleList 0;
      .rules {
        counter-increment: ruleList;
        color: #333333;
        font-size: rem(28);
        line-height: rem(36);
        margin-bottom: rem(10);
        padding-left: rem(38);
        padding-right: rem(20);
        &::before {
          display: inline-block;
          content: counter(ruleList);
          width: rem(30);
          height: rem(30);
          line-height: rem(30);
          text-align: center;
          font-size: rem(24);
          color: #1f7b1e;
          background-color: #b8ee96;
          border-radius: 50%;
          margin-left: rem(-38);
          margin-right: rem(12);
        }
      }
      .btn {
        margin: rem(50) auto 0;
        width: rem(250);
        height: rem(80);
        line-height: rem(80);
        text-align: center;
        font-weight: bold;
        font-size: rem(30);
        border-radius: rem(40);
        background: linear-gradient(180deg, #ffec38, #ffd32d);
        color: #b97410;
      }
      // 获得奖品弹框
      .get-rewards {
        width: 100%;
        height: auto;
        .rewards-list {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          .rewards-item {
            flex: 1 0 33.333333%;
            margin-top: rem(30);
            text-align: center;
            .item-img {
              width: rem(120);
              height: rem(120);
            }
            .text {
              margin-top: rem(8);
              color: #999999;
              font-size: rem(24);
              line-height: rem(24);
            }
            .colord {
              color: #c38416;
            }
          }
        }
        .get-text {
          color: #333333;
          font-size: rem(28);
          text-align: center;
          margin: rem(40) 0 rem(54);
          .red {
            color: #ff593c;
          }
        }
        .btn-left {
          display: inline-block;
          width: rem(224);
          height: rem(80);
          line-height: rem(80);
          text-align: center;
          font-size: rem(30);
          border-radius: rem(40);
          background: linear-gradient(180deg, #ffec38, #ffd32d);
          color: #b97410;
        }
        .btn-right {
          display: inline-block;
          float: right;
          width: rem(224);
          height: rem(80);
          line-height: rem(80);
          text-align: center;
          font-size: rem(30);
          border-radius: rem(40);
          background: linear-gradient(180deg, #ffec38, #ffd32d);
          color: #b97410;
        }
        .box-gray-btn {
          @include subBtn(#cccccc, #f2f1f1, #e6e6e6);
        }
        .link {
          margin-top: rem(30);
          color: #333333;
          font-size: rem(28);
          text-align: center;
          .href {
            color: #3aa344;
            text-decoration: underline;
            display: inline-block;
          }
        }
      }
      // 提示弹框
      .alert {
        width: 100%;
        .alert-text {
          color: #333333;
          font-size: rem(28);
          line-height: rem(40);
          text-align: center;
        }
        .alert-btn-left {
          display: inline-block;
          margin-top: rem(30);
          width: rem(180);
          height: rem(80);
          line-height: rem(80);
          text-align: center;
          font-size: rem(30);
          border-radius: rem(40);
          background: linear-gradient(180deg, #b6ee93, #92ef85);
          color: #4da443;
        }
        .alert-btn-right {
          display: inline-block;
          margin-top: rem(30);
          text-decoration: none;
          float: right;
          width: rem(224);
          height: rem(80);
          line-height: rem(80);
          text-align: center;
          font-size: rem(30);
          border-radius: rem(40);
          background: linear-gradient(180deg, #ffec38, #ffd32d);
          color: #b97410;
        }
      }
    }
    .cancel {
      background: url("./resource/cancel.png") no-repeat;
      background-size: contain;
      width: rem(72);
      height: rem(72);
      margin: rem(48) auto 0;
    }
    .get-card {
      text-align: center;
      .card-title {
        font-size: rem(36);
        color: #fff;
      }
      .card-img {
        width: rem(320);
        height: rem(320);
      }
      .btn {
        margin: 0 auto;
        width: rem(250);
        height: rem(80);
        line-height: rem(80);
        text-align: center;
        font-weight: bold;
        font-size: rem(30);
        border-radius: rem(40);
        background: linear-gradient(180deg, #ffec38, #ffd32d);
        color: #b97410;
      }
      .notice {
        margin-top: rem(36);
        font-size: rem(28);
        color: #fff;
        .link {
          display: inline-block;
          color: #fff;
        }
      }
    }
  }
}
.readBox {
  color: #fff;
  font-size: rem(24);
  position: absolute;
  top: rem(574);
  left: rem(170);
  height: auto;
  text-align: center;
  z-index: 100;
  .big {
    font-size: rem(36);
  }
  .bottom {
    position: absolute;
    margin-top: -0.08rem;
    width: 110%;
    transform: translate(-5%, 0%);
    height: rem(10);
    border-radius: rem(5);
    background-color: #57c055;
    z-index: -1;
  }
}
</style>

