<template>
      <div class="main">
        <router-view></router-view>
        <outsideGuide :wxTip='wxTip' @wxGuide='wxTip = false'></outsideGuide>
      </div>
</template>
<script>
import { isIos } from 'plat-utils/src/systemInfo';
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import outsideGuide from '../../components/outsideGuide/outsideGuide.vue';
import Bus from './page/Bus/';

// import FastClick from 'fastclick';

export default {
  name: 'fiveAnniversary',
  components: {
    outsideGuide,
  },
  data() {
    return {
      isIos,
      wxTip: false,
    };
  },
  created() {
    hybrid('swapBack', { enabled: false });
    Bus.$on('wxGuide', () => {
      this.wxTip = true;
    });
    zybLog.send({
      type: 'pv',
    });
  },
};
</script>
<style lang="scss" scoped>
  html,body {
    width: 100%;
    height: 100%;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
  a, img, button, input, textarea, label, div, span {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
  ul {
    -webkit-overflow-scrolling: touch;
  }
  .main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .bubble {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100000;
    background: rgba(0,0,0,.4);
    top: 0;
  }
  body {
    a, a:hover {
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      outline: 0;
      user-select: none;
    }
    background-color: rgb(247, 247, 247);
    p {
      text-align: center;
      user-select: none;
    }
    .text {
      text-align: center
    }
  }
</style>
