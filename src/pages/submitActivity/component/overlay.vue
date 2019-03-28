<template>
  <div class="overlay-item" @touchmove="e => e.preventDefault()" v-show="flag">
    <div class="overlay" @click="closeOverlay"></div>
    <div class="overlay-content">
      <div class="overlay-top">
        <div class="overlay-title">
          {{title}}
          <img src="./resource/close.png" @click="closeOverlay" v-show="closeIcon">
        </div>
      </div>
        <div class="overlay-center">
          <scroll
          :bounce="false"
          :style="style"
          ref="scroll">
            <div>
              <slot></slot>
            </div>
          </scroll>
        </div>
    </div>
  </div>
</template>
<script>
import Scroll from '../../../components/scroll/scroll.vue';

export default {
  props: {
    title: {
      type: String,
      default: '活动提示',
    },
    flag: {
      type: Boolean,
      default: true,
    },
    closeIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      style: {
        maxHeight: '6.8rem',
      },
    };
  },
  mounted() {
    this.$refs.scroll._initScroll();
  },
  methods: {
    closeOverlay() {
      this.$emit('close');
    },
  },
  components: {
    Scroll,
  },
  watch: {
    flag(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.scroll.refresh();
        });
      }
    },
  },
};
</script>
<style lang="less">
  .overlay-item {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .overlay {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .6);
    }
    .overlay-content {
      border-radius: 0 0 .2rem .2rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 6rem;
      .overlay-top {
        .overlay-title {
          position: relative;
          color: #fff;
          background: #ff6000;
          font-size: .36rem;
          width: 100%;
          line-height: 1.04rem;
          text-align: center;
          border-radius: .2rem .2rem 0 0;

          img {
            position: absolute;
            right: -.15rem;
            top: -.15rem;
            width: .36rem;
          }
        }
      }

      .overlay-center {
        padding: .41rem .35rem;
        // height: 8rem;
        overflow: hidden;
        background: #fff;
        border-radius: 0 0 .2rem .2rem;
      }
    }
  }
</style>

