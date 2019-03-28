<template>
  <div class="write_result">
    <div class="top_img">
      <img src="./resource/top_img.png" alt="">
    </div>
    <div class="writer_swip">
      <div class="swip_box">
        <h5>
          <img src="./resource/writer.png" alt="">
        </h5>
        <div class="container" @touchstart="holdExit(0)" @touchend="holdExit(1)" @touchcancel="holdExit(1)">
          <zyb-swipe :cell-spacing="20" :auto="5000">
            <zyb-swipe-item>
              <img src="./resource/writer1.png" alt="">
            </zyb-swipe-item>
            <zyb-swipe-item>
              <img src="./resource/writer2.png" alt="">
            </zyb-swipe-item>
            <zyb-swipe-item>
              <img src="./resource/writer3.png" alt="">
            </zyb-swipe-item>
          </zyb-swipe>
        </div>
      </div>
    </div>
    <div class="prize_cont" v-if="winners">
      <div :class="['prize_box', key]" v-for="(value ,key, index) in winners" :key="index">
        <h5></h5>
        <div class="prize_titimg">
          <img :src="listImg[key].tit" alt="">
        </div>
        <div class="user">
          <div :class="key" v-if="key === 'special'">
            <div class="info">
              <div class="u_img">
                <img :src="value.avatar ? $compress(value.avatar, true) : defaultAvatar" alt="">
              </div>
              <div class="name">{{value.province ? value.province + '-' : ''}}菂冉</div>
              <p class="articlename">《{{value.title}}》</p>
              <div><span class="toArticleDetail" @click="toArticleDetail(value.articleId)">查看作品</span></div>
              <div class="remark">
                <div class="remark_tit"><span></span><em>作家点评</em><span></span></div>
                <p>《猫儿》是一篇构思精妙的童话或者称为童话体的小说。以“猫”的九世为线索，讲述了猫与老鼠，老鼠与老鼠、猫与猫的之间发生的故事，从而表现“伙伴精神”的主旨。其实在自然界中，猫与老鼠也会有和谐相处的一面，万物皆有成为伙伴的可能。作为一名高中生，能够写出这样有创意、有文采的文章，在文学的路上，会有一番成绩的。</p>
              </div>
            </div>
          </div>
          <div :class="key" v-if="key === 'first'">
            <div class="first_item" v-for="(fir_item,fir_i) in value" :key="fir_i">
              <div class="level">{{fir_item.levelId|level}}</div>
              <div class="item_info">
                <div class="uinfo">
                  <div class="avater">
                    <img :src="fir_item.avatar ? $compress(fir_item.avatar, true) : defaultAvatar" alt="">
                  </div>
                  <div class="uname">
                    <h6>{{(fir_item.province ? fir_item.province + '-' : '') + fir_item.name}}</h6>
                    <div class="artname ellipsis">《{{fir_item.title}}》</div>
                  </div>
                  <div class="right">
                    <span @click="toArticleDetail(fir_item.articleId)">查看作品  ></span>
                  </div>
                </div>
                <div class="mark">
                  <p>{{remark[fir_item.levelId]}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="second_third" v-if="key === 'second' || key === 'third'">
              <div class="level_item" v-for="(v,k,i) in value" :key="i">
                <div class="level">{{k|level}}</div>
                <div class="list_box">
                  <div class="item" v-for="(_item,i) in v" :key="i">
                    <div class="left">
                      <img :src="_item.avatar ? $compress(_item.avatar, true) : defaultAvatar" alt="">
                      <div class="nameinfo">
                        <h6>{{(_item.province ?  _item.province + '-' : '') + _item.name}}</h6>
                        <p>《{{_item.title}}》</p>
                      </div>
                    </div>
                    <div class="right" @click="toArticleDetail(_item.articleId)">
                      <span>查看作品  ></span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="creative" v-if="key === 'creative'">
            <div class="writer_list">
              <div class="item" v-for="(write,w) in value" :key="w">
                <div class="avatar">
                  <img :src="write.avatar ? $compress(write.avatar, true) : defaultAvatar" alt="">
                </div>
                <div class="writer_info">
                  <h6>{{write.name}}</h6>
                  <span @click="toArticleDetail(write.articleId)">查看作品  ></span>
                </div>
              </div>
            </div>
          </div>
          <div class="popular" v-if="key === 'popular'">
            <div class="pop_box">
              <div class="item" v-for="(pop,p) in value" :key="p">
                <div class="left">
                  <div class="avatar">
                    <img :src="pop.avatar ? $compress(pop.avatar, true) : defaultAvatar" alt="">
                  </div>
                  <span>{{pop.name}}</span>
                </div>
                <div class="rank">
                  <img v-if="p === 0" src="./resource/rank1.png" alt="">
                  <img v-else-if="p === 1" src="./resource/rank2.png" alt="">
                  <img v-else-if="p=== 2" src="./resource/rank3.png" alt="">
                  <span v-else>{{p+1}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="prize_botimg">
          <img :src="listImg[key].cont" alt="">
        </div>
      </div>
    </div>
    <div class="bottom_img">
      <img src="./resource/bottom_img.png" alt="">
    </div>
      <!-- 端外引导 -->
    <outsideGuide v-show="wxTip" @wxGuide="wxGuideShow"></outsideGuide>
  </div>
</template>
<script>
import zybLog from 'plat-utils/src/zybLog';
import hybrid from 'plat-utils/src/hybrid';
import share from 'plat-utils/src/share';
import InvokeApp from 'plat-utils/src/invokeApp';
import { inWeChat, inApp, isIos } from 'plat-utils/src/systemInfo';
import outsideGuide from '../../components/outsideGuide/outsideGuide.vue';

export default {
  data() {
    return {
      winners: null,
      listImg: {
        special: {
          tit: require('./resource/special_tit.png'),
          cont: require('./resource/special_cont.png'),
        },
        first: {
          tit: require('./resource/first_tit.png'),
          cont: require('./resource/first_cont.png'),
        },
        second: {
          tit: require('./resource/second_tit.png'),
          cont: require('./resource/second_cont.png'),
        },
        third: {
          tit: require('./resource/third_tit.png'),
          cont: require('./resource/third_cont.png'),
        },
        creative: {
          tit: require('./resource/creative_tit.png'),
          cont: require('./resource/creative_cont.png'),
        },
        popular: {
          tit: require('./resource/popular_tit.png'),
          cont: require('./resource/popular_cont.png'),
        },
      },
      remark: {
        1: '勇于为自己点赞，应该是新时代少年的美丽风采，也是他们文化自信的表现。小作者通过自己履职学习委员的经历写出了自己的故事，展现出自己的形象也为自己点出大大的赞。文章语言流畅，叙述井然有条。',
        20: '《担当》是一篇构思精巧的小说。写了一个农村包工头的担当，在灾难来临目前，他承担了自己的责任，坦白自己就是防滑坡工程的包工头，灾难不一定是防滑坡工程引起的，但主人公“老王”的勇于承担的态度值得我们敬重。小说就是因为别人眼里的英雄最后的坦白才没有落入俗套。',
        30: '《扬伙伴之精神，见家国之同兴》以文言文的形式谈古论今，围绕“伙伴精神”、“家国情怀”书写出作者的爱国之情。文章的主旨明确，论据充实，行文如流水，是一篇不可多得的佳作。',
      },
      defaultAvatar: require('./resource/default_photo.png'),
      wxTip: false,
    };
  },
  components: { outsideGuide },
  filters: {
    level: (v) => {
      const level = parseInt(v, 10);
      if (level === 1) {
        return '小学组';
      }
      if (level === 20) {
        return '初中组';
      }
      return '高中组';
    },
  },
  created() {
    this.getPrizeInfo();
    zybLog.send({
      type: 'write2018_result_showpv',
    });
    share({
      url: window.location.href, // 分享链接，一般为当前页面的链接
      content: '万众瞩目，一起来见证他们的荣耀时刻！', // 分享内容
      title: '作业帮第三届写作大赛获奖名单', // 分享标题
      pic: require('./resource/coverimg.png'), // 分享缩略图
    });
  },
  methods: {
    getPrizeInfo() {
      this.$fetch.get('/activity/write/finalarticle').then((res) => {
        const { data } = res;
        (data.first).reverse();
        this.winners = data;
      });
    },
    toArticleDetail(articleId) {
      zybLog.send({
        type: 'prize_article_click',
      });
      const url = `https://www.zybang.com/activity/write/articledetail?articleId=${articleId}`;
      if (inApp) {
        hybrid('openWindow', {
          url,
        });
      } else {
        this.openNative(url);
      }
    },
    openNative(href) {
      if (inWeChat) {
        this.wxTip = true;
        return false;
      }
      // 端外打开app
      let naLink = `homework://com.baidu.homework/web?stayApp=true&url=${encodeURIComponent(href)}`;
      if (isIos) {
        naLink = `homework://com.baidu.homework/web?stayApp=true&url=${encodeURI(href)}`;
      }
      const download = 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework';
      InvokeApp({
        downloadLink: download,
        yybLink: download,
        nativeLinkIos: naLink,
        nativeLinkAndroid: naLink,
        universalLink:
          `//oia.zybang.com/download/?page=${
            encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${href}`)}`,
      });
    },
    wxGuideShow(wxTip) {
      this.wxTip = wxTip;
    },
    holdExit(state) {
      if (!isIos) {
        hybrid('slidingExitState', {
          state,
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.write_result{
  background: #4417b5;
}
.top_img{
  img{
    width: 100%;
    display: block;
  }
}
.ellipsis{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.writer_swip{
  padding: .5rem .2rem .3rem;
  box-sizing: border-box;
  .swip_box{
    width: 100%;
    min-height: 6rem;
    background-color: #603de2;
    border-radius: .12rem;
    border: solid 1px #9f5fff;
    h5{
      padding: .32rem 0 .46rem;
      img{
        height: .5rem;
        display: block;
        margin: 0 auto;
      }
    }
    .container{
      padding: 0 .25rem 10px;
      img{
        width: 100%;
        margin-bottom: 16px;
      }
      /deep/ .zyb-swipe-indicators{
        display: flex;
        width: 100%;
        justify-content: center;
        .zyb-swipe-indicator{
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fff;
          margin: 0 6px;
          &.active{
            width: 15px;
            background-color: #ffd200;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
.prize_cont{
  width: 100%;
  box-sizing: border-box;
  padding: .3rem .2rem 0;
  .prize_box{
    width: 100%;
    background-color: #603de2;
    border-radius: .12rem;
    border: solid 1px #9f5fff;
    position: relative;
    margin-top:  1.8rem;
    &.special{
      margin-top: .8rem;
    }
    &.creative{
      .prize_titimg{
        top: -1.25rem;
      }
    }
    &.popular{
      .prize_titimg{
        top: -1.4rem;
      }
    }
    h5{
      width: 100%;
      height: .58rem;
      background: #5434dd;
      border-top-left-radius: .12rem;
      border-top-right-radius: .12rem;
    }
    .prize_titimg{
      position: absolute;
      left: 50%;
      top: -1.1rem;
      transform: translateX(-50%);
      img{
        width: 4.55rem;
        display: block;
        margin: 0 auto;
      }
    }
    .prize_botimg{
      padding: 0.37rem .25rem;
      img{
        width: 100%;
        display: block;
      }
    }
    .user{
      padding: 0 .2rem;
      .special{
        margin-top: .74rem;
        width: 100%;
        min-height: 5rem;
        background-color: #ffffff;
        border-radius: .12rem;
        box-shadow: 0 3px 1px #cbbdff;
        padding: .9rem .4rem 0;
        box-sizing: border-box;
        position: relative;
        .u_img{
          border: 5px solid #fff;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: -.6rem;
          transform: translateX(-50%);
          overflow: hidden;
          img{
            width: 1.2rem;
            height: 1.2rem;
          }
        }
        .name{
          font-size: .28rem;
          text-align: center;
          line-height: 1.5;
          color: #4729b7;
        }
        .articlename{
          font-size: .24rem;
          color: #333;
          line-height: 1.5;
          text-align: center;
          margin: .1rem 0 .2rem;
        }
        .toArticleDetail{
          width: 1.68rem;
          height: .48rem;
          line-height: .48rem;
          text-align: center;
          margin: 0 auto .5rem;
          background-color: #603de2;
          border-radius: .12rem;
          font-size: .24rem;
          color: #fff;
          display: block;

        }
        .remark{
          .remark_tit{
            display: flex;
            align-items:center;
            justify-content: space-between;
            span{
              width: 2rem;
              height: 1px;
              background-color: #d8d8d8;
            }
            em{
              padding: 0 .2rem;
              font-size: .28rem;
              color: #333;
            }
          }
          p{
            line-height: 1.5;
            font-size: .2rem;
            color: #666;
            padding: .2rem 0 .3rem;
            text-align: justify;
          }
        }
      }
      .level{
        width: 1.6rem;
        height: .62rem;
        background: url('./resource/level.png') no-repeat center;
        background-size: contain;
        font-size: .28rem;
        color: #4729b7;
        padding-left: .24rem;
        box-sizing: border-box;
      }
      .first{
        padding-top: .1rem;
        .first_item{
          margin-top: .3rem;
          position: relative;
          .item_info{
            margin-top: -.2rem;
            width: 100%;
            background: url('./resource/firbg.png') no-repeat center;
            background-size: 100% 100%;
            padding: 0.53rem .46rem .47rem;
            box-sizing: border-box;
            min-height: 4rem;
            .uinfo{
              display: flex;
              align-items: center;
              .avater{
                width: .8rem;
                height: .8rem;
                overflow: hidden;
                padding-right: .3rem;
                img{
                  width: 100%;
                  border-radius: 50%;
                }
              }
              .uname{
                border-left: 1px solid #b5b5b5;
                padding-left: .3rem;
                padding-right: .2rem;
                flex:1;
                -webkit-box-flex: 1;
                width: 0;
                h6{
                  font-size: .28rem;
                  color: #333;
                  margin-bottom: .08rem;
                  .ellipsis;
                }
                .artname{
                  width: 100%;
                  font-size: .24rem;
                  color: #333;
                }
              }
              .right{
                font-size: .24rem;
                color: #4417b5;
              }
            }
            .mark{
              margin-top: 1.1rem;
              p{
                line-height: 1.5;
                font-size: .2rem;
                color: #666;
                text-align: justify;
              }
            }
          }
        }
      }
      .second_third{
        padding-top: .1rem;
        .level_item{
          margin-top: .3rem;
          .list_box{
            margin-top: -.2rem;
            border-radius: .12rem;
            background: #fff;
            padding: .26rem .3rem;
            box-sizing: border-box;
            .item{
              display: flex;
              padding: .2rem 0;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #b5b5b5;
              &:last-child{
                border-bottom: none;
              }
              .left{
                display: flex;
                flex:1;
                -webkit-flex:1;
                 img{
                   width: .8rem;
                   height: .8rem;
                   border-radius: 50%;
                 }
                 .nameinfo{
                   padding-left: .3rem;
                   flex:1;
                   -webkit-box-flex: 1;
                   -webkit-flex:1;
                   width: 0;
                   h6{
                     .ellipsis;
                      font-size: .28rem;
                      color: #333;
                      margin-bottom: .08rem;
                    }
                    p{
                      .ellipsis;
                      font-size: .24rem;
                      color: #333;
                    }
                 }
              }
              .right{
                font-size: .24rem;
                color: #4417b5;
              }
            }
          }
        }
      }
      .creative{
        width: 100%;
        background: #fff;
        border-radius: .12rem;
        margin-top: .31rem;
        .writer_list{
          padding: .24rem .38rem;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          .item{
            width: 50%;
            border-bottom: 1px solid #b5b5b5;
            padding: .15rem 0;
            display: flex;
            &:last-child,&:nth-last-child(2){
              border-bottom: none;
            }
            .avatar{
              width: .8rem;
              height: .8rem;
              overflow: hidden;
              padding-right: .3rem;
              img{
                width: 100%;
                border-radius: 50%;
              }
            }
            .writer_info{
              font-size: .24rem;
              flex:1;
              -webkit-flex:1;
              width: 0;
              h6{
                .ellipsis;
                width: 100%;
                color: #333;
                margin-bottom: .1rem;
              }
              span{
                color: #666666;
              }
            }
          }
        }
      }
      .popular{
        width: 100%;
        background: #fff;
        border-radius: .12rem;
        margin-top: .31rem;
        .pop_box{
          padding: .22rem .38rem;
          box-sizing: border-box;
          .item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: solid 1px #b5b5b5;
            padding: .14rem 0;
            &:last-child{
              border-bottom: none;
            }
            .left{
              display: flex;
              align-items: center;
            }
            .avatar{
              width: .8rem;
              height: .8rem;
              overflow: hidden;
              padding:0 .23rem;
              img{
                width: 100%;
                border-radius: 50%;
              }
            }
            .rank{
              padding-right: .2rem;
              img{
                width: .6rem;
              }
              span{
                display: block;
                width: .6rem;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
.bottom_img{
  padding-top: .42rem;
  img{
    width: 100%;
    display: block;
  }
}
</style>
