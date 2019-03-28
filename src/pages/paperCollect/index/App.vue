<template>
  <div class="paperWrap">
    <img src="./resource/index_top.png" alt="">
    <img src="./resource/index_bottom.png" alt="">
    <div class="myRecord" @click="jump('record')"></div>
    <a class="apply-group qq_junior" href="https://jq.qq.com/?_wv=1027&k=5hy2ZtS"></a>
    <a class="apply-group qq_senior" href="https://jq.qq.com/?_wv=1027&k=5cHncht"></a>
    <div class="fixed-btn" @click="jump('info')"></div>
  </div>
</template>
<script>
import share from 'plat-utils/src/share';
import hybrid from 'plat-utils/src/hybrid';
import { inApp } from 'plat-utils/src/systemInfo';

export default {
  name: 'papercollect',
  data() {
    return {
      isLogin: null,
      type: null,
      url: '',
    };
  },
  watch: {
    isLogin() {
      this.notAppGoNext();
    },
  },
  methods: {
    init() {
      share({
        url: window.location.href, // 分享链接，一般为当前页面的链接
        content: '总是找不到想要的试卷？快来加入我们的试卷库吧！查试卷拿红包！', // 分享内容
        title: '上传试卷得现金红包', // 分享标题
        pic: 'https://yy-s.zuoyebang.cc/static/activity/zuoyebang/share.jpg', // 分享缩略图
      });
    },
    isLoginStatus() {
      this.$fetch('/napi/ajax/logininfo')
        .then((res) => {
          if (res && res.errNo === 0) {
            this.isLogin = true;
          } else {
            this.isLogin = false;
          }
        })
        .catch(() => {
          this.isLogin = false;
        });
    },
    jump(type) {
      this.type = type;
      const prefix = `${window.location.origin}/plat/activity-vue`;
      this.url = this.type === 'record'
        ? `${prefix}/paperCollectRecord.html`
        : `${prefix}/paperCollectInfo.html`;
      if (inApp) {
        hybrid('is_login', (res) => {
          if (!res.isLogin) {
            hybrid('loginForResult', {}, () => {
              this.isLoginStatus();
            });
          } else {
            hybrid('openWindow', {
              url: this.url,
            });
          }
        });
      } else if (this.isLogin !== null) {
        this.notAppGoNext();
      }
    },
    notAppGoNext() {
      if (this.type === null) {
        return;
      }
      if (!this.isLogin) {
        if (/(h5\.zybang\.com|h5\.zuoyebang\.com)/.test(window.location.origin)) {
          window.location.href = `https://www.zybang.com/passport/login?redirect=${encodeURIComponent(window.location.href)}`;
        } else {
          window.location.href = `${window.location.origin}/passport/login?redirect=${encodeURIComponent(window.location.href)}`;
        }

        // window.location.href = `${window.location.origin}/passport/login?redirect=${encodeURIComponent(window.location.href)}`;
      } else {
        window.location.href = this.url;
      }
    },
  },
  created() {
    this.init();
    if (!inApp) {
      this.isLoginStatus();
    }
  },
};
</script>
<style lang="less" scoped>
.paperWrap {
  position: relative;
  background: #75b9fa;
  height: 100%;
  padding-bottom: .9rem;
  img {
    width: 100%;
  }
  .apply-group {
    position: absolute;

    left: 5.38rem;
    display: inline-block;
    width: 1.46rem;
    height: .45rem;
    background: url(./resource/apply_group.png) no-repeat;
    background-size: 100% auto;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    &.qq_junior{
      bottom: 3.22rem;
    }
    &.qq_senior{
      bottom: 2.63rem;
    }
  }
  .fixed-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .9rem;
    background: url(./resource/fixed_btn.png) no-repeat;
    background-size: 100% auto;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  .myRecord {
    position: absolute;
    right: .12rem;
    top: .25rem;
    width: 1.8rem;
    height: .51rem;
    background: url(./resource/upload_record.png) no-repeat;
    background-size: 100% auto;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
}
</style>

