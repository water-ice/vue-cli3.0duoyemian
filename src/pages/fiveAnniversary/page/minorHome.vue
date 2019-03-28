<template>
  <div class="back-back">
    <!-- 答题分会场主页 -->
    <div class="page-home" v-if="pageNumber===1">
      <div class="left-btn" @click="turntoHome"></div>
      <div class="right-btn" @click="showRule"></div>
      <div class="bottom">
        <div class="bottom-btn" @click="beginAnswer"></div>
      </div>
      <modal-com :visible.sync="visibleRule" :headTxt="'学科大作战活动规则'">
        <div class="list-item" v-for="(item, index) in rules" :key="index">
          <div class="list-item-left">
            <div class="list-item-img">{{index+1}}</div>
          </div>
          <div class="list-item-right">
            <span class="list-item-text">{{item}}</span>
          </div>
        </div>
        <div class="readme">
          <span class="warn">*本活动最终解释权归作业帮所有</span>
        </div>
        <div slot="footer" class="footer">
          <img src="../img/rule_know.png" class="footer-btn" @click="cancel">
        </div>
      </modal-com>
    </div>
    <!-- 答题视图 -->
    <div class="page-practice" v-if="pageNumber===2">
      <div class="practice-card">
        <div class="topics-num">
          <span>{{index}}</span>
          <span class="color153">/{{questionList.length}}</span>
        </div>
        <div class="topics-text" v-html="currnQuestion.question"></div>
        <div class="topics-options" v-for="(item,key) in currnQuestion.options" :key="item">
          <div
            :class="[{'topics-option-active':currnQuestionAniwer==key},'topics-option']"
            @click="choseOption(currnQuestion.tid,key)"
          >
            <span v-html="key+'：'+item"></span>
          </div>
        </div>
      </div>
      <div class="left-icon"></div>
      <div class="right-icon"></div>
    </div>
    <!-- 结果视图 -->
    <div class="page-result" v-if="pageNumber===3">
      <div class="page-result-content">
        <div class="result-card">
          <div :class="['result-card-pic','an_result_'+answerResult]"></div>
          <div class="result-card-text">
            <div class="card-text1">{{answerResult===0?'很遗憾':'恭喜你'}}，答对{{answerResult}}题</div>
            <div class="card-text2">{{resuletText}}</div>
          </div>
        </div>
        <div class="result-footer" v-if="havaMistake">
          <!--没有全部回答正确 查看解析和再来一次 -->
          <div class="result-analysis-btn" @click="turnToAnalysis"></div>
          <div class="result-onemore-btn" @click="oneMore"></div>
        </div>
        <div class="result-footer" v-if="noComplete" style="text-align: center;">
          <!--全部回答正确且有下一套题 下一套试题 -->
          <div class="result-next-btn" @click="nextTask"></div>
        </div>
        <div class="result-footer" style="text-align: center;" v-if="completed">
          <!--全部回答正确 查看解析 -->
          <div class="result-analysis-btn-end" @click="turntoHome"></div>
          <div class="result-end-text">今日答题已结束，明天再来吧~</div>
        </div>
      </div>
    </div>
    <!-- 解析视图 -->
    <div class="page-analysis" v-if="pageNumber===4">
      <div class="page-analysis-content">
        <div style="    position: relative;">
          <div class="left-icon-ana"></div>
          <div class="right-icon-ana"></div>
          <div class="analysis-card">
            <div class="topics-num">
              <span>{{index}}</span>
              <span class="color153">/{{questionList.length}}</span>
            </div>
            <div class="topics-text" v-html="currnQuestion.question"></div>
            <div class="topics-options" v-for="(item,key) in currnQuestion.options" :key="item">
              <div
                :class="[{'topics-option-true':key==currnQuestion.choose},{'topics-option-error':currnQuestionAniwer==key&&key!==currnQuestion.choose},'topics-option']"
              >
                <span v-html="key+'：'+item"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="analysis-footer" style="text-align: center;">
          <div class="analysis-title"></div>
          <br>
          <div class="analysis_text" v-html="currnQuestion.answer"></div>
          <div
            :class="[{'analysis-callback':questionList.length === index},'analysis-next']"
            @click="analysisNext"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import Toast from "../../../components/Toast";
// eslint-disable-next-line
import hybrid from "plat-utils/src/hybrid";
// eslint-disable-next-line
import InvokeApp from "plat-utils/src/invokeApp";
// eslint-disable-next-line
import { inWeChat, inApp } from "plat-utils/src/systemInfo";

export default {
  name: 'minorHome',
  data() {
    return {
      rules: [
        '每日登陆答题分会场，可获得10能量；',
        '全部答对一套题10能量，同一套题可重复作答；',
        '用户每日可练习三套题，共计获得30能量；',
      ],
      visibleRule: false,
      /*
       学科大作战主页:1
       答题页:2
       答题结果页:3
       答题解析页:4 */
      pageNumber: 1,
      // 问题列表
      questionList: [],
      // 当前套题答案 arr内层是json 跟接口传数据用
      answer: [],
      // 对比正确答案用
      answerList: [],
      // 未完成套题ID集合
      taskList: [5102, 5104],
      // 当前taskid
      currtaskId: 0,
      // 当前套题题目序号
      index: 1,
      // 当前套题序号
      taskindex: 1,
      // 答题结果
      answerResult: 0,
      // 是否答题完毕 当iscomplete<0 表示答题结束不增加能量
      iscomplete: 0,
    };
  },
  computed: {
    // 当前问题
    currnQuestion() {
      return this.questionList[this.index - 1];
    },
    // 当前套题当前题目答案
    currnQuestionAniwer() {
      if (this.answer[this.index - 1]) {
        return this.answer[this.index - 1].answer;
      }
      return '';
    },
    havaMistake() {
      return this.answerResult !== this.questionList.length;
    },
    noComplete() {
      return (
        this.answerResult === this.questionList.length &&
        this.taskList.length !== 0
      );
    },
    completed() {
      return (
        this.answerResult === this.questionList.length &&
        this.taskList.length === 0
      );
    },
    resuletText() {
      if (this.answerResult === 5 && this.iscomplete >= 0) {
        return '获得10能量';
      } else if (this.iscomplete < 0) {
        return '今日能量已领取';
      }
      return '离获得能量还有一步之遥';
    },
  },
  watch: {
    /*     // 监听一个变量，该变量没有实际意义，当值改变初始化并获取最新的未完成的套题
    taskindex() {
      this.answer = [];
      this.answerList = [];
      this.index = 1;
      this.answerResult = 0;
      // 请求新套题数据
      this.getQuestionList();
    }, */
  },
  mounted() {
    // 获得用户答题状态
    this.$fetch({
      url: '/activity/fiveyears/mainpage',
    }).then((res) => {
      if (res.errNo === 0) this.taskList = res.data.result.unFinish;

      if (res.data.result.unFinish.length === 0) {
        this.iscomplete--;
      } else {
        this.iscomplete = res.data.result.unFinish.length;
      }
    });
  },
  methods: {
    // 唤醒App
    openApp() {
      if (inWeChat) {
        this.bubble = true;
        document.querySelector('.bubble').addEventListener('touchmove', (e) => {
          e.preventDefault();
        });
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
    // 题目解析下一题
    analysisNext() {
      if (this.questionList.length !== this.index) {
        this.index++;
      } else {
        this.oneMore();
      }
    },
    // 再来一次
    oneMore() {
      this.answer = [];
      this.answerList = [];
      this.index = 1;
      this.answerResult = 0;
      this.pageNumber = 2;
    },
    // 请求新套题数据
    getQuestionList() {
      this.$fetch({
        url: '/activity/activity/fiveyears/questiontikupage',
        params: {
          taskId: this.taskList.length === 0 ? 0 : this.taskList[0],
        },
      })
        .then((res) => {
          if (res.errNo === 0) {
            this.questionList = res.data.result.questionList;
            this.taskList = res.data.result.unFinish;
            this.currtaskId = res.data.result.taskId;
            if (res.data.result.unFinish.length === 0) {
              this.iscomplete--;
            } else {
              this.iscomplete = res.data.result.unFinish.length;
            }
          } else {
            // Toast('详情请登录作业帮app查看!');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 下一套题
    nextTask() {
      this.answer = [];
      this.answerList = [];
      this.index = 1;
      this.answerResult = 0;
      // 请求新套题数据
      this.getQuestionList();
      this.pageNumber = 2;
    },
    // 跳转到解析视图
    turnToAnalysis() {
      this.pageNumber = 4;
      this.index = 1;
    },
    // 学科大作战答题 下一题/提交套题
    choseOption(tid, opkey) {
      this.answerList.push(opkey);
      this.answer.push({ tid, answer: opkey });
      setTimeout(() => {
        if (this.questionList.length !== this.index) {
          this.index++;
        } else {
          // 维护一个正确答案序列;
          const trueAnswers = [];
          this.questionList.forEach(item => trueAnswers.push(item.choose));
          let answerResult = 0;
          for (let i = 0; i < 5; i++) {
            if (trueAnswers[i] === this.answerList[i]) {
              answerResult++;
            }
          }
          this.answerResult = answerResult;
          console.log(this.answerResult);
          if (this.iscomplete >= 0) {
            this.$fetch({
              url: '/activity/activity/fiveyears/answertiku',
              formType: true,
              data: {
                taskId: this.currtaskId,
                answer: this.answer,
              },
              method: 'post',
            })
              .then((res) => {
                console.log(res.errstr);
              })
              .catch((err) => {
                console.log(err);
              });
          }
          // 切换视图跳转到结果页
          this.pageNumber = 3;
        }
      }, 200);
    },
    // 关闭活动规则
    cancel() {
      this.visibleRule = false;
    },
    // 跳转到主会场
    turntoHome() {
      this.$router.push('/Home/Study');
    },
    showRule() {
      this.visibleRule = true;
    },
    // 开始答题
    beginAnswer() {
      // 答题前获取用户登录状态以及端内外信息
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            this.getQuestionList();
            this.pageNumber = 2;
            this.answer = [];
            this.answerList = [];
          } else {
            hybrid('login');
          }
        });
      } else {
        this.openApp();
      }
      /*  this.getQuestionList();
      this.pageNumber = 2;
      this.answer = [];
      this.answerList = []; */
    },
  },
};
</script>
<style lang="scss" >
.back-back {
  -webkit-overflow-scrolling: touch;
  min-height: 100vh;
  height: 100%;
  overflow: auto;
  background-image: url(../img/back-back.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .page-home {
    min-height: 100vh;
    background-image: url(../img/minor_home_back.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .left-btn {
      margin-left: 0.15rem;
      width: 1rem;
      height: 1rem;
      background-image: url(../img/minor_home_topri.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .right-btn {
      width: 1.2rem;
      height: 0.48rem;
      position: absolute;
      right: 0.3rem;
      top: 0.3rem;
      background-image: url(../img/minor_home_rule.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .bottom {
      position: absolute;
      bottom: 10vh;
      text-align: center;
      left: 50%;
      transform: translate(-50%, -50%);
      .bottom-btn {
        width: 3.6rem;
        height: 1rem;
        background-image: url(../img/minor_home_start.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .list-item {
      padding: 0.1rem;
      .list-item-left {
        display: inline-block;
        width: 0.3rem;
        vertical-align: top;
        padding-right: 0.03rem;
        margin-top: 0.06rem;
        .list-item-img {
          position: abosolte;
          text-align: center;
          width: 0.3rem;
          height: 0.3rem;
          background-image: url(../img/sort_bak.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          color: #ffffff;
          font-size: 0.2rem;
          font-weight: bold;
        }
      }
      .list-item-right {
        display: inline-block;
        width: 4.5rem;
        .list-item-text {
          color: #000000;
          font-size: 0.3rem;
        }
      }
    }
    .readme {
      margin-top: 0.6rem;
      text-align: center;
    }
    .warn {
      color: rgb(153, 153, 153);
      font-size: 0.25rem;
    }
    .footer {
      text-align: center;
      .footer-btn {
        width: 2.5rem;
        height: 1rem;
      }
    }
  }
  .page-practice {
    // min-height: 100vh;
    position: relative;
    padding-top: 3.5rem;
    background-image: url(../img/practice_back.png);
    background-repeat: no-repeat;
    background-position-y: -1.4rem;
    background-size: 100% auto;
    .left-icon {
      background-color: rgb(27, 174, 253);
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      border-radius: 50%;
      top: 5.5rem;
    }
    .right-icon {
      float: right;
      background-color: rgb(27, 174, 253);
      width: 0.5rem;
      height: 0.5rem;
      position: absolute;
      border-radius: 50%;
      right: 0;
      top: 5.5rem;
    }
    .practice-card {
      color: #000000;
      // position: absolute;
      // top: 3.5rem;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 6.6rem;
      margin: 0.1rem 0.3rem;
      background-color: rgb(255, 255, 255);
      padding: 0.4rem 0.4rem 0.2rem 0.4rem;
      border-radius: 0.5rem;
      box-sizing: border-box;
      box-shadow: 0 4px 12px rgba(40, 109, 87, 0.5);
      .topics-num {
        text-align: right;
        font-size: 0.32rem;
        margin-bottom: 0.2rem;
        .color153 {
          color: rgb(153, 153, 153);
        }
      }
      .topics-text {
        width: 100%;
        height: 100%;
        word-break: break-word;
        margin-bottom: 0.5rem;
        font-size: 0.32rem;
        font-family: "Hiragino Sans GB";
      }
      .topics-option {
        background-color: rgb(240, 240, 240);
        width: 5.8rem;
        border-radius: 0.5rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // height: 1rem;
        margin: 0.3rem 0;
        // padding: 0.2rem 0.2rem 0.2rem 1rem;
        padding: 0.2rem 0.4rem 0.2rem 0.6rem;
        vertical-align: middle;
        // padding-left: 1rem;
        // line-height: 1rem;
        font-size: 0.32rem;
        box-sizing: border-box;
      }
      .topics-option-active {
        background-image: url(../img/practice_option_active.png);
      }
    }
  }
  .page-result {
    min-height: 100vh;
    background-color: rgb(26, 178, 255);
    .page-result-content {
      padding: 0.5rem 0;
      .result-card {
        background-image: url(../img/answer_result_img/an_result_card.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 8.5rem;
        padding: 0.6rem 0.7rem;
        margin-bottom: 0.5rem;
        text-align: center;

        .result-card-pic {
          width: 5.8rem;
          height: 6rem;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          border-radius: 0.1rem;
        }
        .an_result_0 {
          background-image: url(../img/answer_result_img/an_result_0.png);
        }
        .an_result_1 {
          background-image: url(../img/answer_result_img/an_result_1.png);
        }
        .an_result_2 {
          background-image: url(../img/answer_result_img/an_result_2.png);
        }
        .an_result_3 {
          background-image: url(../img/answer_result_img/an_result_3.png);
        }
        .an_result_4 {
          background-image: url(../img/answer_result_img/an_result_4.png);
        }
        .an_result_5 {
          background-image: url(../img/answer_result_img/an_result_5.png);
        }
        .card-text1 {
          font-size: 0.48rem;
          font-weight: bold;
          margin-top: 0.45rem;
          margin-bottom: 0.3rem;
        }
        .card-text2 {
          font-size: 0.36rem;
          font-weight: bold;
        }
      }
      .result-footer {
        padding: 0 0.35rem;
        .result-analysis-btn {
          display: inline-block;
          background-image: url(../img/answer_result_img/an_result_analysis.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 1rem;
          margin-right: 0.5rem;
        }
        .result-analysis-btn-end {
          display: inline-block;
          background-image: url(../img/answer_result_img/btn_back_home.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 1rem;
        }
        .result-onemore-btn {
          display: inline-block;
          background-image: url(../img/answer_result_img/an_result_onemore.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 1rem;
        }
        .result-next-btn {
          display: inline-block;
          background-image: url(../img/answer_result_img/an_result_next.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 1rem;
        }
        .result-end-text {
          color: #ffffff;
          font-size: 0.24rem;
          text-align: center;
        }
      }
    }
  }
  .page-analysis {
    min-height: 100vh;
    background-color: rgb(26, 178, 255);
    .page-analysis-content {
      padding: 0.5rem 0;
      .left-icon-ana {
        background-color: rgb(27, 174, 253);
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        border-radius: 50%;
        z-index: 99;
        top: 1.5rem;
      }
      .right-icon-ana {
        float: right;
        background-color: rgb(27, 174, 253);
        width: 0.5rem;
        height: 0.5rem;
        position: absolute;
        border-radius: 50%;
        z-index: 99;
        top: 1.5rem;
        right: 0;
      }
      .analysis-card {
        color: #000000;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 6.6rem;
        margin: 0.1rem 0.3rem;
        background-color: rgb(255, 255, 255);
        padding: 0.4rem 0.4rem 0.2rem 0.4rem;
        border-radius: 0.5rem;
        box-sizing: border-box;
        box-shadow: 0 4px 12px rgba(40, 109, 87, 0.5);
        margin-bottom: 0.8rem;
        .topics-num {
          text-align: right;
          font-size: 0.32rem;
          margin-bottom: 0.2rem;
          .color153 {
            color: rgb(153, 153, 153);
          }
        }
        .topics-text {
          word-break: break-word;
          margin-bottom: 0.5rem;
          font-size: 0.32rem;
          font-family: "Hiragino Sans GB";
        }
        .topics-option {
          background-color: rgb(240, 240, 240);
          width: 5.8rem;
          border-radius: 0.5rem;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          // height: 1rem;
          margin: 0.3rem 0;
          // padding-left: 1rem;
          // padding: 0.2rem 0.2rem 0.2rem 1rem;
          padding: 0.2rem 0.4rem 0.2rem 0.6rem;
          vertical-align: middle;
          // line-height: 1rem;
          font-size: 0.32rem;
          box-sizing: border-box;
        }
        .topics-option-error {
          background-image: url(../img/question_analysis/practice_anal_f.png);
        }
        .topics-option-true {
          background-image: url(../img/question_analysis/practice_anal_t.png);
        }
      }
      .analysis-footer {
        padding: 0 0.35rem;
        .analysis-next {
          display: inline-block;
          background-image: url(../img/question_analysis/practice_next.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 1rem;
        }
        .analysis-title {
          display: inline-block;
          background-image: url(../img/question_analysis/practice_anal_btn.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          width: 3rem;
          height: 0.6rem;
        }
        .analysis_text {
          text-align: left;
          color: #ffffff;
          font-size: 0.28rem;
          width: 6.2rem;
          border-radius: 0.3rem;
          background-color: rgb(12, 135, 255);
          padding: 0.2rem;
          margin: 0.3rem 0 0.5rem 0;
        }
        .analysis-callback {
          background-image: url(../img/answer_result_img/an_result_onemore.png);
        }
      }
    }
  }
  img {
    max-width: 100%;
  }
}
</style>

