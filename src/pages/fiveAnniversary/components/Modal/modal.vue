<template>
  <transition name="mask-fade">
  <div class="mask-overlay"
      v-if="visible"
      @touchmove.prevent.stop
      @click="close">
    <div class="wrap" @click="e=>{e.stopPropagation()}" :style="`width:${w}`">
        <header class="titleBg" v-if="headTxt">{{headTxt}}</header>
        <div class="text">{{message}}</div>
        <slot></slot>
        <footer>
          <div class="handle">
            <slot name='footer'>
            <div class="secondary" v-if="secondary" @click="cancel">{{secondTxt}}</div>
            <div :class="['major',{'only':!secondary}]" @click="confirm">{{majTxt}}</div>
            </slot>
          </div>
        </footer>
    </div>
</div>
  </transition>

</template>
<script>

export default {
  name: 'ModalCom',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    headTxt: {
      type: String,
      default: '这是一段描述',
    },
    message: {
      type: String,
    },
    secondary: {
      type: Boolean,
      default: true,
    },
    secondTxt: {
      type: String,
      default: '取消',
    },
    majTxt: {
      type: String,
      default: '确定',
    },
    w: {
      type: String,
      default: '5.7rem',
    },
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false);
      if (this.reject) { this.reject('cancel'); }
    },
    confirm() {
      this.$emit('update:visible', false);
      if (this.resolve) { this.resolve('confirm'); }
    },
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang="scss" scoped>
$color-overlay: rgba(0, 0, 0, .5);
.mask-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-overlay;
  z-index: 99999
}
.mask-fade {
  &-enter-active, &-leave-active {
    transition: opacity .5s;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}
.wrap {
    position: absolute;
    width: 5.4rem;
    top: 50%;
    left: 50%;
    border-radius: .2rem;
    background: white;
    transform: translate(-50%,-50%);
    z-index: 2001;
    box-sizing: border-box;
    padding: .5rem .3rem 1.5rem .3rem;
    .titleBg {
        height:1.1rem;
        width:4.6rem;
        background: url('../../img/mTitile.png') no-repeat;
        background-size: auto 100%;
        // transform: translate(0,-.85rem);
        position: absolute;
        top: -.55rem;
        left: 50%;
        transform: translate(-50%,0);
        margin: 0 auto;
        text-align: center;
        line-height: .8rem;
        font-size: .36rem;
        color: #fff;
    }
    .text {
      text-align: center;
      font-size: .3rem;
      margin-top: .3rem;
    }
    footer {
      width: 100%;
      position: absolute;
      bottom: .3rem;
      left: 0;
      .handle {
        margin: 0 auto;
        width: 5rem;
        div {
          text-align: center;
          height: .8rem;
          border-radius: .4rem;
          display: inline-block;
          margin: 0 auto;
          font-size: .28rem;
          color: #fff;
          line-height: .8rem;
        }
        .secondary {
          width: 2rem;
          background: #00c5ff
        }
      .major {
        width: 2.5rem;
        background: #ff503d;
        margin-left: .5rem;
        &.only {
          display: block;
          margin: 0 auto;
        }
      }
      }
    }
}
</style>
