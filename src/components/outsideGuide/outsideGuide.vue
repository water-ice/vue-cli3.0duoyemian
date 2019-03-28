<template>
  <div @touchmove="e => { e.preventDefault(); }" v-show="wxTip" @click="closewxTip" class="popmask">
    <div class="guide"></div>
  </div>
</template>
<script>
export default {
  props: {
    wxTip: Boolean,
  },
  methods: {
    closewxTip() {
      this.$emit('wxGuide', false);
    },
  },
};
</script>
<style lang="less" scoped>
  .popmask{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, .7);
    overflow: hidden;
    z-index: 99;
    .guide {
      width: 7.2rem;
      height: 2.25rem;
      background: url("./resource/guide.png") no-repeat;
      background-size: contain;
      position: absolute;
      top: 2%;
    }
  }
</style>
