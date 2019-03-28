<template>
  <div class="re-page">
    <div class="re-head">
      <div class="re-head-toHome" @click="turnPage(5)"></div>
      <div class="re-head-text"></div>
    </div>
    <div class="re-video">
      <div class="re-video-card">
        <div>
          <video
            id="media"
            class="video-control"
            :src="videoInfo.url"
            webkit-playsinline="true"
            playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x-webkit-airplay="allow"
            x5-video-orientation="portraint"
            controlslist="nodownload"
            ref="video"
            preload="auto"
          ></video>
          <div :class="['mask',{'hide':!isMaskShow}]" @click="vedioPlay">
            <img :src="posterImg[videoInfo.type-1]" alt srcset>
          </div>
        </div>
        <div class="re-video-btn" @click="turnPage(6)"></div>
      </div>
    </div>
    <div class="middle-logo">
      <div class="abosolute-logo" v-show="wordHome"></div>
    </div>
    <!-- 单词大比拼初始化展示视图 或 答题结果视图 -->
    <div class="re-words" v-show="!answering">
      <div class="re-words-card" v-show="!wordHome">
        <div
          class="re-words-head-text"
          :style="{'visibility':wordHome?'': 'hidden'}"
        >每天趣拼3个单词，即可获得15能量~so easy</div>
        <!-- 答题结果视图背景图片picT picF  -->
        <div class="re-words-pic" v-show="!wordHome">
          <div
            :class="['words-pic-background',{ 'picT':rightQuetionNum===3 },{'picF':rightQuetionNum<=0},{ 'picF2':rightQuetionNum===1||rightQuetionNum===2 }]"
          ></div>
          <div class="words-pic-text">
            <p>{{answerResult}}</p>
            <p>{{answerResult2}}</p>
          </div>
        </div>
        <div class="re-words-btn" @click="beginAnswer(1)">{{wordsBtnText}}</div>
      </div>

      <!-- 初始化展示视图背景 picHome -->
      <div class="re-words-home" v-show="wordHome">
        <div
          :class="['re-words-btn', {'disabletbn':answered}]"
          @click="beginAnswer(2)"
        >{{answered?'':'开始挑战'}}</div>
      </div>
    </div>
    <!-- 单词大比拼答题页 -->
    <div class="re-words" v-show="answering">
      <div class="re-words-card">
        <div class="re-words-head-text">根据图片将单词补充完整，选出正确的答案</div>
        <div class="re-words-answerPic">
          <img :src="questions[currQueNum-1].imgSrc" class="re-words-answerPic">
        </div>
        <div class="re-words-problem">
          <div class="problem-content-text">{{questions[currQueNum-1].problem}}</div>
          <div class="problem-content-icon" @click="playAudio"></div>
          <audio :src="questions[currQueNum-1].audioSrc" id="audio" style="visibility: hidden;"></audio>
        </div>
        <div
          class="re-words-options"
          v-for="(key,option) in questions[currQueNum-1].options"
          :key="key"
          @click="choseOption(option)"
        >{{key}}</div>
      </div>
    </div>
    <div class="re-course">
      <div class="clearfloat">
        <div class="re-course-text"></div>
      </div>
      <div class="re-course-card">
        <div class="coourse-card card-1">
          <div class="coourse-card-btn" @click="turnPage(1)"></div>
        </div>
        <div class="coourse-card card-2">
          <div class="coourse-card-btn" @click="turnPage(2)"></div>
        </div>
        <div class="coourse-card card-3">
          <div class="coourse-card-btn" @click="turnPage(3)"></div>
        </div>
      </div>
    </div>
    <div class="re-footer">
      <div class="re-footer-logo"></div>
      <div class="re-footer-btn">
        <div class="btn-toRE" @click="turnPage(4)"></div>
        <div class="btn-toHome" @click="turnPage(5)"></div>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import InvokeApp from "plat-utils/src/invokeApp";
import { wordsData, videoDate } from './raccoonWords';
// eslint-disable-next-line
import hybrid from "plat-utils/src/hybrid";
// eslint-disable-next-line
import { inWeChat, inApp } from "plat-utils/src/systemInfo";
import Bus from './Bus';
// eslint-disable-next-line
import zybLog from "plat-utils/src/zybLog";
import posterImg1 from '../img/raccoonEnglish/video_cover1.png';
import posterImg2 from '../img/raccoonEnglish/video_cover2.png';
import posterImg3 from '../img/raccoonEnglish/video_cover3.png';
import posterImg4 from '../img/raccoonEnglish/video_cover4.png';

export default {
  name: 'raccoonEnglish',
  data() {
    return {
      // 单词大比拼是否在答题页面
      answering: false,
      // 单词大比拼是否在首页 or 结果页
      wordHome: true,
      // 答对题目数
      rightQuetionNum: 0,
      // 遮罩
      isMaskShow: true,
      // 答题列表数据
      questions: [
        {
          id: 1,
          chinese: '苹果',
          english: 'apple',
          problem: 'appl_',
          options: { A: 'e', B: 'a' },
          value: 'A',
          imgSrc: 'https://plat-h5.cdnjtzy.com/plat/SDK/1.7-1-apple.jpg',
          audioSrc: 'https://bd-s.zuoyebang.cc/zyb-185112.mp3',
        },
        {
          id: 2,
          chinese: '美术',
          english: 'art',
          problem: 'ar_',
          options: { A: 'p', B: 't' },
          value: 'B',
          imgSrc: 'https://plat-h5.cdnjtzy.com/plat/SDK/1.7-2-art.jpg',
          audioSrc: 'https://bd-s.zuoyebang.cc/zyb-185113.mp3',
        },
        {
          id: 3,
          chinese: '坏的',
          english: 'bad',
          problem: 'ba_',
          options: { A: 'p', B: 'd' },
          value: 'B',
          imgSrc: 'https://plat-h5.cdnjtzy.com/plat/SDK/1.7-3-bad-tz.jpg',
          audioSrc: 'https://bd-s.zuoyebang.cc/zyb-185114.mp3',
        },
      ],
      // 视频信息
      videoInfo: {
        type: '3',
        url: 'https://bd-s.zuoyebang.cc/zyb-185565.mp4',
      },
      // 视频封面图片地址
      posterImg: [posterImg1, posterImg2, posterImg3, posterImg4],
      // 当前答题序号
      currQueNum: 1,
      // 用户选择答案序列
      userChooseList: [],
      // 答题结束
      answered: false,
    };
  },
  methods: {
    // 视频播放
    vedioPlay() {
      if (this.isMaskShow === true) {
        if (inApp) {
          this.isMaskShow = false;
          this.$refs.video.play();
          hybrid('is_login', {}, (res) => {
            if (res.isLogin) {
              zybLog.send({
                type: 'REVideo',
              });
              this.$fetch({
                url: '/activity/fiveyears/huanxiongvideo',
              }).then((re) => {
                console.log(re);
              });
            } else {
              hybrid('login');
            }
          });
        } else {
          this.openApp();
        }
      } else {
        this.isMaskShow = true;
        this.$refs.video.pause();
      }
    },
    // 唤醒App
    openApp() {
      if (inWeChat) {
        Bus.$emit('wxGuide');
      } else {
        // 端外打开app
        const naLink = `homework://com.baidu.homework/web?url=${encodeURIComponent(window.location.href)}`;
        InvokeApp({
          downloadLink:
            'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          yybLink:
            'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          nativeLinkIos: naLink,
          nativeLinkAndroid: naLink,
          universalLink: `//oia.zybang.com/download/?page=${encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${window.location.href}`)}`,
        });
      }
    },
    // 获取用户当天答题信息
    getUserAnswerInfo() {
      this.$fetch({
        url: '/activity/fiveyears/answerhuanxiong?status=1',
      }).then((res) => {
        if (res.data.result.status === 0) {
          this.answered = true;
        } else {
          this.answered = false;
        }
      });
    },
    /*    跳转
   1: 精品小班报名
   2：up体系小班报名
   3: 0元免费课程报名
   4：浣熊主页
   5：主会场 */
    turnPage(op) {
      this.isMaskShow = true;
      this.$refs.video.pause();
      const origin = /h5.zybang/.test(window.location.origin)
        ? 'https://www.zybang.com'
        : window.location.origin;
      switch (op) {
        case 1: {
          zybLog.send({
            type: 'RECourseThreeweeks',
          });
          hybrid('openWindow', {
            url: `${origin}/flipped/activity/micropage?microPageId=169&vfrom=5years`,
          });
          break;
        }
        case 2: {
          zybLog.send({
            type: 'RECourseSmallClass',
          });
          hybrid('openWindow', {
            url: `${origin}/flipped/activity/micropage?microPageId=168&vfrom=5years`,
          });
          break;
        }
        case 3: {
          zybLog.send({
            type: 'RECourseFree',
          });
          // hybrid('goToClassDetail', {
          //   courseId: 167812,
          //   from: '五周年浣熊英语分会场',
          // });
          // 更改使用一课提供的新action
          // const url1 = `${origin}/goods/na/course/skudetail?skuId=5320fbd8c98f6ec4e1e89b931893f788&ZybHideTitle=1&hideNativeTitleBar=1&hideNav=1`;
          // const url = 'https://www.zuoyebang.com/goods/na/course/skudetail?skuId=5320fbd8c98f6ec4e1e89b931893f788&ZybHideTitle=1&hideNativeTitleBar=1&hideNav=1';
          const url = `https://www.zybang.com/goods/na/course/skudetail?skuId=5320fbd8c98f6ec4e1e89b931893f788&ZybHideTitle=1&hideNativeTitleBar=1&fillHomeIndicator=0&ZybBlockimage=1
           &lastfrom=out_yike_coursedetail_share`;
          hybrid('openWindow', {
            url,
          });
          break;
        }
        case 4: {
          zybLog.send({
            type: 'RETurnToREHome',
          });
          this.toREHomeGetEnergy();
          hybrid('openWindow', {
            url: `${origin}/flipped/activeconf/activepage?activeId=2`,
          });
          break;
        }
        case 5: {
          zybLog.send({
            type: 'RETurnToHome',
          });
          this.$router.push('/Home/Study');
          break;
        }
        case 6: {
          zybLog.send({
            type: 'REViewMore',
          });
          this.toREHomeGetEnergy();
          hybrid('openWindow', {
            url: `${origin}/flipped/activeconf/activepage?activeId=2`,
          });
          break;
        }
        default: {
          break;
        }
      }
    },
    // 点击选项
    choseOption(option) {
      this.userChooseList.push(option);
      // 维护一个正确选项数组
      const trueAnswers = [];
      this.questions.forEach(item => trueAnswers.push(item.value));
      if (this.currQueNum === 3) {
        for (let i = 0; i < 3; i++) {
          if (this.userChooseList[i] === trueAnswers[i]) {
            this.rightQuetionNum++;
          }
        }
        if (this.rightQuetionNum === 0) {
          zybLog.send({
            type: 'REAnswer0',
          });
        } else if (this.rightQuetionNum === 1 || this.rightQuetionNum === 2) {
          zybLog.send({
            type: 'REAnswer12',
          });
        } else if (this.rightQuetionNum === 3) {
          zybLog.send({
            type: 'REAnswer3',
          });
        }
        this.wordHome = false;
        this.answering = false;
      } else {
        this.currQueNum++;
      }
      if (this.rightQuetionNum === 3 && this.currQueNum === 3) {
        this.$fetch({
          url: '/activity/fiveyears/answerhuanxiong',
          formType: true,
          method: 'get',
        }).then((res) => {
          console.log(res);
        });
      }
    },
    // 前往浣熊会场获取能量
    toREHomeGetEnergy() {
      this.$fetch({
        url: '/activity/fiveyears/linktovenue',
        method: 'POST',
        formType: true,
        data: {
          taskId: 5102,
          venue: 5,
        },
      });
    },
    // 开始答题2 or 再来一次1
    beginAnswer(op) {
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            this.isMaskShow = true;
            this.$refs.video.pause();
            if (op === 2) {
              zybLog.send({
                type: 'REBeginAnswer',
              });
            }
            if (this.answered) {
              return;
            }
            if (this.rightQuetionNum === 3) {
              this.answered = true;
              this.wordHome = true;
              this.rightQuetionNum = 0;
            } else {
              this.wordHome = false;
              this.answering = true;
              this.answering = true;
              this.rightQuetionNum = 0;
              this.currQueNum = 1;
              this.userChooseList = [];
              if (wordsData[this.monthDate]) {
                this.questions = [];
                this.questions = wordsData[this.monthDate];
              }
            }
          } else {
            hybrid('login');
          }
        });
      } else {
        this.openApp();
      }
    },
    // 音频开始播放
    playAudio() {
      const audio = document.getElementById('audio');
      audio.play();
    },
    // 视频播放添加能量
    videoPlay() {
      // const myVideo = document.getElementById('media');
      // myVideo.addEventListener('play', () => {
      //   if (inApp) {
      //     hybrid('is_login', {}, (res) => {
      //       if (res.isLogin) {
      //         zybLog.send({
      //           type: 'REVideo',
      //         });
      //         this.$fetch({
      //           url: '/activity/fiveyears/huanxiongvideo',
      //         }).then((re) => {
      //           console.log(re);
      //         });
      //       } else {
      //         hybrid('login');
      //       }
      //     });
      //   } else {
      //     this.openApp();
      //   }
      // });
    },
  },
  mounted() {
    zybLog.send({
      type: 'REOpen',
    });
    if (videoDate[this.monthDate]) {
      this.videoInfo = videoDate[this.monthDate];
    }
    this.getUserAnswerInfo();
    this.videoPlay();
  },
  watch: {},
  computed: {
    monthDate() {
      const nowDate = new Date();
      return `${nowDate.getMonth() + 1}/${nowDate.getDate()}`;
    },
    answerResult() {
      if (this.rightQuetionNum > 0) {
        return `恭喜你，答对${this.rightQuetionNum}道题`;
      }
      return '哎呀，真可惜~';
    },
    answerResult2() {
      if (this.rightQuetionNum !== 3) {
        return '距离获得15能量仅有一步之遥啦~加油';
      }
      if (this.rightQuetionNum === 3) {
        return '获得了15能量，棒棒哒~';
      }
    },
    wordsBtnText() {
      return this.rightQuetionNum === 3 ? '完成挑战' : '再来一次';
    },
  },
};
</script>
<style lang="scss" scoped>
.re-page {
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
  overflow: auto;
  //   height: 30rem;
  background-image: url(../img/raccoonEnglish/back.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  .re-head {
    height: 10rem;
    background-image: url(../img/raccoonEnglish/head_back.jpg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    .re-head-toHome {
      width: 1rem;
      height: 1rem;
      background-image: url(../img/raccoonEnglish/head_inter.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-left: 0.2rem;
    }
    .re-head-text {
      height: 1.52rem;
      width: 5.07rem;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      bottom: 0.8rem;
      left: 50%;
      transform: translate(-50%);
      background-image: url(../img/raccoonEnglish/video_text.png);
    }
  }
  .re-video {
    text-align: center;
    .re-video-card {
      width: 6.6rem;
      height: 6.6rem;
      background-image: url(../img/raccoonEnglish/video_back.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
      position: relative;
      .re-video-btn {
        position: absolute;
        bottom: 0rem;
        width: 5rem;
        height: 0.97rem;
        left: 50%;
        transform: translate(-50%);
      }
      .video-control {
        width: 6.21rem;
        height: 3.5rem;
        position: relative;
        top: 1.87rem;
        border-radius: 0.1rem;
      }
      .mask {
        &.hide {
          opacity: 0;
        }
        width: 6.21rem;
        height: 3.5rem;
        position: absolute;
        border-radius: 0.1rem;
        top: 1.87rem;
        left: 50%;
        margin-left: -3.1rem;
        background: rgba(0, 0, 0, 0.6);
        img {
          width: 100%;
        }
      }
    }
  }
  .re-words {
    padding-top: 0.74rem;
    text-align: center;
    .re-words-card {
      width: 6.6rem;
      height: 10.67rem;
      background-image: url(../img/raccoonEnglish/word_back.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
      padding: 0.7rem 0;
      box-sizing: border-box;
      position: relative;
      .re-words-head-text {
        margin-top: 0.7rem;
        margin-bottom: 0.25rem;
        font-size: 0.24rem;
        color: rgba(255, 255, 255, 1);
      }
      .re-words-pic {
        width: 6.2rem;
        height: 6.8rem;
        border-radius: 10px;
        margin: auto;
        background-color: rgba(255, 255, 255, 1);
        position: relative;
        .words-pic-background {
          background-repeat: no-repeat;
          background-size: cover;
          width: 3.01rem;
          position: absolute;
          height: 3.1rem;
          left: 50%;
          top: 35%;
          transform: translate(-50%, -50%);
        }
        .words-pic-text {
          padding-top: 75%;
          p {
            font-size: 0.28rem;
            font-weight: 400;
            color: rgba(4, 0, 64, 1);
            line-height: 0.6rem;
          }
        }
      }
      .re-words-answerPic {
        width: 6.2rem;
        height: 3.96rem;
        background-color: rgba(255, 255, 255, 1);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        border-radius: 10px;
        margin: auto;
      }
      .picT {
        background-image: url(../img/raccoonEnglish/word_T.png);
      }
      .picF {
        background-image: url(../img/raccoonEnglish/word_F.png);
      }
      .picF2 {
        background-image: url(../img/raccoonEnglish/word_F2.png);
      }

      .re-words-problem {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(../img/raccoonEnglish/wordback.png);
        width: 6.18rem;
        height: 1.2rem;
        font-size: 0.6rem;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(87, 221, 255, 1);
        line-height: 1.15rem;
        margin: 0.4rem auto;
        position: relative;
        .problem-content-text {
          width: 5rem;
        }
        .problem-content-icon {
          width: 1.2rem;
          height: 1.2rem;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .re-words-options {
        width: 3.2rem;
        height: 1.5rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-image: url(../img/raccoonEnglish/option_btn.png);
        font-size: 0.72rem;
        // font-family: "HuaKangHaiBaoTi";
        font-weight: bold;
        color: rgba(253, 149, 1, 1);
        line-height: 1.35rem;
        display: inline-block;
      }
      .re-words-btn {
        position: absolute;
        bottom: 0.8rem;
        width: 6rem;
        height: 0.97rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        left: 50%;
        transform: translate(-50%);
        background-image: url(../img/raccoonEnglish/bottom-btn.png);
        color: rgba(145, 69, 15, 1);
        line-height: 0.95rem;
        font-weight: bold;
        font-size: 0.3rem;
      }
    }
    .re-words-home {
      position: relative;
      width: 6.6rem;
      height: 10.67rem;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
      padding: 0.7rem 0;
      box-sizing: border-box;
      background-image: url(../img/raccoonEnglish/dancidabipin.png);
      .re-words-btn {
        position: absolute;
        bottom: 0.8rem;
        width: 6rem;
        height: 0.97rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        left: 50%;
        transform: translate(-50%);
        background-image: url(../img/raccoonEnglish/bottom-btn.png);
        color: rgba(145, 69, 15, 1);
        line-height: 0.95rem;
        font-weight: bold;
        font-size: 0.3rem;
      }
      .disabletbn {
        background-image: url(../img/raccoonEnglish/disablebtn.png);
      }
    }
  }
  .middle-logo {
    position: relative;
    .abosolute-logo {
      width: 4.43rem;
      height: 4.54rem;
      background-image: url(../img/raccoonEnglish/middle_logo.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      z-index: 99;
      left: -1.5rem;
      bottom: -10.2rem;
    }
  }
  .re-course {
    position: relative;
    text-align: center;
    .re-course-text {
      height: 1.83rem;
      width: 6.16rem;
      background-image: url(../img/raccoonEnglish/course_text.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
      margin-bottom: 0.54rem;
      margin-top: 0.74rem;
    }
    .re-course-card {
      width: 6.6rem;
      height: 12.71rem;
      // background-image: url(../img/raccoonEnglish/course_back.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: auto;
      text-align: center;
      padding: 0.01rem 0;
      .coourse-card {
        width: 6.2rem;
        height: 3.54rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 0.7rem auto;
        position: relative;
        .coourse-card-btn {
          width: 2rem;
          height: 1rem;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
      .card-1 {
        margin-top: 0;
        background-image: url(../img/raccoonEnglish/course_1.png);
      }
      .card-2 {
        background-image: url(../img/raccoonEnglish/course_2.png);
      }
      .card-3 {
        background-image: url(../img/raccoonEnglish/course_3.png);
      }
    }
  }
  .re-footer {
    padding-top: 0.1rem;
    .re-footer-logo {
      width: 100%;
      height: 3rem;
      background-image: url(../img/raccoonEnglish/footer_logo.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .re-footer-btn {
      height: 1.1rem;
      width: 100%;
      text-align: center;
      background-image: url(../img/raccoonEnglish/tab@2x.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .btn-toRE {
        height: 100%;
        width: 50%;
        display: inline-block;
      }
      .btn-toHome {
        height: 100%;
        width: 50%;
        display: inline-block;
      }
    }
  }
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
}
</style>

