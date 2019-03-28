<template>
  <div class='paperInfo'>
    <div class="fillPart" v-show="!hasSubmit">
      <div class="header">
      </div>
      <div class="form">
        <div class="form-group">
          <div class="form-control required select-wrap">
            <label>年级</label>
            <select
              v-model="formData.grade"
              :class="{ gray: !isGray.grade}"
              @click="isGray.grade=true"
            >
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in grades" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
          <div class="form-control required select-wrap">
            <label>学科</label>
            <select v-model="formData.subject" :class="{ gray: !isGray.subject}" @click="isGray.subject = true">
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in subjects" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <div class="form-control required select-wrap">
            <label>省份</label>
            <select v-model="formData.province" :class="{ gray: !isGray.province }"
                    @click="isGray.province=true"
                    ref="provinceElem" @change="changeProvince($event)">
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in provinces" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
          <div class="form-control select-wrap">
            <label>市</label>
            <select v-model="formData.city" @change="changeCity"
                    @click="isGray.city=true"
                    :class="{ gray: !isGray.city }">
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in cities" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
        </div>
        <div class="form-control select-wrap">
          <label>区</label>
          <select v-model="formData.area"
            :class="{ gray: !isGray.area }"
            @click="isGray.area=true"
            @change="changeArea($event)"
          >
            <option value="" disabled style="display: none">请选择</option>
            <option v-for="(item, index) in areas" :value="item" :key="index">{{item.name}}</option>
          </select>
        </div>
        <div class="form-control required select-wrap">
          <label>学校</label>
          <select
            v-model="formData.school"
            :class="{ gray: !isGray.school }"
            ref="schoolSelect"
            @click="isGray.school=true"
          >
            <option value="" disabled style="display: none">请选择</option>
            <option value="" v-show="schoolInfoShow" disabled>{{schoolInfo}}</option>
            <option v-for="(item, index) in schools" :value="item" :key="index">{{item.name}}</option>
          </select>
          <!-- <span class="select-layer" @click="changeSchool"></span> -->
          <!-- <input class="input" type="text" placeholder="请输入学校全称" v-model="formData.school"> -->
        </div>
        <div class="form-control required select-wrap">
          <label>年份</label>
          <select v-model="formData.year" :class="{ gray: !isGray.year }" @click="isGray.year=true">
            <option value="" disabled style="display: none">请选择</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <!-- <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option> -->
          </select>
        </div>

        <div class="form-group">
          <div class="form-control required select-wrap">
            <label>学期</label>
            <select v-model="formData.term" :class="{ gray: !isGray.term}" @click="isGray.term=true">
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in terms" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
          <div class="form-control required select-wrap">
            <label>类型</label>
            <select v-model="formData.examtype" :class="{ gray: !isGray.examtype}" @click="isGray.examtype = true">
              <option value="" disabled style="display: none">请选择</option>
              <option v-for="(item, index) in examTypes" :value="item" :key="index">{{item.name}}</option>
            </select>
          </div>
        </div>
        <!-- <div class="form-group large">
          <div class="form-control">
            <input class="input" type="text" v-model="formData.name">
            <span class="duplicate" @click="check">查重</span>
          </div>
          <ul class="checkResult" v-show="checkResult.length">
            <li class="resultShow" v-for="(item,index) in checkResult" :key="index">已有：{{item.name}}</li>
          </ul>
          <p class="noLikeRecord" v-show="!checkResult.length&&hasChecked">暂无相似上传记录</p>
        </div> -->
        <div class="form-control required">
          <label>QQ</label>
          <input class="input" type="number" placeholder="请填写" v-model="formData.qq">
        </div>
        <upload :limit="limit" @picList="getPicList" ref="upload"></upload>
      </div>
      <div class="fixed-btn" @click="submit"></div>
      <transition name="fade">
        <div class="layer" v-show="layerVisible"> <!-- layerVisible -->
          <div class="modal">
            <img class="modal-bg" src="./resource/modal.png" alt="">
            <div class="content">
              <div class="all">
                <!-- <div class="tips">
                  <input type="tel" v-model="formData.qq" placeholder="请输入QQ号码"> <br>
                  <span>试卷审核通过后你将获得5元现金奖励 !</span> <br>
                  <span>留下你的QQ号方便我们联系你</span>
                </div> -->
                <span class="qqgroup">{{qqGroup}}</span> <br>
                <span class="tips qqtips">长按复制上方QQ群号加入领奖群</span>
              </div>
              <div class="footer">
                <!-- <div class="abort btn" @click="operateQQ('abort')"></div> -->
                <div class="confirm btn" @click="operateQQ()">我知道了</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="resultPart" v-show="hasSubmit">
        <div class="header">{{formData.name}}</div>
        <div class="picResult">
          <ul>
            <li class="picItem" v-for="(item, index) in resultPics" alt="" :key="index">
              <img :src="zybImgSrc(item)" alt="">
            </li>
          </ul>
        </div>
        <div class="state">目前状态：审核中</div>
        <div class="footer">
          <div class="toHome btn" @click="toHome"></div>
          <div class="toInfo btn" @click="toInfo"></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Type from 'plat-utils/src/type';
import zybImgSrc from 'plat-utils/src/zybImgSrc';
import hybrid from 'plat-utils/src/hybrid';
import { inApp } from 'plat-utils/src/systemInfo';
import upload from './upload.vue';
import Toast from '../../../components/Toast/index';

export default {
  name: 'fillInfo',
  data() {
    return {
      limit: 20,
      // 表单提交数据、查重数据与验证规则
      formData: {
        name: '',
        province: '',
        year: '',
        city: '',
        area: '',
        school: '',
        grade: '',
        term: '',
        subject: '',
        examtype: '',
        photos: [],
        qq: '',
      },
      formRules: {
        name: {
          required: false,
        },
        year: {
          required: true, message: '年份不得为空',
        },
        province: {
          required: true, message: '请选择所在省份',
        },
        city: {
          required: false,
        },
        area: {
          required: false,
        },
        school: {
          required: true, message: '请选择所在学校',
        },
        grade: {
          required: true, message: '请选择所在年级',
        },
        term: {
          required: true, message: '请选择学期',
        },
        subject: {
          required: true, message: '请选择要上传的科目',
        },
        examtype: {
          required: true, message: '请选择试卷类型',
        },
        qq: {
          required: true, message: '请正确填写QQ号',
        },
        photos: {
          required: true, message: '请上传试卷图片',
        },
      },
      checkData: {
        name: '',
        province: '',
        city: '',
        area: '',
        school: '',
        grade: '',
        term: '',
        subject: '',
        examtype: '',
      },
      // 选择框数据初始化
      grades: [
        // {
        //   id: 11, name: '一年级',
        // }, {
        //   id: 12, name: '二年级',
        // }, {
        //   id: 13, name: '三年级',
        // }, {
        //   id: 14, name: '四年级',
        // }, {
        //   id: 15, name: '五年级',
        // }, {
        //   id: 16, name: '六年级',
        // },
        {
          id: 2, name: '初一',
        }, {
          id: 3, name: '初二',
        }, {
          id: 4, name: '初三',
        }, {
          id: 5, name: '高一',
        }, {
          id: 6, name: '高二',
        }, {
          id: 7, name: '高三',
        },
      ],
      terms: [
        {
          id: 1,
          name: '第一学期',
        },
        {
          id: 2,
          name: '第二学期',
        },
      ],
      examTypes: [
        {
          id: 13,
          name: '期中试题',
        }, {
          id: 14,
          name: '期末试题',
        }, {
          id: 17,
          name: '区域联考',
        },
      ],
      subjects: [
        {
          id: 1,
          name: '语文',
        }, {
          id: 2,
          name: '数学',
        }, {
          id: 3,
          name: '英语',
        }, {
          id: 4,
          name: '物理',
        }, {
          id: 5,
          name: '化学',
        }, {
          id: 6,
          name: '生物',
        }, {
          id: 7,
          name: '政治',
        }, {
          id: 8,
          name: '历史',
        }, {
          id: 9,
          name: '地理',
        }, {
          id: 13,
          name: '理综',
        }, {
          id: 14,
          name: '文综',
        },
      ],
      provinces: [],
      cities: [],
      areas: [],
      schools: [],
      schoolInfo: '',
      schoolInfoShow: false,
      // 页面状态
      layerVisible: false, // 填写QQ弹层
      hasSubmit: false, // 是否已提交
      hasChecked: false, // 是否已查重
      checkResult: [], // 查重结果
      resultPics: [], // 提交后，展示上传图片列表
      request: true, // 禁止多次点击
      qqGroup: '729100755',
      // select 未选择之前是灰色字
      isGray: {
        province: false,
        city: false,
        area: false,
        year: false,
        grade: false,
        term: false,
        subject: false,
        examtype: false,
        school: false,
      },
    };
  },
  watch: {
    name(nVal) {
      this.hasChecked = false;
      this.checkResult = [];
      this.formData.name = nVal.replace(/\s/ig, '');
    },
    grade(nVal, oVal) {
      const nId = nVal.id;
      const oId = oVal.id;
      // 获取学校
      this.changeSchool();
      // 跨学段修改年级，清空学校
      if (Math.abs(nId - oId) > 2) {
        this.formData.school = '';
      }
      // 根据年级更新群号
      if (nId >= 5) {
        // 高中
        this.qqGroup = '966264066';
      } else {
        // 初中
        this.qqGroup = '729100756';
      }
    },
  },
  computed: {
    name() {
      return `${this.formData.year ? `${this.formData.year}届` : ''}${this.formData.province.name || ''}
      ${this.formData.city.name || ''}${this.formData.area.name || ''}${this.formData.school.name}
      ${this.formData.grade.name || ''}${this.formData.term.name || ''}${this.formData.subject.name || ''}
      ${this.formData.examtype.name || ''}`;
    },
    grade() {
      return this.formData.grade;
    },
  },
  methods: {
    getAddress(type = '', id = '', grade = '') {
      this.$fetch.get(`/activity/activity/papercollect/getschoollist?type=${type}&id=${id}&grade=${grade}`)
        .then((res) => {
          if (res && res.errNo === 0) {
            const data = res.data || {};

            if (type === 0 || !type) {
              this.provinces = data.proList;
            } else if (type === 1) {
              this.cities = data.proList;
            } else if (type === 2) {
              this.areas = data.proList;
            }
            if (data.schoolList.length && data.schoolList.length > 0) {
              this.schoolInfoShow = false;
              this.schools = data.schoolList;
            } else {
              this.schoolInfoShow = true;
              this.schools = '';
              if (!this.formData.grade.id) {
                this.schoolInfoShow = true;
                this.schoolInfo = '您还未选择年级';
                return;
              }
              if (!this.formData.province.id) {
                this.schoolInfoShow = true;
                this.schoolInfo = '您还未选择省/市/区';
                return;
              }
              this.schoolInfo = '当前范围内暂无可选学校';
            }
          }
        });
    },
    changeProvince() {
      // 获取市和学校
      this.getAddress(1, this.formData.province.id, this.formData.grade.id);
      this.formData.city = '';
      this.formData.area = '';
      this.formData.school = '';
    },
    changeCity() {
      // 获取区和学校
      this.getAddress(2, this.formData.city.id, this.formData.grade.id);
      this.formData.area = '';
      this.formData.school = '';
    },
    changeArea() {
      // 获取学校
      this.getAddress(3, this.formData.area.id, this.formData.grade.id);
      // 清空学校
      this.formData.school = '';
    },
    changeSchool() {
      let type = 1;
      let regionObj = this.formData.province;
      if (this.formData.area.id) {
        type = 2;
        regionObj = this.formData.area;
      } else if (this.formData.city.id) {
        type = 3;
        regionObj = this.formData.city;
      }
      // 获取学校
      this.getAddress(type, regionObj.id, this.formData.grade.id);
    },
    check() {
      if (!this.validate('check')) {
        return;
      }
      this.$fetch({
        url: '/activity/papercollect/check',
        method: 'post',
        data: this.dealtData('check'),
        formType: true,
      })
        .then((res) => {
          if (res && res.errNo === 0) {
            this.checkResult = res.data.lists;
          }
        });
    },
    submitAjax(data) {
      this.$fetch({
        url: '/activity/papercollect/add',
        method: 'post',
        data,
        formType: true,
      })
        .then((res) => {
          if (res && res.errNo === 0) {
            this.hasSubmit = true;
            this.layerVisible = false;
          } else if (res.errNo === 3 || res.errNo === 99) {
            if (inApp) {
              hybrid('loginForResult', {}, () => {});
            } else if (!inApp && !this.isLogin) {
              window.location.href = `https://www.zybang.com/passport/login?redirect=${encodeURIComponent(window.location.href)}`;
            }
          }
          this.request = true;
        })
        .catch(() => {
          this.request = true;
        });
    },
    submit() {
      if (!this.validate('submit')) {
        return;
      }
      this.layerVisible = true;
    },
    validate(type) {
      let rules = [];
      let data = [];
      if (type === 'submit') {
        rules = Object.keys(this.formData);
        data = this.formData;
      } else {
        rules = Object.keys(this.checkData);
        rules.forEach((r) => {
          this.checkData[r] = this.formData[r];
        });
        data = this.checkData;
      }
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (this.formRules[rule].required && (data[rule] === '' || (!Object.keys(data[rule]).length))) {
          if (inApp) {
            hybrid('toast', { text: this.formRules[rule].message });
          } else {
            Toast({
              message: this.formRules[rule].message,
            });
          }
          return false;
        }
      }
      return true;
    },
    dealtData(type) {
      const keys = type === 'submit' ? Object.keys(this.formData) : Object.keys(this.checkData);
      const data = type === 'submit' ? this.formData : this.checkData;
      const finalData = {};
      keys.forEach((key) => {
        if (Type(data[key]) === 'object') {
          if (key === 'subject' || key === 'grade') {
            finalData[key] = data[key].id;
          } else {
            finalData[key] = data[key].name;
          }
        } else {
          finalData[key] = data[key];
        }
      });
      finalData.provinceId = this.formData.province.id;
      finalData.cityId = this.formData.city.id;
      finalData.areaId = this.formData.area.id;
      finalData.schoolId = this.formData.school.id;
      return finalData;
    },
    operateQQ() {
      const data = this.dealtData('submit');
      if (!this.request) {
        return false;
      }
      // if (type === 'abort') {
      //   data.qq = '';
      // } else {
      //   if (!this.formData.qq) {
      //     Toast({
      //       message: '请填写QQ号',
      //     });
      //     return;
      //   }
      //   data.qq = this.formData.qq;
      // }
      this.submitAjax(data);
    },
    getPicList(val) {
      this.formData.photos = val;
      this.resultPics = val;
    },
    toHome() {
      if (inApp) {
        hybrid('exit');
      } else {
        window.location.href = `${window.location.origin}/plat/activity-vue/paperCollect.html`;
      }
    },
    toInfo() {
      this.cleanData();
    },
    cleanData() {
      this.hasSubmit = false;
      this.hasChecked = false;
      this.resultPics = [];
      const formKeys = Object.keys(this.formData);
      const checkKeys = Object.keys(this.checkData);
      formKeys.forEach((fk) => {
        this.formData[fk] = fk === 'photos' ? [] : '';
      });
      checkKeys.forEach((ck) => {
        this.checkData[ck] = '';
      });
      this.$refs.upload.cleanPics();
    },
    zybImgSrc(pid) {
      return zybImgSrc(pid);
    },
    getMonth() {
      const date = new Date();
      const month = date.getMonth() + 1;
      return month;
    },
    init() {
      const month = this.getMonth();
      if (month >= 4 && month <= 9) {
        this.formData.term = {
          id: 2,
          name: '第二学期',
        };
      } else {
        this.formData.term = {
          id: 1,
          name: '第一学期',
        };
      }
      if ((month >= 4 && month <= 5) || (month >= 10 && month <= 11)) {
        this.formData.examtype = {
          id: 13,
          name: '期中试题',
        };
      } else {
        this.formData.examtype = {
          id: 14,
          name: '期末试题',
        };
      }
    },
  },
  created() {
    // 获取省份列表 type=0 或为空
    this.getAddress('', '');
    this.init();
  },
  components: {
    upload,
  },
};
</script>
<style lang="less" scoped>
.paperInfo {
  padding-bottom: 1.2rem;
  .fillPart {
    .header {
      width: 100%;
      height: 1.8rem;
      background: url(./resource/info_top.png) no-repeat;
      background-size: 100% auto;
    }
    .form {
      padding: .2rem .5rem 0;
      .form-control {
        margin-bottom: .13rem;
        display: flex;
        position: relative;
        padding: .2rem 0;
        width: 100%;
        font-size: .28rem;
        height: .35rem;
        line-height: .35rem;
        border-bottom: 1px solid #c8c8c8;
        .select-layer {
          position: absolute;
          left: .8rem;
          right: 0;
          top: 0;
          bottom: 0;
        }
        &.select-wrap:after {
          position: absolute;
          top: 40%;
          right: 0;
          content: '';
          display: inline-block;
          width: .18rem;
          height: .1rem;
          background: url(./resource/select_arrow.png) no-repeat;
          background-size: 100% auto;
        }
        &.required {
          label:before {
            content: '*';
            color: red;
            visibility: visible;
          }
        }
        label {
          display: inline-block;
          width: .8rem;
          color: #7b7b7b;
          box-sizing: border-box;
          &:before {
            position: absolute;
            left: -.2rem;
            top: 50%;
            transform: translateY(-50%);
            content: '*';
            visibility: hidden;
          }
        }
        .input {
          width: 80%;
          flex: 1;
          line-height: 1.3;
          font-size: .28rem;
          outline: 0;
          border: 0;
          appearance : none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          &::-webkit-input-placeholder{
            color: #c8c8c8;
          }
          &::placeholder{
            color: #c8c8c8;
          }
        }
        .duplicate {
          margin-top: -.03rem;
          margin-left: .1rem;
          display: inline-block;
          width: .74rem;
          height: .44rem;
          line-height: .44rem;
          font-size: .24rem;
          background: #ff7121;
          border-radius: .1rem;
          text-align: center;
          color: #fff;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
        select {
          flex: 1;
          width: 1.85rem;
          line-height: 1.2;
          position: relative;
          outline: 0;
          border: 0;
          appearance : none;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          background: rgba(0,0,0,0);
          &.gray {
            color: #c8c8c8;
          }
        }
      }
      .tips {
        margin-top: .12rem;
        font-size: .2rem;
      }
      .form-group {
        margin-bottom: .13rem;
        font-size: 0;
        display: flex;
        justify-content: space-between;
        .form-control {
          width: 2.85rem;
        }
        &.large {
          margin-bottom: .35rem;
          display: block;
          .form-control {
            width: 100%;
          }
        }
      }
      .checkResult {
        padding-top: .2rem;
        .resultShow {
          position: relative;
          margin-bottom: .32rem;
          font-size: .28rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          color: #7b7b7b;
          box-sizing: border-box;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .noLikeRecord {
        margin-bottom: .32rem;
        font-size: .28rem;
        color: #7b7b7b;
      }
    }
    .fixed-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .9rem;
      background: url(./resource/submit.png) no-repeat;
      background-size: 100% auto;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
    }
    .layer {
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.8);
      .modal {
        position: absolute;
        top: 3rem;
        left: 50%;
        transform: translateX(-50%);
        width: 5.6rem;
        height: 5.18rem;
        .modal-bg {
          width: 100%;
          height: 100%;
        }
        .content {
          padding: .3rem .28rem .26rem;
          width: 100%;
          position: absolute;
          left: 0;
          top: 2.5rem;
          text-align: center;
          box-sizing: border-box;
          input {
            width: 100%;
            margin-bottom: .34rem;
            line-height: 1.5;
            font-size: .32rem;
            outline: 0;
            border: 0;
            border-bottom: 1px solid #c8c8c8;
            text-align: center;
            appearance : none;
            color: #3d3d3d;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            &::-webkit-input-placeholder{
              color: #c8c8c8;
            }
            &::placeholder{
              color: #c8c8c8;
            }
          }
          .tips {
            display: inline-block;
            margin-bottom: .34rem;
            line-height: 1.5;
            color: #9e9e9e;
            font-size: .2rem;
            text-align: center;
          }
          .qqgroup {
            font-size: .36rem;
            color: #ff7121;
          }
          .qqtips {
            display: inline-block;
            position: relative;
            &:before, &:after {
              position: absolute;
              top: .1rem;
              content: '';
              width: .1rem;
              height: .1rem;
              border-radius: 50%;
              background: #9e9e9e;
            }
            &:before {
              left: -.15rem;
            }
            &:after {
              right: -.15rem;
            }
          }
          .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            .btn {
              // width: 2.4rem;
              width: 100%;
              height: .7rem;
              -webkit-tap-highlight-color: rgba(0,0,0,0);
              text-align: center;
              color: #fff;
              font-size: .32rem;
              line-height: .7rem;
              &.abort {
                background: url(./resource/abort.png) no-repeat;
                background-size: 100% auto;
              }
              &.confirm {
                // background: url(./resource/confirm.png) no-repeat;
                // background-size: 100% auto;
                background: linear-gradient(to right, #ff9a21, #ff7a21);
                border-radius: 80px;
              }
            }
          }
        }
      }
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .3s
    }
    .fade-enter, .fade-leave-to{
      opacity: 0;
    }
  }
  .resultPart {
    .header {
      width: 100%;
      height: 2.37rem;
      background: url(./resource/result_bg.png) no-repeat;
      background-size: 100% auto;
      color: #fff;
      font-size: .42rem;
      padding: .7rem .58rem;
      box-sizing: border-box;
      text-align: center;
    }
    .picResult {
      margin-bottom: .3rem;
      padding: .58rem .48rem 0;
      .picItem {
        float: left;
        margin-right: .1rem;
        margin-bottom: .07rem;
        width: 2rem;
        height: 2rem;
        border-radius: .1rem;
        background: #f1f1f1;
        overflow: hidden;
        &:nth-child(3n) {
          margin-right: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
    .state {
      font-size: .28rem;
      padding: 0 .50rem;
      text-align: right;
      color: #999;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 0;
      .btn {
        display: inline-block;
        width: 50%;
        height: .9rem;
        &.toHome {
          background: url(./resource/toHome.png) no-repeat;
          background-size: 100% auto;
        }
        &.toInfo {
          background: url(./resource/toInfo.png) no-repeat;
          background-size: 100% auto;
        }
      }
    }
  }
}
</style>

