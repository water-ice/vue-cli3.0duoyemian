<template>
  <div class="team" @click="hideMore" :style="{ backgroundColor : activity.colorS }">
    <div class="team-head">
      <b class="more" @click="showMore"></b>
      <ul class="more-list" v-show="moreShow">
        <li @click="sharePage"><img src="../resource/invite.png">邀请好友</li>
        <li v-show="isMember" @click="exitClick"><img src="../resource/exit.png">退出社团</li>
      </ul>
      <div class="team-pic"><img v-if="community.portrait" :src="community.portrait"></div>
      <p class="team-name">{{ community.name }}</p>
      <div class="team-info">
        <span :style="{ color : activity.colorM }">{{ community.level }}答题团</span>
        <span :style="{ color : activity.colorM }">{{ community.memberConts }}人</span>
        <span :style="{ color : activity.colorM }">共{{ community.bonusConts }}采纳</span>
      </div>
      <a :style="{ color : activity.colorM, border: '1px solid' + activity.colorM }" class="qq-text" :href="community.linkUrl">加入答题团QQ群 与团友互动 >></a>
      <p class="text">*QQ群为官方活动群 有专属工作人员运营维护*</p>
    </div>
    <div v-show="community.rankList.length" class="rank-box">
      <div class="title"></div>
      <div class="list-box">
        <ul>
          <li v-for="(item, index) in community.rankList" :key="index">
            <b v-if="index < 3"></b>
            <div v-else class="rank-num">{{ index+1 }}</div>
            <div class="info">
              <img :src="item.avatar ? $compress(item.avatar, true) : avatar">
              {{ item.uname }}
            </div>
            <div class="get-num" :style="{ color : activity.colorM }">{{ item.score }}</div>
          </li>
        </ul>
        <div class="mine" v-show="isMember">
          <div class="rank-num">{{ community.myRank.rank }}</div>
          <div class="info">
            <img :src="community.myRank.avatar ? $compress(community.myRank.avatar,true) : avatar">
            {{ community.myRank.uname }}
          </div>
          <div class="get-num" :style="{ color : activity.colorM }">{{ community.myRank.score }}</div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom" :style="{ backgroundColor : activity.colorM }">
      <div v-if="status" :style="{ color : activity.colorM }" @click="joinTeam">{{ isJoin ? '快去答题吧' : '加入答题团' }}</div>
      <div v-else class="finish">活动已结束</div>
    </div>
    <div class="exit-mb" v-show="exitShow">
      <div class="exit-tan">
        <div class="title" :style="{ backgroundColor : activity.colorM }">
          如果退出该答题团<br>目前累计被采纳数将清0
        </div>
        <div class="content">
          <p class="tip" :style="{ color : activity.colorM }">注：退团须谨慎！</p>
          <p>若再次选择加入同年级同学科答题团<br>将再次回归本团，无法进入同年级同学科其他团</p>
          <div class="btn-box">
            <span :style="{ color : activity.colorM, border: '2px solid' + activity.colorM }" @click="leaveTeam">确认退出</span>
            <span :style="{ backgroundColor : activity.colorM }" @click="stayTeam">我不走了</span>
          </div>
        </div>
      </div>
    </div>
    <gradeSubject :mainColor="activity.colorM" v-show="chooseGrade" @showGrade="ifShowGrade"></gradeSubject>
    <!-- <userInfo :mainColor="activity.colorM" v-show="fillInfo" @showInfoTan = "ifShowInfo" @showGrade="ifShowGrade"></userInfo> -->
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import gradeSubject from '../components/gradeSubject/gradeSubject.vue';
// import userInfo from '../components/userInfo/userInfo.vue';

export default {
  data() {
    return {
      exitShow: false,
      moreShow: false,
      chooseGrade: false,
      fillInfo: false,
      isJoin: 0,
      isMember: 0,
      // isApply: 0,
      communityId: 0,
      leftTime: 0,
      status: 0,
      activity: {},
      community: {
        rankList: [],
        myRank: {},
      },
      avatar: require('../resource/photo.png'),
    };
  },
  components: {
    gradeSubject,
    // userInfo,
  },
  created() {
    window.fePageResume = () => {
      this.pageInit();
      this.chooseGrade = false;
    };
    this.pageInit();
    zybLog.send({
      type: 'pv',
    });
  },
  methods: {
    showMore() {
      this.moreShow = true;
    },
    hideMore(e) {
      if (e.srcElement.className !== 'more') {
        this.moreShow = false;
      }
    },
    leaveTeam() {
      const url = '/napi/activity/answercommunitydropoutrelation';
      this.$fetch({
        url,
        data: {
          communityId: this.communityId,
        },
        method: 'post',
        formType: true,
      }).then((res) => {
        if (!res.errNo) {
          this.exitShow = false;
          this.pageInit();
          hybrid('toast', { text: '退团成功' });
        }
      });
      zybLog.send({
        type: 'leaveTeam',
      });
    },
    stayTeam() {
      this.exitShow = false;
      zybLog.send({
        type: 'stayTeam',
      });
    },
    ifShowGrade(chooseGrade) {
      this.chooseGrade = chooseGrade;
    },
    // ifShowInfo(fillInfo) {
    //   this.fillInfo = fillInfo;
    // },
    pageInit() {
      const herfSearch = window.location.search;
      this.$fetch.get(`/napi/activity/answercommunityinfopage${herfSearch}`)
        .then((res) => {
          if (!res.errNo) {
            const data = res.data || {};
            this.isJoin = data.isJoin;
            this.isMember = data.isMember;
            // this.isApply = res.data.isApply;
            this.communityId = data.communityId;
            this.activity = data.activity;
            this.community = data.community;
            this.leftTime = data.leftTime;
            this.status = this.activity.status;
          }
        });
    },
    joinTeam() {
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
            page: 'team',
          });
        } else {
          this.chooseGrade = true;
          zybLog.send({
            type: 'gradeWindowShow',
            page: 'team',
          });
        }
        // else if (this.isApply) {
        //   this.chooseGrade = true;
        //   zybLog.send({
        //     type: 'gradeWindowShow',
        //     page: 'team',
        //   });
        // } else {
        //   this.fillInfo = true;
        //   zybLog.send({
        //     type: 'infoWindowShow',
        //     page: 'team',
        //   });
        // }
      });
      zybLog.send({
        type: 'joinClick',
        page: 'team',
      });
    },
    sharePage() {
      hybrid('share', {
        share_title: '作业问答 答题团体赛',
        share_text: '组团冲榜瓜分海量帮帮币！',
        share_text_weibo: window.location.href,
        share_img: 'https://yy-s.zuoyebang.cc/zuoyebang/article/resource/logo.png',
        share_url: window.location.href,
      });
    },
    exitClick() {
      this.exitShow = true;
    },
  },
};
</script>
<style lang="less">
body {
  background-color: #ffc682;
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
// .team {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background-color: #ffd24a;
// }
.team-head {
  position: relative;
  width: 100%;
  height: 5.1rem;
  background: url("../resource/team_head.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .more {
    position: absolute;
    display: block;
    width: .7rem;
    height: .49rem;
    top: .2rem;
    right: .3rem;
    background: url(../resource/more.png) no-repeat;
    background-size: 100% 100%;
  }
  .more-list {
    position: absolute;
    top: .8rem;
    right: .3rem;
    border-radius: .1rem;
    padding: 0 .35rem;
    background-color: #fff;
    li {
      height: .88rem;
      line-height: .88rem;
      color: #666;
      font-size: .24rem;
      list-style-type: none;
      img {
        width: .22rem;
        height: .22rem;
        margin-right: .2rem;
      }
      &:nth-of-type(2) {
        border-top: 1px solid #d8d8d8;
      }
    }
    &:before {
      position: absolute;
      content: " ";
      display: block;
      width: .2rem;
      height: .1rem;
      top: -.1rem;
      right: .22rem;
      background: url(../resource/triangle.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .team-pic {
    width: 100%;
    margin-top: .5rem;
    text-align: center;
    img {
      width: 1.62rem;
      height: 1.62rem;
      border-radius: 50%;
    }
  }
  .team-name {
    width: 100%;
    margin: .25rem 0;
    text-align: center;
    font-size: .32rem;
    font-weight: bold;
    color: #fff;
  }
  .team-info {
    width: 100%;
    text-align: center;
    >span {
      display: inline-block;
      height: .38rem;
      padding: 0 .12rem;
      line-height: .4rem;
      border-radius: .1rem;
      font-size: .2rem;
      background-color: #fff;
      // color: #ff5400;
      &:nth-of-type(2) {
        margin: 0 .2rem;
      }
    }
  }
  .qq-text {
    display: block;
    height: .46rem;
    width: fit-content;
    padding: 0 .2rem;
    margin: .55rem auto 0;
    text-align: center;
    font-size: .24rem;
    // color: #ff5400;
    line-height: .48rem;
    border-radius: .23rem;
    // border: 1px solid #ff5400;
    text-decoration:none;
  }
  .text {
    margin-top: .15rem;
    font-size: .2rem;
    color: #666;
    text-align: center;
  }
}
.rank-box {
  width: 100%;
  padding-bottom: .1rem;
  .title {
    width: 100%;
    height: .51rem;
    margin-top: .2rem;
    background: url("../resource/person_rank.png") center center no-repeat;
    background-size: auto 100%;
  }
  .list-box {
    position: relative;
    width: 88%;
    margin: .3rem auto 1.6rem;
    border-radius: .2rem;
    background-color: #fff;
    overflow: hidden;
  }
  ul {
    width: 100%;
    max-height: 6rem;
    padding: 0 .4rem 1rem;
    box-sizing: border-box;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    li {
      width: 100%;
      height: 1rem;
      list-style-type: none;
      line-height: 1rem;
      border-bottom: 1px solid #e1d7ad;
      background-color: #fff;
      overflow: hidden;
      b {
        float: left;
        display: block;
        width: 15%;
        height: 100%;
      }
      &:nth-of-type(1) {
        b {
          background: url("../resource/no_1.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:nth-of-type(2) {
        b {
          background: url("../resource/no_2.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:nth-of-type(3) {
        b {
          background: url("../resource/no_3.png") center center no-repeat;
          background-size: 40% 60%;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .rank-num {
    float: left;
    width: 10%;
    height: 100%;
    margin-left: 5%;
    line-height: 1rem;
    font-size: .24rem;
    text-indent: .08rem;
    color: #333;
  }
  .info {
    float: left;
    width: 60%;
    height: 100%;
    line-height: 1rem;
    font-size: .28rem;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    // color: #ff5400;
  }
  .mine {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    padding: 0 .4rem;
    line-height: 1rem;
    border-top: 1px solid #e1d7ad;
    border-radius: 0 0 .2rem .2rem;
    box-sizing: border-box;
    background-color: #fff9df;
  }
}
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.1rem;
  // background-color: #ff5400;
  div {
    width: 3rem;
    height: .8rem;
    margin: .15rem auto;
    border-radius: .4rem;
    font-size: .32rem;
    font-weight: bold;
    // color: #ff5400;
    text-align: center;
    line-height: .82rem;
    background-color: #fff;
  }
  .finish {
    background-color: #ccc;
    color: #555;
  }
}
.exit-mb {
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
.exit-tan {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 50%;
  border-radius: .2rem;
  background-color: #fff;
  overflow: hidden;
  transform: translateY(-50%);
  .title {
    width: 100%;
    padding: .3rem 0;
    text-align: center;
    font-size: .34rem;
    color: #fff;
    // background-color: #ff5400;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    padding: .4rem 0;
    box-sizing: border-box;
    p {
      width: 100%;
      text-align: center;
      font-size: .22rem;
      color: #707070;
      line-height: .35rem;
    }
    .tip {
      margin-bottom: .15rem;
      // color: #ff5400;
      font-size: .26rem;
      font-weight: bold;
    }
    .btn-box {
      margin-top: .4rem;
      padding: 0 .3rem;
      overflow: hidden;
      span {
        display: block;
        width: 2.2rem;
        height: .8rem;
        line-height: .78rem;
        text-align: center;
        font-size: .3rem;
        border-radius: .4rem;
        // border: 2px solid #ff5400;
        // color: #ff5400;
        box-sizing: border-box;
        &:nth-of-type(1) {
          float: left;
          margin-left: .2rem;
        }
        &:nth-of-type(2) {
          float: right;
          margin-right: .2rem;
          // background-color: #ff5400;
          color: #fff;
        }
      }
    }
  }
}
</style>
