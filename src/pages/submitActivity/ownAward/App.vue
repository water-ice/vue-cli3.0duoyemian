<template>
  <div class="container">
    <div class="top-bg"></div>
    <div class="composition">
      <ul class="composition-list" ref="list" @scroll="getMoreData">
        <li
        v-for="(item,index) in list"
        :key="index">
          <composition
          :type="item.type"
          :status="item.articleStatus"
          :time="item.createTime"
          :title="item.title"></composition>
        </li>
      </ul>
    </div>
    <div class="explain">
      <h1 class="explain-title">活动说明</h1>
      <dl>
        <dt>1、我的作品为什么被退稿？</dt>
        <dd>作品被退稿的可能原因有如下3种：</dd>
        <dd>字数不达标、标点使用、段落排版不正确；</dd>
        <dd>投稿作品不是考场作文或者课堂作文；</dd>
        <dd>投稿作品涉嫌抄袭，内容有大量文字和他人已投稿作文雷同。</dd>
        <dt>2、审核需要多长时间？</dt>
        <dd>每天18:00前投出的稿件将在当天审核完毕；如在18:00后投稿，作品会在第二天审核完毕。</dd>
        <dt>3、过审的作文在哪里展示？</dt>
        <dd>过审的作文会全数展示在语文作文-作文圈。</dd>
      </dl>
    </div>
    <div class="operate">
      <div class="see-other" @click="seeOther">看看其他人的作品</div>
      <div class="continue-submit" @click="goOnSubmit">我要继续投稿</div>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

import Composition from '../component/composition.vue';

export default {
  data() {
    return {
      list: [],
      pending: false,
      inTest: /suanshubang/.test(window.location.origin),
      pn: 0,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getMoreData() {
      if (!this.hasMore) {
        return false;
      }
      if (this.$refs.list) {
        const el = this.$refs.list;
        const { offsetHeight, scrollHeight, scrollTop } = el;
        if (scrollTop + offsetHeight + 50 >= scrollHeight && this.pending) {
          this.getData();
        }
      }
    },
    getData() {
      this.pending = false;
      this.$fetch({
        method: 'get',
        url: '/activity/composition/compusercontributelist',
        params: {
          pn: this.pn,
          rn: 10,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          this.list = this.list.concat(res.data.list || []);
          this.hasMore = res.data.hasMore;
          this.pn += 10;
        }
        this.pending = true;
      }).catch(() => {
        this.pending = true;
      });
    },
    seeOther() {
      hybrid('APPJumpProtocol', {
        protocolString: 'app://homework/composition/circle',
      });
    },
    goOnSubmit() {
      hybrid('common', {}, (res) => {
        hybrid('getuserinfo', {}, (resp) => {
          zybLog.send({
            type: 'rightNowWrite',
            module: 'activity-vue',
            uid: res.uid,
            cuid: resp.cuid,
          });
        });
      });
      hybrid('openWindow', {
        url: 'https://www.zybang.com/composition/compcircle/compcirclerules',
        hideNav: 1,
        fillStatusBar: 0,
      });
    },
  },
  components: {
    Composition,
  },
};
</script>
<style lang="less">
@color1: #f22121;
@color2: #ffc70c;
.container {
  background-color: @color1;
  .top-bg {
    height: 5.02rem;
    background: url('./resource/top-bg.jpg') .5px 0 no-repeat;
    background-size: 100% auto;
  }
  .composition {
    height: 6.3rem;
    background-image: url('./resource/repeat.png');
    background-position: 0 0;
    background-repeat: repeat-y;
    background-size: contain;
    .composition-list{
      height: 6.3rem;
      overflow: scroll;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .2rem;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .explain {
    background: url('./resource/bottom-bg.jpg') 0 0 no-repeat;
    background-size: 100% auto;
    color: #fff;
    padding: 1.2rem .34rem 1.5rem;
    background-color: #ef2440;
    .explain-title {
      font-size: .36rem;
      text-align: center;
      margin-bottom: .6rem;
    }
    dl {
      line-height: .42rem;
      dt {
        font-size: .26rem;
        margin-top: .26rem;
        &:first-child{
          margin-top: 0;
        }
      }
      dd {
        font-size: .24rem;
      }
    }
  }
  .operate {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color2;
    font-size: .32rem;
    padding: .1rem  .14rem;
    display: flex;
    justify-content: space-between;
    .see-other {
      color: @color1;
      text-align: center;
      border-radius: .4rem;
      height: .8rem;
      line-height: .72rem;
      box-sizing: border-box;
      border: .04rem solid @color1;
      width: 3.31rem;
    }
    .continue-submit {
      color: #fff;
      border-radius: .4rem;
      background: @color1;
      height: .8rem;
      width: 3.31rem;
      line-height: .8rem;
      text-align: center;
    }
  }
}
</style>
