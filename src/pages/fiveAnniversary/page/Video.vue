<template>
  <div class="vwrap">
        <div class='vView' view-mode="h" view-rotation="auto" view-scale="exactfit" view-width="1280" view-height="720" view-align="">
          <div style="position: absolute;" v-show="videoShow">
              <video ref='video' class="compatibleStyle" id="canvasVideo" style="position:absolute; display:none;"></video>
          </div>
          <div class="dom" v-if="curScene">
          <!-- 起始页 -->
          <div class="scene scene1" v-if="curScene === 'start'">
            <img class="rkt" src="../img/video/home2.png" alt="" srcset="">
            <div class="holder" @click="start"></div>
          </div>
          <!-- 场景选择页 -->
          <div class="scene scene2" v-if="curScene === 'scene-nav'">
            <div class="label label1">
              <img v-if="remainScene.indexOf('scene-code')>-1" src="../img/video/label1.png" alt="" srcset="" @click="goScene('scene-code')">
            </div>
            <div class="label label2">
              <img v-if="remainScene.indexOf('scene-des')>-1" src="../img/video/label2.png" alt="" srcset="" @click="goScene('scene-des')">
            </div>
            <div class="label label3">
              <img v-if="remainScene.indexOf('scene-tea')>-1" src="../img/video/label3.png" alt="" srcset="" @click="goScene('scene-tea')">
            </div>
          </div>
          <!-- 码农页 -->
          <div class="scene scene-code" v-else-if="curScene === 'scene-code'">
            <img src="../img/video/hint.png" alt="" class="hint">
            <img class='enter' src="../img/video/enter.png" alt="" srcset="" @click="setVideo(vSrc.code.url2.url,vSrc.code.url2.timesParam)">
          </div>
          <!-- 设计师页 -->
          <div class="scene scene-des-bg" v-else-if="curScene === 'scene-des'">
            <div class="scene-des">
              <div class="cBtn red" @click="setVideo(vSrc.des.url2.url,vSrc.des.url2.timesParam,'red')"></div>
              <div class="cBtn purple" @click="setVideo(vSrc.des.url3.url,vSrc.des.url3.timesParam,'purple')"></div>
              <div class="cBtn blue" @click="setVideo(vSrc.des.url4.url,vSrc.des.url4.timesParam,'blue')"></div>
            </div>
          </div>
          <!-- 设计师分页 -->
          <div :class="['scene','scene-des-color',`${selectColor}-bg`]" v-else-if="curScene === 'scene-des-color'" @click="nextPage">
            <img class='pre' id='red' src="../img/video/red.jpg" alt="" v-show="selectColor === 'red'">
            <img class='pre' id='purple' src="../img/video/purple.jpg" alt="" v-show="selectColor === 'purple'">
            <img class='pre' id='blue' src="../img/video/blue.jpg" alt="" v-show="selectColor === 'blue'">
            <img class="next" src="../img/video/saveImg.png" @click="saveImg"/>
          </div>
          <!-- 老师页 -->
          <div class="scene scene-tea" v-else-if="curScene === 'scene-tea'">
            <img src="../img/video/enter.png" alt="" srcset="" @click="goVideo(4)">
          </div>
          <!-- 感谢页 -->
          <div class="scene thanks" v-else-if="curScene === 'thanks'" @click="sceneEnd">
            <div :class="['wrap',`${page}-w`]">
              <img v-if="page === 'scene-code'" src="../img/video/code-end.png" alt="" srcset="">
              <img v-if="page === 'scene-des'" src="../img/video/des-end.png" alt="" srcset="" >
              <img v-if="page === 'scene-tea'" src="../img/video/tea-end.png" alt="" srcset="" >
              <p class="hText">点击继续</p>
            </div>
          </div>
          <!-- 衔接页 -->
          <div class="scene black" v-else-if="curScene === 'black'">
          </div>
          <!-- 吹蜡烛 -->
          <div :class="['scene','candle',{'fade':isFade}]" v-else-if="curScene === 'candle'">
            <img class='cake' src="../img/video/candle.png" alt="">
            <div :class="['fire-wrap']">
              <img :class="['fire',{'fade':isFade}]" src="../img/video/fire.png" alt="">
              <img :class="['fire',{'fade':isFade}]" src="../img/video/fire.png" alt="">
              <img :class="['fire',{'fade':isFade}]" src="../img/video/fire.png" alt="">
            </div>
            <div class="btn" @touchstart='blow' @touchend='blowEnd' @touchcancel='tCancel'></div>
          </div>
          <!-- 结束分享页 -->
          <div class="scene end" v-else-if="curScene === 'end'">
            <div class="share" @click="share"></div>
            <div class="again" @click="reload"></div>
          </div>
        </div>
        </div>
      </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import InvokeApp from 'plat-utils/src/invokeApp';
import { inApp, inWeChat } from 'plat-utils/src/systemInfo';

import Bus from '../page/Bus/';

export default {
  data() {
    return {
      mp4Video: {},
      videoShow: false,
      curScene: 'start',
      selectColor: 'red',
      isFade: false,
      beginTime: '',
      vSrc: {
        start: { url: 'https://bd-s.zuoyebang.cc/zyb-186136.mp4', timesParam: [{ name: 'scene-nav', time: 13.5 }] },
        code: {
          url1: { url: 'https://bd-s.zuoyebang.cc/zyb-186137.mp4', timesParam: [{ name: 'scene-code1', time: 27 }] },
          url2: { url: 'https://bd-s.zuoyebang.cc/zyb-186108.mp4', timesParam: [{ name: 'end', time: 4 }] },
          url3: { url: 'https://bd-s.zuoyebang.cc/zyb-186138.mp4', timesParam: [{ name: 'candle', time: 7 }] },
        },
        des: {
          url1: { url: 'https://bd-s.zuoyebang.cc/zyb-186144.mp4', timesParam: [{ name: 'scene-des1', time: 23 }] },
          url2: { url: 'https://bd-s.zuoyebang.cc/zyb-186111.mp4', timesParam: [{ name: 'des-color', time: 7 }] },
          url3: { url: 'https://bd-s.zuoyebang.cc/zyb-186110.mp4', timesParam: [{ name: 'des-color', time: 7 }] },
          url4: { url: 'https://bd-s.zuoyebang.cc/zyb-186109.mp4', timesParam: [{ name: 'des-color', time: 7 }] },
          url5: { url: 'https://bd-s.zuoyebang.cc/zyb-186143.mp4', timesParam: [{ name: 'candle', time: 7 }] },
        },
        tea: {
          url1: { url: 'https://bd-s.zuoyebang.cc/zyb-186139.mp4', timesParam: [{ name: 'scene-tea', time: 28 }] },
          url2: { url: 'https://bd-s.zuoyebang.cc/zyb-186140.mp4', timesParam: [{ name: 'candle', time: 6 }] },
        },
        candle: {
          url1: { url: 'https://bd-s.zuoyebang.cc/zyb-186134.mp4', timesParam: [{ name: 'beforeCandle', time: 10 }] },
          url2: { url: 'https://bd-s.zuoyebang.cc/zyb-186135.mp4', timesParam: [{ name: 'afterCandle', time: 22 }] },
        },
      },
      timeStamp: [{}, {}, {}],
      remainScene: ['scene-code', 'scene-des', 'scene-tea'],
      page: '',
    };
  },
  mounted() {
    const ctx = this;
    // eslint-disable-next-line
    this.mp4Video = new MMD.VideoPlayer({
      videoElement: document.getElementById('canvasVideo'), // [必填],video元素
      src: ctx.vSrc.start.url, // [必填],video src
      loop: false, // [可选],是否循环,默认false,true为循环
      muted: false, // [可选],是否静音,默认false,IOS下只有IOS10生效,安卓生效
      poster: '', // [可选],video默认图片
      timesParam: [{ name: 'first', time: 5 }], // [可选],video currenttime时间点
      onTimes(name) {
        ctx.videoShow = false;
        ctx.mp4Video.pause();
        switch (name) {
          case 'scene-nav':
            ctx.curScene = 'scene-nav';
            break;
          case 'scene-code1':
            ctx.curScene = 'scene-code';
            break;
          case 'scene-des1':
            ctx.curScene = 'scene-des';
            break;
          case 'des-color':
            ctx.curScene = 'scene-des-color';
            break;
          case 'scene-tea':
            ctx.curScene = 'thanks';
            break;
          case 'candle':
            ctx.curScene = 'black';
            ctx.mp4Video.src = ctx.vSrc.candle.url1.url;
            ctx.mp4Video.timesParam = ctx.vSrc.candle.url1.timesParam;
            ctx.videoShow = true;
            ctx.mp4Video.play();
            break;
          case 'beforeCandle':
            ctx.curScene = 'candle';
            break;
          case 'afterCandle':
            ctx.curScene = 'end';
            break;
          case 'end':
            ctx.curScene = 'thanks';
            break;
          default:
            break;
        }
      }, // [可选],video currenttime回调
      onStart() {
      }, // [可选],video第一个画面出现回调
      onEnd() {
      }, // [可选],video播放完成回调
    });

    // mp4Video.play();// 播放视频
    // this.$refs.video.addEventListener('timeupdate', () => {
    //   this.curScene = 0;
    //   console.log(123);
    // });
  },
  methods: {
    nextPage() {
      this.curScene = 'thanks';
    },
    tCancel(e) {
      e.preventDefault();
      const nTime = new Date();
      if ((nTime - this.beginTime) > 2000) {
        this.setVideo(this.vSrc.candle.url2.url, this.vSrc.candle.url2.timesParam);
      } else {
        this.isFade = false;
      }
    },
    // 保存图片
    saveImg() {
      this.curScene = 'thanks';
      const color = `https://www.zybang.com/five_video/${this.selectColor}.jpg`;
      hybrid('downloadMedia', { url: color, type: 1 }, () => {
        //
      });
    },
    // 分享
    share() {
      // eslint-disable-next-line
      const shareConfig = {
        share_title: '和我一起穿越作业帮生日趴',
        share_text: '快和我一起闪现作业帮庆生现场吧!',
        share_img: 'https://img.zuoyebang.cc/zyb_7466d449e0ed87a2ca76563dfa19741b.png',
        share_url: `https://${window.location.host}/plat/activity-vue/fiveAnniversary.html#/Video`,
      };
      hybrid('share', shareConfig);
    },
    // 唤醒App
    openApp(cb) {
      if (inWeChat) {
        Bus.$emit('wxGuide');
      } else if (inApp || !inApp) {
        cb();
      } else {
        // 端外打开app
        const naLink =
        `homework://com.baidu.homework/web?url=${
          encodeURIComponent(window.location.href)}`;
        InvokeApp({
          downloadLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          yybLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          nativeLinkIos: naLink,
          nativeLinkAndroid: naLink,
          universalLink:
          `//oia.zybang.com/download/?page=${
            encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${window.location.href}`)}`,
        });
      }
    },
    // 再玩一次
    reload() {
      window.location.reload();
    },
    // 吹蜡烛
    blow(e) {
      e.preventDefault();
      // eslint-disable-next-line
      this.isFade = true;
      this.beginTime = new Date();
    },
    blowEnd(e) {
      e.preventDefault();
      const nTime = new Date();
      if ((nTime - this.beginTime) > 2000) {
        // this.curScene = 'end';
        // eslint-disable-next-line
        this.setVideo(this.vSrc.candle.url2.url, this.vSrc.candle.url2.timesParam);
      } else {
        this.isFade = false;
      }
    },
    start() {
      // this.curScene = 'candle';
      this.openApp(() => {
        this.mp4Video.timesParam = this.vSrc.start.timesParam;
        this.videoShow = true;
        this.mp4Video.play();
        // this.curScene = 0;
      });
    },
    // video设置并播放
    setVideo(url, params, color) {
      this.mp4Video.timesParam = params;
      this.mp4Video.src = url;
      if (color) {
        this.selectColor = color;
      }
      this.videoShow = true;
      this.mp4Video.play();
    },
    // 跳转指定场景
    goScene(index) {
      if (index !== 'thanks') {
        this.page = index;
      }
      const scene = this.remainScene.indexOf(index);
      if (scene > -1) this.remainScene.splice(scene, 1);
      switch (index) {
        case 'scene-code':
          this.setVideo(this.vSrc.code.url1.url, this.vSrc.code.url1.timesParam);
          // this.curScene = 'candle';
          break;
        case 'scene-des':
          this.setVideo(this.vSrc.des.url1.url, this.vSrc.des.url1.timesParam);
          break;
        case 'scene-tea':
          this.setVideo(this.vSrc.tea.url1.url, this.vSrc.tea.url1.timesParam);
          break;
        case 'scene-nav':
          this.curScene = 'scene-nav';
          break;
        case 'thanks':
          this.curScene = 'thanks';
          break;
        case 'end':
          this.curScene = 'scene-end';
          break;
        default:
          break;
      }
    },
    // 当前场景结束后触发动作
    sceneEnd() {
      // 剩余场景为0时触发结束页
      if (this.remainScene.length === 0) {
        // this.setVideo();
        if (this.page === 'scene-code') {
          this.setVideo(this.vSrc.code.url3.url, this.vSrc.code.url3.timesParam);
        } else if (this.page === 'scene-des') {
          this.setVideo(this.vSrc.des.url5.url, this.vSrc.des.url5.timesParam);
        } else if (this.page === 'scene-tea') {
          this.setVideo(this.vSrc.tea.url2.url, this.vSrc.tea.url2.timesParam);
        }
      } else {
        this.goScene('scene-nav');
      }
    },
  },
};
</script>
<style lang="stylus">
   html
    width 100%
    height 100%
    overflow hidden
    .vView
     .dom
      width 100%
      height 100%
      position absolute
      img
       max-width 100%
      .enter
       position absolute
       width 4rem
       left 70%
       top 50%
       transform translate(-50%,-50%)
      .scene-code
       background url('../img/video/code-cha.png') no-repeat
       .hint
        position absolute
        left -11%
      .scene
       width 100%
       height 100%
       overflow hidden
       transition 1s linear
      .scene-des-bg
       background url('../img/video/des-cho.png') no-repeat
       .scene-des
        width 100%
        height 100%
      .red-bg
       background url('../img/video/des-red.png') no-repeat
      .blue-bg
       background url('../img/video/des-blue.png') no-repeat
      .purple-bg
       background url('../img/video/des-pur.png') no-repeat
      .scene1
       background url('../img/video/home.png') no-repeat
       background-size cover
       background-origin center center
      .end
       background url('../img/video/end.png') no-repeat
       background-size cover
       .share,.again
        width 10rem
        height 2rem

        position absolute
        left 50%
        transform translate(-50%,0)
       .share
        top 61%
       .again
        top 80%
      .candle
       transiton 1s linear;
       background url('../img/video/candle-before.png') no-repeat
       .fade
        opacity .3
       .cake
        position absolute
        left 50%
        top 50%
        transform translate(-50%,-50%)
        width 6.5rem
       .btn
        width 10rem
        height 3rem
        position absolute
        left 50%
        transform translate(-50%,0)
        bottom 18%
       .fire-wrap
        position absolute
        left 50%
        top 10%
        transform translate(-50%,0)
        img
         margin 0 .2rem
         transform scale(1)
         transition 1s linear
         width .6rem
        .fade
         transform scale(.1)
         transform-origin bottom
         opacity .3
      .thanks
       background-size cover
       .hText
        position absolute
        width 100%
        text-align center
        font-size .5rem
        color #fff
        bottom 10%
        left 0
       .wrap
        width 100%
        height 100%
       .scene-des-w
        background url('../img/video/des-blue.png') no-repeat
       .scene-code-w
        background url('../img/video/code.png') no-repeat
       .scene-tea-w
        background url('../img/video/tea-cha.png') no-repeat
       img
        position absolute
        left 50%
        top 50%
        transform translate(-50%,-50%)
      .black
       background #000
      .scene-des-color
       .pre
        width 60%
        position absolute
        top 12%
        left 50%
        transform translate(-50%,0)
        border-radius .6rem
       .next
        position absolute
        top 80%
        left 50%
        transform translate(-50%,0)
        max-width 5rem
      .scene-des
       background url('../img/video/des.png') no-repeat
       background-size cover
       .cBtn
        width 5rem
        height 3rem
        position absolute
        top 50%
        &.purple
         left 10%
        &.red
         left 40%
        &.blue
         left 70%
      .scene2
       background url('../img/video/scene-nav.png') no-repeat
       background-size cover
       padding: 1rem .5rem;
       box-sizing: border-box;
       .label
        overflow hidden
        margin 1.3rem 0
        img
         display inline-block
         max-width 8rem
       .label1
        img
         float right
         margin-right 1rem
       .label2
        img
         float left
         margin-left 1rem
       .label3
        img
         float right
         margin-right 1rem
      .rkt
       width 3.2rem
       height 4rem
       position absolute
       left 6rem
       bottom 1.5rem
       animation bling .5s infinite
      .holder
       height 3rem
       width 13rem
       position absolute
       left 50%
       top 70%
       transform translate(-50%)
     .compatibleStyle
      z-index 99
      backface-visibility:hidden;
      -webkit-backface-visibility:hidden;
      -moz-backface-visibility:hidden;
      -ms-backface-visibility:hidden;
      -webkit-perspective: 0;
      -webkit-transform: translate3d(0,0,0);
      visibility:visible;
  @keyframes bling {
    0% {
      transform rotate(0deg)
    }
    50% {
      transform rotate(-2deg)
    }
    100% {
      transform rotate(2deg)
    }
  }
</style>
