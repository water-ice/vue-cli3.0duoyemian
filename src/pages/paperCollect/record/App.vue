<template>
  <div class='paperCollectList'>
    <mt-loadmore :bottom-method="loadBottom"
                 :bottom-all-loaded="allLoaded"
                 :bottomDistance="10"
                 v-if="list.length"
                 ref="loadmore">
      <ul class="list">
        <li class="item" v-for="(item,index) in list" :key="index">
          <div class="media-left">
            <img :src="zybImgSrc(item.img)" alt="图片地址不对"/>
          </div>
          <div class="media-right">
            <div class="title">{{item.name}}</div>
            <div class="state">目前状态：
              <span>{{status[item.status]}}</span>
            </div>
            <div class="result" v-if="item.status==='3'" @click="showResult(item.msg)"></div>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <img class="noData" src="./resource/null.png" v-else alt="">
  </div>
</template>
<script>
import zybImgSrc from 'plat-utils/src/zybImgSrc';
import Toast from '../../../components/Toast/index';

export default {
  name: 'papercollect',
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        rn: 10,
      },
      hasMore: 1,
      list: [],
      allLoaded: false,
      status: ['审核通过', '删除', '审核中', '审核未通过'],
    };
  },
  methods: {
    zybImgSrc(pid) {
      return zybImgSrc(pid);
    },
    getList() {
      const pn = (this.pageInfo.pageNum - 1) * this.pageInfo.rn;
      this.$fetch(`/activity/papercollect/lists?pn=${pn}&rn=${this.pageInfo.rn}`)
        .then((res) => {
          if (res && res.errNo === 0) {
            this.hasMore = res.data.hasMore;
            this.list = this.list.concat(res.data.lists);
            this.pageInfo.pageNum++;
          }
        });
    },
    loadBottom() {
      if (this.hasMore) {
        this.getList();
        this.$refs.loadmore.onBottomLoaded();
      } else {
        this.allLoaded = true;
        this.$refs.loadmore.onBottomLoaded();
      }
    },
    showResult(msg) {
      Toast({
        message: msg,
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style lang="less" scoped>
.paperCollectList {
  padding: 0 .48rem;
  .noData {
    width: 4.47rem;
    height: 3.21rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -2.235rem;
    margin-top: -1.6rem;
  }
  .list {
   position: relative;
   padding-top: .4rem;
   z-index: 1;
   background: #fff;
   .item {
     margin-bottom: .35rem;
     display: flex;
     justify-content: space-between;
     background: #fff;
     .media-left {
       margin-right: .3rem;
       width: 1.9rem;
       height: 1.9rem;
       border-radius: .1rem;
       overflow: hidden;
       background: #f1f1f1;
       img {
         width: 100%;
         height: 100%;
       }
     }
     .media-right {
       position: relative;
       flex: 1;
       .title {
         font-size: .28rem;
         color: #000;
       }
       .state {
         position: absolute;
         bottom: 0;
         font-size: .24rem;
         color: #999;
       }
       .result {
         position: absolute;
         bottom: 0;
         right: 0;
         width: 1.18rem;
         height: .36rem;
         background: url(./resource/result.png) no-repeat;
         background-size: 100% auto;
         -webkit-tap-highlight-color: rgba(0,0,0,0);
       }
     }
   }
 }
}
</style>

