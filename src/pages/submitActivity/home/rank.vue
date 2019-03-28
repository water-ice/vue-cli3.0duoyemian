<template>
  <div class="item-content">
    <div class="item">
      <div class="left">
        <img :src="avatarList[rank-1]" v-if="rank < 4 && rank > 0">
        <span v-else>{{rank > 3 ? rank : '暂无'}}</span>
      </div>
      <div class="center">
        <img :src="avatar ? $compress(avatar, true) : defaultAvatar" class="avatar">
        <span class="name">{{name}}</span>
      </div>
      <div class="right">
        <span class="num">{{num}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    rank: {
      type: Number,
      default: 1,
    },
    name: {
      type: String,
      default: '我',
    },
    num: {
      type: [Number, String],
      default: 0,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      avatarList: [
        require('./resource/num1.png'),
        require('./resource/num2.png'),
        require('./resource/num3.png'),
      ],
      defaultAvatar: require('./resource/default.png'),
    };
  },
};
</script>
<style lang="less">
.item-content {
  padding: 0 .36rem;
  .item {
    padding: .18rem 0;
    border-bottom: 1px solid #f2bccf;
    display: flex;
    align-items: center;

    .left {
      width: 20%;
      text-align: left;
      span {
        padding-left: .1rem;
      }

      img {
        width: .36rem;
      }
    }

    .center {
      width: 60%;

      .avatar {
        width: .6rem;
        border-radius: 50%;
        height: .6rem;
        float: left;
      }

      .name {
        font-size: .28rem;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        line-height: .6rem;
        margin-left: .84rem;
      }
    }

    .right {
      text-align: right;
      width: 20%;
      .num {
        color: #f22121;
      }
    }
  }
}

</style>
