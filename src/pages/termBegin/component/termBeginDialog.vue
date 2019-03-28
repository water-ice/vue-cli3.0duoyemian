<template>
  <div class="dialog-wrap">
    <transition name="zyb-transition-fade">
      <div class="bubble" @touchmove="e => {e.preventDefault()}" v-show="dialogShow">
        <div class="pop" v-show="item===this.item">
          <!-- head -->
          <div class="head">
            <div class="title">{{filterItem}}</div>
            <div class="cancel" @click="closeBubble"></div>
          </div>
          <!-- content -->
          <div class="content">
            <!-- rule -->
            <div class="rule-scroll" v-show="isRule">
              <scroll ref="diaScroll">
                <div class="rules">
                  <div class="rule" v-for="(items,index) in rules" :key="index">
                    <div class="rule-title">{{items.title}}</div>
                    <div
                      class="rule-detail"
                      v-for="(item,index) in items.rule"
                      :key="index"
                    >{{item}}</div>
                  </div>
                  <div class="copyright">*本活动最终解释权归作业帮所有</div>
                </div>
              </scroll>
            </div>
            <!-- luckyalert -->
            <div class="luckyalert" v-if="isLuckyalert">
              <div class="prize">
                恭喜您获得
                <span class="red">{{prizeName}}</span>
              </div>
              <div class="detail" v-if="isPay">已充值到账 ~</div>
              <div class="detail" v-else>请填写收货地址 ~</div>
              <div class="lucky-btn" v-if="!isPay" @click="clickToAdd">点击填写</div>
            </div>
            <!-- addalert -->
            <div class="addalert" v-if="isAddalert">
              <div class="addalert-detail">您已开通年费会员</div>
              <div class="addalert-detail">请填写收货地址</div>
              <div class="addalert-detail orange">用于收取「超越」笔记礼盒～</div>
              <div class="addalert-btn" @click="clickToAdd">点击填写</div>
            </div>
            <!-- add -->
            <div class="add" v-if="isAdd">
              <input
                type="text"
                v-model="form.userName"
                class="dialog-input"
                placeholder="点此输入收货人姓名"
              >
              <input
                type="number"
                v-model="form.phone"
                class="dialog-input"
                placeholder="点此输入收货人手机号"
              >
              <textarea
                rows="3"
                v-model="form.address"
                class="dialog-textarea"
                placeholder="详细地址：省、市、县（区）、小区、门牌号"
              ></textarea>
              <div class="add-btn">
                <div class="add-cancel" @click="addAdress('2')">取消</div>
                <div class="add-confirm" @click="addAdress('1')">确认</div>
              </div>
            </div>
            <!-- record -->
            <div class="record" v-if="isRecord">
              <table class="table">
                <tr class="table-head">
                  <th>奖品</th>
                  <th>状态</th>
                </tr>
                <tr v-for="(item,index) in prizeList" :key="index">
                  <td class="table-name">{{item.prizeName}}</td>
                  <td class="table-status">{{item.content}}</td>
                </tr>
              </table>
            </div>
            <!-- end -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';
import scroll from '../../../components/scroll/scroll.vue';
import rules from '../rules';

export default {
  name: 'termBeginDialog',
  components: { scroll },
  props: {
    dialogShow: Boolean,
    item: String,
    isPay: Boolean,
    prizeName: String,
    prizeList: Array,
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
      dialogs: [
        { name: 'rule', text: '活动规则' },
        { name: 'addalert', text: '填写地址提示' },
        { name: 'add', text: '填写收货地址' },
        { name: 'luckyalert', text: '中奖提示' },
        { name: 'record', text: '我的中奖记录' },
      ],
      rules: JSON.parse(JSON.stringify(rules)),
      form: {
        userName: '',
        phone: '',
        address: '',
      },
    };
  },
  created() {
    setTimeout(() => {
      this.keepForm();
    }, 1);
  },
  mounted() {
    this.$refs.diaScroll._initScroll();
  },
  watch: {
    dialogShow(val) {
      if (val && this.isRule) {
        this.$refs.diaScroll.refresh();
      }
    },
  },
  computed: {
    filterItem() {
      if (this.item) {
        return this.dialogs.filter(a => a.name === this.item)[0].text;
      }
      return '';
    },
    // 活动规则
    isRule() {
      return this.item === 'rule';
    },
    // 中奖提示
    isLuckyalert() {
      return this.item === 'luckyalert';
    },
    // 填写地址提示
    isAddalert() {
      return this.item === 'addalert';
    },
    // 填写收货地址
    isAdd() {
      return this.item === 'add';
    },
    // 我的中奖记录
    isRecord() {
      return this.item === 'record';
    },
  },
  methods: {
    // 为form存储默认值
    keepForm() {
      // hybrid('toast', { text: this.addressDetaill });
      if (this.addressDetaill.phone !== '') {
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          this.form[key] = this.addressDetaill[key];
        });
      } else {
        this.form = {
          userName: '',
          phone: '',
          address: '',
        };
      }
    },
    // 编辑收货地址
    addAdress(item) {
      if (item === '1') {
        if (this.form.phone === '') {
          hybrid('toast', { text: '手机号不能为空' });
        } else if (this.form.userName === '') {
          hybrid('toast', { text: '姓名不能为空' });
        } else if (this.form.address === '') {
          hybrid('toast', { text: '详细地址不能为空' });
        } else {
          const formData = JSON.parse(JSON.stringify(this.form));
          formData.activityId = 'f91792aef02e52fa71d1f324b2926998';
          this.$fetch({
            url: '/activity/vip/activityaddress',
            method: 'post',
            data: formData,
            formType: true,
          }).then((res) => {
            if (res.errNo === 0) {
              this.$emit('doSomeThing', 'refresh');
              this.closeBubble();
              hybrid('toast', { text: '收货地址添加成功' });
            }
          });
        }
      } else {
        this.keepForm();
        this.closeBubble();
      }
    },
    // 点击填写收货地址
    clickToAdd() {
      zybLog.send({ type: ' windowaddress' });
      this.$emit('changeVisible', [false, 'toAdd']);
    },
    // 关闭弹框
    closeBubble() {
      this.$emit('changeVisible', [false]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../mixin.scss";
@function rem($px) {
  @return $px / 100 + rem;
}
.dialog-wrap {
  width: 100%;
  .bubble {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    background: rgba(0, 0, 0, 0.6);
    .pop {
      position: fixed;
      width: rem(600);
      height: auto;
      left: 50%;
      top: 50%;
      color: white;
      transform: translate(-50%, -50%);
      z-index: 1002;
      .head {
        width: 100%;
        height: rem(104);
        background: url("../resource/pop-head.png") no-repeat;
        background-size: contain;
        .title {
          font-size: rem(46);
          color: white;
          width: 100%;
          line-height: rem(104);
          text-align: center;
          vertical-align: middle;
        }
        .cancel {
          position: absolute;
          top: 0;
          right: 0;
          width: rem(46);
          height: rem(46);
          transform: translate(50%, -50%);
          background: url("../resource/cancel.png") no-repeat;
          background-size: contain;
        }
      }
      .content {
        width: 100%;
        height: 100%;
        background-color: #fff;
        color: #333;
        border-bottom-left-radius: rem(20);
        border-bottom-right-radius: rem(20);
        // rules
        .rule-scroll {
          width: 100%;
          height: rem(480);
          margin-bottom: rem(30);
          .rules {
            .rule {
              height: 100%;
              width: rem(550);
              margin: 0 auto;
              counter-reset: ruleList 0;
              .rule-title {
                @include detail-red(rem(36), #f44f3d);
                font-weight: bold;
                text-align: center;
                padding-top: rem(30);
              }
              .rule-detail {
                counter-increment: ruleList;
                text-align: start;
                padding-left: rem(34);
                line-height: rem(34);
                font-weight: bold;
                @include detail-red(rem(20), #666);
                &::before {
                  content: counter(ruleList);
                  display: inline-block;
                  width: rem(24);
                  height: rem(24);
                  background-color: rgba($color: #f04432, $alpha: 0.2);
                  color: #f04432;
                  border-radius: 50%;
                  text-align: center;
                  line-height: rem(26);
                  margin-left: rem(-34);
                  margin-right: rem(10);
                }
              }
            }
            & > .rule:nth-child(2) > .rule-title {
              padding-bottom: rem(20);
            }
            .copyright {
              margin-top: rem(10);
              padding-left: rem(60);
              padding-bottom: rem(60);
              @include detail-red(rem(20), #666);
            }
          }
        }
        // luckyalert
        .luckyalert {
          height: 100%;
          width: 100%;
          text-align: center;
          padding: rem(60) 0;
          .prize {
            margin-bottom: rem(20);
            @include detail-red(rem(32), #666);
            .red {
              @include detail-red(rem(32), #f64f3d);
            }
          }
          .detail {
            margin-bottom: rem(30);
            @include detail-red(rem(32), #666);
          }
          .lucky-btn {
            @include dialogBtn(
              rem(364),
              rem(72),
              0,
              0,
              0,
              0,
              rem(32),
              rem(35),
              #df2128,
              #ffd524,
              #ffffaf,
              #ffc215
            );
          }
        }
        // addalert
        .addalert {
          height: 100%;
          width: 100%;
          text-align: center;
          padding: rem(60) 0;
          .addalert-detail {
            margin-bottom: rem(20);
            @include detail-red(rem(32), #666);
          }
          .orange {
            color: #ff6000;
            margin-bottom: rem(30);
          }
          .addalert-btn {
            @include dialogBtn(
              rem(364),
              rem(72),
              0,
              0,
              0,
              0,
              rem(32),
              rem(35),
              #df2128,
              #ffd524,
              #ffffaf,
              #ffc215
            );
          }
        }
        // add
        .add {
          width: 100%;
          height: 100%;
          text-align: center;
          padding-top: rem(40);
          .dialog-input {
            width: rem(470);
            height: rem(78);
            margin-bottom: rem(20);
            border: 1px solid #ccc;
            border-radius: rem(10);
            padding-left: rem(20);
            font-size: rem(24);
            color: #999;
            line-height: rem(78);
          }
          .dialog-textarea {
            width: rem(470);
            height: rem(120);
            border: 1px solid #ccc;
            border-radius: rem(10);
            font-size: rem(24);
            color: #999;
            line-height: rem(36);
            padding-left: rem(20);
            padding-top: rem(20);
          }
          .add-btn {
            width: rem(470);
            height: auto;
            margin: rem(40) auto rem(60);
            display: inline-block;
            .add-cancel {
              display: block;
              float: left;
              @include dialogBtn(
                rem(182),
                rem(70),
                0,
                0,
                0,
                0,
                rem(32),
                rem(35),
                #8b8b8b,
                #bdbdbd,
                #dcdcdc,
                #a3a3a3
              );
            }
            .add-confirm {
              display: block;
              float: right;
              @include dialogBtn(
                rem(258),
                rem(70),
                0,
                0,
                0,
                0,
                rem(32),
                rem(35),
                #df2128,
                #ffd524,
                #ffffaf,
                #ffc215
              );
            }
          }
        }
        // record
        .record {
          width: 100%;
          height: 100%;
          text-align: center;
          padding-top: rem(40);
          padding-bottom: rem(50);
          .table {
            margin: 0 auto;
            width: rem(490);
            height: auto;
            .table-head {
              height: rem(60);
              & > th {
                font-weight: bold;
                @include detail-red(rem(32), #666);
              }
            }
            tr {
              height: rem(50);
            }
            .table-name {
              @include detail-red(rem(28), #f64f3e);
            }
            .table-status {
              @include detail-red(rem(28), #666);
            }
          }
        }
      }
    }
  }
}
</style>

