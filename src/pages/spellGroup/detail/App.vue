<template>
  <div class='main' :class='{mainTop:inWeChat}'>
    <login v-if='inWeChat' ref='login' :isLogin='isLogin' :userName='userName' :source='source'></login>
    <div class='contain' :class='{payContain:!isInfo}'>
      <div v-if='isInfo' class='top'>
        <img class='goodsIcon' :src='product.img'>
        <div class='rightContain'>
          <div class='prefInfo'>
            <p class='firstLine'>{{product.title}}作业帮会员</p>
            <p class='secondLine'><span class='personIcon'></span>{{maxPersons}}人团</p>
            <p><span class='price'>￥{{product.groupPrice}}</span><span class='singlePrice'>单独购买￥{{product.singlePrice}}元</span></p>
          </div>
          <div class='resultIcon' :class='{over:isOver, success:isSuccess}'></div>
        </div>
      </div>
      <div v-else class='payTop'>
        <div class='title'>{{title}}</div>
      </div>
      <div class='middle' :class='{payMiddle:!isInfo}'>
        <ul>
          <li class='headContain' v-for='(item, index) in getUserList' :key='index'>
            <img v-if='item != ""' class='head fill' :class='{isme:showMeClass(index, item.isCurUser)}' :src='item.headImg'>
            <div v-else class='head empty'></div>
            <div v-if='index==0' class='crown'></div>
            <div v-if='index==0' class='logo'>团长</div>
          </li>
        </ul>
        <div class='remind'>
          <span>{{remindInfo}}</span>
          <div v-show='isLeftTime' class='timeContain'>
            <span>{{hour}}</span> :
            <span>{{minutes}}</span> :
            <span>{{seconds}}</span>
          </div>
        </div>
        <div class='btn btnAnimation' @click='clickHandler'>{{btnText}}</div>
        <p class='tips' :class='{payTips:!isInfo}'>注：若拼团失败，将自动退款</p>
      </div>
      <div v-if='isInfo' class='bottom'>
        <img class='laba' src='../resource/laba1.png'>
        <div class='rollContain' v-if='listLen>0'>
          <rolling :len='listLen' :time='1'>
            <li class='info' v-for='(item, index) in successList' :key='index'><span class='userName'>{{item}}</span><span>刚刚拼团成功</span></li>
          </rolling>
        </div>
      </div>
    </div>
    <div v-if='inWeChatDetail' class='openAppBtn' @click='openAppHandler'>打开作业帮</div>
    <carousel :detail='true'></carousel>
    <div v-show='isShowMask' class='mask topLayer' @click='hideMask' @touchmove.prevent>
      <div class='arrow'>
        <p class='tip1'>{{maskObj.content1}}</p>
        <p>{{maskObj.content2}}</p>
      </div>
    </div>
    <div v-show='isShowBounced' class='mask' @touchmove.prevent>
      <div class='bounced'>
        <div class='bouncedTitle'>
          提示
          <div class='closeBtn' @click='hideBounced'></div>
        </div>
        <p class='bouncedTip1'>{{bouncedObj.tip1}}</p>
        <p>{{bouncedObj.tip2}}</p>
        <div class='btn bouncedBtn' @click='bouncedHandler'>{{bouncedObj.btnTxt}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import share from 'plat-utils/src/share';
import InvokeApp from 'plat-utils/src/invokeApp';
import { isIos, isAndroid, inApp, inWeChat, inQQ } from 'plat-utils/src/systemInfo';

import Rolling from '../../../components/Rolling/Rolling.vue';
import Carousel from '../components/Carousel.vue';
import Login from '../components/Login.vue';

export default {
  components: { Rolling, Carousel, Login },
  data() {
    return {
      extInfo: '', // 支付用回传参数
      product: { // 商品数据结构
        singlePrice: 0,
        groupPrice: 0,
        serviceId: 0,
        itemId: 0,
        img: '',
        title: '',
      },
      maxPersons: 0, // 最大拼团人数
      userList: [], // 拼团列表
      currenLen: 0, // 当前拼团人数
      title: '', // 标题
      remindInfo: '', // 提示文案
      btnText: '', // 按钮文案
      successList: [], // 滚屏文字
      isLeftTime: true, // 是否显示倒计时
      hour: 0, // 时
      minutes: 0, // 分
      seconds: 0, // 秒
      isInfo: false, // 是否是商品详情页
      isOver: false, // 拼团结束
      isSuccess: false, // 拼团成功
      isShowMask: false, // 是否显示指引提示
      isShowBounced: false, // 是否显示弹框
      maskObj: { // 蒙层文案
        content1: '',
        content2: '',
      },
      bouncedType: 1, // 弹框按钮状态
      bouncedSt: 0, // 弹框定时器
      bouncedObj: { // 弹框文案
        tip1: '',
        tip2: '',
        btnTxt: '',
      },
      isShare: false, // 是否分享页面
      isLogin: false, // 是否登录
      userName: '', // 用户名
      btnType: 1, // 1-参团2-开新团3-分享
      groupId: '', // 当前团id
      userDoingGroupId: '', // 用户参团的id
      canJoin: 0, // 能否参团/开团
      downTimeSt: 0, // 倒计时
      uid: '', // 用户uid（打点用）
      isCreateTeam: false, // 是否开团（打点用）
      userInGroup: 0, // 是否在团内（打点用）
    };
  },
  computed: {
    inWeChat() {
      return inWeChat;
    },
    inWeChatDetail() {
      return inWeChat && this.isInfo;
    },
    source() { // 页面来源（打点用）
      return this.getQueryString('from') || 'vipGroup';
    },
    listLen() {
      return this.successList.length;
    },
    getUserList() { // 参团用户列表
      const result = this.userList;
      if (result.length < this.maxPersons) {
        const len = result.length;
        const leftNum = this.maxPersons - len;
        for (let i = 0; i < leftNum; i++) {
          result.push('');
        }
      }
      return result;
    },
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
    getDetailInfo(groupid) { // 获取详情数据
      this.$fetch
        .get(`/activity/vipgroupon/detail?groupId=${groupid}`)
        .then((res) => {
          if (res.errNo === 0) {
            this.updateView(res.data);
            this.initData(res.data);
            this.updateStatus(res);
            this.userList = res.data.userList;
          }
        });
    },
    getPayInfo() { // 支付成功后获取数据
      const orderid = this.getQueryString('orderId');
      this.$fetch
        .get(`/activity/vipgroupon/paypage?orderId=${orderid}`)
        .then((res) => {
          if (res.errNo === 0) {
            if (res.data.userList.length === res.data.maxPersonNum) {
              this.title = '拼团成功';
              if (inApp) {
                this.sendLog({ type: 'inApp-team-success-count', realityCount: res.data.group.personNum });
              } else {
                this.sendLog({ type: 'WeChat-team-success-count', realityCount: res.data.group.personNum });
              }
            } else {
              this.isCreateTeam = res.data.group.type === 1;
              this.title = res.data.group.type === 1 ? '开团成功' : '参团成功';
              if (!this.isCreateTeam) { // 参团成功打点
                if (inApp) {
                  this.sendLog({ type: 'inApp-join-success' });
                } else {
                  this.sendLog({ type: 'WeChat-join-success' });
                }
              }
            }
            this.updateView(res.data);
            this.updateStatus(res);
            this.userList = res.data.userList;
          }
        });
    },
    getShareInfo(groupid) { // 获取分享数据
      this.$fetch
        .get(`/activity/vipgroupon/share?groupId=${groupid}`)
        .then((res) => {
          if (res.errNo === 0) {
            this.updateView(res.data);
            this.initData(res.data);
            this.updateStatus(res);
            this.userList = res.data.userList;
          }
        });
    },
    initData(data) { // 详情页面初始化数据
      this.extInfo = data.extInfo;
      this.product = data.product;
      this.canJoin = data.group.canJoin;
      this.userDoingGroupId = data.userDoingGroupId;
      this.successList = data.successTxtList;
    },
    updateStatus(obj) { // 更新团状态
      this.uid = obj.data.uid;
      this.groupId = obj.data.group.id;
      this.userName = obj.data.uname;
      this.isLogin = obj.data.userIsLogin;
      this.maxPersons = obj.data.maxPersonNum;
      this.currenLen = obj.data.userList.length;
      if (obj.data.group.status === 1) { // 参团倒计时
        let leftTime = obj.data.group.endTime - obj.data.curTime;
        this.isLeftTime = leftTime > 0;
        this.isOver = false;
        this.isSuccess = false;
        if (this.downTimeSt !== 0) {
          this.stopInterval();
        }
        this.downTimeSt = setInterval(() => {
          if (leftTime <= 0) {
            this.stopInterval();
          }
          this.updateTime(leftTime);
          leftTime--;
        }, 1000);
      } else if (obj.data.group.status === 2) { // 拼团成功
        this.isOver = obj.data.userInGroup === 0; // 不在团内
        this.isSuccess = !this.isOver; // 在团内
        this.isLeftTime = false;
      }
    },
    updateView(data) { // 更新页面显示
      this.userInGroup = data.userInGroup;
      if (data.group.status === 1) { // 拼团未满
        this.remindInfo = `仅差${data.maxPersonNum - data.userList.length}人拼团成功，剩余时间：`;
        this.btnText = data.userInGroup === 1 ? '邀请好友立即参团' : '立即参团';
        this.btnType = data.userInGroup === 1 ? 3 : 1;
      } else {
        this.remindInfo = `${this.isLogin ? '拼团' : '此团'}成功，会员5分钟后到账`;
        this.btnText = '开启新的拼团';
        this.btnType = 2;
      }
    },
    clickHandler() { // 详情页面按钮事件
      switch (this.btnType) {
        case 1: // 参团
          this.joinTeam(1);
          break;
        case 2: // 开新团
          if (this.userDoingGroupId.length > 0 && this.userDoingGroupId !== this.groupId) { // 用户的参团id和当前团id不一致时提示
            this.showBounced(1);
          } else {
            this.joinTeam(2);
          }
          break;
        case 3: // 分享
          this.shareHandler(1);
          break;
        default:
          break;
      }
    },
    updateTime(num) { // 更新倒计时
      this.hour = Math.floor(num / 60 / 60);
      this.minutes = Math.floor(num / 60) % 60;
      this.seconds = num % 60;
    },
    joinTeam(type) { // 参团
      if (isIos && inQQ) {
        this.showMask(1);
      } else {
        if (inApp) { // 端内调用支付接口
          if (this.isLogin === 1) {
            if (type === 1) { // 参团
              if (this.canJoin === 1) { // 能参团
                this.$fetch.get(`/activity/vipgroupon/bind?groupId=${this.groupId}`)
                  .then((res) => {
                    if (res.errNo === 0) {
                      this.buyHandler();
                    }
                  });
              } else { // 不能参团
                this.showBounced(1);
              }
            } else { // 开新团
              this.buyHandler();
              if (this.userInGroup === 1) {
                this.sendLog({ type: 'inApp-success-open-new' });
              } else {
                this.sendLog({ type: 'inApp-over-open-new' });
              }
            }
          } else {
            this.inAppLogin();
          }
          return;
        }

        if (inWeChat) { // 微信内登录然后支付
          if (this.isLogin === 1) { // 已登录
            if (type === 2) { // 开新团
              if (this.userInGroup === 1) { // 在团内
                this.sendLog({ type: 'WeChat-success-open-new' });
              } else {
                this.sendLog({ type: 'WeChat-over-open-new' });
              }
            } else { // 参团
              this.sendLog({ type: 'WeChat-join-click' });
            }
            const callbackURL = `${window.location.origin}${window.location.pathname}?inApp=0&share=1&type=0&from=${this.source}`;
            let path = `https://www.zuoyebang.com/support/pay/jsapi?extInfo=${this.extInfo}
            &items=${this.product.serviceId}_${this.product.itemId}_1&fee=${this.product.groupPrice * 100}&callbackURL=${encodeURIComponent(callbackURL)}`;
            path = path.replace(/\s+/g, '');
            window.location.href = path;
          } else { // 未登录弹出登录框
            this.$refs.login.loginHandler();
          }
          return;
        }

        if (inQQ) {
          if (type === 1) { // 参团
            this.sendLog({ type: 'QQ-join-click' });
          } else { // 开新团
            this.sendLog({ type: 'QQ-open-new' });
          }
        }
        // 调起APP
        this.openApp();
      }
    },
    shareHandler(type) { // 分享
      const path = `${window.location.protocol}//h5.zuoyebang.com${window.location.pathname}?inApp=0&type=1&share=1&groupId=${this.groupId}&from=${this.source}`;
      if (inApp) {
        hybrid('share', {
          share_url: path,
          share_title: '【限时特价】作业帮会员拼团价9.9元！',
          share_text: `我刚9.9元买完，还差${this.maxPersons - this.currenLen}人，快上车！会员享价值上万精品课程，每天仅0.3元！`,
          share_img: 'https://yy-s.zuoyebang.cc/static/common/css/resource/logo_128x128_b10037d.png',
        });
        if (!this.isInfo) {
          if (this.isCreateTeam) { // 端内开团成功页
            this.sendLog({ type: 'inApp-open-success-invite' });
          } else { // 端内参团成功页
            this.sendLog({ type: 'inApp-join-invite' });
          }
        } else { // 端内详情页
          this.sendLog({ type: 'inApp-detail-invite' });
        }
      } else {
        this.showMask(2);
        if (inWeChat) {
          if (this.isInfo) {
            this.sendLog({ type: 'WeChat-detail-invite' });
          } else {
            this.sendLog({ type: 'WeChat-join-invite' });
          }
        }
      }

      if (type === 1 && this.bouncedSt === 0) {
        this.bouncedSt = setTimeout(() => {
          clearTimeout(this.bouncedSt);
          this.bouncedSt = 0;
          this.showBounced(2);
        }, 5000);
      }
    },
    showBounced(type) {
      this.isShowBounced = true;
      this.bouncedType = type;
      if (type === 1) {
        this.bouncedObj = {
          tip1: '您有一个进行中的拼团',
          tip2: '暂不能参与其它团哦',
          btnTxt: '查看我的拼团',
        };
      } else {
        this.bouncedObj = {
          tip1: '分享到群里',
          tip2: '拼单成功率高达95%哦',
          btnTxt: '继续分享',
        };
      }
    },
    inAppLogin() { // app登录
      hybrid('loginForResult', {}, (res) => {
        if (res.result) {
          window.location.reload();
        }
      });
    },
    buyHandler() { // 端内购买
      const parmas = {
        serverId: this.product.serviceId,
        itemId: this.product.itemId,
        PAY_EXT: this.extInfo,
      };
      hybrid('platformPay', parmas, (res) => {
        window.location.reload();
        const path = `${window.location.origin}${window.location.pathname}?inApp=1&orderId=${res.orderId}&type=0&share=0`;
        hybrid('openWindow', {
          url: path,
          hideNav: 0,
        });
      });
    },
    openAppHandler() { // 打开作业帮
      if (inQQ && isAndroid) {
        this.openApp();
      } else {
        this.showMask(1);
        this.sendLog({ type: 'WeChat-open-app-click' });
      }
    },
    openApp() { // 调起APP
      const path = `${window.location.protocol}//h5.zybang.com${window.location.pathname}${window.location.search.replace('share=1', 'share=0')}`;
      // 端外打开app
      let naLink = `homework://com.baidu.homework/web?stayApp=true&url=${encodeURIComponent(path)}`;
      if (isIos) {
        naLink = `homework://com.baidu.homework/web?stayApp=true&url=${encodeURI(path)}`;
      }
      const download = 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework';
      InvokeApp({
        downloadLink: download,
        yybLink: download,
        nativeLinkIos: naLink,
        nativeLinkAndroid: naLink,
        universalLink:
          `//oia.zybang.com/download/?page=${
            encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${path}`)}`,
      });
    },
    bouncedHandler() { // 弹框按钮事件
      this.isShowBounced = false;
      if (this.bouncedType === 1) { // 查看我的拼团
        const path = `${window.location.href.replace(`groupId=${this.groupId}`, `groupId=${this.userDoingGroupId}`)}`;
        window.location.href = path;
      } else if (this.bouncedType === 2) { // 分享
        if (inApp) {
          this.shareHandler(2); // 继续分享
          this.sendLog({ type: 'inApp-invite-continue' });
        } else {
          this.showMask(2);
          this.sendLog({ type: 'WeChat-invite-continue' });
        }
      }
    },
    showMeClass(index, isCurUser) {
      if (index > 0 && isCurUser === 1) {
        return true;
      }
      return false;
    },
    showMask(type) {
      this.isShowMask = true;
      if (type === 1) {
        this.maskObj = {
          content1: '选择用',
          content2: '浏览器打开',
        };
      } else {
        this.maskObj = {
          content1: '点击分享',
          content2: '邀请好友参团',
        };
      }
    },
    hideBounced() {
      this.isShowBounced = false;
    },
    hideMask() {
      this.isShowMask = false;
    },
    stopInterval() {
      clearInterval(this.downTimeSt);
      this.downTimeSt = 0;
    },
    sendLog(obj) {
      const parmas = Object.assign({
        uid: this.uid,
        from: this.source,
      }, obj);
      zybLog.send(parmas);
    },
  },
  created() {
    this.isInfo = this.getQueryString('type') === '1';
    this.isShare = this.getQueryString('share') === '1';
    window.document.title = this.isInfo ? '作业帮会员拼团' : '支付成功';
    if (this.isInfo) { // 查看详情
      const groupid = this.getQueryString('groupId');
      if (this.isShare) { // 端外分享
        this.getShareInfo(groupid);
        if (inWeChat) {
          this.sendLog({ type: 'WeChat-page' });
        }
        if (inQQ) {
          this.sendLog({ type: 'QQ-page' });
        }
      } else { // 端内打开
        this.getDetailInfo(groupid);
        this.sendLog({ type: 'inApp-detail' });
      }
    } else { // 支付成功
      this.getPayInfo();
      if (inApp) {
        this.sendLog({ type: 'inApp-open-success' });
      }
      if (inWeChat) { // 微信支付成功打点
        this.sendLog({ type: 'WeChat-pay-success' });
      }
    }
    if (inApp) {
      hybrid('swapBack', { enabled: false });
    } else {
      const path = `${window.location.protocol}//h5.zuoyebang.com${window.location.pathname}?inApp=0&type=1&share=1&groupId=${this.groupId}&from=${this.source}`;
      share({
        url: path, // 分享链接，一般为当前页面的链接
        content: '我刚9.9元买完，就差你了，快上车！会员享价值上万精品课程，每天仅0.3元！', // 分享内容
        title: '【限时特价】作业帮会员拼团价9.9元！', // 分享标题
        pic: 'https://yy-s.zuoyebang.cc/static/common/css/resource/logo_128x128_b10037d.png', // 分享缩略图
      });
    }
  },
  beforeDestroy() {
    if (this.downTimeSt !== 0) {
      this.stopInterval();
    }
  },
};
</script>
<style lang="less" scoped>
  .main {
    padding-top: 0.75rem;
    background: #ededed;

    .contain {
      width: 5.95rem;
      height: 7.58rem;
      margin: 0 auto 0.6rem;
      background: #fff;
      border-radius: 0.1rem;

      .top {
        width: 5.2rem;
        height: 1.94rem;
        margin: 0 auto;
        border-bottom: 0.03rem solid #eee;

        .goodsIcon {
          float: left;
          width: 1.45rem;
          height: 1.16rem;
          margin: 0.4rem auto 0;
        }

        .rightContain {
          float: left;
          font-size: 0.2rem;
          color: #b5b5b5;
          margin: 0.4rem auto 0 0.2rem;

          .prefInfo {
            display: inline-block;

            .firstLine {
              font-size: 0.3rem;
              font-weight: bold;
              color: #aaaaaa;
            }

            .secondLine {
              margin: 0.05rem;

              .personIcon {
                display: inline-block;
                width: 0.23rem;
                height: 0.19rem;
                margin-right: 0.04rem;
                background: url('../resource/person.png') no-repeat;
                background-size: contain;
              }
            }

            .price {
              display: inline-block;
              font-size: 0.3rem;
              font-weight: 700;
              color: #ff6c6b;
              margin-right: 0.1rem;
            }

            .singlePrice {
              text-decoration: line-through;
            }
          }

          .resultIcon {
            display: inline-block;
            width: 0.82rem;
            height: 0.8rem;
            margin-left: 0.2rem;
            vertical-align: bottom;
          }
          .success {
            background: url('../resource/success.png') no-repeat;
            background-size: contain;
          }
          .over {
            background: url('../resource/over.png') no-repeat;
            background-size: contain;
          }
        }

      }

      .payTop {
        height: 1.8rem;

        .title {
          position: relative;
          top: -0.2rem;
          width: 3.92rem;
          height: 0.97rem;
          line-height: 0.97rem;
          color: #fff;
          margin: 0 auto;
          text-align: center;
          font-size: 0.44rem;
          font-weight: bold;
          background: url('../resource/titleBg.png') no-repeat;
          background-size: contain;
        }
      }

      .middle {
        width: 5.2rem;
        margin: 0.57rem auto 0;

        ul {
          margin-left: 0.2rem;
          height: 1.4rem;

          .headContain {
            position: relative;
            float: left;
            margin: auto 0.2rem;

            .head {
              width: 1.2rem;
              height: 1.2rem;
              border-radius: 1.2rem;
            }
            .fill {
              border: 0.03rem solid #ffba00;
            }
            .isme {
              border: 0.03rem solid #ff403f;
            }
            .empty {
              background: url('../resource/empty-head.png') no-repeat;
              background-size: contain;
            }
            .crown {
              position: absolute;
              top: -0.35rem;
              left: -0.25rem;
              width: 0.75rem;
              height: 0.68rem;
              background: url('../resource/huangguan.png') no-repeat;
              background-size: contain;
            }
            .logo {
              position: absolute;
              top: 1rem;
              width: 1.2rem;
              height: 0.42rem;
              color: #983c13;
              font-size: 0.3rem;
              font-weight: bold;
              line-height: 0.42rem;
              background: #fdc638;
              border-radius: 0.15rem;
              text-align: center;
            }
          }
        }

        .remind {
          margin: 0.4rem auto;
          text-align: center;
          color: #000;
          font-size: 0.24rem;
          font-weight: bold;

          .timeContain {
            display: inline-block;

            span {
              display: inline-block;
              width: 0.38rem;
              height: 0.38rem;
              line-height: 0.4rem;
              color: #fff;
              font-size: 0.24rem;
              text-align: center;
              background: #ff403f;
            }
          }
        }

        .tips {
          color: #b5b5b5;
          font-size: 0.24rem;
          text-align: center;
        }

        .payTips {
          margin-top: 0.4rem;
        }
      }

      .payMiddle {
        margin: 0 auto;
      }

      .bottom {
        width: 3.8rem;
        height: 0.36rem;
        margin: 0.35rem auto 0;
        background: #f5f5f5;
        border-radius: 0.1rem;
        font-size: 0;

        .laba {
          width: 0.27rem;
          height: 0.19rem;
          margin: 0.09rem 0.15rem 0 0.3rem;
          vertical-align: top;
        }
        .rollContain {
          display: inline-block;
          width: 3rem;
          height: 100%;
          font-size: 0;

          .info {
            color: #b5b4b5;
            margin-top: 0.1rem;

            span {
              display: inline-block;
              vertical-align: top;
              font-size: 0.2rem;
            }
            .userName {
              max-width: 1.4rem;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

    }
    .payContain {
      height: 7.1rem;
    }

    .openAppBtn {
      float: right;
      width: 1.65rem;
      height: 0.5rem;
      line-height: 0.5rem;
      font-size: 0.24rem;
      font-weight: bold;
      color: #b1621d;
      margin-top: -0.3rem;
      text-align: center;
      background: #fdc638;
      border-radius: 0.25rem 0 0 0.25rem;
    }

    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 99;

      .arrow {
        float: right;
        margin-top: 0.3rem;
        margin-right: 1rem;
        width: 0.54rem;
        height: 0.6rem;
        text-align: center;
        background: url('../resource/arrow.png') no-repeat;
        background-size: contain;
        z-index: 999;
        .tip1 {
          margin-top: 0.7rem;
        }
        p {
          width: 2.2rem;
          color: #fff;
          font-size: 0.36rem;
          margin-left: -1rem;
        }
      }
    }

    .bounced {
      position: absolute;
      top: 1.73rem;
      left: 50%;
      width: 5.6rem;
      height: 4.2rem;
      margin-left: -2.8rem;
      background: #fff;
      border-radius: 0.2rem;

      .bouncedTitle {
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        background: #e5e5e5;
        text-align: center;
        font-size: 0.36rem;
        color: #535353;
        font-weight: bold;
        border-radius: 0.2rem 0.2rem 0 0;

        .closeBtn {
          float: right;
          width: 0.25rem;
          height: 0.25rem;
          margin-top: 0.3rem;
          margin-right: 0.3rem;
          background: url('../resource/close.png') no-repeat;
          background-size: contain;
        }
      }

      p {
        line-height: 0.4rem;
        text-align: center;
        font-size: 0.28rem;
        color: #535353;
      }
      .bouncedTip1 {
        margin-top: 0.8rem;
      }

      .bouncedBtn {
        margin-top: 0.4rem;
      }
    }
    .btn {
      width: 4.42rem;
      height: 1.22rem;
      line-height: 0.94rem;
      margin: 0 auto;
      color: #fff;
      font-size: 0.32rem;
      font-weight: bold;
      text-align: center;
      background: url('../resource/btnBg.png') no-repeat;
      background-size: contain;
    }

    .btnAnimation {
      animation: btnScale 1s infinite;
    }

    @keyframes btnScale {
      0%  {
          -webkit-transform: scale(1,1);
          transform: scale(1,1);
        }
      50% {
          -webkit-transform: scale(0.9,0.9);
          transform: scale(0.9,0.9);
        }
      100%  {
          -webkit-transform: scale(1,1);
          transform: scale(1,1);
        }
    }
    .topLayer {
      z-index: 999;
    }
  }
  .mainTop {
    padding-top: 1.1rem;
  }
</style>
