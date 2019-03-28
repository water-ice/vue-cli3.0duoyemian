<template>
  <div class="sublucky">
    <div
      :class="['item',{'active':index===position}]"
      v-for="(item,index) in list "
      :key="index"
      @click="toStart(index)"
    >
      <img class="icon" :src="item.src" :alt="item.id" v-if="item.id!==8">
      {{item.name}}
      <div class="count" v-if="item.id===8">（剩余{{count}}次）</div>
    </div>
    <termBeginDialog
      v-if="success"
      @changeVisible="changeVisible"
      :isPay="isPay"
      :prizeName="prizeName"
      :item="item"
      :dialogShow="dialogShow"
      :addressDetaill="addressDetaill"
    ></termBeginDialog>
  </div>
</template>

<script>
import zybLog from 'plat-utils/src/zybLog';
import termBeginDialog from './termBeginDialog.vue';
import Toast from '../../../components/Toast/index';

export default {
  components: {
    termBeginDialog,
  },
  props: {
    luckDrawCount: Number,
    status: Object,
    success: {
      type: Boolean,
      default: false,
    },
    addressDetaill: {
      type: Object,
      dafault: {
        userName: '',
        phone: '',
        address: '',
      },
    },
  },
  data() {
    return {
      list: [
        { id: 0, src: require('../resource/lucky/bbb.png'), name: '10帮帮币' },
        {
          id: 1,
          src: require('../resource/lucky/redmi.png'),
          name: '红米6手机32G',
        },
        { id: 2, src: require('../resource/lucky/box.png'), name: '大栗礼盒' },
        { id: 3, src: require('../resource/lucky/bbb.png'), name: '500帮帮币' },
        {
          id: 4,
          src: require('../resource/lucky/package.png'),
          name: '栗 · 帆布袋',
        },
        {
          id: 5,
          src: require('../resource/lucky/diamond.png'),
          name: '7天会员',
        },
        { id: 6, src: require('../resource/lucky/bbb.png'), name: '20帮帮币' },
        {
          id: 7,
          src: require('../resource/lucky/micircle.png'),
          name: '小米手环3',
        },
        {
          id: 8,
          name: '点击抽奖',
        },
      ],
      prizesList: [
        { prizeId: 1, prizeName: '10帮帮币', position: 0 },
        { prizeId: 2, prizeName: '20帮帮币', position: 6 },
        { prizeId: 3, prizeName: '500帮帮币', position: 3 },
        { prizeId: 4, prizeName: '7天会员', position: 5 },
        { prizeId: 5, prizeName: '栗·帆布袋', position: 4 },
        { prizeId: 6, prizeName: '小栗礼盒', position: 2 },
        { prizeId: 7, prizeName: '小米手环3', position: 7 },
        { prizeId: 8, prizeName: '红米手机6', position: 1 },
      ],
      prize: {
        position: -1,
        prizeId: -1,
        prizeName: '-1',
      },
      // 当前转动位置
      position: 0,
      // 总转动次数
      totalIndex: 0,
      // 定时器 timer
      timerNormal: null,
      timerSlow: null,
      timerStop: null,
      // 滚动中
      moving: false,
      ajaxEnd: false,
      // 进入低速转动动画 标识
      timeEnd: false,
      // dialog
      item: '',
      prizeName: '-1',
      dialogShow: false,
      isCount: false,
      luckyCount: -1,
    };
  },
  watch: {
    totalIndex(val) {
      // 如果计数过程中，ajax未成功
      if (!this.ajaxEnd) {
        return false;
      }
      if (val >= 11) {
        this.timeEnd = true;
      }
    },
  },
  created() {
    window.fePageResume = () => {
      this.isCount = false;
    };
  },
  computed: {
    isPay() {
      if (!this.prize.position === -1) {
        return true;
      } else if (
        this.prize.position === 1 ||
        this.prize.position === 2 ||
        this.prize.position === 4 ||
        this.prize.position === 7
      ) {
        return false;
      }
      return true;
    },
    // 剩余抽奖次数,进入页面抽奖次数使用的是活动详情接口的次数,抽奖后使用的是抽奖接口中的抽奖次数
    count() {
      if (this.isCount === false) {
        return this.luckDrawCount;
      }
      return this.luckyCount;
    },
  },
  methods: {
    // 关闭弹框
    changeVisible(val) {
      const bool = val[0];
      this.dialogShow = bool;
      if (val[1] === 'toAdd') {
        setTimeout(() => {
          this.dialogShow = true;
          this.item = 'add';
        }, 300);
      }
    },
    toStart(item) {
      zybLog.send({ type: 'luckydraw' });
      if (this.status.app) {
        if (this.status.isLogin === 1) {
          this.start(item);
        } else {
          this.$emit('doSomeThing', 'openLogin');
        }
      } else if (this.status.wechat) {
        this.$osg().then(() => {
        // eslint-disable-next-line
          alert('success')
        });
      } else {
        this.$emit('doSomeThing', 'openApp');
      }
    },
    // 点击抽奖，开始抽奖
    start(item) {
      if (item !== 8) {
        return false;
      }
      if (this.moving) {
        return false;
      }
      if (this.count === 0) {
        Toast({ message: '本页开通会员抽奖+1，年费+2', duration: 1000 });
      } else {
        // 重置参数
        this.reset();
        // 获取中奖信息
        this.$fetch({
          url: '/activity/vip/activityluckdraw',
          method: 'post',
          data: {
            activityId: 'f91792aef02e52fa71d1f324b2926998',
          },
          formType: true,
        }).then((res) => {
          if (res.errNo === 0) {
            // 开启滚动动画
            this.startRoll();
            const _id = res.data.prize.prizeId;
            const zybPrize = this.prizesList.filter(i => i.prizeId === _id)[0];
            this.prize = JSON.parse(JSON.stringify(zybPrize));
            this.ajaxEnd = true;
            this.luckyCount = res.data.userInfo.luckDrawCount;
            this.isCount = true;
          } else {
            Toast({ message: res.errstr, duration: 1000 });
          }
        });
      }
    },
    // 滚动动画
    startRoll() {
      this.moving = true;
      this.position = 0;
      this.timerNormal = setInterval(() => {
        this.position++;
        this.totalIndex++;
        if (this.position === 8) {
          this.position = 0;
        }
        // 达到12次
        if (this.timeEnd) {
          clearInterval(this.timerNormal);
          this.slow();
        }
      }, 200);
    },
    // 慢动画
    slow() {
      let count = this.prize.position - this.position;
      if (count <= 4) {
        count = count > -4 ? count + 8 : count + 16;
      }
      this.timerSlow = setInterval(() => {
        count--;
        this.position++;
        if (this.position === 8) {
          this.position = 0;
        }
        if (count === 4) {
          clearInterval(this.timerSlow);
          this.stop();
        }
      }, 300);
    },
    // 停止动画
    stop() {
      let count = 0;
      this.timerStop = setInterval(() => {
        count++;
        this.position++;
        if (this.position === 8) {
          this.position = 0;
        }
        if (count === 4) {
          clearInterval(this.timerStop);
          this.toDialog();
        }
      }, 500);
    },
    // 弹框,传值
    toDialog() {
      this.item = 'luckyalert';
      this.prizeName = this.prize.prizeName;
      setTimeout(() => {
        this.dialogShow = true;
        this.moving = false;
      }, 200);
    },
    // 重置 参数
    reset() {
      this.position = -1;
      this.prize = {
        position: -1,
        prizeId: -1,
        prizeName: '-1',
      };
      this.timerNormal = null;
      this.timerSlow = null;
      this.timerStop = null;
      this.totalIndex = 0;
      this.timeEnd = false;
      this.prizeName = '-1';
      this.isCount = false;
    },
  },
  beforeDestroy() {
    // 组件销毁前 清除定时器
    clearInterval(this.timerNormal);
    clearInterval(this.timerSlow);
    clearInterval(this.timerStop);
  },
};
</script>
<style lang="scss" scoped>
@import "../mixin.scss";
.sublucky {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: rem(43);
  background: url("../resource/lucky/luckyredbglight.png") no-repeat;
  background-size: 100% 100%;
  .item {
    display: flex;
    align-items: center;
    flex-direction: column;
    order: 1;
    width: 33.2%;
    height: rem(164);
    background: url("../resource/lucky/listbg.png") no-repeat;
    background-size: 100%;
    margin-bottom: rem(6);
    font-size: rem(18);
    color: #333333;
    font-weight: bold;
    .icon {
      width: 100%;
      height: auto;
    }
    .count {
      font-size: rem(22);
      color: white;
    }
    &:nth-child(9) {
      animation: breath 0.4s ease-out infinite alternate;
      background: url("../resource/lucky/redbg.png") no-repeat;
      background-size: contain;
      font-size: rem(33);
      color: #f0ff00;
      justify-content: center;
    }
    &:nth-child(1) {
      order: 1;
    }
    &:nth-child(2) {
      order: 2;
    }
    &:nth-child(3) {
      order: 3;
    }
    &:nth-child(4) {
      order: 6;
    }
    &:nth-child(5) {
      order: 9;
    }
    &:nth-child(6) {
      order: 8;
    }
    &:nth-child(7) {
      order: 7;
    }
    &:nth-child(8) {
      order: 4;
    }
    &:nth-child(9) {
      order: 5;
    }
  }
  .active {
    background: url("../resource/lucky/yellowbg.png") no-repeat;
    background-size: contain;
  }
}
</style>

