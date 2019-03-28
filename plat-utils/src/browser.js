/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 浏览器类型判断
 * @author WangWenshu | wangwenshu@zuoyebang.com
 * @author WangYan01   | wangyan01@zuoyebang.com
 * @version 1.0 | 2014-07-03 | WangWenshu    // 初始版本，引自 tangram.
 * @version 1.1 | 2014-07-15 | WangWenshu    // 添加对 IE 11 的支持。
 * @version 1.2 | 2014-09-04 | WangWenshu    // 完善注释。
 * @version 1.3 | 2014-10-14 | WangWenshu    // 修改接口的“属性”方式为“函数”的方式，避免不必要逻辑的执行。
 * @version 1.4 | 2015-12-14 | WangWenshu    // 添加对 Edge 的支持。
 * @version 1.5 | 2016-04-08 | WangWenshu    // 新增 os()、kernel() 方法；
 * @version 1.6 | 2017-12-08 | WangYan01      // 统一 os() 输出格式 ostype os_xx。
 *                                           // 修正某些版本 Firefox 被检测为 IE 的问题。
 *
 * @method chrome()                // 方法：检测浏览器是否为 Chrome.
 *   @param No                     // 参数：无。
 *   @return {Number|undefined}    // 返回：Chrome 版本号(非 Chrome 浏览器返回 undefined)。
 *
 * @method firefox()               // 方法：检测浏览器是否为 Firefox.
 *   @param No                     // 参数：无。
 *   @return {Number|undefined}    // 返回：Firefox 版本号(非 Firefox 浏览器返回 undefined)。
 *
 * @method ie()                    // 方法：检测浏览器是否为 IE.
 *   @param No                     // 参数：无。
 *   @return {Number|undefined}    // 返回：IE 版本号(非 IE 浏览器返回 undefined)。
 *
 * @method safari()                // 方法：检测浏览器是否为 Safari.
 *   @param No                     // 参数：无。
 *   @return {Number|undefined}    // 返回：Safari 版本号(非 Safari 浏览器返回 undefined)。
 *
 * @method isStandard()    // 方法：检测文档是否启用“标准模式”渲染。
 *   @param No             // 参数：无。
 *   @return {Boolean}     // 返回：检测结果。
 *
 * @method isGecko()      // 方法：检测浏览器的排版引擎是否为 gecko.
 *   @param No            // 参数：无。
 *   @return {Boolean}    // 返回：检测结果。
 *
 * @method isWebkit()     // 方法：检测浏览器的排版引擎是否为 webkit.
 *   @param No            // 参数：无。
 *   @return {Boolean}    // 返回：检测结果。
 *
 * @method os()          // 方法：获取用户操作系统类型。
 *   @param No           // 参数：无。
 *   @return {String}    // 返回：描述用户操作系统类型的字符串。
 *
 * @method kernel()      // 方法：获取用户浏览器内核类型。
 *   @param No           // 参数：无。
 *   @return {String}    // 返回：描述用户浏览器内核类型的字符串。
 *
 * @description    // 附加说明。
 *   1) 本方法用于检测用户操作系统、浏览器类型及渲染模式、排版引擎等；相应的浏览器检测方法返回检测到的浏览器版本号；
 *      不匹配的浏览器类型字段值为 undefined (请参阅示例)。
 *
 * @example    // 典型的调用示例。
 // 本示例为 Windows 10 64bit 环境 Chrome 70 (64-bit) 版本下，2018-10-31的检测结果。
 import Browser from '@/utils/browser';
 const getBrowser = new Browser();
 getBrowser.chrome();        // 70
 getBrowser.firefox();       // undefined
 getBrowser.ie();            // undefined
 getBrowser.safari();        // undefined
 getBrowser.isGecko();       // false
 getBrowser.isStandard();    // true
 getBrowser.isWebkit();      // true
 getBrowser.os();            // windows os_10_64bit
 getBrowser.kernel();        // chrome_70
 */

export default class Browser {
  constructor() {
    this.ua = navigator.userAgent;
  }

  chrome() {
    return /\b(?:Chrome|CriOS)\/(\d+)/i.test(this.ua) ? +RegExp.$1 : undefined;
  }

  firefox() {
    return /\bFirefox\/(\d+)/i.test(this.ua) ? +RegExp.$1 : undefined;
  }

  ie() {
    // Firefox 某些版本的 ua 中含有和 IE 11 一样的 'rv:' 字段。
    return /\b(?:MSIE |rv:|Edge\/)(\d+)/i.test(this.ua) && !this.firefox() ? (document.documentMode || +RegExp.$1) : undefined;
  }

  edge() {
    return /\bEdge\/(\d+)/i.test(this.ua) ? (document.documentMode || +RegExp.$1) : undefined;
  }

  safari() {
    return /\bSafari\/?(\d+)?/i.test(this.ua) && !/chrome/i.test(this.ua) ? +(RegExp.$1 || RegExp.$2) : undefined;
  }

  isGecko() {
    return /gecko/i.test(this.ua) && !/like gecko/i.test(this.ua);
  }

  isWebkit() {
    return /webkit/i.test(this.ua);
  }

  os() {
    let os = 'other';
    if (/\bMac/i.test(this.ua)) {
      if (/iPhone/i.test(this.ua)) {
        os = `iphone os_${(/iPhone OS (\d+(?:_\d+)?)/i.test(this.ua) ? RegExp.$1.replace('_', '.') : 'unknown')}`;
      } else if (/iPad/i.test(this.ua)) {
        os = `ipad os_${(/iPad.*OS (\d+(?:_\d+)?)/i.test(this.ua) ? RegExp.$1.replace('_', '.') : 'unknown')}`;
      } else {
        os = `mac os_${(/Mac OS X (\d+(?:_\d+)?)/i.test(this.ua) ? RegExp.$1.replace('_', '.') : 'unknown')}`;
      }
    } else if (/Android/i.test(this.ua)) {
      os = `android os_${(/Android (\d+(?:\.\d+)?)/i.test(this.ua) ? RegExp.$1 : 'unknown')}`;
    } else if (/\bWindows/i.test(this.ua)) {
      os = `windows os_${(/Windows NT (\d+)/i.test(this.ua) ? RegExp.$1 : 'unknown')}_${(/win64|x64|wow64/i.test(this.ua) ? '64' : '32')}bit`;
    }

    return os;
  }

  kernel() {
    let browser = 'other';
    if (this.edge()) {
      browser = `edge_${this.edge()}`;
    } else if (this.ie()) {
      browser = `ie_${this.ie()}`;
    } else if (this.chrome()) {
      browser = `chrome_${this.chrome()}`;
    } else if (this.safari()) {
      browser = `safari_${this.safari()}`;
    } else if (this.firefox()) {
      browser = `firefox_${this.firefox()}`;
    }
    return browser;
  }
}
