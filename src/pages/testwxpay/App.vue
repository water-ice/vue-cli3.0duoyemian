<template>
  <div class="wrap">
    <div class="btn">
      <div class="btnText" @click="toPay">点击领取福利</div>
    </div>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';

export default {
  name: 'testwxpay',
  data() {
    return {};
  },
  created() {
  },
  methods: {
    toPay() {
      const serverId = 31;
      const itemId = 999;
      const wxfee = 990;
      const items = `${serverId}_${itemId}_1`;
      this.$fetch({
        url: '/support/pay/h5api',
        method: 'post',
        data: {
          items,
          fee: wxfee,
          payChannel: 'WX_H5API',
        },
        formType: true,
      }).then((res) => {
        if (res.errNo === 0) {
          if (res.data.payParam.redirectURL) {
            const wxpayPage = res.data.payParam.redirectURL;
            setTimeout(() => {
              window.location.href = wxpayPage;
            }, 200);
          }
        } else {
          hybrid('toast', { text: '支付失败' });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@function rem($px) {
  $ui: 750;
  @return $px / (100/ (720 / $ui)) + rem;
}
.wrap {
  width: 100%;
  position: relative;
  .btn {
    position: fixed;
    left: 0;
    width: 100%;
    height: rem(128);
    background-color: rgb(53, 53, 53);
    z-index: 1000;
    line-height: rem(128);
    text-align: center;
    .btnText {
      display: inline-block;
      width: rem(686);
      height: rem(84);
      margin: 0 auto;
      background-color: #fbc70e;
      border-radius: rem(40);
      text-align: center;
      font-size: rem(40);
      line-height: rem(80);
      color: #a53f12;
    }
  }
}
</style>

