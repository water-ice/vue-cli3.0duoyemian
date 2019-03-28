<template>
  <div class="composition-item" :class="status | statusFilter">
    <div class="composition-left">
      <div class="composition-type">{{type}}</div>
      <div class="composition-title">{{title}}</div>
      <div class="composition-time">{{time}}</div>
    </div>
    <div class="composition-right">
      {{status === 1 ? '已过审' : status === 0 ?  '已退稿' : '待审核'}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: '议论文',
    },
    status: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '毕业了，你们还好吗',
    },
    time: {
      type: String,
      default: '',
    },
  },
  filters: {
    statusFilter(status) {
      if (status === 0) {
        return 'reject';
      } else if (status === 1) {
        return 'waiting';
      }
      return 'pass';
    },
  },
};
</script>
<style lang="less">
.bg(@val) {
  background: url(@val) 0 0 no-repeat;
  background-size: 100% auto;
}
.composition-item {
  border-radius: .13rem;
  height: 1.82rem;
  width: 6.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .2rem .3rem;
  box-sizing: border-box;
  .composition-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .composition-type {
      width: .83rem;
      height: .33rem;
      border: 1px solid #ff6161;
      border-radius: .13rem;
      line-height: .33rem;
      color: #ff6161;
      font-size: .2rem;
      text-align: center;
      // margin-bottom: .23rem;
    }
    .composition-title {
      font-size: .36rem;
      color: #f22121;
      margin-top: .1rem;
      // margin-bottom: .32rem;
    }
    .composition-time {
      font-size: .2rem;
      color: #666;
      margin-top: .1rem;
    }
  }
  .composition-right {
    font-size: .28rem;
  }
  &.pass {
    .bg('./resource/pass.png');
    .composition-right {
      color: #f22121;
    }
  }
  &.waiting {
    .bg('./resource/waiting.png');
    .composition-right {
      color: #666;
    }
  }
  &.reject {
    .bg('./resource/reject.png');
    .composition-left {
      color: #666;
      .composition-type {
        color: #999;
        border: 1px solid #999;
      }
      .composition-title {
        color: #666;
      }
    }
    .composition-right {
      color: #333333;
    }
  }
}
</style>
