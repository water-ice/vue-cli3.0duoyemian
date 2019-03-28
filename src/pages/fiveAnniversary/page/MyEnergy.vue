 <template>
  <div class="page">
    <div class="top-energy-num">
      <div class="center">
        <p class="energy-num">{{currentEnergy}}</p>
        <p class="energy-text">能量</p>
      </div>
    </div>
    <div v-if="this.list.length===0">
      <div class="energy-lack">
        <img src="../img/energy_lack.png" class="energy-lack-img">
        <p class="energy-lack-text">您还没有能量记录哦~</p>
        <img src="../img/get_energy.png" class="energy-lack-btn" @click="turntoEnergy">
      </div>
    </div>
    <Scroll v-else class="wrapper" :data="list" :pullup="pullup" @scrollToEnd="scrollShowMore">
      <ul class="en-list">
        <li class="list-item" v-for="item in list" :key="item.taskTitle">
          <div class="list-item-left">
            <p class="list-item-text">{{item.title}}</p>
            <p class="list-item-date">{{item.createTime}}</p>
          </div>
          <div
            :class="[{ red : item.energy<0 },{  success: item.energy>0 }, 'list-item-score']"
          >{{item.energy}}</div>
        </li>
      </ul>
      <div class="loading-wrapper"></div>
    </Scroll>
  </div>
</template>
<script>
import Scroll from '../components/Scroll.vue';

export default {
  name: 'MyEnergy',
  components: {
    Scroll,
  },
  data() {
    return {
      currentEnergy: 0,
      pullup: true,
      pn: 0,
      rn: 20,
      hasMore: 1,
      list: [
        /*  {
          title: '帮帮币5个',
          energy: '-100',
          createTime: '2018年12月25日',
        },
        {
          title: '进入五周年活动主会场',
          energy: '+10',
          createTime: '2018年12月25日',
        },
        {
          title: '帮帮币52个',
          energy: '-87',
          createTime: '2018年12月25日',
        },
        {
          title: '帮帮币5个',
          energy: '-100',
          createTime: '2018年12月25日',
        },
        {
          title: '进入五周年活动主会场',
          energy: '+10',
          createTime: '2018年12月25日',
        },
        {
          title: '帮帮币52个',
          energy: '-87',
          createTime: '2018年12月25日',
        },
        {
          title: '帮帮币5个',
          energy: '-100',
          createTime: '2018年12月25日',
        }, */
      ],
    };
  },
  created() {
    this.getEnergyList();
    window.fePageResume = () => {
      window.location.reload();
    };
    window.fePagePause = () => {
      window.location.reload();
    };
  },
  computed: {},
  methods: {
    turntoEnergy() {
      this.$router.push('/Home/Energy');
    },
    getEnergyList(pn = this.pn, rn = this.rn) {
      this.$fetch({
        url: '/activity/fiveyears/pagegetenergyloglist',
        params: {
          pn,
          rn,
        },
      }).then((res) => {
        this.list = this.list.concat(res.data.result.list);
        this.hasMore = res.data.result.hasMore;
        // this.hasMore = 1;
        // this.list = this.list.concat([
        //   {
        //     title: 'XXXXXX个',
        //     energy: '-100',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'QQQQQQQ',
        //     energy: '+10',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'BBBBBBBBBBB',
        //     energy: '-87',
        //     createTime: '2018年12月25日',
        //   }, {
        //     title: 'XXXXXX个',
        //     energy: '-100',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'QQQQQQQ',
        //     energy: '+10',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'BBBBBBBBBBB',
        //     energy: '-87',
        //     createTime: '2018年12月25日',
        //   }, {
        //     title: 'XXXXXX个',
        //     energy: '-100',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'QQQQQQQ',
        //     energy: '+10',
        //     createTime: '2018年12月25日',
        //   },
        //   {
        //     title: 'BBBBBBBBBBB',
        //     energy: '-87',
        //     createTime: '2018年12月25日',
        //   },
        // ]);
        this.currentEnergy = res.data.result.currentEnergy;
      });
    },
    scrollShowMore() {
      console.log('hasMore');
      if (this.hasMore) {
        this.pn += 20;
        this.getEnergyList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  background-color: rgb(247, 247, 247);
  font-size: 0;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  .top-energy-num {
    position: relative;
    text-align: center;
    color: #ffffff;
    width: 100%;
    height: 2rem;
    background-image: url(../img/myenergy_back.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
    box-shadow: -0.02rem 0 0 0;
    .center {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
      .energy-num {
        font-size: 0.8rem;
      }
      .energy-text {
        font-size: 0.4rem;
      }
    }
  }
  .en-list {
    font-size: 0.3rem;
    color: black;
    margin: 0.3rem 0 0.3rem 0;
    .list-item {
      margin: 0.2rem auto;
      width: 6.6rem;
      height: 1.2rem;
      background-color: white;
      box-shadow: 0.04rem 0.1rem rgba(237, 237, 237, 0.5);
      border-radius: 0.12rem;
      margin-bottom: 0.2rem;
      color: rgb(83, 64, 60);
      .list-item-left {
        width: 5rem;
        height: 1rem;
        display: inline-block;
        vertical-align: middle;
        padding: 0.1rem 0.2rem;
        .list-item-text {
          margin-top: 0.1rem;
          font-size: 0.3rem;
          font-weight: bold;
        }
        .list-item-date {
          color: rgb(134, 123, 121);
          margin-top: 0.1rem;
          font-size: 0.2rem;
        }
      }
      .list-item-score {
        line-height: 1.2rem;
        width: 0.8rem;
        height: 1.2rem;
        display: inline-block;
        vertical-align: middle;
        font-size: 0.36rem;
        font-weight: bold;
        position: absolute;
        right: 0.45rem;
      }
      .red {
        color: red;
      }
      .success {
        color: #67c23a;
      }
    }
  }
}
.wrapper {
  width: 100%;
  height: calc(100% - 2rem);
  overflow: hidden;
}
.energy-lack {
  text-align: center;
  margin-top: 1.5rem;
  .energy-lack-img {
    width: 2.4rem;
    height: 2.4rem;
    margin-bottom: 0.3rem;
  }
  .energy-lack-text {
    font-size: 0.3rem;
    color: rgb(102, 102, 102);
  }
  .energy-lack-btn {
    margin-top: 0.5rem;
    width: 2rem;
    height: 0.6rem;
  }
}
</style>

