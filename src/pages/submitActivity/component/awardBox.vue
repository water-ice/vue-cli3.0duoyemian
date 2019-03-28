<template>
  <div class="award-boxs">
    <div class="award-left award-section">
      <img :src="coinPicList[status - 1]" class="h-coin">
      <span>{{hCoinMsgList[status - 1]}}</span>
    </div>
    <div class="award-center ">
      <div :style="{backgroundImage: 'url(' + awardList[status - 1] + ')'}" class="center-pic"></div>
      <span>{{awardMsgList[status - 1]}}</span>
    </div>
    <div class="award-right award-section" :class="{'last': status === 5}">
      <img :src="qCoinList[status - 1]" class="q-coin">
      <span>{{qCoinMsgList[status - 1]}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      hCoinMsgList: [
        '50帮帮币',
        '150帮帮币',
        '250帮帮币',
        '500帮帮币',
        '1250帮帮币',
      ],
      awardMsgList: [
        '定制卡套',
        '大栗笔记本',
        '大栗帆布袋',
        '大栗帆布袋',
        '大栗帆布袋',
      ],
      qCoinMsgList: [
        '5Q币',
        '5Q币',
        '10Q币',
        '20Q币',
        '荣誉证书',
      ],
      coinPicList: [
        require('./resource/b1.png'),
        require('./resource/b2.png'),
        require('./resource/b3.png'),
        require('./resource/b4.png'),
        require('./resource/b5.png'),
      ],
      awardList: [
        require('./resource/a1.png'),
        require('./resource/a2.png'),
        require('./resource/a3.png'),
        require('./resource/a4.png'),
        require('./resource/a4.png'),
      ],
      qCoinList: [
        require('./resource/q1.png'),
        require('./resource/q1.png'),
        require('./resource/q3.png'),
        require('./resource/q4.png'),
        require('./resource/q5.png'),
      ],
    };
  },
};
</script>

<style lang="less">
.award-boxs {
  padding: 0 .15rem;
  font-size: .24rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2.76rem;
  .award-section {
    width: 1.6rem;
    height: 2.72rem;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: .5rem .12rem .2rem;
    img {
      width: 1.4rem;
    }
    &.last {
      padding: 0;
      span {
        text-align: center;
      }
    }
  }
  .award-center {
    width: 2.28rem;
    border: 1px solid #d8d8d8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding-bottom: .2rem;
    box-sizing: border-box;
    height: 100%;
    .center-pic {
      width: 2rem;
      height: 2rem;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    img {
      width: 2rem;
    }
  }
}
</style>
