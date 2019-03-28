<template>
  <div class="answer" :style="{ backgroundColor : backgroundColor }">
    <div class="page-head">
      <img v-if="activity.page1" :src="activity.page1">
      <div v-if="status" class="join-btn" @click="joinClick">{{ isJoin ? '快去答题吧' : '加入答题团' }}</div>
      <div v-else class="join-btn finish"></div>
      <div class="countdown" v-if="status">
        {{ `已有${totalCount}个提问被解答` }}<br/>
        {{ `距离活动结束还有${day}天${hour}时${minute}分${second}秒` }}
      </div>
      <div class="countdown" v-else>
        {{ '活动已结束' }}
      </div>
    </div>
    <div class="page-content">
      <div class="rank-box">
        <div class="title"></div>
        <div class="title-text">·点击答题团头像查看团队主页 可加入<em>官方QQ群</em>与团友互动</div>
        <div class="rank">
          <div class="tab">
            <div :style="tabBox" v-for="(tab,index) in tabs" :key="index" @click="changeTab(index)">
              <div :style="tabActive == index ? tabCur : ''">{{ tab }}</div>
            </div>
          </div>
          <ul v-for="(list, index) in rankList" :key="index" v-show="index == tabActive">
            <li v-for="(item, index) in list" :key="index" :class="{ mine:item.id == communityId }" @click="goAnswerTeam(item.id)">
              <div>
                <div class="rank-num">{{ index+1 }}</div>
                <div class="info">
                  <img :src="item.portrait ? $compress(item.portrait, true) : avatar">
                  {{ item.name }}
                </div>
                <div class="get-num">{{ item.bonus }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="bottom-pic"><img v-if="activity.page2" :src="activity.page2"></div>
    </div>
    <outsideGuide v-show="wxTip" @wxGuide="wxGuideShow"></outsideGuide>
    <gradeSubject :mainColor="activity.colorM" v-show="chooseGrade" @showGrade="ifShowGrade"></gradeSubject>
    <!-- <userInfo :mainColor="activity.colorM" v-show="fillInfo" @showInfoTan = "ifShowInfo" @showGrade="ifShowGrade"></userInfo> -->
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import share from 'plat-utils/src/share';
import zybLog from 'plat-utils/src/zybLog';
import InvokeApp from 'plat-utils/src/invokeApp';
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';
import gradeSubject from '../components/gradeSubject/gradeSubject.vue';
// import userInfo from '../components/userInfo/userInfo.vue';
import outsideGuide from '../../../components/outsideGuide/outsideGuide.vue';

export default {
  data() {
    return {
      chooseGrade: false,
      fillInfo: false,
      wxTip: false,
      initStatus: 0,
      tabActive: 1,
      tabs: { 1: '小学', 2: '初中', 3: '高中' },
      isJoin: 0,
      // isApply: 0,
      communityId: 0,
      activity: {},
      rankList: {},
      leftTime: 0,
      endTime: 0,
      status: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      totalCount: '',
      avatar: require('../resource/photo.png'),
      backgroundColor: '',
      tabBox: {
        color: '',
      },
      tabCur: {
        backgroundColor: '',
        color: '#fff',
      },
    };
  },
  components: {
    gradeSubject,
    // userInfo,
    outsideGuide,
  },
  created() {
    window.fePageResume = () => {
      this.pageInit();
      this.chooseGrade = false;
    };
    this.pageInit();
    share({
      url: window.location.href, // 分享链接，一般为当前页面的链接
      content: '组团冲榜瓜分海量帮帮币！', // 分享内容
      title: '作业问答 答题团体赛', // 分享标题
      pic: 'https://yy-s.zuoyebang.cc/zuoyebang/article/resource/logo.png', // 分享缩略图
    });
    zybLog.send({
      type: 'pv',
    });
  },
  methods: {
    ifShowGrade(chooseGrade) {
      this.chooseGrade = chooseGrade;
    },
    // 个人信息弹窗暂不弹出
    // ifShowInfo(fillInfo) {
    //   this.fillInfo = fillInfo;
    // },
    changeTab(i) {
      this.tabActive = i;
    },
    wxGuideShow(wxTip) {
      this.wxTip = wxTip;
    },
    pageInit() {
      this.$fetch.get('/napi/activity/answercommunityhomepage')
        .then((res) => {
          if (!res.errNo) {
            const data = res.data || {};
            this.isJoin = data.isJoin;
            // this.isApply = res.data.isApply;
            this.communityId = data.communityId;
            this.activity = data.activity;
            this.rankList = data.rankList;
            this.tabBox.color = this.activity.colorM;
            this.tabCur.backgroundColor = this.activity.colorM;
            this.backgroundColor = this.activity.colorS;
            this.totalCount = data.totalCount;
            this.status = this.activity.status;
            if (res.data.gradeId && !this.initStatus) {
              this.tabActive = data.gradeId;
              this.initStatus = 1;
            }
            if (this.activity.leftTime > 0) {
              this.leftTime = this.activity.leftTime;
              this.endTime = this.activity.endTime;
              this.day = parseInt(this.leftTime / 86400, 10);
              const sub1 = this.day * 86400;
              this.hour = parseInt((this.leftTime - sub1) / 3600, 10);
              const sub2 = this.hour * 3600;
              this.minute = parseInt((this.leftTime - sub1 - sub2) / 60, 10);
              const sub3 = this.minute * 60;
              this.second = parseInt(this.leftTime - sub1 - sub2 - sub3, 10);
              this.countdown();
            }
          }
        });
    },
    joinClick() {
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (!res.isLogin) {
            hybrid('loginForResult', {}, (res1) => {
              if (res1.result) {
                this.pageInit();
              }
            });
          } else if (this.isJoin) {
            hybrid('unsolved_questionlist', { list: 0 });
            zybLog.send({
              type: 'goAnswer',
              page: 'index',
            });
          } else {
            this.chooseGrade = true;
            zybLog.send({
              type: 'gradeWindowShow',
              page: 'index',
            });
          }
          // else if (this.isApply) {
          //   this.chooseGrade = true;
          //   zybLog.send({
          //     type: 'gradeWindowShow',
          //     page: 'index',
          //   });
          // } else {
          //   this.fillInfo = true;
          //   zybLog.send({
          //     type: 'infoWindowShow',
          //     page: 'index',
          //   });
          // }
        });
      } else {
        this.openNative();
      }
      zybLog.send({
        type: 'joinClick',
        page: 'index',
      });
    },
    countdown() {
      this.trueLeftTime = this.endTime - parseInt(new Date().getTime() / 1000, 10);
      const chaTime = this.leftTime - this.trueLeftTime;
      const count = setInterval(() => {
        this.trueLeftTime = this.endTime - parseInt(new Date().getTime() / 1000, 10);
        const remainTime = chaTime + this.trueLeftTime;
        if (remainTime > 0) {
          this.day = parseInt(remainTime / 86400, 10);
          const sub1 = this.day * 86400;
          this.hour = parseInt((remainTime - sub1) / 3600, 10);
          const sub2 = this.hour * 3600;
          this.minute = parseInt((remainTime - sub1 - sub2) / 60, 10);
          const sub3 = this.minute * 60;
          this.second = parseInt(remainTime - sub1 - sub2 - sub3, 10);
        } else {
          clearInterval(count);
          this.pageInit();
        }
      }, 1000);
    },
    goAnswerTeam(team) {
      if (inApp) {
        hybrid('openWindow', {
          url: `${window.location.origin}/plat/activity-vue/answerTeam.html?communityId=${team}`,
        });
        zybLog.send({
          type: 'photoClick',
          community: this.communityId,
        });
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
  },
};
</script>
<style lang="less" scoped>
  body {
    background-color: #e79863;
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
  .answer {
    position: relative;
    // background-color: #ffd24a;
    overflow: hidden;
  }
  .page-head {
    position: relative;
    width: 100%;
    img {
      width: 100%;
      height: auto;
    }
    .join-btn {
      position: absolute;
      left: 50%;
      bottom: 1.4rem;
      z-index: 2;
      width: 3.16rem;
      height: .96rem;
      margin-left: -1.58rem;
      line-height: .85rem;
      text-align: center;
      color: #fff;
      font-size: .3rem;
      font-weight: bold;
      background: url("../resource/index_btn.png") no-repeat;
      background-size: 100% 100%;
      &.finish {
        background: url("../resource/finish_btn.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .countdown {
    position: absolute;
    bottom: .4rem;
    width: 100%;
    height: .7rem;
    line-height: .35rem;
    color: #3e3334;
    font-size: .22rem;
    text-align: center;
  }
  .rank-box {
    .title {
      width: 100%;
      height: .55rem;
      background: url("../resource/rank_title.png") center center no-repeat;
      background-size: auto 100%;
    }
    .title-text {
      margin: .2rem 0 .4rem 0;
      font-size: .18rem;
      color: #666;
      text-align: center;
      em {
        font-weight: normal;
        color: #ff5400;
      }
    }
    .rank {
      position: relative;
      z-index: 2;
      width: 88%;
      margin-left: 6%;
      border-radius: .2rem;
      box-shadow: 0.02rem 0 0.3rem #e79863, 0 0 0 #fff, 0.02rem 0 0.3rem #e79863, 0 0.02rem 0.3rem #e79863;
      background-color: #fff;
      border-bottom: .12rem solid #e79863;
      overflow: hidden;
      .tab {
        display: flex;
        width: 100%;
        height: .8rem;
        background-color: #ffe8b2;
        >div {
          flex: 1;
          div {
            width: 1.4rem;
            height: .58rem;
            margin: .12rem auto;
            border-radius: .29rem;
            text-align: center;
            font-weight: bold;
            font-size: .32rem;
            line-height: .6rem;
            background-color: inherit;
            // color: #ff5400;
          }
          // .cur {
          //   background-color: #ff5400;
          //   color: #fff;
          // }
        }
      }
      ul {
        width: 100%;
        max-height: 10rem;
        margin-top: .2rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        li {
          width: 100%;
          list-style-type: none;
          padding: 0 .25rem;
          box-sizing: border-box;
          overflow: hidden;
          >div {
            width: 100%;
            height: 1rem;
            border-bottom: 1px solid #e1d7ad;
            box-sizing: border-box;
            .rank-num {
              float: left;
              width: 10%;
              height: 100%;
              margin-left: 5%;
              line-height: 1rem;
              font-size: .22rem;
              color: #333;
            }
            .info{
              float: left;
              width: 60%;
              height: 100%;
              line-height: 1rem;
              font-size: .26rem;
              color: #666;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              img {
                width: .8rem;
                height: .8rem;
                margin: 0 .2rem;
                border-radius: .4rem;
              }
            }
            .get-num {
              float: right;
              width: 20%;
              margin-right: 5%;
              text-align: right;
              line-height: 1rem;
              font-size: .16rem;
              color: #666;
            }
          }
          &:last-child {
            >div {
              border-bottom: none;
            }
          }
        }
        .mine {
          background-color: #fff9df;
        }
      }
    }
  }
  .bottom-pic {
    width: 100%;
    margin-top: .6rem;
    img {
      width: 100%;
      height: auto;
    }
  }
</style>
