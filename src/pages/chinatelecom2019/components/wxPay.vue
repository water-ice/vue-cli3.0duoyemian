<template>
  <div class="wxpay">
    <!-- msg -->
    <div
      class="wxpay_confirm_dialog hide"
      v-if="showConfirm"
      @touchmove="e => {e.preventDefault()}"
    >
      <div class="confirm_box">
        <div class="title">请确认微信支付是否完成?</div>
        <div class="choice_btn" @click="confirm">已完成支付
        </div>
      </div>
    </div>
    <!-- loading -->
    <div class="loading" v-if="showLoading">
      <div class="loadItem">
        <zyb-icon name="loading" size=".8rem" spin/>
      </div>
    </div>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import { Icon } from 'h2';
import 'h2/packages/styles/icon.scss';

export default {
  components: {
    [Icon.name]: Icon,
  },
  data() {
    return {
      showLoading: false,
      showConfirm: false,
      // 保存支付成功状态
      paySuccess: false,
      num: 0,
      payFailed: '',
      orderid: 0,
    };
  },
  created() {
    this.getStorage();
  },
  methods: {
    // 返回此页面执行此方法
    getStorage() {
      const id = sessionStorage.getItem('orderid');
      if (id) {
        this.startPolling();
        this.showConfirm = true;
        this.orderid = id;
      }
    },
    // 查询支付状态
    getPayStatus() {
      return this.$fetch.get(`/support/pay/ajaxstatus?orderId=${this.orderid}`);
    },
    // 处理支付状态
    handleStatus(res) {
      if (res.errNo === 0) {
        this.num += 1;
        if (res.data.payStatus === 1) {
          // 保存支付状态
          this.paySuccess = true;
          // 如果是点击确认按钮过来的，支付成功的反馈
          if (this.payFailed === '1') {
            this.confirm();
            this.payFailed = '';
          }
        } else if (this.num <= 9) {
          this.startPolling();
        } else {
          this.showLoading = false;
          // 点击确认后未支付的反馈
          if (this.payFailed === '1') {
            this.showConfirm = false;
            this.showLoading = false;
            hybrid('toast', { text: '支付未成功，您可以选择重新支付' });
            this.payFailed = '';
          }
        }
      } else {
        hybrid('toast', { text: '查询失败' });
      }
    },
    // 开始轮询
    startPolling() {
      this.getPayStatus.then(this.handleStatus);
    },
    // 点击已完成支付
    confirm() {
      if (this.paySuccess) {
        this.showConfirm = false;
        hybrid('toast', { text: '支付成功！' });
        sessionStorage.removeItem('orderid');
      } else if (this.clicked) {
        this.showLoading = false;
        this.showConfirm = false;
        hybrid('toast', { text: '查询失败，请进入个人中心查看支付状态。' });
        this.clicked = false;
      } else {
        this.clicked = true;
        this.num = 0;
        this.showLoading = true;
        this.startPolling();
        this.payFailed = '1';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wxpay {
  width: 100%;
  position: relative;
  // loading
  .loading {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1006;
    .loadItem {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 1007;
      transform: translate(-50%, -50%);
    }
  }
  /*vip微信支付确认框  */
  .wxpay_confirm_dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1004;
    .confirm_box {
      position: absolute;
      background: #fff;
      width: 5.6rem;
      height: 2.6rem;
      border-radius: 4px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1005;
      .title {
        border-bottom: 1px solid #e5e5e5;
        font-size: 0.28rem;
        color: #333333;
        text-align: center;
        height: 1.63rem;
        line-height: 1.63rem;
      }
      .choice_btn {
          display: block;
          width: 100%;
          text-align: center;
          height: 0.95rem;
          line-height: 0.95rem;
          font-size: 0.32rem;
          color: #4cc760;

      }
    }
  }
}
</style>

