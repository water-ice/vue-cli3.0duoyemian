<template>
  <div class="seven">
    <div class="page-head"><img src="./resource/head.png"></div>
    <div class="seven-content">
      <div class="danmu" v-show="danmuShow">
        <ul ref="danmuOne" class="danmu-one item-danmu">
          <li v-for="(item, index) in barrage1" :key="index">{{ item }}</li>
        </ul>
        <ul ref="danmuTwo" class="danmu-two item-danmu">
          <li v-for="(item, index) in barrage2" :key="index">{{ item }}</li>
        </ul>
      </div>
      <section class="page-item task">
        <div class="title"><img src="./resource/before.png">每日任务<img src="./resource/before.png"></div>
        <div class="content">
          <div class="task-box">
            <div v-for="(item, index) in boxlist" :key="index">
              <div v-if="item.count <= 0 && item.status === 2" class="gift opened" :type="item.type"></div>
              <div v-else-if="item.count <= 0 && item.status === 0" class="gift unopen" :type="item.type"></div>
              <div v-else-if="item.count > 0 || item.status === 1"
                class="gift opening" :type="item.type" :answerNum="taskNum[index]" @click="openPrize">
              </div>
              <span v-if="item.count <= 0 && item.status === 2" class="gray">已开奖</span>
              <span v-else-if="item.count <= 0 && item.status === 0">{{taskNum[index]}}次回答</span>
              <span v-else-if="item.count > 0 || item.status === 1">等待领取(×{{item.count}})</span>
            </div>
          </div>
        </div>
      </section>
      <section class="page-item rank">
        <div class="title"><img src="./resource/before.png">被采纳排行榜<img src="./resource/before.png"></div>
        <div class="content">
          <ul class="list">
            <li v-for="(item, index) in adoptrank" :key="index">
              <b v-if="index<3"></b>
              <div v-else class="number">{{index+1}}</div>
              <div class="info">
                <img :src="item.avatar ? $compress(item.avatar,true) : avatar">
                {{item.uname}}
              </div>
              <div class="get-num">{{item.score}}</div>
            </li>
          </ul>
          <div class="mine">
            <div class="number">{{ selfinfo.rank || '暂无' }}</div>
            <div class="info">
              <img :src="selfinfo.avatar ? $compress(selfinfo.avatar, true) : avatar">
              我
            </div>
            <div class="get-num">{{selfinfo.adoptNum}}</div>
          </div>
        </div>
      </section>
      <div class="prize"><img src="./resource/prize.png"></div>
      <div class="rule"><img src="./resource/rule.png"></div>
    </div>
    <div class="fixed-bottom">
      <div class="text">
        <span>已有<em>{{totalnum}}</em>个提问被解答</span>
        <span v-if="leftTime>0">距离活动结束还有<em class="day">{{day}}</em>天<em class="hours">{{hour}}</em>时<em class="minute">{{minute}}</em>分</span>
        <span v-else-if="leftTime===0">活动已结束</span>
        <span v-else>活动未开始</span>
      </div>
      <span class="join-btn" @click="joinActivity">{{ isJoin ? '马上答题' : '加入活动' }}</span>
    </div>
    <div class="tan-mb" v-show="ifShowTan">
      <div class="tan-box">
        <b class="close" @click="closeTan"></b>
        <h3>恭喜您完成{{tanAnswerNum}}次回答</h3>
        <p>抽中{{tanBbbNum}}帮帮币 已自动入账</p>
        <p>快去答题冲刺榜单吧</p>
        <div class="tan-btn" @click="goAnswer">去答题</div>
      </div>
    </div>
    <div @touchmove="e => { e.preventDefault(); }" v-show="wxTip" @click="wxTipOperate" class="popmask">
      <div class="guide"></div>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import InvokeApp from 'plat-utils/src/invokeApp';
import share from 'plat-utils/src/share';
import zybLog from 'plat-utils/src/zybLog';
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';

export default {
  data() {
    return {
      danmuShow: false,
      barrage: [],
      barrage1: [],
      barrage2: [],
      boxlist: [],
      taskNum: [3, 7, 15],
      adoptrank: [],
      selfinfo: {},
      totalnum: 0,
      leftTime: 0,
      endTime: 0,
      day: 0,
      hour: 0,
      minute: 0,
      avatar: require('./resource/photo.png'),
      isJoin: false,
      tanAnswerNum: 0,
      tanBbbNum: 0,
      ifShowTan: false,
      wxTip: false,
      trueLeftTime: 0,
    };
  },
  created() {
    this.getPage();
    share({
      url: window.location.href, // 分享链接，一般为当前页面的链接
      content: '答题冲榜拿大奖！', // 分享内容
      title: '作业问答 7天挑战赛', // 分享标题
      pic: 'https://img.zuoyebang.cc/zyb_a708b0098c71ac5c61647f881dd3070c.png', // 分享缩略图
    });
    zybLog.send({
      type: 'pv',
    });
  },
  methods: {
    openPrize(e) {
      e.srcElement.classList.add('gift-opening');
      setTimeout(() => {
        const url = '/napi/activity/answergamelottery';
        this.$fetch({
          url,
          data: {
            type: e.target.attributes.type.nodeValue,
            activityId: 2,
          },
          method: 'post',
          formType: true,
        }).then((res) => {
          if (!res.errNo) {
            this.tanBbbNum = res.data.prize;
            this.tanAnswerNum = e.target.attributes.answerNum.nodeValue;
            this.boxlist = res.data.boxlist;
            this.ifShowTan = true;
            zybLog.send({
              type: 'boxOpen',
              index: e.target.attributes.type.nodeValue,
            });
          }
        });
      }, 1000);
    },
    getPage() {
      this.$fetch.get('/napi/activity/answergamehome?activityId=2')
        .then((res) => {
          if (!res.errNo) {
            if (res.data.barrage.length > 0) {
              this.barrage = res.data.barrage;
              Object.keys(this.barrage).forEach((key) => {
                if (key % 2 === 0) {
                  this.barrage1.push(this.barrage[key]);
                } else {
                  this.barrage2.push(this.barrage[key]);
                }
              });
              this.danmuShow = true;
            }
            if (res.data.leftTime > 0) {
              this.leftTime = res.data.leftTime;
              this.endTime = res.data.endTime;
              this.day = parseInt(this.leftTime / 86400, 10);
              const sub1 = this.day * 86400;
              this.hour = parseInt((this.leftTime - sub1) / 3600, 10);
              const sub2 = this.hour * 3600;
              this.minute = parseInt((this.leftTime - sub1 - sub2) / 60, 10);
              this.countdown();
            }
            this.boxlist = res.data.boxlist;
            this.adoptrank = res.data.adoptrank;
            this.selfinfo = res.data.selfinfo;
            this.totalnum = res.data.totalnum;
            this.isJoin = res.data.isJoin;
          }
        });
    },
    countdown() {
      const count = setInterval(() => {
        this.trueLeftTime = this.endTime - parseInt(new Date().getTime() / 1000, 10);
        if (this.trueLeftTime > 0) {
          this.trueLeftTime = this.trueLeftTime - 1;
          this.day = parseInt(this.trueLeftTime / 86400, 10);
          const sub1 = this.day * 86400;
          this.hour = parseInt((this.trueLeftTime - sub1) / 3600, 10);
          const sub2 = this.hour * 3600;
          this.minute = parseInt((this.trueLeftTime - sub1 - sub2) / 60, 10);
        } else {
          clearInterval(count);
          window.location.reload();
        }
      }, 1000);
    },
    closeTan() {
      this.ifShowTan = false;
    },
    goAnswer() {
      hybrid('unsolved_questionlist', { list: 0 });
    },
    joinActivity() {
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (!res.isLogin) {
            hybrid('loginForResult', {}, (res1) => {
              if (res1.result) {
                window.location.reload();
              }
            });
          } else {
            if (!this.isJoin) {
              const url = '/napi/activity/answergameapply';
              this.$fetch({
                url,
                data: {
                  activityId: 2,
                },
                method: 'post',
                formType: true,
              }).then(() => {
                this.getPage();
              });
              zybLog.send({
                type: 'joinActivity',
              });
            } else {
              zybLog.send({
                type: 'answer',
              });
            }
            hybrid('unsolved_questionlist', { list: 0 });
          }
        });
      } else {
        this.openNative();
      }
    },
    openNative() {
      if (inWeChat) {
        this.wxTip = true;
        return false;
      }
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
    },
    wxTipOperate() {
      this.wxTip = false;
    },
  },
};
</script>
<style lang="less" scoped>
.prefix(@prop, @val) {
  -webkit-@{prop}: @val;
  -moz-@{prop}: @val;
  -ms-@{prop}: @val;
  -o-@{prop}: @val;
  @{prop}: @val;
}
body {
  background-color: #fff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
body,html{
  height: 100%;
}
input, textarea {
  -webkit-appearance: none;
}
a, img, button, input, textarea, label, div, span {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.page-head {
  width: 100%;
  height: 8.24rem;
  img{
    width: 100%;
    height: 100%;
  }
}
.seven-content {
  width: 100%;
  padding-bottom: 1.6rem;
  background: url("./resource/bg.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.danmu {
  position: relative;
  margin-top: .4rem;
  width: 100%;
  height: 1.3rem;
  ul {
    position: absolute;
    height: .5rem;
    font-size: 0;
    left: 7.2rem;
    white-space: nowrap;
    overflow: hidden;
    li {
      display: inline-block;
      list-style-type: none;
      width: 5rem;
      height: .5rem;
      margin-right: 1.5rem;
      background: url("./resource/danmu.png") no-repeat;
      background-size: 100% 100%;
      text-indent: .3rem;
      line-height: .5rem;
      font-size: .22rem;
      color: #fff;
    }
  }
  .danmu-one {
    top: 0;
    animation: danmuMove 100s linear infinite;
    transform: translateZ(0);
  }
  .danmu-two {
    bottom: 0;
    animation: danmuMove 100s linear infinite;
    animation-delay: 1s;
    transform: translateZ(0);
  }
}
@keyframes danmuMove {
  from {left: 7.2rem;}
  to   {left: -162.5rem;}
}
.page-item {
  margin-top: .55rem;
  width: 88%;
  margin-left: 6%;
  border-radius: .2rem;
  border-bottom: .1rem solid #fff089;
  overflow: hidden;
  -webkit-box-shadow: 0.02rem 0 0.3rem #ffbf12, 0 0 0 #fff, 0.02rem 0 0.3rem #ffbf12, 0 0.02rem 0.3rem #ffbf12;
  box-shadow: 0.02rem 0 0.3rem #ffbf12, 0 0 0 #fff, 0.02rem 0 0.3rem #ffbf12, 0 0.02rem 0.3rem #ffbf12;
  .title {
    width: 100%;
    height: .65rem;
    text-align: center;
    line-height: .65rem;
    font-size: .36rem;
    font-weight: bold;
    color: #ff4200;
    background-color: #ffb400;
    border-bottom: 3px solid #ff7200;
    img {
      width: .45rem;
      height: .2rem;
      &:nth-of-type(1) {
        margin-right: .2rem;
      }
      &:nth-of-type(2) {
        margin-left: .2rem;
      }
    }
  }
}
.task {
  .content {
    width: 100%;
    padding: .2rem;
    background-color: #fff;
    box-sizing: border-box;
  }
  .task-box {
    display: flex;
    display: -webkit-flex;
    display: box-flex;
    display: -webkit-box-flex;
    width: 100%;
    height: 3.2rem;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    background: url("./resource/prize_box.png") no-repeat;
    background-size: 100% 100%;
    >div {
      flex: 1;
      -webkit-flex: 1;
      box-flex: 1;
      -webkit-box-flex: 1;
      .gift {
        width: 100%;
        height: 1.83rem;
      }
      .opened {
        background: url("./resource/opened.png") center center no-repeat;
        background-size: 80% 100%;
      }
      .opening {
        background: url("./resource/opening.png") center center no-repeat;
        background-size: 80% 100%;
      }
      .unopen {
        background: url("./resource/unopen.png") center center no-repeat;
        background-size: 80% 100%;
      }
      span {
        display: block;
        width: 100%;
        margin-top: .2rem;
        text-align: center;
        font-size: .28rem;
        font-weight: bold;
        color: #ff5400;
      }
      .gray {
        color: #666;
      }
    }
  }
}
.gift-opening{
  animation: openingMove 1s ease-out 1;
  transform: translateZ(0);
}
@keyframes openingMove {
  0%   {transform:rotate(0);}
  30%  {transform:rotate(-10deg);}
  70%  {transform:rotate(10deg);}
  100% {transform:rotate(0);}
}
.rank {
  .content {
    position: relative;
    width: 100%;
    padding-bottom: .86rem;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
  }
  .list {
    width: 100%;
    max-height: 10.55rem;
    padding: .3rem .25rem 0 .25rem;
    box-sizing: border-box;
    background-color: #fff9df;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    li {
      position: relative;
      width: 100%;
      height: 1rem;
      list-style-type: none;
      line-height: 1rem;
      border-bottom: 1px solid #e1d7ad;
      overflow: hidden;
      b {
        float: left;
        display: block;
        width: 15%;
        height: 100%;
      }
      &:nth-of-type(1) {
        b {
          background: url("./resource/no_1.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:nth-of-type(2) {
        b {
          background: url("./resource/no_2.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:nth-of-type(3) {
        b {
          background: url("./resource/no_3.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .number {
      float: left;
      width: 10%;
      height: 100%;
      margin-left: 5%;
      line-height: 1rem;
      font-size: .24rem;
      text-indent: .08rem;
      color: #333;
    }
    .info{
      float: left;
      width: 60%;
      height: 100%;
      line-height: 1rem;
      font-size: .3rem;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      img {
        width: .6rem;
        height: .6rem;
        margin: 0 .15rem;
        border-radius: .3rem;
      }
    }
    .get-num {
      float: right;
      width: 20%;
      margin-right: 5%;
      text-align: right;
      line-height: 1rem;
      font-size: .24rem;
      color: #ff4f20;
    }
  }
}
.mine {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  height: .85rem;
  padding: 0 .25rem;
  border-top: 1px solid #e1d7ad;
  box-sizing: border-box;
  overflow: hidden;
  .number {
    float: left;
    width: 10%;
    height: 100%;
    margin-left: 5%;
    line-height: .85rem;
    font-size: .24rem;
    color: #333;
  }
  .get-num {
    float: right;
    width: 10%;
    margin-right: 5%;
    text-align: right;
    line-height: .85rem;
    font-size: .24rem;
    color: #ff4f20;
  }
  .info {
    float: left;
    width: 70%;
    height: 100%;
    line-height: .85rem;
    font-size: .3rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    img {
      width: .6rem;
      height: .6rem;
      margin: 0 .15rem;
      border-radius: .3rem;
    }
  }
}
.prize {
  width: 97%;
  height: 8rem;
  margin-left: 1.5%;
  margin-top: .55rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.rule {
  width: 100%;
  height: 9.22rem;
  margin-top: .65rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.fixed-bottom {
  position: fixed;
  width: 100%;
  height: 1.6rem;
  left: 0;
  bottom: 0;
  padding: .2rem .25rem .1rem .25rem;
  background-color: #fff;
  box-sizing: border-box;
  .text {
    margin-bottom: .15rem;
    font-size: .22rem;
    color: #666;
    overflow: hidden;
    >span {
      &:nth-of-type(1) {
        float: left;
      }
      &:nth-of-type(2) {
        float: right;
      }
    }
    em {
      font-weight: normal;
      color: #ff9230;
    }
  }
  .join-btn {
    display: block;
    width: 3.8rem;
    height: .8rem;
    margin: 0 auto;
    border-radius: .4rem;
    text-align: center;
    line-height: .8rem;
    font-size: .32rem;
    color: #fff;
    font-weight: bold;
    border-bottom: .05rem solid #ffdd1f;
    background-color: #ff8212;
  }
}
.tan-mb {
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .tan-box {
    position: absolute;
    left: 8%;
    top: 50%;
    width: 84%;
    height: 5.32rem;
    background: url("./resource/tan.png") no-repeat;
    background-size: 100% 100%;
    .prefix(transform, translateY(-50%));
    overflow: hidden;
    .close {
      position: absolute;
      top: 1rem;
      right: .1rem;
      width: .24rem;
      height: .24rem;
      background: url("./resource/close.png") no-repeat;
      background-size: 100% 100%;
    }
    h3 {
      margin-top: 2.6rem;
      margin-bottom: .3rem;
      font-size: .36rem;
      font-weight: bold;
      color: #e01818;
      text-align: center;
    }
    p {
      margin-bottom: .1rem;
      font-size: .26rem;
      color: #ff660a;
      text-align: center;
    }
    .tan-btn {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: .9rem;
      font-size: .32rem;
      font-weight: bold;
      color: #ff660a;
      text-align: center;
      line-height: .9rem;
      border-radius: 0 0 .2rem .2rem;
      box-sizing: border-box;
      background-color: #fff;
    }
  }
}
.popmask{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, .7);
  overflow: hidden;
  z-index: 99;
  .guide {
    width: 7.2rem;
    height: 2.25rem;
    background: url("./resource/guide.png") no-repeat;
    background-size: contain;
    position: absolute;
    top: 10%;
  }
}
</style>
