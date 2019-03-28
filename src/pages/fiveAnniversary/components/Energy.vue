<template>
  <div class="energy_page">
    <div class="task-div" v-if="taskList.length!==0">
      <p class="title">待获取的能量</p>
      <ul class="tasklist">
        <li class="task" v-for="task in taskList" :key="task.taskId">
          <div class="icon">
            <img :src="$compress(task.taskImg)">
          </div>
          <div class="texts">
            <p class="description ellipsis">{{ task.title }}</p>
            <div class="award">
              {{task.rateCn}}任务
              <div class="taskSeg">|</div>奖励:
              <div class="small_icon"></div>
              X {{ task.energy}}
            </div>
          </div>
          <div class="button" @click="toComplete(task)">去完成</div>
        </li>
      </ul>
    </div>
    <div v-else class="notask">
      <img class="notaskImg" src="../img/notask.png">
      <p>恭喜你完成了今天的全部任务</p>
      <p>明天再来看看吧~</p>
      <img class="lookbtn" @click="lookMyenergy" src="../img/look_myenergy.png">
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import InvokeApp from "plat-utils/src/invokeApp";
// eslint-disable-next-line
import { inWeChat, inApp } from "plat-utils/src/systemInfo";
// eslint-disable-next-line
import hybrid from "plat-utils/src/hybrid";
import zybLog from 'plat-utils/src/zybLog';
import Bus from '../page/Bus';

export default {
  name: 'Energy',
  props: {
    isLogin: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      taskList: [
        /*  {
          taskId: 1100,
          energy: 10,
          rate: 1,
          title: '进入五周年活动主会场',
          url: 'app://homework/composition/chinese',
          rateCn: '每日',
          taskDesc: '',
          hereGet: 1,
          taskImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          venue: 1,
        },
        {
          taskId: 1101,
          energy: 10,
          rate: 1,
          title: '进入五周年活动主会场',
          url: 'app://homework/composition/chinese',
          rateCn: '每日',
          taskDesc: '',
          hereGet: 1,
          taskImg: 'http://www.zybang.com/activity_fiveyears/Daily_5.png',
          venue: 1,
        }, */
      ],
      all: [],
      pn: 0,
    };
  },
  methods: {
    // 唤醒App
    openApp() {
      if (inWeChat) {
        Bus.$emit('wxGuide');
      } else {
        // 端外打开app
        const naLink = `homework://com.baidu.homework/web?url=${encodeURIComponent(window.location.href)}`;
        InvokeApp({
          downloadLink:
            'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          yybLink:
            'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
          nativeLinkIos: naLink,
          nativeLinkAndroid: naLink,
          universalLink: `//oia.zybang.com/download/?page=${encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${window.location.href}`)}`,
        });
      }
    },
    // scrollShowMore() {
    //   if (this.all.length - 1 > this.pn) {
    //     // 剩余数量
    //     const count = (this.all.length - 1 - this.pn >= 6) ? (this.pn + 6) : (this.all.length - 1);
    //     console.log('count: ', count);
    //     this.taskList = [...this.taskList, ...this.all.slice(this.pn + 1, count)];
    //     this.pn += 6;
    //   }
    // },
    toComplete(task) {
      zybLog.send({ type: `energy-${task.title}` });
      const reg = /APP:\/\//i;
      const isApp = reg.test(task.url);
      if (task.venue && task.taskId) {
        this.$fetch({
          url: '/activity/fiveyears/linktovenue',
          method: 'POST',
          formType: true,
          data: {
            taskId: task.taskId,
            venue: task.venue,
          },
        }).then((res) => {
          // eslint-disable-next-line
              // alert(res);
          if (res.data.result) {
            this.$nextTick(() => {
              Bus.$emit('refresh');
              this.getEnergyTask();
            });
          }
        });
      }
      if (inApp) {
        hybrid('is_login', {}, (res) => {
          if (res.isLogin) {
            if (!isApp) {
              if (task.title === '完成每日组队') {
                this.$router.push('/Home/Team');
                Bus.$emit('reTab');
              } else {
                hybrid('openWindow', { url: task.url });
              }
            } else if (isApp) {
              hybrid('APPJumpProtocol', {
                protocolString: task.url,
              });
            }
          } else {
            hybrid('login');
          }
        });
      } else {
        this.openApp();
      }
    },
    getEnergyTask() {
      this.$fetch({
        url: '/activity/fiveyears/energylistpage',
      }).then((res) => {
        if (res.errNo === 0) {
          this.taskList = res.data.result.list;
          // this.all = res.data.result.list;
          // this.taskList = this.all.slice(0, 5);
          // this.pn = 5;
        }
      });
    },
    lookMyenergy() {
      zybLog.send({ type: 'showMyEnnergy' });
      hybrid('is_login', {}, (res) => {
        if (res.isLogin) {
          const before = window.location;
          hybrid('openWindow', {
            url: `${before.origin}${before.pathname}#/MyEnergy`,
          });
        } else {
          this.openApp();
        }
      });
    },
  },
  mounted() {
    this.getEnergyTask();
  },
};
</script>
<style lang="scss" scoped>
.energy_page {
  width: 100%;
  height: 8.5rem;
  -webkit-overflow-scrolling: touch;
  .task-div {
    margin-left: 0.3rem;
    margin-top: 0.4rem;
    width: 100%;
    height: 100%;
    .title {
      color: rgb(102, 102, 102);
      font-size: 0.3rem;
      font-weight: bold;
    }
    .tasklist {
      margin-top: 0.27rem;
      height: 9rem;
      .task {
        width: 6.3rem;
        height: 1.3rem;
        border-radius: 0.12rem;
        background-color: rgb(255, 255, 255);
        padding-left: 0.3rem;
        box-shadow: 0 0.04rem 0.1rem 0 rgba($color: #000000, $alpha: 0.06);
        margin-bottom: 0.2rem;
        div {
          display: inline-block;
          vertical-align: middle;
        }
        .icon {
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 50%;
          font-size: 0.3rem;
          color: white;
          text-align: center;
          line-height: 0.9rem;
          img {
            width: 0.9rem;
            height: 0.9rem;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
        }
        .texts {
          width: 3.5rem;
          height: 100%;
          margin-left: 0.2rem;
          .description {
            font-size: 0.3rem;
            font-weight: bold;
            color: rgb(83, 64, 60);
            margin-top: 0.25rem;
          }
          .award {
            color: rgb(134, 123, 121);
            font-size: 0.24rem;
            margin-top: 0.1rem;
            .taskSeg {
              padding: 0 0.1rem 0 0.04rem;
              height: 0.35rem;
              color: #e5e5e5;
            }
            .small_icon {
              width: 0.36rem;
              height: 0.36rem;
              border-radius: 50%;
              background-image: url("../img/energy_icon.png");
              background-repeat: no-repeat;
              background-size: 100% 100%;
              transform: translateY(-0.05rem);
            }
          }
        }
        .button {
          font-weight: bold;
          margin-left: 0.2rem;
          width: 1.2rem;
          height: 0.6rem;
          border-radius: 0.3rem;
          border-color: rgb(255, 77, 59);
          border-style: solid;
          border-width: 1px;
          font-size: 0.24rem;
          color: rgb(255, 77, 59);
          text-align: center;
          line-height: 0.6rem;
        }
      }
    }
  }
  .notask {
    text-align: center;
    padding-bottom: 3.2rem;
    padding-top: 0.9rem;
    p {
      color: rgb(102, 102, 102);
      font-size: 0.3rem;
      font-weight: 400;
    }
    .notaskImg {
      margin-bottom: 0.1rem;
      width: 2.5rem;
      height: 2.5rem;
    }
    .lookbtn {
      margin-top: 0.25rem;
      width: 2.4rem;
      height: 0.6rem;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
