<template>
  <div class='upload'>
    <ul class="picList">
      <li class="picShow" v-for="(pic, index) in pics" :key="index">
        <img class="correct" :src="zybImgSrc(pic.url)" alt="" v-show="pic.type===1">
        <img class="rotate" src="./resource/loading.png" alt="" v-show="pic.type===2">
        <img class="fail" src="./resource/failImg.png" alt="" v-show="pic.type===0">
        <div class="close" @click="deletePic(index)" v-show="pic.type===0||pic.type===1"></div>
      </li>
      <li class="addPic picShow" v-if="pics.length<limit">
        <input class="addPicInput"
               type="file"
               ref="uploadFile"
               @click="popSelect"
               @change="fileChange"
               accept="image/*" multiple>
      </li>
    </ul>
    <div class="tips">重要提示：拍搜的试卷一定要完整、清晰；若审核未通过，将不可获得红包奖励</div>
    <div class="checkUploadInfo" @click="toUploadInfo">查看上传实例 >></div>
  </div>
</template>
<script>
import { isAndroid, inApp } from 'plat-utils/src/systemInfo';
import hybrid from 'plat-utils/src/hybrid';
import zybImgSrc from 'plat-utils/src/zybImgSrc';
import Toast from '../../../components/Toast/index';

export default {
  name: 'upload',
  props: {
    limit: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      pics: [],
      base64List: [],
      index: 0,
      cbIndex: 0, // 判断是否全部上传完事
      filesLength: 0, // 当前选中文件的长度
      copyFileLen: 0,
    };
  },
  methods: {
    zybImgSrc(pid) {
      return zybImgSrc(pid);
    },
    srcToBase64(file) {
      this.fileReader.readAsDataURL(file);
    },
    uploadImg() {
      const originLength = this.pics.length - this.filesLength;
      this.base64List.forEach((item, index) => {
        if (originLength + index + 1 > this.limit) {
          return;
        }
        const config = {
          url: '/napi/mis/imgupload',
          method: 'post',
          data: {
            content: item.split(',')[1],
          },
          formType: true,
        };
        this.$fetch(config)
          .then((res) => {
            if (res && res.errNo === 0) {
              this.pics.splice(originLength + index, 1, {
                type: 1,
                url: res.data.pid,
              });
            } else {
              this.pics.splice(originLength + index, 1, {
                type: 0,
              });
            }
            this.cbIndex++;
            if (this.cbIndex === this.copyFileLen) {
              this.emitPicList();
            }
          });
      });
    },
    external() {
      this.srcToBase64(this.files[this.index]);
    },
    popSelect(e) {
      if (this.cbIndex !== this.copyFileLen) {
        Toast({
          message: '正在上传中，请稍后选择',
        });
        e.preventDefault();
        e.stopPropagation();
      }
      if (inApp && isAndroid) {
        hybrid('cameraUpload', { type: 0 }, (res) => {
          if (res.status !== -1) {
            if (res.pid !== '') {
              this.pics.push({
                type: 1,
                url: res.pid,
              });
              this.emitPicList();
            } else {
              this.pics.push({
                type: 0,
              });
            }
          }
        });
        e.preventDefault();
        e.stopPropagation();
      }
    },
    fileChange(e) {
      this.index = 0;
      this.cbIndex = 0;
      this.base64List = [];
      this.files = e.target.files;
      this.filesLength = this.files.length;
      if (this.pics.length + this.filesLength > this.limit) {
        Toast({
          message: `最多上传${this.limit}张图片`,
        });
      }
      for (let i = 0; i < this.filesLength; i++) {
        if (this.pics.length >= this.limit) {
          this.filesLength = i;
          break;
        }
        this.pics.push({
          type: 2,
        });
      }
      this.copyFileLen = this.filesLength;
      this.external();
      this.$refs.uploadFile.setAttribute('type', 'text');
      this.$refs.uploadFile.setAttribute('type', 'file');
    },
    deletePic(index) {
      this.pics.splice(index, 1);
      const flags = this.pics.filter(({ type }) => type === 2);
      if (!flags.length) {
        this.cbIndex = 0;
        this.copyFileLen = 0;
      }
      this.emitPicList();
    },
    configByOs() {
      const ua = navigator.userAgent.toLowerCase();
      let type = '';
      if ((/micromessenger/i).test(ua)) {
        type = 'weixin';
      } else if ((/qq/i).test(ua)) {
        type = 'qq';
      }
      if (isAndroid && type === 'qq') {
        this.$refs.uploadFile.setAttribute('capture', 'camera');
      }
    },
    // 图片压缩
    compressImage(base64URL) {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      img.src = base64URL;

      img.onload = () => {
        // 图片原始尺寸
        const originWidth = img.width;
        const originHeight = img.height;
        // 最大尺寸限制
        const maxWidth = 720;
        const maxHeight = 1040;
        // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        // canvas对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);

        const base64Data = canvas.toDataURL('image/png', 0.8);
        this.base64List.push(base64Data);
        this.ifUpload(base64Data);
      };
    },
    ifUpload() {
      this.index += 1;
      if (this.index < this.filesLength) {
        this.external();
      } else {
        this.uploadImg();
      }
    },
    // 向父组件传值&提供清空方法
    emitPicList() {
      const picList = [];
      this.pics.forEach(({ url, type }) => {
        if (type === 1) {
          picList.push(url);
        }
      });
      // 每次上传结束将所有成功的结果发送给父组件form表单
      this.$emit('picList', picList);
    },
    cleanPics() {
      this.pics = [];
    },
    toUploadInfo() {
      const url = `${window.location.origin}/plat/activity-vue/paperCollectInstance.html`;
      if (inApp) {
        hybrid('openWindow', {
          url,
        });
      } else if (!inApp && !this.isLogin) {
        window.location.href = url;
      }
    },
  },
  mounted() {
    // 安卓QQ需要添加capture属性
    this.configByOs();
    if (!window.FileReader) {
      // console.log('Your browser does not support FileReader API!');
    }
    this.fileReader = new FileReader();
    this.fileReader.onload = () => {
      const base64Str = this.fileReader.result;
      if (base64Str <= (1024 * 2000)) {
        this.base64List.push(base64Str);
        this.ifUpload();
      } else {
        this.compressImage(base64Str);
      }
    };
  },
};
</script>
<style lang="less" scoped>
.upload {
  width: 100%;
  position: relative;
  &:after {
    content: '';
    display: block;
    clear: both;
  }
  .picList {
    font-size: 0;
    margin-bottom: .05rem;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    .picShow {
      float: left;
      margin-right: 2%;
      position: relative;
      margin-bottom: .1rem;
      width: 23.5%;
      height: 1.5rem;
      text-align: center;
      background: #f1f1f1;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      &:nth-child(4n){
        margin-right: 0;
      }
      &.addPic {
        background: url(./resource/addpic.png) no-repeat;
        background-size: 100% 100%;
        .addPicInput {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
      img {
        &.rotate {
          width: .58rem;
          height: .58rem;
          margin-top: .46rem;
          transform-origin: 50% 50%;
          animation: loading .8s ease-out 0;
          animation-iteration-count: infinite;
          /*animation-direction: alternate;*/
        }
        &.correct, &.fail {
          width: 100%;
          height: 100%;
        }
      }
      .close {
        position: absolute;
        right: .08rem;
        top: .08rem;
        width: .4rem;
        height: .4rem;
        background: url(./resource/close.png) no-repeat;
        background-size: 100% auto;
      }
    }
  }
  .tips {
    font-size: .2rem;
    color: #9e9e9e;
  }
  .checkUploadInfo{
    float: right;
    color: #ff7121;
  }
}
@keyframes loading {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
</style>

