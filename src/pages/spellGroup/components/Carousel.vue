<template>
  <div class='content' :class='{detailContent:detail}'>
    <div class='contentInfo' :class='{detailInfo:detail}'>
      <div class="swiper-container">
        <zyb-swipe :auto='3000'>
          <zyb-swipe-item v-for='(item, index) in items' :key='index'>
            <div class="item_img">
              <img :src='item' alt="">
            </div>
          </zyb-swipe-item>
        </zyb-swipe>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      items: ['https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content1_4fa5500.png',
        'https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content2_8681dff.png',
        'https://yy-s.zuoyebang.cc/static/practice/learnEnergyPackage/vipSpecial/resource/content3_fd486fd.png'],
    };
  },
  props: {
    detail: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped lang='less'>
.content {
  width: 6.72rem;
  height: 10.72rem;
  margin: 0 auto;
  background: url('../resource/contentBg.png') no-repeat;
  background-size: contain;

  .contentInfo {
    padding-top: 3.12rem;
    margin: 0 auto;

    .swiper-container {
      width:  5.5rem;
      height: 6.2rem;
      margin: 0.3rem auto 0;
      overflow: hidden;

      .item_img {
        width: 5.07rem;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
    }
  }

  .detailInfo {
    padding-top: 2.8rem;
  }
}
.detailContent {
  width: 6.56rem;
  height: 10.44rem;
  background: url('../resource/detail-contentBg.png') no-repeat;
  background-size: contain;
}
</style>
