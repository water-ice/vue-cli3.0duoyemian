<template>
  <div class="page">
    <div class="head">
      <div class="title">
        <!-- 顶部入口模块 -->
        <div class="firstLine">
          <div class="left" @click="toPower">
            <span v-if="isLogin === 1">我的能量:&nbsp;&nbsp;{{power}}</span>
            <span v-else> 登录查看能量</span>
            <img v-if="isLogin === 1" src='../img/whiteArrow.png' alt='>'/>
          </div>
          <div class="right" @click="toRules">规则</div>
        </div>
      </div>
      <!-- 人已参加模块 -->
      <div class="count">
        <div class="nums">
          <span v-for="(num, index) in peopleNum" :key="index">{{num}}</span>
          <p>已参与</p>
        </div>
      </div>
      <!-- swipe模块 -->
       <div class="swiper-container">
        <mt-swipe :auto='4000' :defaultIndex='3'>
          <mt-swipe-item>
            <div class="item" @click="goActivity(0)">
            <img src="../img/act-1.png" alt="">
            </div>
          </mt-swipe-item>
          <mt-swipe-item>
            <div class="item">
            <img v-if="actStatus.length>=2" src="../img/act-2.png" @click="goActivity(1)">
            <img v-else src="../img/del-2.png">
            </div>
          </mt-swipe-item>
          <mt-swipe-item>
            <div class="item">
            <img v-if="actStatus.length>=3" src="../img/act-3.png" @click="goActivity(2)">
            <img v-else src="../img/del-3.png">
            </div>
          </mt-swipe-item>
          <mt-swipe-item>
            <div class="item" v-if="!endRedActivity">
              <div class="start-red-banner" v-if="actStatus.length>=4">
                <img v-if="actStatus.length>=4" src="../img/act-4.1.png">
                <div class="right-status-btn" @click="redEnvOperation">{{tipStatus !== 1 ? '点击开始': formatTime(endTime)}}</div>
              </div>
              <img v-if="actStatus.length>=4" src="../img/act-4.1.png">
              <img v-else src="../img/del-4.png">
            </div>
            <div class="item" v-else>
              <img src="../img/rain/endRed.png">
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </div>
    <div class="tabs">
      <div @click="changeTab(0)" :class="{active: currentTab === 0}">学习广场</div>
      <div @click="changeTab(1)" :class="{active: currentTab === 1}">能量广场</div>
      <div @click="changeTab(2)" :class="{active: currentTab === 2}">礼品兑换</div>
      <div @click="changeTab(3)" :class="{active: currentTab === 3}">组队得能量</div>
    </div>
    <modal-com :visible.sync="rulesShow" :headTxt="`五周年活动规则`" :secondary="false" :majTxt="`知道了`" :w="`5.1rem`">
      <div class="intro">
        <p><span>活动时间：</span>1月7日 - 1月20日</p>
        <p style="margin:.2rem 0 .1rem 0"><span>活动规则:</span></p>
        <p class="intro__item">用户参与活动可获得能量，消耗能量可兑换礼品，详情可查看礼品兑换页；</p>
        <p class="intro__item">1月20日将开启五周年四场红包雨，开启后 10分钟内均可参与，每场红包雨持续10秒；</p>
        <p class="intro__item">每种礼品用户只可兑换一次（除5个帮帮币外），礼品数量有限，兑完即止，虚拟礼品将实时发放，实物礼品将在活动结束后7个工作日内寄出。</p>
        <p class="intro__item">如有违规行为（如作弊、恶意刷能量等），核实后将取消您的获奖资格，并撤销违规操作。</p>
        <p class="foot">
          *本活动最终解释权归作业帮所有
        </p>
      </div>
    </modal-com>
    <modal-com :visible.sync="noticeShow" :headTxt="`组队结束`" :secondary="false" :majTxt="`知道了`" :w="`5.1rem`">
      <div class="modalEnergy">
        <div class="pic"></div>
        <p>恭喜你获得{{teamAddedEnergy}}能量</p>
        <p>已放入您的账户<span @click="toPower">我的能量</span></p>
      </div>
    </modal-com>
    <transition name='fade'>
      <router-view :isLogin="isLogin" @openApp="openApp"></router-view>
    </transition>
    <div class="rain-overlay" v-if="rainFlag">
      <div class="close" @click="resetRain"></div>
      <div class="cloud1">
        红包雨时长<br>
        <span class="red-envelope-time">{{countDownTime}}</span>&nbsp;s
      </div>
      <div class="cloud2">
        红包个数&nbsp;<span class="red-envelope-num">{{redEnvelopeNum}}</span>
      </div>
      <img src="../img/rain/cloud3.png" class="cloud3">
      <img src="../img/rain/clou4.png" class="cloud4">
      <img :src="countDownPic[countDownIndex]" class="count-down" v-if="countDownIndex < 6">
      <div class="rain-env-wrapper" v-if="redEnvFlag">
        <div class="rain-bg">
          <div
            class="red-env"
            v-for="(val, index) in readEnvelopeList"
            :key="index"
            :style="transformStyle(val)"
            @click="openRedEnvelope"></div>
        </div>
      </div>
    </div>
    <modal-com class="award-overlay" :visible.sync="awardShow" :message="freegifts.length > 0 ? '恭喜您获得以下礼包': ''" :headTxt="freegifts.length > 0 ? '五周年学习礼': '很遗憾'">
      <div class="has-gift" v-if="freegifts.length > 0">
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
      </div>
      <div class="no-gift" v-else>
        <img src="../img/rain/cloud-rain.png" class="no-award-pic">
        <br>
        一个红包都没有抢到<br>
        别伤心，下次再来吧
      </div>
      <div class="action" slot="footer">
        <div class="secondary" @click="cancel('awardShow')">知道了</div>
      </div>
    </modal-com>
  </div>
</template>
<script>
// eslint-disable-next-line
import share from 'plat-utils/src/share';
// eslint-disable-next-line
import InvokeApp from 'plat-utils/src/invokeApp';
// eslint-disable-next-line
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';
// eslint-disable-next-line
import zybLog from 'plat-utils/src/zybLog';
// eslint-disable-next-line
import hybrid from 'plat-utils/src/hybrid';
// eslint-disable-next-line
import translateUtil from './translate';
import Bus from './Bus';
import { hasClass, addClass } from './class';

export default {
  name: 'fiveAnniversary',
  methods: {
    // 唤醒App
    openApp() {
      if (inWeChat) {
        Bus.$emit('wxGuide');
      } else if (inApp) {
        hybrid('login');
      } else {
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
      }
    },
    // 去时间节点活动
    goActivity(index) {
      if (index === 1) {
        window.location.href = this.actList[index].url;
      } else if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            hybrid('openWindow', { url: this.actList[index].url });
          } else {
            hybrid('loginForResult', {}, (status) => {
              if (status) {
                this.initData();
              }
            });
          }
        });
      } else {
        this.openApp();
      }
      zybLog.send({
        type: `activity-${index}`,
      });
    },
    // 点击我的能量
    toPower() {
      zybLog.send({
        type: 'myEnergy',
      });
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            const before = window.location;
            hybrid('openWindow', {
              url: `${before.origin}${before.pathname}#/MyEnergy`,
            });
          } else {
            hybrid('loginForResult', {}, (status) => {
              const login = status ? 1 : 0;
              this.isLogin = login;
            });
          }
        });
      } else {
        this.openApp();
      }
    },
    // 点击规则
    toRules() {
      zybLog.send({
        type: 'mainRules',
      });
      this.rulesShow = true;
    },
    // 切换标签
    changeTab(val) {
      zybLog.send({
        type: `tab-${val}`,
      });
      this.currentTab = val;
      const curRoute = this.routerList[val];
      this.$router.replace(`/Home${curRoute}`);
      this.$fetch({
        url: '/activity/fiveyears/teamleaderpage',
      }).then((res) => {
        this.invitedPeople = res.data.result.lastTeamUserList;
      });
    },
    // 点击问号
    clickQuestion() {
      console.log('question');
    },
    // 根据当前时间判断活动进展
    processDate() {
      const day = new Date().getDate();
      let l = null;
      switch (parseInt(day, 10)) {
        case 7:
          l = '.84rem';
          break;
        case 8:
          l = '1.31rem';
          break;
        case 9:
          l = '1.77rem';
          break;
        case 10:
          l = '2.14rem';
          break;
        case 11:
          l = '2.35rem';
          break;
        case 12:
          l = '2.66rem';
          break;
        case 13:
          l = '2.95rem';
          break;
        case 14:
          l = '3.26rem';
          break;
        case 15:
          l = '3.54rem';
          break;
        case 16:
          l = '3.84rem';
          break;
        case 17:
          l = '4.13rem';
          break;
        case 18:
          l = '4.42rem';
          break;
        case 19:
          l = '4.72rem';
          break;
        case 20:
          l = '4.84rem';
          break;
        default:
          l = '.5rem';
          break;
      }
      return l;
    },
    // 初始化数据请求
    initData(add) {
      this.$fetch({
        url: '/activity/fiveyears/mainpage',
        method: 'POST',
        formType: true,
        data: { addUser: add ? 1 : 0 },
      }).then((res) => {
        this.power = res.data.result.currentEnergy;
        this.people = res.data.result.partNum;
        this.isLogin = res.data.result.isLogin;
        Bus.userInfo.grade = res.data.result.grade;
        this.actStatus = res.data.result.progressList;
        this.goodsRainTime = res.data.result.goodsRainTime;
        this.currentTime = res.data.result.currentTime;
        if (this.getDataTimer) {
          clearInterval(this.getDataTimer);
        }
        // 组队结算弹窗
        if (res.data.result.teamAddedEnergy > 0) {
          this.teamAddedEnergy = res.data.result.teamAddedEnergy;
          this.noticeShow = true;
        }
        const { currentTime, goodsRainTime } = res.data.result;
        const inCountDownTimeIndex = goodsRainTime.findIndex(val => currentTime > val.countdown && currentTime < val.end);
        this.endRedActivity = this.currentTime > goodsRainTime[goodsRainTime.length - 1].end;
        if (this.endRedActivity) {
          return false;
        }
        // 在到级时间之前
        if (inCountDownTimeIndex > -1) {
          this.timeIndex = inCountDownTimeIndex;
          const currentReturnTimeObj = goodsRainTime[inCountDownTimeIndex];
          const isInRedRain = currentTime > currentReturnTimeObj.start ? 1 : 0;
          // 在下红包雨时间内，登陆情况下canGet为1，不登陆情况就下。
          if (isInRedRain && (currentReturnTimeObj.canGet || !this.isLogin)) {
            // 执行下红包雨的操作并且需要canget为1
            this.countDown();
            this.getDataTimer = setInterval(() => {
              this.currentTime += 1;
            }, 1000);
          } else if (!isInRedRain) {
            // 开始倒计时的操作
            // this.tipStatus = 1;
            this.getDataTimer = setInterval(() => {
              this.currentTime += 1;
            }, 1000);
          }
        } else {
          const whichTimeIndex = goodsRainTime.findIndex(val => currentTime < val.start);
          this.timeIndex = whichTimeIndex;
          // 当前时间
          this.getDataTimer = setInterval(() => {
            this.currentTime += 1;
          }, 1000);
        }

        // hybrid('is_login', {}, (r) => {
        //   this.isLogin = r.isLogin ? 1 : 0;
        // });
      });
    },

    // 红包雨开始后倒计时相关操作
    countDown() {
      this.resetConfig();
      this.rainFlag = true;
      const win = document.documentElement.clientWidth || document.body.clientWidth;
      this.readEnvelopeList = this.readEnvelopeList.map(() => parseInt(Math.random() * (win - 50), 0));
      this.countDowntimer = setInterval(() => {
        this.countDownIndex++;
        if (this.countDownIndex > 6) {
          this.startRedPacket();
          this.redEnvFlag = true;
          clearInterval(this.countDowntimer);
        }
      }, 1000);
    },

    transformStyle(val) {
      const { transformStyleName } = translateUtil;
      const obj = {};
      obj[transformStyleName] = `translateX(${val}px)`;
      return obj;
    },
    // 红包雨相关操作
    startRedPacket() {
      this.downTimer = setInterval(() => {
        this.countDownTime--;
      }, 1000);
      this.downOutTimer = setTimeout(() => {
        this.redEnvFlag = false;
        this.rainFlag = false;
        this.sendRedData(this.redEnvelopeNum);
        setInterval(this.downTimer);
      }, 10000);
    },
    openRedEnvelope(event) {
      const { target } = event;
      if (hasClass(target, 'open')) {
        return false;
      }
      if (inApp) {
        if (this.isLogin) {
          addClass(target, 'open');
          this.redEnvelopeNum++;
        } else {
          hybrid('loginForResult', {}, () => {
            window.location.reload();
          });
        }
      } else {
        this.openApp();
      }
    },
    cancel(type) {
      this[type] = false;
    },
    sendRedData(clickNum) {
      this.$fetch({
        method: 'get',
        url: '/activity/fiveyears/apiqianggou',
        params: {
          clickNum,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          this.freegifts = res.data.result || [];
          this.awardShow = true;
          // const { goodsRainTime, timeIndex } = this;
          this.$set(this.goodsRainTime[this.timeIndex], 'canGet', 0);
          // const currentTimeObj = goodsRainTime[timeIndex];
          // currentTimeObj.canGet = 0;
        } else {
          hybrid('toast', {
            text: res.errstr,
          });
        }
      });
    },
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
    redEnvOperation() {
      const { goodsRainTime, timeIndex } = this;
      const currentTimeObj = goodsRainTime[timeIndex];
      if (this.isLogin && !currentTimeObj.canGet) {
        hybrid('toast', {
          text: '你已经抢过红包了，下次再来吧',
        });
        return;
      }
      if (this.tipStatus === 0) {
        hybrid('toast', {
          text: `红包雨将在${this.formatHourTime(currentTimeObj.start)}:00开始`,
        });
      } else if (this.tipStatus === 2 && ((this.isLogin && currentTimeObj.canGet) || !this.isLogin)) {
        this.countDown();
      }
    },
    formatTime(val) {
      const date = new Date(val * 1000);
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      return `${date.getMinutes()}:${seconds}`;
    },
    formatHourTime(val) {
      const date = new Date(val * 1000);
      return date.getHours();
    },
    resetConfig() {
      if (this.downTimer) {
        clearInterval(this.downTimer);
      }
      if (this.downOutTimer) {
        clearTimeout(this.downOutTimer);
      }
      if (this.countDowntimer) {
        clearInterval(this.countDowntimer);
      }
      this.countDownIndex = 0;
      this.redEnvelopeNum = 0;
      this.countDownTime = 10;
      this.redEnvFlag = false;
    },
    resetRain() {
      this.resetConfig();
      this.rainFlag = false;
    },
  },
  data() {
    return {
      // 活动进度提示
      msgHidd: false,
      // 当前登录人信息
      userInfo: {},
      // 进度条长度
      progressL: '50%',
      // 路由
      routerList: ['/Study', '/Energy', '/Gift', '/Team'],
      // 我的能量
      power: 0,
      // 参与人数
      people: 0,
      // 进度活动列表
      actList: [{
        date: '1月7日', name: '年终档案', id: 1, url: inApp ? 'https://www.zybang.com/skyfire/report/index' : 'https://www.zuoyebang.com/skyfire/report/index',
      }, {
        date: '1月10日', name: '神秘来信', id: 2, url: 'https://www.zybang.com/static/yike-sell-operational/hummingbird.html?actId=2192',
      }, {
        date: '1月15日', name: '传送门', id: 3, url: `${window.location.origin}${window.location.pathname}#/Video`,
      }, { date: '1月20日', name: '红包雨', id: 4 }],
      // 当前活动进展
      currentStep: 0,
      // 当前标签
      currentTab: 0,
      // 进主页时显示的提醒信息
      noticeShow: false,
      // 已邀请人信息
      invitedPeople: [
        {
          avatar: '../img/headpic.png',
          name: 'test1',
          time: '2018.01.02 16:20',
        },
        {
          avatar: '../img/people.png',
          name: 'test2',
          time: '2018.01.02 16:20',
        },
        {
          avatar: '../img/question.png',
          name: 'test3',
          time: '2018.01.02 16:20',
        },
      ],
      rulesShow: false,
      // 是否登录
      isLogin: 0,
      // 活动开启列表
      actStatus: [],
      // 组队获取的能量
      teamAddedEnergy: 0,
      // 倒计时图片
      countDownPic: [
        require('../img/rain/num5.png'),
        require('../img/rain/num4.png'),
        require('../img/rain/num3.png'),
        require('../img/rain/num2.png'),
        require('../img/rain/num1.png'),
        require('../img/rain/start.png'),
      ],
      countDownIndex: 0,
      // 领取的红包个数
      redEnvelopeNum: 0,
      // 红包雨数组
      readEnvelopeList: Array.from({ length: 20 }),
      // 下红包雨的时间
      downTimer: null,
      countDownTime: 10,
      redEnvFlag: false,
      rainFlag: false,
      currentTime: 0,
      tipStatus: 5,
      freegifts: [],
      downOutTimer: null,
      countDowntimer: null,
      awardShow: false,
      endRedActivity: false,
      endTime: 0,
      getDataTimer: null,
    };
  },
  computed: {
    peopleNum() {
      const arr = [];
      let num = this.people;
      while (num > 0) {
        arr.push(num % 10);
        num /= 10;
        num = parseInt(num, 0);
      }
      while (arr.length < 8) {
        arr.push(0);
      }
      return arr.reverse();
    },
  },
  watch: {
    currentTime(val) {
      const { goodsRainTime, timeIndex } = this;
      const currentTimeObj = goodsRainTime[timeIndex];
      if (val < currentTimeObj.countdown) {
        this.tipStatus = 0;
      } else if (val > currentTimeObj.countdown && val < currentTimeObj.start) {
        this.endTime = currentTimeObj.start - this.currentTime;
        this.tipStatus = 1;
      } else if (val > currentTimeObj.start && val < currentTimeObj.end) {
        this.tipStatus = 2;
      } else if (val > currentTimeObj.end) {
        this.tipStatus = 3;
        if (goodsRainTime[timeIndex + 1]) {
          this.timeIndex++;
        }
      }
    },
  },
  mounted() {
    // 活动末尾弹窗
    const day = new Date().getDate();
    if ((day > 18) && !window.localStorage.getItem(`reminder${day}`)) {
      this.$modal({ headTxt: '能量使用提醒', message: '活动将在20日24:00结束,请尽快使用能量哦~', secondary: false }).then(() => {
        window.localStorage.setItem(`reminder${day}`, 'true');
      }).catch((err) => {
        console.log(err);
      });
    }
    // 注册分享
    share({
      url: window.location.href, // 分享链接，一般为当前页面的链接
      content: '作业帮五周年', // 分享内容
      title: '五年相伴，学习享好礼!', // 分享标题
      pic: 'https://img.zuoyebang.cc/zyb_7466d449e0ed87a2ca76563dfa19741b.png', // 分享缩略图
    });
    // 刷新后同步一下路由和高亮的标签
    this.progressL = this.processDate();
    this.initData(1, true);
    const path = this.$route.path.split('/');
    const active = path.pop();
    this.currentTab = this.routerList.findIndex(val => val.slice(1) === active);
    const msgTimer = setTimeout(() => {
      this.msgHidd = true;
      clearTimeout(msgTimer);
    }, 3000);
    Bus.$on('refresh', () => {
      console.log('refresh');
      this.initData();
    });
    Bus.$on('reTab', () => {
      this.currentTab = 3;
    });
    this.$router.beforeEach((to, from, next) => {
      // to and from are both route objects. must call `next`.
      if (/\/Energy/.test(to.path)) {
        this.initData();
      }
      next();
    });
    this.$router.afterEach(() => {
      // to and from are both route objects.
      // this.currentTab = this.routerList.findIndex(val => val.slice(1) === active);
    });
  },
};
</script>
<style lang="less" scoped>
.bg(@val) {
  background: url(@val) 0 0 no-repeat;
  background-size: contain;
}
.page {
  font-size: 0;
  overflow-x: hidden;
  position: relative;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  width: 100%;
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .head {
    background-image: url("../img/headpic.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
    height: 9.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 0.32rem;
      color: rgb(255, 255, 255);
      position: relative;
      .firstLine {
        position: relative;
        font-size: 0.25rem;
        .left {
          position: absolute;
          left: -3.6rem;
          top: 0.3rem;
          padding: 0 0.16rem 0 0.17rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0 0.48rem 0.48rem 0;
          height: 0.48rem;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          img {
            height: .13rem;
            width: .12rem;
            margin-left: .05rem;
          }
        }
        .right {
          position: absolute;
          top: 0.3rem;
          right: -3.3rem;
          padding: 0 0.1rem 0 0.1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0.48rem;
          width: 1rem;
          height: 0.48rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .swiper-container {
      width: 6.6rem;
      height: .86rem;
      margin-top: .3rem;
        .item {
          .start-red-banner {
            position: relative;
            .right-status-btn {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: .2rem;
              width: 1.2rem;
              height: .48rem;
              background: url('../img/rain/btn.png') 0 0 no-repeat;
              background-size: 100% auto;
              display: flex;
              font-weight: bold;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 10px;
            }
          }
          img {
            width: 6.6rem;
          }

        }
      }
    .count {
      position: relative;
      margin-top: 7rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .people_img {
        display: flex;
        justify-content: center;
        img {
          width: 2.6rem;
          height: 0.9rem;
        }
      }
      .nums {
        font-size: 0.35rem;
        color: black;
        width: 2.4rem;
        height: 0.9rem;
        background: url('../img/coutBg.png') no-repeat;
        background-size: 100% auto;
        // position: absolute;
        margin-top: -0.72rem;
        padding: 0 .05rem;
        p {
          text-align: center;
          color: white;
          font-size: .2rem;
          margin-top: .05rem;
        }
        span {
          height: 0.4rem;
          width: 0.3rem;
          line-height: .46rem;
          display: inline-block;
          text-align: center;
        }
      }
    }
    .process {
      position: relative;
      margin: 0 auto;
      height: 1.27rem;
      top: 1.1rem;
      width: 5.6rem;
      .message {
        width: 6.7rem;
        height: .85rem;
        background:url('../img/active2.png') no-repeat;
        background-size: 100% auto;
        position: absolute;
        left: 50%;
        transition: 1s linear;
        transform: translate(-50%,0);
        top: -1.05rem;
        z-index: 1000;
        span {
          position: absolute;
          display: inline-block;
          width: .18rem;
          height: .14rem;
          background: url('../img/arrow-down.png') no-repeat;
          background-size: contain;
          bottom: -0.13rem;
          left: 1.37rem;
        }
        &.hidden {
          display: none;
        }
        &.message1 {
          background-image: url('../img/slider1.png')
        }
        &.message2 {
          background-image: url('../img/active2.png');
          span {
            left:2.77rem;
          }
        }
        &.message3 {
          background-image: url('../img/active2.png');
          span {
            left:4.15rem;
          }
        }
        &.message4 {
          background-image: url('../img/active2.png');
          span {
            left:5.4rem;
          }
        }
      }
      ul {
        width: 110%;
        margin-top: -.02rem;
        &::before,&::after{
          content:".";
          display:block;
          height:0;
          clear:both;
          visibility:hidden;
        }
        li {
          float: left;
          margin-left: .5rem;
          font-size: .14rem;
          text-align: center;
          position: relative;
          .headImg {
            width: .5rem;
            height: .5rem;
            position: absolute;
            background: url('../img/img1.png') no-repeat;
            background-size: cover;
            top: -.7rem;
            left: 50%;
            transform: translate(-50%,0);
            &.headImg1 {
              background-image: url('../img/img1.png')
            }
            &.headImg2 {
              background-image: url('../img/img2.png')
            }
            &.headImg3 {
              background-image: url('../img/img3.png')
            }
            &.headImg4 {
              background-image: url('../img/img4.png')
            }
            &.big {
              width: .8rem;
              height: .8rem;
              top: -.9rem;
              animation: move 1s infinite;
            }
          }
          .status {
            display: block;
            height: .25rem;
            width: .25rem;
            margin: 0 auto .15rem;
            background: url('../img/status1.png') no-repeat;
            background-size: cover;
          }
          &.act {
            color:#ffb0b0;
            font-size: .16rem;
            z-index: 999;
          }
          &.act1 {
            color:#ffb0b0;
            font-size: .16rem;
            .status {
              background-image: url('../img/status1.png')
            }
          }
          &.act3 {
            color:#fff;
            .status {
              background-image: url('../img/status3.png')
            }
          }
          &.act2 {
            color: #fff76f;
            .data {
              font-size: .26rem;
              margin-top: -.07rem;
            }
            .name {
              font-size: .14rem;
            }
            .status {
              background-image: url('../img/status2.png')
            }
          }
        }
      }
      .steps {
        position: absolute;
        top: 0.8rem;
        width: 5.2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          font-weight: 200;
          div:nth-child(2) {
            font-size: 0.34rem;
            position: absolute;
            top: 0.3rem;
          }
          div:nth-child(3) {
            font-size: 0.2rem;
            position: absolute;
            top: 0.7rem;
          }
          .normal {
            border-width: 0.05rem;
            border-radius: 50%;
            border-style: solid;
            border-color: white;
            height: 0;
            width: 0;
          }
          .normal.passed {
            border-width: 0.24rem;
            top: 0.98rem;
            margin-top: -0.22rem;
          }
        }
      }
      .line {
        // X:99px Y:832px W:520px H:2px
        border-top-color: white;
        border-top-style: solid;
        border-top-width: .05rem;
        width: 5.6rem;
        position: absolute;
        top: .07rem;
      }
      .proline {
        .line;
        border-top-color: #00ffff;
        z-index: 99;
        &::after {
          content: '';
          display: inline-block;
          height: .3rem;
          width: .3rem;
          background: url('../img/end.png') no-repeat;
          background-size: cover;
          position: absolute;
          right: -.17rem;
          top: -.17rem;
        }
      }

    }
  }
  .tabs {
    font-size: 0.24rem;
    color: white;
    height: 0.8rem;
    width: 100%;
    background-image: url("../img/tab.png");
    background-repeat: repeat-x;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    div {
      height: 100%;
      line-height: 0.8rem;
      width: 1.5rem;
    }
    .active {
      background: rgb(0, 197, 255);
      font-size: 0.26rem;
      font-weight: bold;
      height: 0.9rem;
      width: 1.8rem;
      border-radius: 0.06rem;
      line-height: 0.9rem;
    }
  }
  .content {
    overflow: hidden;
  }
  .intro {
    counter-reset:intro 0;
    span {
      font-weight: 550;
    }
    .intro__item{
      counter-increment: intro;
      padding-left: .4rem;
      &::before{
        content: counter(intro);
        display: inline-block;
        width: 0.3rem;
        line-height: 0.3rem;
        border-radius: 50%;
        text-align: center;
        color: #fff;
        background: #ff4e3c;
        margin-right: 0.1rem;
        margin-left: -0.4rem;
      }
    }
    p {
      font-size: .26rem;
      line-height: .35rem;
      &.space {
        margin-left: .4rem;
      }
    }
    .foot {
      font-size: .24rem;
      color: #999999;
      text-align: center;
      margin-top: .6rem;
    }
  }
  .modalEnergy {
    width: 100%;
    text-align: center;
    .pic {
      margin: 0 auto;
      height: 2rem;
      width: 1.86rem;
      background: url('../img/ennergy.png') no-repeat;
      background-size: 100% auto;
    }
    p{
      color: #333;
      font-size: .32rem;
    }
    p:nth-child(3){
      font-size: .24rem;
      color: #666;
      margin-top: .2rem;
      span {
        color:#00c0ff;
        margin: 0 .1rem;
      }
    }
  }
  .rain-overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .6);
    z-index: 5;
    .close {
      position: absolute;
      right: .2rem;
      top: .2rem;
      width: .76rem;
      height: .75rem;
      z-index: 2;
      .bg('../img/rain/close.png');
    }
    .cloud1 {
      position: absolute;
      top: .2rem;
      left: 50%;
      transform: translateX(-50%);
      width: 3.2rem;
      height: 1.76rem;
      padding-top: .6rem;
      text-align: center;
      font-size: 15px;
      z-index: 2;
      color: #53403c;
      .bg('../img/rain/cloud1.png');
      .red-envelope-time {
        font-size: 24px;
        color: #ff563b;
        font-weight: bolder;
      }
    }
    .cloud2 {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 2.66rem;
      height: 1.46rem;
      padding: .8rem 0 0 .3rem;
      box-sizing: border-box;
      z-index: 2;
      .bg('../img/rain/cloud2.png');
      font-size: 15px;
      color: #53403c;
      .red-envelope-num {
        color: #ff563b;
        font-weight: bolder;
      }
    }
    .cloud3 {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1.18rem;
      z-index: 2;
    }
    .cloud4 {
      position: absolute;
      right: .9rem;
      bottom: 1.86rem;
      height: 1.2rem;
      z-index: 2;
    }
    .count-down {
      position: absolute;
      left: 50%;
      top: 50%;
      height: 1.4rem;
      transform: translate(-50%, -50%) scale(1.5);
      animation: transScale 1s infinite;
    }
    .rain-env-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      transform: rotate(10deg);
    }
    .rain-bg {
      width: 100%;
      background-image: url('../img/rain/red-env-bg.png');
      background-position: center center;
      background-repeat: repeat-y;
      background-size: contain;
      transform: translateY(-100%);
      animation: translateBg 10000ms linear;
      .red-env {
      width: 1.15rem;
      height: 1.38rem;
      margin: .56rem 0;
      background: url('../img/rain/close-en.png') 0 no-repeat;
      background-size: contain;
      &:first-child {
        margin-top: 0;
      }
        &.open{
          .bg('../img/rain/open-en.png');
        }
      }
    }
  }
  .award-overlay {
    .wrap {
      .no-gift {
        font-size: .28rem;
        color: #333;
        text-align: center;
        .no-award-pic {
          width: 1.8rem;
        }
      }
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
      .secondary {
        width: 2rem;
        margin: 0 auto;
        height: .8rem;
        line-height: .8rem;
        font-size: .3rem;
        text-align: center;
        background: #ff4937;
        border-radius: .4rem;
        color: #fff;
      }
    }
  }
}
@keyframes move {
  from {
    top: -.9rem;
  }
  to {
    top: -.92rem;
  }
}
@keyframes translateBg {
  from {
    transform: translateY(-100%) translateX(20px);
  }
  to {
    transform: translateY(40%) translateX(20px);
  }
}
@keyframes transScale {
  from {
    transform: translate(-50%, -50%) scale(1.5);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
