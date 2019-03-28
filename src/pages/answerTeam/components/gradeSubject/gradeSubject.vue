<template>
  <div class="tan-grade" @touchmove="e => { e.preventDefault(); }">
    <div class="tan-box" v-show="gradeShow">
      <div class="title" :style="{ color : mainColor }">请选择加入答题团的年级<b class="tan-close" @click="closeGradeTan"></b></div>
      <div class="content">
        <ul>
          <li v-for="(item, index) in gradeArray" :key="index" :class="{ active : index === gIndex }" @click="gradeSelect(index)">{{ item }}</li>
        </ul>
      </div>
    </div>
    <div class="tan-box" v-show="subjectShow">
      <div class="title" :style="{ color : mainColor }">请选择加入答题团的学科
        <b class="tan-back" @click="backGradeTan"></b>
        <b class="tan-close" @click="closeSubjectTan"></b>
      </div>
      <div class="content">
        <ul v-for="(item, index) in subjectArray" :key="index" v-show="index === subjectIndex">
          <li v-for="(subject, index) in item" :key="index" :class="{ active : index === sIndex }" @click.once="subjectSelect(index)">{{ subject }}</li>
        </ul>
      </div>
    </div>
    <div class="success-box" v-show="successShow">
      <b class="tan-close" @click="closeSuccessTan"></b>
      <div class="head-pic"></div>
      <h3 :style="{ color : mainColor }">恭喜你加入《{{ communityName }}》</h3>
      <p>快与团队并肩战斗吧</p>
      <span @click="goAnswer" :style="{ backgroundColor : mainColor }">去答题</span>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

export default {
  data() {
    return {
      gradeShow: true,
      subjectShow: false,
      successShow: false,
      communityId: 0,
      communityName: '',
      gradeArray: { 1: '小学', 2: '初中', 3: '高中' },
      gIndex: 0,
      sIndex: 0,
      subjectIndex: 0,
      subjectArray: {
        1: {
          1: '小学语文', 2: '小学数学', 3: '小学英语',
        },
        2: {
          1: '初中语文', 2: '初中数学', 3: '初中英语', 4: '初中综合',
        },
        3: {
          1: '高中语文', 2: '高中数学', 3: '高中英语', 5: '高中文综', 6: '高中理综',
        },
      },
      gradeId: 0,
      courseId: 0,
    };
  },
  props: {
    chooseGrade: Boolean,
    mainColor: String,
  },
  methods: {
    gradeSelect(index) {
      this.gIndex = index;
      this.gradeId = index;
      setTimeout(() => {
        this.gIndex = 0;
        this.subjectIndex = index;
        this.gradeShow = false;
        this.subjectShow = true;
      }, 300);
      zybLog.send({
        type: 'gradeSelect',
        gradeId: index,
      });
      zybLog.send({
        type: 'subjectWindowShow',
      });
    },
    subjectSelect(index) {
      this.courseId = index;
      this.sIndex = index;
      setTimeout(() => {
        const url = '/napi/activity/answercommunityapply';
        this.$fetch({
          url,
          data: {
            gradeId: this.gradeId,
            courseId: this.courseId,
          },
          method: 'post',
          formType: true,
        }).then((res) => {
          if (!res.errNo) {
            this.sIndex = 0;
            this.communityId = res.data.communityId;
            this.communityName = res.data.name;
            this.subjectShow = false;
            this.successShow = true;
          }
        });
      }, 300);
      zybLog.send({
        type: 'subjectSelect',
        subjectId: index,
      });
    },
    closeGradeTan() {
      this.$emit('showGrade', false);
      zybLog.send({
        type: 'gradeWindowClose',
      });
    },
    closeSubjectTan() {
      this.$emit('showGrade', false);
      this.subjectShow = false;
      this.gradeShow = true;
      zybLog.send({
        type: 'subjectWindowClose',
      });
    },
    closeSuccessTan() {
      this.successShow = false;
      this.$emit('showGrade', false);
      const path = window.location.pathname.split('/')[3];
      if (path === 'answerIndex.html') {
        hybrid('openWindow', {
          url: `${window.location.origin}/plat/activity-vue/answerTeam.html?communityId=${this.communityId}`,
        });
      } else {
        hybrid('closeAndOpenWindow', {
          url: `${window.location.origin}/plat/activity-vue/answerTeam.html?communityId=${this.communityId}`,
        });
      }
    },
    backGradeTan() {
      this.subjectShow = false;
      this.gradeShow = true;
      zybLog.send({
        type: 'subjectWindowGoback',
      });
    },
    goAnswer() {
      hybrid('unsolved_questionlist', { list: 0 });
      this.successShow = false;
      zybLog.send({
        type: 'goAnswerWindow',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tan-grade {
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
.tan-box {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 50%;
  border-radius: .2rem;
  background-color: #fff;
  overflow: hidden;
  transform: translateY(-50%);
  .title {
    position: relative;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: .34rem;
    font-weight: bold;
    // color: #ff5400;
    border-bottom: 1px solid #d8d8d8;
    .tan-close {
      position: absolute;
      display: block;
      top: .37rem;
      right: .3rem;
      width: .25rem;
      height: .25rem;
      background: url("../../resource/tan_close.png") no-repeat;
      background-size: 100% 100%;
    }
    .tan-back {
      position: absolute;
      display: block;
      top: .35rem;
      left: .3rem;
      width: .21rem;
      height: .29rem;
      background: url("../../resource/tan_back.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .content {
    width: 100%;
    padding: .3rem .5rem .2rem;
    box-sizing: border-box;
    ul {
      width: 100%;
      li {
        width: 100%;
        height: .8rem;
        margin-bottom: .2rem;
        list-style-type: none;
        border-radius: .4rem;
        line-height: .75rem;
        color: #ff5400;
        font-size: .26rem;
        text-align: center;
        border: 2px solid #ff5400;
        background-color: #fff;
        box-sizing: border-box;
      }
      .active {
        color: #fff;
        background-color: #ff5400;
      }
    }
  }
}
.success-box {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 50%;
  border-radius: .2rem;
  background-color: #fff;
  transform: translateY(-45%);
  .head-pic {
    position: absolute;
    top: -2rem;
    left: .7rem;
    width: 3.64rem;
    height: 3.28rem;
    background: url("../../resource/tan_hand.png") no-repeat;
    background-size: 100% 100%;
  }
  .tan-close {
    position: absolute;
    display: block;
    top: .35rem;
    right: .3rem;
    width: .25rem;
    height: .25rem;
    background: url("../../resource/tan_close.png") no-repeat;
    background-size: 100% 100%;
  }
  h3 {
    width: 100%;
    margin-top: 1.8rem;
    font-size: .32rem;
    font-weight: bold;
    text-align: center;
    // color: #ff5400;
  }
  p {
    margin-top: .25rem;
    text-align: center;
    font-size: .26rem;
    color: #666;
  }
  span {
    display: block;
    width: 80%;
    height: .8rem;
    margin: .6rem auto .4rem;
    border-radius: .4rem;
    font-size: .32rem;
    text-align: center;
    line-height: .8rem;
    color: #fff;
    // background-color: #ff5400;
  }
}
</style>
