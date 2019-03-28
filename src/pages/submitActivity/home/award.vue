<template>
  <div class="box-container">
    <img :src="status ? require('./resource/open.png') : picList[level - 1]" class="box">
    <div class="search">查看</div>
    <div class="msg" :class="status ? 'active' : ''">
      <p class="name">{{level}}星礼盒</p>
      <p class="has-pass">过审{{needPass}}篇可开启</p>
      <p class="has-get">已有{{hasGet}}人领取</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 1,
    },
    needPass: {
      type: Number,
      default: 0,
    },
    hasGet: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      picList: [
        require('./resource/star1.png'),
        require('./resource/star2.png'),
        require('./resource/star3.png'),
        require('./resource/star4.png'),
        require('./resource/star5.png'),
      ],
    };
  },
};
</script>
<style lang="less">
.box-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .search {
    color: #fff;
    font-size: .24rem;
    width: 1.1rem;
    height: .38rem;
    line-height: .38rem;
    text-align: center;
    background: #ff3b3b;
    border-radius: .08rem;
    margin-top: .07rem;
  }
  .box {
    width: 1.28rem;
  }
  .msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: .2rem;
    &.active {
      color: #f22121;
    }
    .name {
      font-size: .24rem;
      color: #f22121;
    }

  }
}
</style>

