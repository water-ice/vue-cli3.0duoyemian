/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reseved.
 * @fileoverview 分享组件 针对微信优化版本
 * @author qiukuo | qiukuo@zuoyebang.com
 * @version 1.0 | 2017-07-14 | qiukuo        // 初始版本。
 * @version 1.1 | 2018-01-20 | rongzhiqiang  // 1) 解决document.write当文档流被close时，清空当前文档的问题;
 *                                              2) 直接require本地微信JSSDK文件解决依赖不存在而导致初始化失效问题;
 * @version 1.2 | 2018-10-31 | xiaogaoyang   // 迁移
 *
 * @example    // 调用示例。
 *  import { share } from 'plat-utils';
 *  share({
 *    url: 'http://activity.page.url.com/index.html', // 分享链接，一般为当前页面的链接
 *    content: '最好的爱给最特别的你', // 分享内容
 *    title: '521优惠：唯有爱与学习不可辜负', // 分享标题
 *    pic: 'http://activity.page.picture.com/pic.png',  // 分享缩略图
 *  });
 */

import axios from 'axios';
import wx from '../lib/weixin'; // https://res.wx.qq.com/open/js/jweixin-1.2.0.js
import hybrid from './hybrid';
import { inWeChat, inApp } from './systemInfo';

// 检查必填属性
function checkData(data) {
  const needCheck = ['url', 'content', 'title', 'pic'];
  if (data) {
    needCheck.forEach((property) => {
      if (!Object.prototype.hasOwnProperty.call(data, property) || !data[property]) {
        throw new Error(`we need a property named(not null):'${property}'`);
      }
    });
  } else {
    throw new Error('we need data');
  }
}

function Share(params) {
  checkData(params);

  const { origin, pathname, href } = window.location;

  if (inApp) {
    hybrid('show_share', {
      share_title: params.title,
      share_text: params.content,
      share_text_weibo: params.url || (origin + pathname),
      share_img: params.pic,
      share_url: params.url,
      share_origin: origin,
      is_share: 'true',
    });
  } else if (inWeChat) {
    axios
      .get('/platApi/course/api/getwxtoken', {
        params: { url: href },
      })
      .then(({ data: res }) => {
        if (res && res.errNo === 0) {
          wx.config({
            debug: false,
            appId: res.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: [
              'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
              'onMenuShareWeibo', 'onMenuShareQZone', 'showMenuItems', 'showOptionMenu',
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.error((err) => {
            throw err;
          });
          wx.ready(() => {
            wx.checkJsApi({
              // 需要检测的JS接口列表，所有JS接口列表见附录2,
              jsApiList: [
                'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo',
                'onMenuShareQZone', 'showMenuItems', 'showOptionMenu',
              ],
              success(data) { // eslint-disable-line
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
              },
            });
            // 朋友圈
            wx.onMenuShareTimeline({
              title: params.title, // 分享标题
              link: href, // 分享链接
              imgUrl: params.pic, // 分享图标
              success() {}, // 用户确认分享后执行的回调函数
              cancel() {}, // 用户取消分享后执行的回调函数
              fail() {},
            });
            // 朋友
            wx.onMenuShareAppMessage({
              title: params.title, // 分享标题
              desc: params.content, // 分享描述
              link: href, // 分享链接
              imgUrl: params.pic, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success() {}, // 用户确认分享后执行的回调函数
              cancel() {}, // 用户取消分享后执行的回调函数
              fail() {},
            });
            // qq
            wx.onMenuShareQQ({
              title: params.title, // 分享标题
              desc: params.content, // 分享描述
              link: href, // 分享链接
              imgUrl: params.pic, // 分享图标
              success() {}, // 用户确认分享后执行的回调函数
              cancel() {}, // 用户取消分享后执行的回调函数
            });
            // qq空间
            wx.onMenuShareQZone({
              title: params.title, // 分享标题
              desc: params.content, // 分享描述
              link: href, // 分享链接
              imgUrl: params.pic, // 分享图标
              success() {}, // 用户确认分享后执行的回调函数
              cancel() {}, // 用户取消分享后执行的回调函数
            });
            // 显示分享按钮
            wx.showOptionMenu();
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}

export default Share;
