<template>
  <div class="Team">
    <div class="bgOrange">
      <img src="../img/banner.png" draggable="false">
      <img src="../img/qu.png" @click="toRules">
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
      <p v-if="lastTeamInfo.teamUser.length === 0" class="text">
        每日邀请
        <span>5</span>个好友,获得
        <span>100</span>能量
      </p>
      <p v-else-if="(0 < lastTeamInfo.teamUser.length) && (lastTeamInfo.teamUser.length < 5)" class="text">
        再邀请
        <span>{{5-lastTeamInfo.teamUser.length}}</span>个好友,可获得
        <span>100</span>能量
      </p>
      <p v-else class="text">恭喜你, 组队成功 !</p>
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
      <div class="button" @click="invite" v-if="lastTeamInfo.teamUser.length < 5">邀请好友入队</div>
      <div class="button_text" v-if="lastTeamInfo.teamUser.length === 5">能量将在今日24:00发放到 "我的能量"</div>
    </div>
    <div class="friendsRecord" v-if="lastTeamInfo.teamUser.length > 0">
      <p>好友入队记录</p>
      <div class="list" v-for="(person, index) in lastTeamInfo.teamUser" :key="index">
        <img :src="person.avatar?person.avatar:'https://www.zybang.com/five/defaultAva.png'">
        <span class="nickname">{{ person.uname }}</span>
        <span class="time">{{ person.createTime }}</span>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import InvokeApp from 'plat-utils/src/invokeApp';
import zybLog from 'plat-utils/src/zybLog';
// eslint-disable-next-line
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';
// eslint-disable-next-line
import hybrid from 'plat-utils/src/hybrid';
import Bus from '../page/Bus/';

export default {
  name: 'Team',
  methods: {
    // 实时更新信息
    updateInfo(partNum, currentEnergy) {
      this.people = partNum;
      this.power = currentEnergy;
    },
    // 唤醒App
    openApp() {
      if (inWeChat) {
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
    // 邀请好友入队
    invite() {
      zybLog.send({ type: 'Team-invite' });
      const shareConfig = {
        share_title: '作业帮五周年',
        share_text: '组队得能量，就差你啦，加入我的队伍，一起领福利!',
        share_img: 'https://img.zuoyebang.cc/zyb_7466d449e0ed87a2ca76563dfa19741b.png',
        share_url: `https://${window.location.host}/plat/activity-vue/fiveAnniversary.html#/Share?teamId=${
          this.lastTeamInfo.teamId
        }`,
      };
      // 如果没有在app中，尝试唤醒app
      if (!inApp) {
        this.$emit('openApp');
        return 0;
      } else if (!this.isLogin) {
        hybrid('login');
      } else if (this.isEnd === 1) {
        // 若还没创建队伍，就先创建队伍
        this.$fetch({
          url: '/activity/fiveyears/teamcreate',
        }).then((resp) => {
          if (resp.errNo === 0) {
            this.lastTeamInfo.teamId = resp.data.result.teamId;
            shareConfig.share_url = `http://${window.location.host}/plat/activity-vue/fiveAnniversary.html#/Share?teamId=${
              this.lastTeamInfo.teamId
            }`;
            this.isEnd = 0;
            hybrid('share', shareConfig);
          }
        });
      } else {
        hybrid('share', shareConfig);
      }
    },
    // 点击我的能量
    toPower() {
      // this.$router.push('/MyEnergy');
      const before = window.location;
      hybrid('openWindow', {
        url: `${before.origin}${before.pathname}#/MyEnergy`,
      });
    },
    // 点击规则
    toRules() {
      // console.log('to rules');
      zybLog.send({ type: 'Team-rules' });
      this.rulesShow = true;
    },
    // 根据当前时间判断活动进展
    getProcess(time) {
      const current = new Date(time);
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      const day = current.getDate();
      if (year === 2018) {
        if (month === 1) {
          if (day >= 7) {
            this.currentStep = 1;
          } else if (day >= 10) {
            this.currentStep = 2;
          } else if (day >= 15) {
            this.currentStep = 3;
          } else {
            this.currentStep = 4;
          }
        }
      }
    },
  },
  data() {
    return {
      // 当前登录人信息
      userInfo: {},
      // 当前活动进展
      currentStep: 0,
      // 队伍信息
      lastTeamInfo: {
        // 队伍ID
        teamId: '',
        // 队伍成员信息
        teamUser: [],
        // 队伍创建时间
        createTime: '',
      },
      // 上次组队是否结束
      isEnd: 0,
      // 弹窗显示
      rulesShow: false,
    };
  },
  mounted() {
    this.$fetch({
      url: '/activity/fiveyears/teamleaderpage',
    }).then((res) => {
      if (res.errNo === 0) {
        this.lastTeamInfo.teamUser = res.data.result.lastTeamUserList;
        // 替换头像
        const avatars = document.querySelectorAll('div.avatar');
        this.lastTeamInfo.teamUser.forEach((item, index) => {
          avatars[index].style.backgroundImage = `url(${item.avatar ? item.avatar : 'https://www.zybang.com/five/defaultAva.png'})`;
        });
        this.lastTeamInfo.createTime = res.data.result.lastTeamInfo.date;
        this.lastTeamInfo.teamId = res.data.result.lastTeamInfo.teamId;
        this.isEnd = res.data.result.isEnd;
        this.power = res.data.result.currentEnergy;
        this.currentTime = res.data.result.currentTime;
        this.isLogin = res.data.result.isLogin;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.Team {
  min-height: 4rem;
  min-width: 100%;
}
.bgOrange {
 position: relative;
 top: -.05rem;
  img:nth-child(1) {
    width: 100vw;
    position: relative;
    z-index: -1;
    top: -.542rem;
    user-select: none;
  }
  img:nth-child(2) {
    height: .36rem;
    width: .36rem;
    position: absolute;
    left: 6.5rem;
    top: .31rem;
  }
  p {
    font-size: 0.48rem;
    text-align: center;
    color: #fff;
    padding-top: 0.65rem;
  }
  .question {
    height: 0.36rem;
    width: 0.36rem;
  }
}
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
.invite {
  width: 6.6rem;
  height: 4.2rem;
  position: relative;
  top: -1.93rem;
  background-color: white;
  border-radius: 0.12rem;
  box-shadow: 0 .04rem 0.1rem 0 rgba($color: #000000, $alpha: .06);
  font-size: 0.3rem;
  margin: 0 auto;
  p {
    font-weight: bold;
    padding-top: 0.37rem;
    text-align: center;
    span {
      color: rgb(255, 78, 60);
      margin: 0 0.1rem;
    }
  }
  .avatars {
    display: flex;
    justify-content: space-around;
    position: absolute;
    left: 0.7rem;
    top: 1.3rem;
    width: 5.2rem;
    .avatar {
      background-image: url("../img/circleplus.png");
      background-position: center;
      background-size: contain;
      border-radius: 50%;
      height: 0.8rem;
      width: 0.8rem;
    }
  }
  .inviteSteps {
    position: absolute;
    top: 2.3rem;
    left: 0.6rem;
    div {
      background-color: rgb(230, 230, 230);
    }
    .midline {
      height: 1px;
      position: absolute;
      top: 0.05rem;
      width: 1rem;
    }
    .active {
      background-color: rgb(0, 195, 255);
    }
    .invitenormal {
      height: 0.1rem;
      width: 0.1rem;
      border-radius: 50%;
    }
    div:nth-child(1) {
      height: 1px;
      width: 0.4rem;
      position: absolute;
      left: 0.25rem;
      top: 0.05rem;
    }
    div:nth-child(2) {
      position: absolute;
      left: 0.55rem;
    }
    div:nth-child(3) {
      left: 0.65rem;
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
    font-size: 0.2rem;
    color: rgb(255, 78, 60);
    position: absolute;
    top: 2.5rem;
    left: 0.9rem;
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
    height: 0.8rem;
    width: 2.4rem;
    position: absolute;
    top: 3rem;
    left: 2.1rem;
    border-radius: 0.4rem;
    background-color: rgb(255, 59, 43);
    color: white;
    font-size: 0.3rem;
    text-align: center;
    line-height: 0.8rem;
  }
  .button_text {
    background-color: #fff;
    color: rgb(157, 148, 146);
    font-size: .24rem;
    width: 100%;
    position: absolute;
    top: 3rem;
    border-radius: .4rem;
    background-color: #fff;
    color: rgb(157,148,146);
    font-size: .24rem;
    text-align: center;
    line-height: .8rem;
  }
}
.friendsRecord {
  width: 6.6rem;
  padding-bottom: 0.35rem;
  position: absolute;
  left: 0.3rem;
  top: 16.4rem;
  background-color: white;
  border-radius: 0.12rem;
  box-shadow: 0 .04rem 0.1rem 0 rgba($color: #000000, $alpha: .06);
  font-size: 0.24rem;
  margin-bottom: 0.2rem;
  .list {
    margin-top: 0.3rem;
    img {
      width: 0.6rem;
      height: 0.6rem;
      margin-left: 0.4rem;
      border-radius: 50%;
    }
    .nickname {
      font-weight: bold;
      margin-left: 0.22rem;
    }
    .time {
      font-size: 0.2rem;
      margin-right: 0.42rem;
      float: right;
      line-height: 0.6rem;
    }
  }
  p {
    font-size: 0.3rem;
    text-align: center;
    font-weight: bold;
    margin-top: 0.38rem;
  }
}
</style>
