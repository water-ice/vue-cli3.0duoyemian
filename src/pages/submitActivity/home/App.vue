<template>
  <div class="home">
    <div class="fst-page">
      <img src="./resource/bg.jpg" class="bg">

      <!-- <p class="current" @click="changeFlag('rulesInfo')">
        {{homeData.joinTotal}}位圈友正在参与狂欢
        <br>
        目前已收到优秀投稿{{homeData.submitTotal}}篇
      </p> -->
    </div>
    <div class="banner-list" v-if="homeData.bannerList.length > 0">
      <div class="banner-list-wrap">
        <rolling
        :len="homeData.bannerList.length">
        <li class="banner-item" v-for="(item, index) in homeData.bannerList" :key="index">
          <span class="name">{{item.nickName}}&nbsp;</span>
          <span class="msg">{{item.reward}}</span>
        </li>
        </rolling>
      </div>
    </div>
    <div class="sed-page">

      <!-- <div class="title">写作指导专区</div>
      <div class="enter-zone" @click="startWrite">
      </div> -->
      <div class="content">
        <div class="title">活动奖励</div>
        <img src="./resource/own-award.png" v-if="!!homeData.isStart && awardList.length > 0" class="own-award" @click="changeFlag('ownAwardInfo')">
        <div class="schedules">
          <div class="schedule" :style="{'width': homeData.currentLevel / 5 * 100 + '%'}">
          </div>
          <span class="step1" :class="{'active': homeData.currentLevel > 0}"></span>
          <span class="step2" :class="{'active': homeData.currentLevel > 1}"></span>
          <span class="step3" :class="{'active': homeData.currentLevel > 2}"></span>
          <span class="step4" :class="{'active': homeData.currentLevel > 3}"></span>
          <span class="step5" :class="{'active': homeData.currentLevel > 4}"></span>
        </div>
        <div class="award-box">
          <div class="award"
          v-for="(award,index) in boxInfo"
          :key="index">
            <award
            :hasGet="award.number"
            :needPass="award.needNum"
            :status="!!award.opened"
            :level="award.boxLevel"
            @click.native="awardDetail(award)"></award>
          </div>
        </div>
      </div>
    </div>
    <div class="thd-page">
      <div class="content">
        <div class="title">作文投稿通过榜单</div>
        <div class="rank-container">
          <div class="top-rank">
            <span>排名</span>
            <span>作者昵称</span>
            <span>通过篇数</span>
          </div>
          <ul class="rank-list" ref="list" @scroll="getMoreRankData">
            <li v-for="(item,index) in rankList" :key="index">
              <rank-item
                :rank="item.rank"
                :avatar="item.userInfo.avatar"
                :num="item.submitNum"
                :name="item.userInfo.nickName"></rank-item>
            </li>
          </ul>
           <div class="bottom-rank">
            <rank-item :rank="homeData.myRank" :avatar="homeData.myAvatar" :num="homeData.submitNum"></rank-item>
          </div>
        </div>
        <div class="rank-tip">
          <span>
            {{homeData.userShow}}
          </span>
        </div>
      </div>
    </div>
    <div class="four-page">
      <div class="content">
        <div class="title">文学大使招聘</div>
        <div class="card"></div>
        <div class="apply" @click="applyEnterTeam"></div>
      </div>
    </div>
    <div class="five-page">
      <div class="bottom-title">活动说明</div>
      <div class="content">
        <div class="bottom-desc">
          <p>1. 由于活动结束时间与春节时间重合，活动获奖名单和奖励将在2月12日公布在作文圈置顶文章，请获奖同学及时关注系统消息，确保收到奖励</p>
          <p>2. 严禁抄袭，如果通过审核的作文被抽查或举报有抄袭嫌疑，一旦确认，将进行退稿处理，并取消作者的所有奖励</p>
          <p>3. 请确保投稿作文原创性，支持一切原创课堂作文及考场作文进行投稿</p>
          <p>4. 有任何活动疑问均可联系作文圈QQ：3003599899</p>
          <p>5. 活动最终解释权归作业帮作文圈所有</p>
        </div>
      </div>

      <div class="fix-bottom-bt activity-end" :class="{'hasSubmit': homeData.hasSubmit}" v-if="!!homeData.isStart">
        <div class="my-detail" @click="submitDetail" v-if="!!homeData.hasSubmit">我的投稿情况</div>
        <div class="join-submit" @click="submitImmediately">参与作文投稿</div>
      </div>
      <div class="activity-end" v-else>
        <div class="activity-button" @click="toastuser(inActivity)">{{inActivity === 1 ? '活动即将开始' : '活动已经结束'}}</div>
      </div>
    </div>
    <overlay
    :title="rulesInfo.title"
    @close="closeOverlay('rulesInfo')"
    :flag="rulesInfo.flag">
      <div class="rules-container">
        <dl class="submit-restriction">
          <dt>Q1：投稿作文可以写哪些内容呢？</dt>
          <dd>支持课堂作文和考场作文，诗歌小说暂不接受；</dd>
          <dd>作文本和语文试卷上写过的作文，都可以投稿；</dd>
          <dd>另外，作文圈为大家推荐了10个命题，你也可以结合命题来写作。</dd>
          <dt>Q2：什么样的投稿容易通过审核？</dt>
          <dd>字数达标：小学>350字 初中>500字 高中>600字</dd>
          <dd>分段合理：按作文内容结构分自然段，逻辑清楚</dd>
          <dd>检查仔细：标点符号使用合理，拒绝任何错别字。</dd>
        </dl>
        <div class="overlay-bt" @click="submitImmediately">了解！立即投稿</div>
      </div>
    </overlay>
    <award-overlay
    :flag="awardInfo.flag"
    :level="awardInfo.level"
    @close="closeOverlay('awardInfo')"
    @lottery="lottery"
    :status="awardInfo.status"
    :num="awardInfo.num">
    </award-overlay>
    <overlay
    :title="registerAwardInfo.title"
    class="register-overlay"
    @close="closeOverlay('registerAwardInfo')"
    :flag="registerAwardInfo.flag">
      <div class="own-msg">
        <label class="name">
          <span>名字</span>
          <input type="text" placeholder="请输入真实姓名" v-model="userInfo.name">
        </label>
        <label class="phone">
          <span>电话</span>
          <input type="number" placeholder="请输入11位手机号" maxlength=11 v-model="userInfo.phone">
        </label>
        <label class="location">
          <span>快递地址</span>
          <input type="text" placeholder="XX省XX市XX区（县）XX街道XX" v-model="userInfo.address">
        </label>
        <label class="qq">
          <span>Q号</span>
          <input type="number" placeholder="请正确填写QQ号" v-model="userInfo.qq">
        </label>
        <div class="submit-bt" @click="submitUserInfo">提交</div>
        <div class="submit-msg">
          <div class="submit-title">填写说明</div>
          <ul class="submit-content">
            <li>1.抽到实物礼品请填写姓名、电话和快递地址，抽到Q币的同学只需填写QQ号；</li>
            <li>2.请确保信息填写准确，信息填写不正确将无法正常收到奖励，未填写信息则视为放弃奖励，逾期不予补发；</li>
            <li>3.在活动结束前可修改地址并再次提交，领奖信息以最后一次提交信息为准。</li>
          </ul>
        </div>
      </div>
    </overlay>
    <overlay
    class="own-award-overlay"
    :title="ownAwardInfo.title"
    @close="closeOverlay('ownAwardInfo')"
    :closeIcon="ownAwardInfo.closeIcon"
    :flag="ownAwardInfo.flag">
      <div class="own-award">
        <ul class="award-list">
          <li
          v-for="(award,index) in awardList"
          :key="index">
            <img :src="awardPic[award.boxLevel - 1]" alt="">
            <div class="award-msg-container">
              <span class="boxlevel">{{award.boxLevel}}星礼盒</span>
              <div class="award-msg">
                <p v-for="(msg,key) in award.rewards" :key="key">
                {{msg}}
                </p>
              </div>
            </div>
          </li>
        </ul>
        <div class="award-button" v-if="awardList.length > 0" @click="changeFlag('registerAwardInfo')">
          登记领奖信息
        </div>
        <div class="award-explain">
          <div class="award-tip-title">
            <span class="line"></span>
            <span class="text">奖励说明</span>
            <span class="line"></span>
          </div>
          <ul class="submit-content">
            <li>1.抽到实物礼品请填写姓名、电话和快递地址，抽到Q币的同学只需填写QQ号；</li>
            <li>2.请确保信息填写准确，信息填写不正确将无法正常收到奖励，未填写信息则视为放弃奖励，逾期不予补发；</li>
            <li>3.在活动结束前可修改地址并再次提交，领奖信息以最后一次提交信息为准。</li>
          </ul>
        </div>
      </div>
    </overlay>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

import Rolling from '@/components/Rolling/Rolling.vue';
import RankItem from './rank.vue';
import Award from './award.vue';
import Overlay from '../component/overlay.vue';
import AwardOverlay from '../component/awardOverlay.vue';

export default {
  data() {
    return {
      ownAwardInfo: {
        title: '我的奖品',
        flag: false,
        closeIcon: false,
      },
      rulesInfo: {
        title: '活动提示',
        flag: false,
      },
      awardInfo: {
        flag: false,
        level: 1,
        status: false,
        num: 5,
      },
      registerAwardInfo: {
        title: '领奖信息登记',
        flag: false,
      },
      userInfo: {},
      homeData: {
        bannerList: [],
        isStart: true,
      },
      boxInfo: [{}, {}, {}, {}, {}],
      award: {
        hasGet: 1,
        hasPass: 20,
        status: false,
        num: 50,
      },
      awardPic: [
        require('./resource/star1.png'),
        require('./resource/star2.png'),
        require('./resource/star3.png'),
        require('./resource/star4.png'),
        require('./resource/star5.png'),
      ],
      rankPage: 0,
      rankList: [],
      hasMore: false,
      awardList: [],
      uid: '',
      cuid: '',
      inActivity: '',
      pending: false,
      inTest: /suanshubang/.test(window.location.origin),
    };
  },
  mounted() {
    this.getInitData();
    this.getRankData();
    this.getAwardData();
    hybrid('common', {}, (res) => {
      this.cuid = res.cuid;
      hybrid('getuserinfo', {}, (resp) => {
        this.uid = resp.uid;
        zybLog.send({
          page: 'submitActvitityHome',
          module: 'activity-vue',
          uid: resp.uid,
          cuid: res.cuid,
        });
      });
    });
    window.fePageResume = () => {
      window.location.reload();
    };
    this.init();
  },
  methods: {
    changeFlag(type) {
      this[type].flag = true;
    },
    init() {
      const today = new Date();
      const startTime = new Date('2019-1-28');
      const endTime = new Date('2019-2-3');
      if (today < startTime) {
        this.inActivity = 1;
      } else if (today > endTime) {
        this.inActivity = 2;
      }
    },
    startWrite() {
      this.openWindow('https://www.zybang.com/feeds/api/feeddetailpoly?tagId=f498c1484d650e19e41cee5b0e53a3aa&grade=0&polyType=1');
    },
    toastuser(inActivity) {
      if (inActivity !== 1) {
        hybrid('toast', {
          text: '活动结束，活动奖励将在7个工作日内发送！',
        });
      }
    },

    submitDetail() {
      zybLog.send({
        type: 'writeDetail',
        module: 'activity-vue',
        uid: this.uid,
        cuid: this.cuid,
      });
      hybrid('is_login', {}, (res) => {
        if (res.isLogin) {
          this.openWindow(`${window.location.origin}/plat/activity-vue/submitActivityAward.html`);
        } else {
          this.loginForResult();
        }
      });
    },
    // 立即投稿
    submitImmediately() {
      zybLog.send({
        type: 'rightNowWrite',
        module: 'activity-vue',
        uid: this.uid,
        cuid: this.cuid,
      });
      hybrid('is_login', {}, (res) => {
        if (res.isLogin) {
          hybrid('openWindow', {
            url: 'https://www.zybang.com/composition/compcircle/compcirclerules',
            hideNav: 1,
            fillStatusBar: 0,
          });
        } else {
          this.loginForResult();
        }
      });
    },
    getInitData() {
      this.$fetch({
        type: 'get',
        url: '/activity/composition/compcontributehome',
      }).then((res) => {
        if (res.errNo === 0) {
          this.homeData = res.data;
          this.boxInfo = res.data.boxInfo;
        }
      });
    },
    lottery(status, level) {
      if (status) {
        return false;
      }
      this.openWindow(`${window.location.origin}/plat/activity-vue/submitActivityShare.html?boxLevel=${level}`);
    },
    openWindow(url, flag) {
      const choice = { url };
      if (flag) {
        choice.hideNav = 1;
      }
      hybrid('openWindow', choice);
    },
    applyEnterTeam() {
      this.openWindow('https://wj.qq.com/s2/2896848/da73/');
    },
    awardDetail(award) {
      zybLog.send({
        type: 'giftBoxClick',
        module: 'activity-vue',
        uid: this.uid,
        cuid: this.cuid,
      });
      hybrid('is_login', {}, (res) => {
        if (res.isLogin) {
          if (award.opened) {
            this.openWindow(`${window.location.origin}/plat/activity-vue/submitActivityShare.html?boxLevel=${award.boxLevel}&type=1`);
            return;
          }
          this.awardInfo = {
            flag: true,
            num: award.remainNum,
            status: !!award.remainNum,
            level: award.boxLevel,
          };
        } else {
          this.loginForResult();
        }
      });
    },
    loginForResult() {
      hybrid('loginForResult', {}, () => {
        window.location.reload();
      });
    },
    isPhone(val) {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(val);
    },
    isPureNumber(val) {
      return /^\d+$/.test(val);
    },
    closeOverlay(type) {
      this[type].flag = false;
    },
    // 提交个人信息
    submitUserInfo() {
      if (!this.userInfo.address || !this.userInfo.name) {
        hybrid('toast', {
          text: '信息不完整',
        });
        return;
      }
      if (!this.isPhone(this.userInfo.phone)) {
        hybrid('toast', {
          text: '手机号格式不正确',
        });
        return;
      }
      if (this.userInfo.qq && !this.isPureNumber(this.userInfo.qq)) {
        hybrid('toast', {
          text: 'qq号格式不正确',
        });
        return;
      }
      // 避免多次提交
      let flag = false;
      if (flag) {
        return;
      }
      this.$fetch({
        method: 'post',
        data: this.userInfo,
        formType: true,
        url: '/activity/composition/receiverewardinfo',
      }).then((res) => {
        if (res.errNo === 0) {
          hybrid('toast', {
            text: '提交成功',
          });
          setTimeout(() => {
            this.registerAwardInfo.flag = false;
          }, 500);
        } else {
          hybrid('toast', {
            text: res.erstr,
          });
        }
        flag = true;
      });
    },
    // 获取排行榜数据
    getRankData() {
      this.pending = false;
      this.$fetch({
        method: 'get',
        url: '/activity/composition/compcontributetoprank',
        params: {
          rn: 20,
          pn: this.rankPage,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          this.rankList = this.rankList.concat(res.data.list || []);
          this.rankPage += 20;
          this.hasMore = res.data.hasMore;
        }
        this.pending = true;
      }).catch(() => {
        this.pending = true;
      });
    },
    // 获取更多排行榜数据
    getMoreRankData() {
      if (!this.hasMore) {
        return false;
      }
      const el = this.$refs.list;
      const { offsetHeight, scrollHeight, scrollTop } = el;
      if (scrollTop + offsetHeight + 50 >= scrollHeight && this.pending) {
        this.getRankData();
      }
    },
    // 获取奖励信息
    getAwardData() {
      this.$fetch.get('/activity/composition/compositionuserreward')
        .then((res) => {
          if (res.errNo === 0) {
            this.awardList = res.data.list || [];
          }
        });
    },
  },
  components: {
    RankItem,
    Award,
    Overlay,
    AwardOverlay,
    Rolling,
  },
};
</script>
<style lang="less">
.bg(@val) {
  background: url(@val) 0 0 no-repeat;
  background-size: 100% auto;
}

.center-bg(@val) {
  background: url(@val) center center no-repeat;
  background-size: contain;
}

body {


  .home {
    background: #f64129;
    .fst-page {
      margin-bottom: .6rem;
      position: relative;

      .bg {
        width: 100%;
      }
      .current {
        position: absolute;
        bottom: .42rem;
        left: 50%;
        transform: translateX(-50%);
        width: 4.06rem;
        font-size: .24rem;
        color: #fff;
        text-align: center;
      }
    }
    .banner-list {
      height: .6rem;
      background: #ffeee5;
      width: 91%;
      margin: 0 auto;
      border-radius: .05rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .banner-list-wrap {
        height: .35rem;
        li {
          text-align: center;
          height: 100%;
        }
        .name {
          color: #f22121;
          font-size: .2rem;
        }
        .msg {
          font-size: .2rem;
          color: #666666;
        }
      }
    }

    .sed-page {
      padding: 0 .25rem;
      box-sizing: border-box;
      .title {
        font-size: .36rem;
        font-weight: bold;
        line-height: .48rem;
        color: #fff;
        text-align: center;
        margin-bottom: .3rem;
        .center-bg('./resource/title-bg.png');
      }

      .enter-zone {
        height: 1.4rem;
        background: url('./resource/guide.png') center center no-repeat;
        background-size: 6.52rem auto;
      }

      .content {
        width: 100%;
        height: 7.8rem;
        background: url('./resource/two-bg.png') 0 -.51rem no-repeat;
        background-size: 100% auto;
        position: relative;
        padding-top: .78rem;

        .title {
          font-weight: bold;
          font-size: .36rem;
          line-height: .48rem;
          color: #fff;
          text-align: center;
          .center-bg('./resource/title-bg.png');
        }

        .own-award {
          position: absolute;
          width: 1.31rem;
          right: -.17rem;
          top: .84rem;
        }

        .schedules {
          width: 6.15rem;
          height: .102rem;
          background: #f22121;
          position: relative;
          margin-left: .3rem;
          margin-top: 3.35rem;
          .schedule {
            position: absolute;
            height: .102rem;
            background: #ffcf0f;
          }
          span {
            position: absolute;
            height: .25rem;
            width: .25rem;
            top: -60%;
            display: inline-block;
            border-radius: 50%;
            background: #f22121;
            &.active {
              background: #ffcf0f;
            }
          }
          .step1 {
            left: 16.6%;
          }
          .step2 {
            left: 32.2%;
          }
          .step3 {
            left: 48.8%;
          }
          .step4 {
            left: 65.4%;
          }
          .step5 {
            left: 82%;
          }
        }

        .award-box {
          .award:nth-child(1) {
            position: absolute;
            bottom: 4.1rem;
            left: .7rem;
          }

          .award:nth-child(2) {
            position: absolute;
            left: 1.6rem;
            bottom: .9rem;
          }

          .award:nth-child(3) {
            position: absolute;
            left: 2.68rem;
            bottom: 4.1rem;
          }

          .award:nth-child(4) {
            position: absolute;
            bottom: .9rem;
            right: 1.5rem;
             @media only screen and (device-width: 320px) {
              right: 1.3rem;
            }
          }

          .award:nth-child(5) {
            position: absolute;
            right: .55rem;
            bottom: 4.1rem;
            @media only screen and (device-width: 320px) {
              right: .4rem;
            }
          }
        }
      }

    }

    .thd-page {
      height: 15.4rem;
      padding: 0 .25rem;
      box-sizing: border-box;

      .content {
        width: 100%;
        height: 100%;
        background: url('./resource/thd-section.png') 0 -.53rem no-repeat;
        background-size: 100% auto;
        box-sizing: border-box;
        padding-top: .91rem;
      }

      .title {
        font-size: .36rem;
        font-weight: bold;
        line-height: .48rem;
        color: #fff;
        text-align: center;
        .center-bg('./resource/title-bg2.png');
      }

      .rank-container {
        background: #fff3f7;
        height: 11.86rem;
        width: 6rem;
        margin: .5rem auto 0;
        border-radius: 0 0 .15rem .15rem;
        padding: .25rem 0;
        box-sizing: border-box;
        position: relative;

        .top-rank {
          padding: 0 .36rem;
          display: flex;

          span {
            display: inline-block;
            flex: 1;

            &:nth-child(2) {
              text-align: center;
            }

            &:nth-child(3) {
              text-align: right;
            }
          }
        }

        .rank-list {
          position: absolute;
          bottom: 1rem;
          top: 1rem;
          left: 0;
          right: 0;
          overflow: scroll;
        }

        .bottom-rank {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 0 0 .15rem .15rem;

          .item {
            border-bottom: 0;
          }
        }
      }

      .rank-tip {
        text-align: center;
        margin-top: .73rem;
        color: #de0b0b;
        font-size: .24rem;
        span {
          display: inline-block;
          max-width: 80%;
          text-align: center;
        }
      }
    }

    .four-page {
      height: 5.8rem;
      padding: 0 .25rem;
      box-sizing: border-box;
      margin-top: -.08rem;

      .content {
        width: 100%;
        height: 100%;
        background: url('./resource/four-bg.png') 0 -.51rem no-repeat;
        background-size: 100% auto;
        padding-top: .91rem;
        box-sizing: border-box;
      }

      .title {
        font-size: .36rem;
        line-height: .48rem;
        font-weight: bold;
        color: #fff;
        text-align: center;
        .center-bg('./resource/title-bg.png');
      }

      .card {
        width: 6.74rem;
        height: 3.31rem;
        margin: .3rem auto 0;
        .center-bg('./resource/card.png');
      }

      .apply {
        width: 2.4rem;
        height: .8rem;
        margin: -.2rem auto 0;
        .bg('./resource/apply.png');
      }
    }

    .five-page {
      margin-top: .31rem;
      padding-top: 1rem;
      padding-bottom: 1.5rem;
      box-sizing: border-box;
      .bg('./resource/bottom-bg.png');

      .bottom-title {
        color: #fff;
        text-align: center;
        font-size: .36rem;
      }

      .content {
        .bottom-desc {
          margin-top: .81rem;
          padding: 0 .47rem;
          font-size: .24rem;
          color: #fff;
          line-height: .5rem;
        }
      }

      .activity-end {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        background: #ffdb21;
        margin-top: .6rem;
        &.fix-bottom-bt {
          padding: .1rem .2rem;
          display: flex;
          justify-content: center;
          font-size: .32rem;
          &.hasSubmit {
            justify-content: space-between;
          }
          .join-submit {
            background: #f22121;
            color: #fff;
            text-align: center;
            height: .8rem;
            line-height: .8rem;
            border-radius: .4rem;
            width: 3.3rem;
          }
          .my-detail {
            color: #f22121;
            text-align: center;
            height: .8rem;
            text-align: center;
            line-height: .72rem;
            box-sizing: border-box;
            border: 0.04rem solid #f22121;
            border-radius: .4rem;
            width: 3.3rem;
          }
        }
        .activity-button {
          background: #999;
          height: .8rem;
          line-height: .8rem;
          border-radius: .4rem;
          font-size: .32rem;
          color: #fff;
          text-align: center;
          padding: 0 .85rem;
        }
      }
    }

    .rules-container {
      .submit-restriction {
        dt {
          font-size: .24rem;
          color: #f22121;
          margin: .24rem 0;

          &:first-child {
            margin-top: 0;
          }
        }

        dd {
          font-size: .24rem;
          color: #666;
        }


      }

      .overlay-bt {
        font-size: .32rem;
        color: #fff;
        border-radius: .36rem;
        width: 4.61rem;
        margin: .78rem auto 0;
        text-align: center;
        line-height: .8rem;
        background: #f22121;
      }
    }

    .own-msg {
      label {
        display: block;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: .18rem;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          display: inline-block;
          width: .6rem;
          font-size: .28rem;
          color: #333;
        }

        input {
          background: none;
          outline: none;
          border: 0px;
          width: 4.32rem;
          border: 1px solid #d8d8d8;
          padding: .28rem .23rem;
          box-sizing: border-box;
          border-radius: .1rem;

          &:focus {
            outline: none;
          }

          &::-webkit-input-placeholder {
            font-size: .24rem;
            color: #999;
          }

          &::-moz-placeholder {
            font-size: .24rem;
            color: #999;
          }

          &::-ms-input-placeholder {
            font-size: .24rem;
            color: #999;
          }
        }
      }

      .submit-bt {
        width: 4.64rem;
        height: .8rem;
        line-height: .8rem;
        background: #f22121;
        text-align: center;
        margin: .42rem auto 0;
        color: #fff;
        font-size: .32rem;
        border-radius: .4rem;
      }

      .submit-msg {
        color: #666;

        .submit-title {
          margin-top: .4rem;
          font-size: .24rem;
          text-align: center;
        }

        .submit-content {
          margin-top: .32rem;
          font-size: .2rem;
          line-height: .36rem;
        }
      }
    }

    .own-award-overlay {
      .overlay-top {
        border-bottom: 1px solid #ea5902;
      }
      .overlay-center {
        padding: 0;
      }
      .own-award {
        .award-list {
          background: #ff6000;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: .24rem;
          li {
            width: 5rem;
            height: 1.47rem;
            background: url('./resource/award-bg.png') 0 0 no-repeat;
            background-size: 100% auto;
            position: relative;
            margin-bottom: .24rem;
            &:first-child {
              margin-top: .24rem;
            }
            img {
              width: 1.3rem;
              position: absolute;
              top: -.08rem;
              left: .66rem;
            }
            .award-msg-container {
              position: absolute;
              left: 2.85rem;
              top: .22rem;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              span {
                font-size: .2rem;
                color: #666;
              }

              p {
                font-size: .28rem;
                color: #f22121;
              }
            }

          }
        }

        .award-button {
          width: 4.6rem;
          margin: .2rem auto .4rem;
          height: .8rem;
          line-height: .8rem;
          text-align: center;
          background: #f22121;
          font-size: .32rem;
          color: #fff;
          border-radius: .4rem;
        }

        .award-explain {
          padding: 0 .35rem .41rem;
          .submit-content {
            font-size: .2rem;
            color: #666;
          }
        }
        .award-tip-title {
          text-align: center;
          height: .24rem;
          line-height: .24rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: .3rem;

          .line {
            display: inline-block;
            width: 2rem;
            border-top: 1px solid #ccc;
          }

          .text {
            color: #666;
          }
        }
      }
    }
    .register-overlay {
      z-index: 10;
    }
  }
}
</style>
