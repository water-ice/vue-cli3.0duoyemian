<template>
  <div class="term-begin-vip">
    <!-- items -->
    <div class="term-begin-items">
      <div class="item" v-for="(item,index) in items" :key="index">
        <div :class="['bg',{'term-begin-active':index===swipeIndex}]">
          <img :src="item.img">
        </div>
        <div :class="['text',{'term-begin-text-active':index===swipeIndex}]">{{item.text}}</div>
      </div>
    </div>
    <!-- swiper -->
    <div class="term-begin-swiper">
      <zyb-swipe
        :cell-spacing="20"
        :auto="3000"
        @change="handleChange"
        style="border-radius: 4px;"
      >
        <zyb-swipe-item v-for="(item,index) in swipers" :key="index" class="item">
          <img :src="item" class="img-item" @touchstart="log">
        </zyb-swipe-item>
      </zyb-swipe>
    </div>
  </div>
</template>

<script>
import zybLog from 'plat-utils/src/zybLog';

export default {
  data() {
    return {
      swipers: [
        require('../resource/swiper/video.png'),
        require('../resource/swiper/practice.png'),
        require('../resource/swiper/sync.png'),
        require('../resource/swiper/identify.png'),
      ],
      items: [
        { img: require('../resource/swiper/logo.png'), text: '视频特权' },
        {
          img: require('../resource/swiper/practice-logo.png'),
          text: '练习特权',
        },
        { img: require('../resource/swiper/sync-logo.png'), text: '同步课' },
        {
          img: require('../resource/swiper/identify-logo.png'),
          text: '身份特权',
        },
      ],
      swipeIndex: 0,
    };
  },
  methods: {
    log() {
      zybLog.send({ type: 'privilegecard' });
    },
    handleChange(val) {
      this.swipeIndex = val;
    },
  },
};
</script>

<style lang="scss" >
@import "../mixin.scss";

.term-begin-vip {
      box-sizing: border-box;
  width: rem(660);
  height: rem(1009);
  margin: rem(60) auto 0;
  padding-top: rem(130);
  background: url("../resource/swiper/swiperbg.png") no-repeat;
  background-size: contain;
  .term-begin-items {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: rem(150);
    width: 100%;
    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      height: 100%;
      width: rem(114);
      .bg {
        background-color: #ff5d63;
        width: rem(110);
        border-radius: 50%;
        height: rem(110);
        border: 2px solid #fff;
        img {
          width: 100%;
          height: auto;
        }
      }
      .text {
        color: #da1526;
        font-size: rem(24);
        line-height: 1;
      }
      .term-begin-active {
        background-color: #e4333b;
      }
      .term-begin-text-active {
        color: #b90007;
      }
    }
  }
  .term-begin-swiper {
    width: rem(486);
    margin: rem(40) auto 0;
    .item {
      .img-item {
        width: rem(486);
      }
    }
    .zyb-swipe__indicators .zyb-swipe__indicator {
      border: 1px solid #f6d979;
      width: rem(10);
      height: rem(10);
    }
    .zyb-swipe__indicators .zyb-swipe__indicator--active {
      background-color: #f6d979;
      opacity: 0.5;
    }
  }
}
</style>

