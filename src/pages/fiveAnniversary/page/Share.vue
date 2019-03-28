<template>
  <div class="page">
    <div class="bgImg">
      <!-- <img src="../img/share.png"> -->
      <div class="rules" @click="showRules">活动规则</div>
    </div>
    <modal-com :visible.sync="rulesShow" :headTxt="`组队规则`" :secondary="false" :majTxt="`知道了`" :w="`5.1rem`">
      <div class="intro">
        <p><span>活动时间：</span>1月7日 - 1月20日</p>
        <p style="margin:.2rem 0 .1rem 0"><span>活动规则:</span></p>
        <p><i>1</i>完成首次组队将获得20能量；</p>
        <p><i>2</i>每有一人入队可获得20能量，每日</p>
        <p class='space'>组队最多可得100能量；</p>
        <p><i>3</i>组队能量将在24:00自动发放</p>
        <p class="foot">
          *本活动最终解释权归作业帮所有
        </p>
      </div>
    </modal-com>
    <div class="invite">
      <div v-html="inviteMessage" class="inviteMessage"></div>
      <div class="avatars">
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
        <div class="avatar"></div>
      </div>
      <div class="inviteSteps">
        <div class="startline" :class="{active: lastTeamInfo.teamUser.length >= 1}"></div>
        <div class="invitenormal" :class="{active: lastTeamInfo.teamUser.length >= 1}"></div>
        <div class="midline" :class="{active: lastTeamInfo.teamUser.length >= 2}"></div>
        <div class="midline" :class="{active: lastTeamInfo.teamUser.length >= 3}"></div>
        <div class="invitenormal" :class="{active: lastTeamInfo.teamUser.length >= 3}"></div>
        <div class="midline" :class="{active: lastTeamInfo.teamUser.length >= 4}"></div>
        <div class="midline" :class="{active: lastTeamInfo.teamUser.length >= 5}"></div>
        <div class="invitenormal" :class="{active: lastTeamInfo.teamUser.length >= 5}"></div>
      </div>
      <div class="powerDesc">
        <span>20能量</span>
        <span>60能量</span>
        <span>100能量</span>
      </div>
      <div class="button finished" v-if="isEnd">
        组队已截止
      </div>
      <div class="button finished" v-if="!isEnd && isSuccess">
        组队已成功
      </div>
      <div class="button finished" v-if="!isEnd && !isSuccess && userInfo.isMember">
        已入队
      </div>
      <div class="button" @click="joinTeam" v-if="!isEnd && !isSuccess && !userInfo.isMember && inapp">
        加入队伍
      </div>
      <div class="button" @click="openApp" v-if="!isEnd && !isSuccess && !userInfo.isMember && !inapp">
        打开APP加入队伍
      </div>
    </div>
    <div class="friendsRecord" v-if="lastTeamInfo.teamUser.length > 0">
      <p>好友入队记录</p>
      <div class="list" v-for="(person, index) in lastTeamInfo.teamUser" :key="index">
        <img :src="person.avatar?person.avatar:'https://www.zybang.com/five/defaultAva.png'" />
        <span class="nickname">{{ person.uname }}</span>
        <span class="time">{{ person.createTime }}</span>
      </div>
    </div>
    <div class='bubble' @touchmove='e => {e.preventDefault()}' v-show="bubble" @click="bubble = false">
          <div class="guide"></div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import InvokeApp from 'plat-utils/src/invokeApp';
import zybLog from 'plat-utils/src/zybLog';
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';
// eslint-disable-next-line
import hybrid from 'plat-utils/src/hybrid';
import Toast from '../../../components/Toast';
import Bus from './Bus/';

export default {
  name: 'Share',
  data() {
    return {
      // 当前时间
      currentTime: null,
      // 是否在App中
      inapp: 0,
      // 当前是否登录
      isLogin: 0,
      // 规则弹窗
      rulesShow: false,
      // 登陆人信息
      userInfo: {
        // 登陆人是否是队员
        isMember: 0,
        // 登陆人是否为其他队员
        hasOtherTeam: 0,
        // 登陆人是否是队长
        isLeader: 0,
      },
      // 队伍信息
      lastTeamInfo: {
        // 队伍ID
        teamId: '',
        // 队伍成员信息
        teamUser: [],
      },
      // 上次组队是否结束
      isEnd: 0,
      // 上次组队是否成功
      isSuccess: 0,
      // 气泡
      bubble: false,
    };
  },
  computed: {
    // 组队邀请文案
    inviteMessage() {
      const map = new Map();
      const processing = [1, 2, 3, 4];
      map.set(0, `<p>每日邀请<span style="color:rgb(255, 78, 60)"> 5 </span>个好友,
       获得<span style="color:rgb(255, 78, 60)"> 100 </span>能量</p>`);
      processing.forEach((item) => {
        map.set(item, `<p>再邀请<span style="color:rgb(255, 78, 60)"> ${5 - item} </span>个好友,
         可获得<span style="color:rgb(255, 78, 60)"> 100 </span>能量</p>`);
      });
      map.set(5, '<p>恭喜你, 组队成功 !</p>');
      return map.get(this.lastTeamInfo.teamUser.length);
    },
  },
  methods: {
    // 显示规则
    showRules() {
      zybLog.send({ type: 'Team-rules' });
      this.rulesShow = true;
      console.log('this.rulesShow: ', this.rulesShow);
    },
    // 初始化页面
    init() {
      this.lastTeamInfo.teamId = this.$route.query.teamId;
      this.$fetch({
        url: `/activity/fiveyears/teammemberpage?teamId=${this.lastTeamInfo.teamId}`,
      }).then((res) => {
        if (res.errNo === 0) {
          this.isLogin = res.data.result.isLogin;
          this.userInfo.uname = res.data.result.uname;
          this.userInfo.avatar = res.data.result.avatar;
          this.currentTime = new Date(res.data.result.currentTime);
          this.lastTeamInfo.teamId = res.data.result.lastTeamInfo.teamId;
          this.lastTeamInfo.teamUser = res.data.result.lastTeamUserList;
          this.isEnd = res.data.result.isEnd;
          this.userInfo.isMember = res.data.result.isMember;
          this.userInfo.hasOtherTeam = res.data.result.hasOtherTeam;
          this.userInfo.isLeader = res.data.result.isLeader;
          this.isSuccess = (res.data.result.lastTeamInfo.teamCount === 5);
          // 替换头像
          const avatars = document.querySelectorAll('div.avatar');
          this.lastTeamInfo.teamUser.forEach((item, index) => {
            avatars[index].style.backgroundImage = `url(${item.avatar ? item.avatar : 'https://www.zybang.com/five/defaultAva.png'})`;
          });
        }
      });
      if (inApp) {
        this.inapp = 1;
      } else {
        this.inapp = 0;
      }
    },
    // 唤醒App
    openApp() {
      zybLog.send({ type: 'Team-join-click' });
      if (inWeChat) {
        this.inapp = 0;
        Bus.$emit('wxGuide');
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
    // 加入队伍
    joinTeam() {
      if (this.userInfo.isLeader === 1) {
        Toast('您是队长,不能入队哦~');
      } else if (this.userInfo.hasOtherTeam === 1) {
        Toast('您已加入其他队伍,不能再加入队伍');
      } else {
        this.$fetch({
          url: `/activity/fiveyears/teamadduser?teamId=${this.lastTeamInfo.teamId}`,
        }).then((res) => {
          if (res.errNo === 0) {
            if (res.data.result === true) {
              Toast('入队成功!');
              this.init();
            }
          }
        });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.page {
  font-size: 0;
  overflow-x: hidden;
  position: relative;
  height: 100vh;
  user-select: none;
  .intro {
    span {
      font-weight: 550;
    }
    p {
      font-size: .26rem;
      line-height: .35rem;
      height: .35rem;
      &.space {
        margin-left: .4rem;
      }
    }
    i {
      display: inline-block;
      width: .3rem;
      height: .3rem;
      line-height: .3rem;
      border-radius: .15rem;
      text-align: center;
      color: #fff;
      background: #ff4e3c;
      font-style: normal;
      margin-right: .1rem;
    }
    .foot {
      font-size: .24rem;
      color: #999999;
      text-align: center;
      margin-top: .6rem;
    }
  }
  .bgImg {
    width: 100%;
    height: 5rem;
    position: relative;
    background: url('../img/share.png') no-repeat;
    background-size: 100% auto;
    // img {
    //   width: 100vw;
    //   user-select: none;
    // }
    .rules {
      width: 1.2rem;
      height: .48rem;
      border-radius: .24rem;
      background-color: rgb(253, 71, 0);
      color: white;
      font-size: .24rem;
      line-height: .48rem;
      text-align: center;
      position: absolute;
      top: .3rem;
      left: 5.7rem;
    }
  }
  .invite {
    width: 6.6rem;
    height: 4.2rem;
    position: absolute;
    left: .3rem;
    top: 4.15rem;
    background-color: white;
    border-radius: .12rem;
    box-shadow: .01rem .04rem rgb(237, 237, 237);
    font-size: .3rem;
    .inviteMessage {
      display: flex;
      justify-content: center;
      margin-top: .38rem;
      font-weight: bold;
    }
    .avatars {
      display: flex;
      justify-content: space-around;
      position: absolute;
      left: .7rem;
      top: 1.3rem;
      width: 5.2rem;
      .avatar {
        background-image: url('../img/circleplus.png');
        background-position: center;
        background-size: contain;
        border-radius: 50%;
        height: .8rem;
        width: .8rem;
      }
    }
    .inviteSteps {
      position: absolute;
      top: 2.3rem;
      left: .6rem;
      div {
        background-color: rgb(230, 230, 230);
      }
      .midline {
        height: 1px;
        position: absolute;
        top: .05rem;
        width: 1rem;
      }
      .active {
        background-color: rgb(0, 195, 255);
      }
      .invitenormal {
        height: .1rem;
        width: .1rem;
        border-radius: 50%;
      }
      div:nth-child(1) {
        height: 1px;
        width: .4rem;
        position: absolute;
        left: .25rem;
        top: .05rem;
      }
      div:nth-child(2) {
        position: absolute;
        left: .55rem;
      }
      div:nth-child(3) {
        left: .65rem;
      }
      div:nth-child(4) {
        left: 1.65rem;
      }
      div:nth-child(5) {
        position: absolute;
        left: 2.62rem;
      }
      div:nth-child(6) {
        left: 2.75rem;
      }
      div:nth-child(7) {
        left: 3.75rem;
      }
      div:nth-child(8) {
        position: absolute;
        left: 4.74rem;
      }
      // .startline {
      //   width: .4rem;
      //   height: .01rem;
      // }
    }
    .powerDesc {
      font-size: .2rem;
      color: rgb(255, 78, 60);
      position: absolute;
      top: 2.5rem;
      left: .9rem;
      span:nth-child(2) {
        position: absolute;
        left: 2rem;
        width: 1rem;
      }
      span:nth-child(3) {
        position: absolute;
        left: 4.1rem;
        width: 1rem;
      }
    }
    .button {
      height: .8rem;
      position: absolute;
      padding: 0 .35rem 0 .35rem;
      top: 3rem;
      left: 50%;
      transform: translateX(-50%);
      border-radius: .4rem;
      background-color: rgb(255, 59, 43);
      color: white;
      font-size: .3rem;
      text-align: center;
      line-height: .8rem;
    }
    .button.finished {
      background-color: rgb(230, 230, 230);
      color: rgb(164, 154, 155);
      font-size: .24rem;
    }
  }
  .friendsRecord {
    width: 6.6rem;
    padding-bottom: .35rem;
    left: .3rem;
    top: 8.55rem;
    position: absolute;;
    background-color: white;
    border-radius: .12rem;
    box-shadow: .04rem .1rem rgb(237, 237, 237);
    font-size: .24rem;
    margin-bottom: .2rem;
    .list {
      margin-top: .3rem;
      img {
        width: .6rem;
        height: .6rem;
        margin-left: .4rem;
        border-radius: 50%;
      }
      .nickname {
        font-weight: bold;
        margin-left: .22rem;
      }
      .time{
        font-size: .2rem;
        margin-right: .42rem;
        margin-top: .1rem;
        float: right;
      }
    }
    p {
      font-size: .3rem;
      text-align: center;
      font-weight: bold;
      margin-top: .38rem;
    }
  }
  .bubble {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.6);
    .guide {
      width: 7.2rem;
      height: 2.25rem;
      background: url("../img/guide.png") no-repeat;
      background-size: contain;
      position: absolute;
      top: 10%;
    }
  }
}
</style>

