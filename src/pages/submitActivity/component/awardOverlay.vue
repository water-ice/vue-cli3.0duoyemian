<template>
  <div class="award-overlay" v-show="flag" @touchmove="e => e.preventDefault()">
    <div class="overlay" @click="closeOverlay"></div>
    <div class="overlay-content">
      <img src="./resource/close.png" @click="closeOverlay" class="close-pic">
      <div class="overlay-title">{{title[level - 1]}}</div>
      <div class="overlay-tip">{{level | levelFilter}}</div>
      <div class="overlay-box">
        <award-box :status="level"></award-box>
      </div>
      <div class="overlay-button" :class="status ? '': 'active'" @click="lottery(status, level)">
        {{status ? `仅差${num}篇过审即可开启`:'开启礼盒'}}
      </div>
    </div>
  </div>
</template>
<script>
import AwardBox from './awardBox.vue';

export default {
  props: {
    level: {
      type: Number,
      default: 1,
    },
    flag: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    num: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      title: [
        '一星礼盒',
        '二星礼盒',
        '三星礼盒',
        '四星礼盒',
        '五星礼盒',
      ],
    };
  },
  filters: {
    levelFilter(level) {
      return level < 5 ? '开启礼盒可随机获得以下奖品之一'
        : '开启礼盒 可获得以下全部奖励';
    },
  },
  methods: {
    closeOverlay() {
      this.$emit('close');
    },
    lottery(status, level) {
      this.$emit('lottery', status, level);
    },
  },
  components: {
    AwardBox,
  },
};
</script>
<style lang="less">
.award-overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;

  .overlay {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
  }

  .overlay-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 6rem;
    height: 8.52rem;
    background: url('./resource/award.png') 0 0 no-repeat;
    background-size: 100% auto;

    .close-pic {
      position: absolute;
      right: -.15rem;
      top: 2.1rem;
      width: .36rem;
    }

    .overlay-title {
      text-align: center;
      margin-top: 2.4rem;
      font-size: .42rem;
      color: #fff;
    }
    .overlay-tip {
      font-size: .28rem;
      color: #f22121;
      margin-top: .61rem;
      text-align: center;
      margin-bottom: .4rem;
    }
    .overlay-button {
      width: 4.64rem;
      margin: .4rem auto 0;
      text-align: center;
      height: .8rem;
      line-height: .8rem;
      background: #999;
      color: #fff;
      border-radius: .36rem;
      &.active {
        background: #f22121;
      }
    }
  }
}
</style>
