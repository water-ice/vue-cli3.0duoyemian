<template>
  <div class="award-container">
    <div v-if="boxLevel < 5" class="one-award">
      <div class="pic" :style="{backgroundImage: 'url(' + pic + ')'}"></div>
      <p class="desc">{{desc}}</p>
    </div>
    <div v-else class="five-box">
      <div class="award-section-fst award-section">
        <img src="./resource/b5.png" alt="">
        <p>1250帮帮币</p>
      </div>
      <div class="award-center award-section">
        <img src="./resource/a4.png" class="gift-box">
        <p>大栗礼盒</p>
      </div>
      <div class="award-section-sed award-section">
        <img src="./resource/q5.png" class="book">
        <p>荣誉证书</p>
      </div>
    </div>
  </div>
</template>
<script>
import AwardBox from './awardBox.vue';

export default {
  props: {
    boxLevel: {
      type: Number,
      default: 1,
    },
    pic: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
  components: {
    AwardBox,
  },
};
</script>
<style lang="less">
.one-award {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2.93rem;
  margin: 0 auto;
  border: 1px solid #d8d8d8;
  height: 2.32rem;
  padding-top: .1rem;

  .pic {
    width: 1.98rem;
    height: 1.71rem;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .desc {
    font-size: .24rem;
    color: #666;
  }
}
.five-box {
  width: 5.71rem;
  margin: 0 auto;
  height: 2.32rem;
  font-size: .24rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .award-section-fst {
    border: 1px solid #d8d8d8;
    padding: .17rem .12rem .09rem;

    img {
      width: 1.4rem;

    }
  }
  .award-section {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    p {
      text-align: center;
    }
  }
  .award-center {
    border: 1px solid #d8d8d8;
    padding: .17rem .12rem .24rem;
    img {
      width: 1.85rem;
    }
  }
  .award-section-sed {
    border: 1px solid #d8d8d8;
    padding: .1rem .1rem 0;
    width: 1.6rem;
    img {
      width: .95rem;
    }
  }
}
</style>
