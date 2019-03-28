<template>
  <div class="wrap">
    <div class="empty" v-if="!this.status.entity&&!this.status.cards&&!this.status.coin">
      <img src="./resource/empty.png" alt class="empty-img">
      <div class="text">还没有奖品哦~快去开启礼盒吧！</div>
      <div class="btn" @click="look">去查看</div>
    </div>
    <!-- 实物奖励 -->
    <div class="full" v-if="status.entity">
      <div class="entity">
        <div class="title">实物奖励</div>
        <div :class="[is?'full-btn':'editAdd']" @click="changeVisible()">
          {{is?'填写收货地址':'修改收货地址'}}
          <div class="tooltip" v-if="tooltip">
            <div class="arrow"></div>您有奖品待邮递，快来填写收货地址吧
          </div>
        </div>
        <div class="read-box">
          <div class="readBox">
            实物奖品将在4.10日前寄送
            <div class="bottom"></div>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="list" v-for="(item,index) in entity" :key="index">
        <img :src="item.award.img" alt class="list-img">
        <div class="list-detail">
          <div class="list-name">{{item.award.awardName}}</div>
          <div class="list-date">领取时间：{{item.draw_time}}</div>
        </div>
      </div>
    </div>
    <!-- 读书卡与帮帮币 -->
    <div class="full" v-if="item.rewards.length > 0" v-for="(item,index) in cards" :key="index">
      <div class="entity">
        <div class="title">{{item.name}}</div>
        <div class="full-btn" @click="openWindow(item.url,item.btn)">{{item.btn}}</div>
      </div>
      <div class="list" v-for="(i,n) in item.rewards" :key="n">
        <img :src="i.award.img" class="list-img">
        <div class="list-detail">
          <div class="list-name">{{i.award.awardName}}</div>
          <div class="list-date">领取时间：{{i.draw_time}}</div>
        </div>
      </div>
      <div class="active" v-if="item.hasMore" @click="getList(num+1,item.type)">
        展开更多
        <zyb-icon name="arrow-l" size="0.2rem" class="arrow"/>
      </div>
      <div class="active" v-if="!item.hasMore" @click="pack(item.name)">
        收起
        <zyb-icon name="arrow-l" size="0.2rem" class="clap"/>
      </div>
    </div>
    <!-- 表单 -->
    <zyb-popup :visible.sync="visible" position="bottom" class="pop">
      <div class="form">
        <div class="form-title">填写收货地址</div>
        <div class="cancel" @click="addAdress('2')">取消</div>
        <input
          type="text"
          v-model="form.name"
          :class="[{'verify':failVerify.uname},'dialog-input',]"
          :placeholder="place.username"
          @blur.prevent="verifyName()"
        >
        <input
          type="number"
          oninput="if(value.length>11)value=value.slice(0,11)"
          v-model="form.phone"
          :class="[{'verify':failVerify.phone},'dialog-input',]"
          :placeholder="place.phone"
          @blur.prevent="verifyPhone()"
        >
        <textarea
          rows="3"
          v-model="form.address"
          :class="[{'verify':failVerify.add},'dialog-textarea',]"
          :placeholder="place.add"
          @blur.prevent="verifyAdd()"
        ></textarea>
        <div class="add-btn">
          <div class="add-confirm" @click="addAdress('1')">保存</div>
        </div>
      </div>
    </zyb-popup>
  </div>
</template>

<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

export default {
  name: 'readWorldRewards',
  data() {
    return {
      is: true, // 添加收货地址按钮样式,false为编辑
      visible: false,
      place: {
        username: '点此输入收货人姓名',
        phone: '点此输入收货人手机号码',
        add: '详细地址：省、市、县、街道、小区、门牌号',
      },
      form: {
        // 表单
        name: '',
        phone: '',
        address: '',
      },
      failVerify: {
        phone: false,
        add: false,
        uname: false,
      },
      addressDetaill: {
        phone: '',
        name: '',
        address: '',
      },
      status: {
        // 有无数据的状态
        entity: false,
        cards: false,
        coin: false,
      },
      entity: [],
      cards: [],
      // 保存第一页的奖品
      firstCards: [],
      firstCoin: [],
      num: 0,
      href: window.location.origin,
      rn: 2,
      tooltip: false,
      // end
    };
  },
  created() {
    zybLog.send({ type: 'rewardsPageLook' });
    // 获取数据
    this.getList(0, 1);
    this.getList(0, 2);
    this.getList(0, 3);
    // 获取填写地址状态
  },
  methods: {
    switch() {
      this.tooltip = false;
    },
    // 获取数据
    getList(n, types) {
      if (n === 0) {
        this.rn = 2;
      } else {
        this.rn = 4;
      }
      this.$fetch({
        url: '/macan/activity/PurchaseBookCardPrizeDrawMyPrizes',
        method: 'get',
        params: {
          pn: n,
          rn: this.rn,
          type: types,
        },
      }).then((res) => {
        if (res.errNo === 0) {
          if (n !== 0) {
            zybLog.send({ type: 'lookMoreClick' });
            this.num += 1;
          }
          if (types === 1) {
            if (res.data.prizes.length === 0) {
              this.status.entity = false;
              this.tooltip = false;
            } else {
              this.status.entity = true;
              this.tooltip = true;
            }
            this.entity = res.data.prizes;
          } else if (types === 2) {
            if (res.data.prizes.length === 0) {
              this.status.cards = false;
            } else {
              this.status.cards = true;
            }
            if (n === 0) {
              const card = {
                name: '读书卡奖励',
                btn: '去阅读',
                url: 'app://homework/push/link?to=cartoon_book',
                type: types,
                rewards: [],
              };
              card.hasMore = res.data.hasMore;
              card.rewards = res.data.prizes;
              this.cards.push(card);
              this.firstCards = [];
              this.firstCards = JSON.parse(JSON.stringify(res.data.prizes));
            } else {
              this.cards.forEach((item) => {
                const newI = item;
                if (newI.name === '读书卡奖励') {
                  res.data.prizes.forEach((i) => {
                    newI.rewards.push(i);
                  });
                  newI.hasMore = res.data.hasMore;
                }
              });
            }
          } else if (types === 3) {
            if (res.data.prizes.length === 0) {
              this.status.coin = false;
            } else {
              this.status.coin = true;
            }
            if (n === 0) {
              const coin = {
                name: '帮帮币奖励',
                btn: '兑换读书卡',
                url: 'https://www.zybang.com/macan/mall/goodslist?type=4',
                type: types,
                rewards: [],
              };
              coin.hasMore = res.data.hasMore;
              coin.rewards = res.data.prizes;
              this.cards.push(coin);
              this.firstCoin = JSON.parse(JSON.stringify(res.data.prizes));
            } else {
              this.cards.forEach((item) => {
                if (item.name === '帮帮币奖励') {
                  res.data.prizes.forEach((i) => {
                    item.rewards.push(i);
                  });
                  const newI = item;
                  newI.hasMore = res.data.hasMore;
                }
              });
            }
          }
        }
      });
    },
    // 收起
    pack(name) {
      if (name === '读书卡奖励') {
        this.cards.forEach((item) => {
          if (item.name && item.name === '读书卡奖励') {
            const i = item;
            i.rewards = JSON.parse(JSON.stringify(this.firstCards));
            i.hasMore = true;
            this.num = 0;
          }
        });
      } else if (name === '帮帮币奖励') {
        this.cards.forEach((item) => {
          if (item.name && item.name === '帮帮币奖励') {
            const i = item;
            i.rewards = JSON.parse(JSON.stringify(this.firstCoin));
            i.hasMore = true;
            this.num = 0;
          }
        });
      }
    },
    // 跳转阅读世界
    openWindow(url, btn) {
      if (btn === '去阅读') {
        zybLog.send({ type: 'toReadClick' });
        hybrid('APPJumpProtocol', {
          protocolString: 'app://homework/push/link?to=cartoon_book',
        });
      } else if (btn === '兑换读书卡') {
        zybLog.send({ type: 'toConvertClick' });
        hybrid('openWindow', {
          url,
          hideNav: 1,
          hideStatus: 1,
        });
      }
    },
    // 去查看
    look() {
      zybLog.send({ type: 'linkToRewardsClick' });
      hybrid('openWindow', {
        url: `${this.href}/plat/activity-vue/readWorldLucky.html`,
        hideNav: 1,
        hideStatus: 1,
      });
    },
    // 表单显隐
    changeVisible() {
      zybLog.send({ type: 'addressClick' });
      this.visible = !this.visible;
      this.switch();
    },
    // 为form存储默认值
    keepForm() {
      if (this.addressDetaill.phone !== '') {
        const keys = Object.keys(this.form);
        keys.forEach((key) => {
          this.form[key] = this.addressDetaill[key];
        });
      } else {
        this.form = {
          name: '',
          phone: '',
          address: '',
        };
      }
    },
    // 编辑收货地址
    addAdress(item) {
      if (item === '1') {
        // 执行验证函数
        this.verifyName();
        this.verifyPhone();
        this.verifyAdd();
        if (this.form.name === '') {
          this.failVerify.uname = true;
        } else if (this.form.phone.length !== 11) {
          this.failVerify.phone = true;
        } else if (this.form.address === '') {
          this.failVerify.add = true;
        } else {
          this.failVerify.uname = false;
          this.failVerify.phone = false;
          this.failVerify.add = false;
          const formData = JSON.parse(JSON.stringify(this.form));
          this.$fetch({
            url: '/macan/activity/PurchaseBookCardPrizeDrawUpdateUserAddress',
            method: 'post',
            data: formData,
            formType: true,
          }).then((res) => {
            if (res.errNo === 0) {
              this.addressDetaill = this.form;
              this.visible = false;
              this.is = false;
              hybrid('toast', { text: '收货地址添加成功' });
            }
          });
        }
      } else {
        this.keepForm();
        this.visible = false;
        this.failVerify.uname = false;
        this.failVerify.phone = false;
        this.failVerify.add = false;
      }
    },
    // 验证函数
    verifyName() {
      if (this.form.name === '') {
        this.failVerify.uname = true;
        this.place.username = '收货人姓名不能为空';
      } else {
        this.failVerify.uname = false;
        this.place.username = '点此输入收货人姓名';
      }
    },
    verifyPhone() {
      if (this.form.phone.length !== 11) {
        this.failVerify.phone = true;
        this.place.phone = '请输入正确的手机号码';
      } else {
        this.failVerify.phone = false;
        this.place.phone = '点此输入收货人手机号码';
      }
    },
    verifyAdd() {
      if (this.form.address === '') {
        this.failVerify.add = true;
        this.place.add = '详细地址不能为空';
      } else {
        this.failVerify.add = false;
        this.place.add = '详细地址：省、市、县、街道、小区、门牌号';
      }
    },
    // end
  },
};
</script>

<style lang="scss" >
@import "../readWorldLucky/mixin.scss";
@function rem($px) {
  @return $px / 100 + rem;
}
html,
body {
  width: 100%;
  height: 100%;
}
.wrap {
  width: 100%;
  height: 100%;
  background-color: #82d86f;
  color: #ccc;
  user-select: none;
  overflow: scroll;
  .full {
    width: 100%;
    height: auto;
    margin: rem(60) auto 0;
    width: rem(662);
    &:last-child {
      margin-bottom: rem(40);
    }
    .entity {
      margin-bottom: rem(30);
      .title {
        display: inline-block;
        color: #1f7b1e;
        font-size: rem(36);
        font-weight: bold;
        text-shadow: 0 2px 0px #a7e49a;
      }
      .full-btn {
        position: relative;
        float: right;
        width: rem(182);
        height: rem(50);
        line-height: rem(50);
        font-size: rem(24);
        border-radius: rem(24);
        font-weight: bold;
        text-align: center;
        background: linear-gradient(180deg, #ffec38, #ffd32d);
        color: #b9740f;
        box-shadow: 0px 2px 4px #74be51;
        margin-top: rem(10);
        // tooltip
        .tooltip {
          position: absolute;
          width: rem(470);
          height: rem(60);
          font-size: rem(20);
          border-radius: rem(10);
          color: #fff;
          line-height: rem(60);
          text-align: center;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 10001;
          right: 0;
          .arrow {
            top: 4px;
            right: 16px;
            position: absolute;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid rgba(0, 0, 0, 0.7);
            top: -5px;
          }
        }
      }
      .editAdd {
        position: relative;
        border: 2px solid #4bba55;
        width: rem(182);
        height: rem(50);
        line-height: rem(50);
        font-size: rem(24);
        border-radius: rem(25);
        float: right;
        color: #40953a;
        background: transparent;
        font-weight: bold;
        text-align: center;
        box-shadow: inset 0px 1px 1px #b4e8a9, 0px 1px 1px #b4e8a9;
      }
      .read-box {
        margin-top: rem(10);
        width: 100%;
        height: auto;
        .readBox {
          display: inline-block;
          color: #fff;
          font-size: rem(24);
          height: auto;
          text-align: center;
          .bottom {
            margin-top: rem(-5);
            height: rem(10);
            border-radius: rem(5);
            background-color: #57c055;
          }
        }
      }
    }
    .list {
      box-sizing: border-box;
      margin-top: rem(20);
      padding: rem(22) 0 0 rem(22);
      width: 100%;
      height: rem(162);
      background-color: #fff;
      border-radius: rem(20);
      box-shadow: inset -2px -2px 0px #dcf4d6, 0px 1px 4px #69c15b;
      .list-img {
        float: left;
        width: rem(120);
        height: rem(120);
      }
      .list-detail {
        float: left;
        margin-top: rem(14);
        margin-left: rem(16);
        .list-name {
          color: #333333;
          font-size: rem(32);
        }
        .list-date {
          margin-top: rem(18);
          color: #666;
          font-size: rem(24);
        }
      }
    }
    .active {
      width: 100%;
      height: rem(62);
      background-color: #60c04b;
      color: #fff;
      font-size: rem(24);
      line-height: rem(62);
      text-align: center;
      border-radius: rem(14);
      margin-top: rem(18);
      .arrow {
        transform: rotate(-90deg) translateX(20%);
      }
      .clap {
        transform: rotate(90deg) translateX(10%);
      }
    }
  }
  .empty {
    width: 100%;
    .empty-img {
      position: absolute;
      width: rem(206);
      height: rem(258);
      top: rem(212);
      left: 50%;
      transform: translateX(-50%);
    }
    .text {
      color: #fff;
      font-size: rem(30);
      text-align: center;
      width: 100%;
      margin-top: rem(506);
    }
    .btn {
      width: rem(252);
      height: rem(80);
      font-size: rem(30);
      font-weight: bold;
      line-height: rem(80);
      text-align: center;
      border-radius: rem(40);
      margin: rem(48) auto 0;
      @include subBtn(#b97410, #ffec39, #ffd12b);
    }
  }
  .pop {
    width: 100%;
    .form {
      width: rem(630);
      height: 100%;
      text-align: center;
      padding-top: rem(40);
      margin: 0 auto;
      .form-title {
        font-size: rem(36);
        color: #333333;
        font-weight: bold;
        display: inline-block;
        margin-bottom: rem(34);
      }
      .cancel {
        float: right;
        display: inline-block;
        margin-top: rem(10);
        font-size: rem(24);
        color: #3aa344;
      }
      .dialog-input {
        box-sizing: border-box;
        width: rem(630);
        height: rem(80);
        margin-bottom: rem(20);
        border: 1px solid #ccc;
        border-radius: rem(10);
        padding-left: rem(20);
        font-size: rem(28);
        color: #999;
        line-height: rem(80);
        outline: none;
      }
      .dialog-textarea {
        box-sizing: border-box;
        width: rem(630);
        height: rem(120);
        border: 1px solid #ccc;
        border-radius: rem(10);
        font-size: rem(28);
        color: #999;
        line-height: rem(36);
        padding-left: rem(20);
        padding-top: rem(20);
        outline: none;
      }
      .verify {
        border: 1px solid #ff593c;
        &::-webkit-input-placeholder {
          color: #ff593c;
        }
      }
      .add-btn {
        width: rem(250);
        height: auto;
        margin: rem(36) auto rem(40);
        display: inline-block;
        .add-confirm {
          width: rem(250);
          height: rem(80);
          line-height: rem(80);
          text-align: center;
          font-weight: bold;
          font-size: rem(30);
          border-radius: rem(40);
          background: linear-gradient(180deg, #ffec38, #ffd32d);
          color: #b97410;
        }
      }
    }
  }
  // end
}
</style>

