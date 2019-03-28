<template>
  <div>
    <div class='loginContain'>
      <p class='userName'>{{userName}}</p>
      <div @click='loginHandler' class='btn'>{{getBtnText}}</div>
    </div>
    <div v-show='showLogin' class='contain' @click='hideLogin' @touchmove.prevent>
      <div class='content' @click.stop>
        <div id='loginContent'></div>
        <div class='wxBtn' @click='wxLoginHandler'>微信登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import zybLog from 'plat-utils/src/zybLog';
import LoginUI from 'zyb-login';
import Toast from '../../../components/Toast';

export default {
  data() {
    return {
      showLogin: false,
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      default: '',
    },
    source: {
      type: String,
    },
  },
  computed: {
    getBtnText() {
      return this.isLogin ? '退出' : '登录';
    },
    loginSDK() {
      return new LoginUI({
        el: '#loginContent',
      });
    },
  },
  methods: {
    loginHandler() {
      if (this.isLogin) {
        this.loginSDK.logout()
          .then((res) => {
            if (res.errNo === 0) {
              window.location.reload();
            } else {
              Toast(res.errstr);
            }
          })
          .catch((err) => {
            Toast(err.message);
          });
      } else {
        this.showLogin = true;
        this.loginSDK.on('login', (res) => {
          this.sendLog('WeChat-login-phone');
          if (res.type === 'success') {
            Toast('登录成功');
            window.location.reload();
          } else {
            Toast('登录失败');
          }
        });
      }
    },
    wxLoginHandler() {
      this.hideLogin();
      this.sendLog('WeChat-login-wx');
      const path = `https://www.zuoyebang.com/activity/vipgroupon/oauth?ref=${window.encodeURIComponent(window.location.href)}`;
      window.location.href = path;
    },
    hideLogin() {
      this.showLogin = false;
    },
    sendLog(logType) {
      zybLog.send({
        type: logType,
        uid: '',
        from: this.source,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.loginContain {
  position: fixed;
  width: 100%;
  height: 0.6rem;
  top: 0;
  left: 0;
  font-size: 0.22rem;
  color: #999999;
  background: #fff;
  line-height: 0.6rem;
  z-index: 98;

  .userName {
    float: left;
    margin-left: 0.6rem;
  }

  .btn {
    float: right;
    margin-right: 0.9rem;
  }
}
.contain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 99;

  .content {
    position: absolute;
    width: 80%;
    padding: 0.2rem;
    top: 50%;
    left: 50%;
    font-size: 0.32rem;
    background: #fff;
    border-radius: 0.2rem;
    transform: translate(-50%, -50%);
  }
  .wxBtn {
    margin-top: .25rem;
    height: 0.76rem;
    line-height: 0.76rem;
    font-size: 0.28rem;
    color: #fff;
    background: #00c800;
    border-radius: .2em;
    border: 1px solid #dbdbdb;
    text-align: center;
  }
}
</style>
