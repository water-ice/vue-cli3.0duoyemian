<template>
  <div id="box" ref='contain'>
      <ul ref='con1' class='rowup' :style='{
        webkitAnimation: `rowup ${this.totalTime}s ${this.aniType} ${this.delayTime}s ${this.count} ${this.direction}`,
        animation: `rowup ${this.totalTime}s ${this.aniType} ${this.delayTime}s ${this.count} ${this.direction}`}'>
        <slot></slot>
      </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      totalTime: { // 滚动总时长
        type: Number,
        default: 2,
      },
    };
  },
  props: {
    len: { // 渲染列表
      type: Number,
      default: 0,
    },
    time: { // 单个滚动时长
      type: Number,
      default: 2,
    },
    aniType: { // 滚动类型
      type: String,
      default: 'linear',
    },
    delayTime: { // 延迟时间
      type: String,
      default: '0',
    },
    count: { // 滚动次数
      type: String,
      default: 'infinite',
    },
    direction: { // 滚动方向
      type: String,
      default: 'normal',
    },
  },
  methods: {
    // 设置滚动终点位置
    setKeyFrames(y) {
      const styleList = document.getElementsByTagName('style');
      let style = null;
      if (styleList.length > 0) {
        style = styleList[styleList.length - 1];
      } else {
        style = document.createElement('style');
        style.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(style);
      }
      const keyFrames = `\
        @-webkit-keyframes rowup {\
            0% {\
                -webkit-transform: translate3d(0, 0, 0);\
                transform: translate3d(0, 0, 0);\
            }\
            100% {\
                -webkit-transform: translate3d(0, ${y}, 0);\
                transform: translate3d(0, ${y}, 0);\
            }\
        }\
        @keyframes rowup {\
            0% {\
                -webkit-transform: translate3d(0, 0, 0);\
                transform: translate3d(0, 0, 0);\
            }\
            100% {\
                -webkit-transform: translate3d(0, ${y}, 0);\
                transform: translate3d(0, ${y}, 0);\
            }\
        }`;

      style.innerHTML += keyFrames;
    },
  },
  mounted() {
    this.totalTime = this.time * this.len;
    const cHeight = this.$refs.con1.clientHeight;
    this.setKeyFrames(`-${cHeight}px`);
  },
};
</script>
<style scoped>
#box{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
