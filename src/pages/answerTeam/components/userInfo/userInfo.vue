<template>
  <div class="info-outer" @touchmove="e => { e.preventDefault(); }">
    <div class="info-box">
      <div class="title" :style="{ backgroundColor : mainColor }">信息填写<b class="close" @click="closeInfoTan"></b></div>
      <div class="content">
        <ul>
          <li>
            <label>姓名</label><input type="text" placeholder="真实姓名" maxlength="6" v-model="formData.name">
          </li>
          <li>
            <label>昵称</label><input id="nickname" type="text" placeholder="作业帮App昵称" maxlength="10" v-model="formData.nickName">
          </li>
          <li>
            <label>省市</label>
            <div class="select-box">
              <label for="province">
                <select id="province" v-model="provinceData" @change="getCity">
                  <option value="">请选择省</option>
                  <option v-for="item in provinceArray" :key="item.id" :value="item">{{ item.name }}</option>
                </select>
                <div class="block"><b></b></div>
              </label>
            </div>
            <div class="select-box city">
              <label for="city">
                <select id="city" v-model="cityData">
                  <option value="">请选择市</option>
                  <option v-for="item in cityArray" :key="item.id" :value="item">{{ item.name }}</option>
                </select>
                <div class="block"><b></b></div>
              </label>
            </div>
          </li>
          <li>
            <label>学校</label><input type="text" placeholder="如：清华大学附属小学" v-model="formData.school">
          </li>
          <li>
            <label>年级</label>
            <div class="select-box">
              <label for="grade">
                <select id="grade" v-model="formData.grade">
                  <option value="">请选择</option>
                  <option v-for="(item, index) in gradeArray" :key="index" :value="index">{{ item }}</option>
                </select>
                <div class="block"><b></b></div>
              </label>
            </div>
          </li>
          <li>
            <label>手机号</label><input type="text" placeholder="请正确填写手机号格式" v-model="formData.phone" maxlength="11">
          </li>
        </ul>
        <div class="tip">提示：所有信息必须填写，确认后不可更改！</div>
        <span :style="{ backgroundColor : mainColor }" class="submit-btn" @click="submitInfo">提交</span>
      </div>
    </div>
  </div>
</template>
<script>
import hybrid from 'plat-utils/src/hybrid';
import zybLog from 'plat-utils/src/zybLog';

export default {
  data() {
    return {
      formData: {
        name: '',
        nickName: '',
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        grade: '',
        school: '',
        phone: '',
      },
      provinceData: '',
      cityData: '',
      gradeArray: {
        1: '一年级',
        2: '二年级',
        3: '三年级',
        4: '四年级',
        5: '五年级',
        6: '六年级',
        7: '初一',
        8: '初二',
        9: '初三',
        10: '高一',
        11: '高二',
        12: '高三',
      },
      provinceArray: [],
      cityArray: [],
    };
  },
  props: {
    fillInfo: Boolean,
    mainColor: String,
  },
  created() {
    this.getProvinceCity();
  },
  methods: {
    getProvinceCity(type = '', id = '') {
      this.$fetch.get(`/napi/ajax/fudaoschoolinfo?type=${type}&id=${id}`)
        .then((res) => {
          if (res && res.errNo === 0) {
            const data = res.data || {};
            if (type === 0 || !type) {
              this.provinceArray = data.list;
            } else if (type === 1) {
              this.cityArray = data.list;
            }
          }
        });
    },
    getCity() {
      this.getProvinceCity(1, this.provinceData.id);
    },
    closeInfoTan() {
      this.$emit('showInfoTan', false);
      zybLog.send({
        type: 'infoWindowClose',
      });
    },
    submitInfo() {
      let canSubmit = 1;
      this.formData.province = this.provinceData.name;
      this.formData.provinceId = this.provinceData.id;
      this.formData.city = this.cityData.name;
      this.formData.cityId = this.cityData.id;
      Object.keys(this.formData).forEach((key) => {
        if (this.formData[key] === '' && canSubmit) {
          hybrid('toast', { text: '有信息未填写！' });
          canSubmit = 0;
        }
      });
      if (!this.ifPhone(this.formData.phone) && canSubmit) {
        hybrid('toast', { text: '手机格式错误！' });
        canSubmit = 0;
      }
      if (canSubmit) {
        const url = '/napi/activity/answercommunityuseradd';
        this.$fetch({
          url,
          data: this.formData,
          method: 'post',
          formType: true,
        }).then((res) => {
          if (!res.errNo) {
            this.$emit('showInfoTan', false);
            this.$emit('showGrade', true);
          }
        });
      }
    },
    ifPhone(phone) {
      return /^1[0-9]\d{9}$/.test(phone);
    },
  },
};
</script>
<style lang="less" scoped>
.info-outer {
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}
.info-box {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  border-radius: .1rem;
  overflow: hidden;
  box-sizing: border-box;
  transform: translateY(-50%);
  .title {
    width: 100%;
    height: 1.05rem;
    line-height: 1.05rem;
    text-align: center;
    color: #fff;
    font-size: .32rem;
    font-weight: bold;
    // background-color: #ff7600;
    b {
      position: absolute;
      display: block;
      top: .4rem;
      right: .2rem;
      width: .3rem;
      height: .3rem;
      background: url("../../resource/info_close.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .content {
    padding: .4rem .3rem;
    background-color: #f8f8f8;
    box-sizing: border-box;
    ul {
      width: 100%;
      overflow: hidden;
      li {
        width: 100%;
        height: .8rem;
        margin-bottom: .2rem;
        list-style-type: none;
        >label {
          float: left;
          width: 1rem;
          height: .8rem;
          font-size: .26rem;
          line-height: .8rem;
          color: #333;
        }
      }
      .select-box {
        float: left;
        width: 36%;
        height: .8rem;
        label {
          position: relative;
          display: inline-block;
          width: 100%;
          border: 1px solid #d8d8d8;
          border-radius: .1rem;
          overflow: hidden;
        }
        select {
          float: left;
          display: inline-block;
          width: 85%;
          height: .8rem;
          padding-left: .2rem;
          background-color: #fff;
          line-height: .8rem;
          font-size: .22rem;
          color: #999;
          -webkit-appearance: none;
          outline: 0;
          border: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          option {
            background-color: #fff;
            color: #999;
            height: .5rem;
          }
        }
        .block {
          position: absolute;
          right: 0;
          top: 0;
          width: .36rem;
          height: .8rem;
          text-align: center;
          background-color: #d8d8d8;
          b {
            display: inline-block;
            margin-top: .36rem;
            border-left: .07rem solid transparent;
            border-right: .07rem solid transparent;
            border-top: .12rem solid #fff;
          }
        }
      }
      .city {
        margin-left: .38rem;
      }
      input {
        float: left;
        display: inline-block;
        padding-left: .2rem;
        width: 75%;
        height: .8rem;
        line-height: .8rem;
        background-color: #fff;
        border: 1px solid #d8d8d8;
        border-radius: .1rem;
        outline: 0;
        -webkit-appearance: none;
        font-size: .22rem;
        color: #999;
      }
      input::-webkit-input-placeholder { /* WebKit browsers */
        color: #999;
      }
      input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #999;
      }
      input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #999;
      }
      input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #999;
      }
    }
    .tip {
      width: 100%;
      margin: .1rem 0;
      font-size: .2rem;
      text-align: center;
      color: #999;
    }
    .submit-btn {
      display: block;
      margin: .4rem auto 0;
      width: 100%;
      height: .8rem;
      border-radius: .4rem;
      // background-color: #ff5400;
      text-align: center;
      line-height: .8rem;
      font-size: .32rem;
      color: #fff;
    }
  }
}
</style>
