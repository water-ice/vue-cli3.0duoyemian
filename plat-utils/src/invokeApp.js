/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 快对作业 app 调起工具
 * @author WangYan01   | wangyan01@zuoyebang.com
 * @version 1.0 | 2017-12-18 | WangYan01      // 继承自 common ，增加 AppLinks 和 UniversalLinks 的调用方式。
 * @version 1.1 | 2018-10-30 | XiaoGaoYang    // 迁移
 *
 * @method invokeApp(opts)                           // 方法：调起本地 app.
 *   @param opts {String|Object}                     // 参数：调起 app 所使用的 uri，或调起 app 所需的配置文件
 *   @param opts.nativeLinkIos {String}              // 参数：ios 7/8 通过该链接调起 app
 *   @param opts.nativeLinkAndroid {String}          // 参数：android 通过该链接调起 app
 *   @param opts.universalLink {String}              // 参数：ios 9 以上通过该链接调起 app
 *   @param opts.downloadLink {String}               // 参数：下载链接
 *   @param opts.yybLink {String}                    // 参数：应用宝下载链接
 *   @param opts.appStore {String}                   // 参数：ios appStore 下载链接
 *   @return No                                      // 返回：无。
 *
 * @description    // 附加说明。
 *   1) 本方法用于在 mobile 端 web 页面调起本地作业帮 app.
 *   2) 调用时传入用于调起的 uri，通常是作业帮自定义协议开头的 uri 串。
 *   3) 如果能够成功调起，onSuccess 回调通常会在调起成功后立即被执行；
 *       如果调起失败，onFail 回调可能在调起操作约 1 秒后，或者在用户再次返回浏览器页面时被执行。
 *   4) 由于调起是否成功无法被精准检测，所以回调不能保证被绝对正确地调用，使用时请注意。
 *   5) 多个调起操作被密集执行时，可能会互相影响。因此种使用场景几乎不会(也不应该)出现，故本方法对此不做处理，使用时也应避免。
 *   6) [2017-12-18] AppLinks(≥ Android 6.0) & UniversalLinks(≥ iOS 9)的支持依赖客户端，
 *       客户端需在各自平台下注册，之后便可通过 http/https 的标准链接方式自由调起客户端(if installed)。
 *
 * @example    // 典型的调用示例。
  import { invokeApp } from 'plat-utils';

  // 调起作业帮商城首页
  invokeApp('/mall/index?from=');

  // 调起作业帮商城首页
  invokeApp({
    downloadLink: 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
    yybLink: 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
    nativeLinkIos: `homework://com.baidu.homework/mall/index?from=`,
    nativeLinkAndroid: `homework://com.baidu.homework/mall/index?from=`,
    universalLink: `//oia.zybang.com/download/?page=%2Fmall%2Findex%3Ffrom%3D`,
  });
 */

import { os, inWeChat, isIos, isAndroid } from './systemInfo';

const OS = {
  android: isAndroid,
  ios: isIos,
  weixin: inWeChat,
  version: /os_(.*)/i.test(os) && parseInt(RegExp.$1, 10),
};

function openWithIframeFun(openUrl, callback) {
  // 检查 app 是否打开
  function checkOpen(cb) {
    const clickTime = +new Date();
    function check(elsTime) {
      if (elsTime > 2000 || document.hidden || document.webkitHidden) {
        cb(1);
      } else {
        cb(0);
      }
    }
    // 启动间隔 20ms 运行的定时器，并检测累计消耗时间是否超过 2000ms，超过则结束
    let count = 0;
    const intHandle = setInterval(() => {
      count++;
      const elsTime = +new Date() - clickTime;
      if (count >= 75 || elsTime > 2000) {
        clearInterval(intHandle);
        check(elsTime);
      }
    }, 20);
  }

  // 在 iframe 中打开 app
  const ifr = document.createElement('iframe');
  ifr.src = openUrl;
  ifr.style.display = 'none';
  if (callback) {
    checkOpen((opened) => {
      callback(opened);
    });
  }

  document.body.appendChild(ifr);
  setTimeout(() => {
    document.body.removeChild(ifr);
  }, 2000);
}

class InvokeApp {
  constructor(opt) {
    this.opt = opt;
  }
  active() {
    if (OS.weixin) {
      this.openInWeixin();
    } else if (OS.ios && OS.version >= 9 && !OS.qqbrowser) {
      this.openInIos9p(); // universalLink ios9及以上唤起app
    } else if (OS.ios || OS.android) {
      this.openWithIframe(); // 移动端使用iframe打开
    } else {
      this.download(); // 其他下载APP
    }
  }
  // 微信内下载，统一走应用宝的下载链接
  openInWeixin() {
    if (OS.ios && OS.version >= 9 && this.opt.universalLink) {
      this.openInIos9p();
    } else if (this.opt.yybLink) {
      window.location.href = this.opt.yybLink;
    } else {
      this.download();
    }
  }
  // ios9 以上版本通过 universalLink 调起
  openInIos9p() {
    if (this.opt.universalLink) {
      window.location.href = this.opt.universalLink;
      setTimeout(() => {
        this.download();
      }, 1000);
    } else {
      this.download();
    }
  }
  // ios 7/8 android 的打开APP （iframe打开）
  openWithIframe() {
    let nativeLink;
    if (OS.ios) {
      nativeLink = this.opt.nativeLinkIos;
    } else if (OS.android) {
      nativeLink = this.opt.nativeLinkAndroid;
    }
    if (!nativeLink) {
      this.download();
      return;
    }
    openWithIframeFun(nativeLink, (success) => {
      if (!success) {
        this.download();
      }
    });
  }
  // 直接下载链接
  download() {
    let link = null;
    if (OS.ios) {
      link = this.opt.appStore || this.opt.yybLink;
    } else {
      link = this.opt.downloadLink;
    }
    window.location.href = link;
  }
}

const defaultOpt = {
  downloadLink: '', // APP下载链接 必须
  appStore: '',
  yybLink: '', // 应用宝的链接(weixin) 必须
  nativeLinkIos: '', // 唤起ios app
  nativeLinkAndroid: '', // 唤起andriod app
  universalLink: '', // ios9及以上唤起app
};

export default (opts) => {
  if (typeof opts === 'string') {
    new InvokeApp({
      downloadLink: 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
      yybLink: 'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
      nativeLinkIos: `homework://com.baidu.homework${opts}`,
      nativeLinkAndroid: `homework://com.baidu.homework${opts}`,
      universalLink: `//oia.zybang.com/download/?page=${encodeURIComponent(opts)}`,
    }).active();
  } else {
    new InvokeApp(Object.assign(defaultOpt, opts)).active();
  }
};
