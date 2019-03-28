<template>
  <div class="page">
    <img src="./img/bg.png" alt="" class="bg">
    <div class="btn">
      <a href="http://wap.cmread.com/r/p/index.jsp?cm=M39V0003" class="subscribe">订阅咪咕作业帮悦读会</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'miguRead',
};
</script>
<style lang="scss" scoped>
  body {
    a, a:hover {
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      outline: 0;
    }
  }
  .page {
    font-size: 0;
    position: relative;
    img.bg {
      width: 100%;
      pointer-events: none;
    }
    .btn {
      position: absolute;
      width: 100%;
      bottom: 6.21rem;
    }
    .subscribe {
      display: block;
      margin: 0 auto;
      width: 4.27rem;
      line-height: .90rem;
      text-align: center;
      font-weight: bold;
      font-size: .32rem;
      color: #fff;
      background-image: url(./img/btn.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
    }
  }
</style>
