/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 作业帮前端打点工具
 * @author WangWenshu | wangwenshu@zuoyebang.com
 * @author WangYan | wangyan01@zuoyebang.com
 * @version 1.0 | 2016-04-08 | WangWenshu    // 初始版本。
 * @version 1.1 | 2016-04-09 | WangWenshu    // 全局公共数据添加屏幕分辨率 screen 字段。
 * @version 1.2 | 2016-06-25 | WangWenshu    // '$' 全局化。
 * @version 1.3 | 2017-01-11 | Wangyan01     // 请求迁移到 https://notice.zuoyebang.cc/napi/stat/addnoticev1
 * @version 1.4 | 2017-06-22 | WangWenshu    // 打点请求协议改为与页面协议保持一致；
 *                                           // setCommonData() 方法支持 extend 方式扩展数据。
 * @version 1.5 | 2017-07-18 | WangYan       // 新增打点字段: vcname/cuid/vc（从ua中获取）。
 * @version 1.6 | 2019-01-05 | XiaoGaoYang   // 端内使用 action 打点
 *
 * @method send(data)        // 方法：自定义打点(参阅下文详述)。
 *   @param data {Object}    // 参数：打点数据(可选，默认无)。
 *   @return No              // 返回：无。
 *
 * @method setCommonData(data)          // 方法：设置自定义公共打点数据(参阅下文详述)。
 *   @param data {Object}               // 参数：公共打点数据(可选，默认无)。
 *   @param shouldOverride {Boolean}    // 参数：是否覆盖此前设置的公共打点数据(可选，默认值：false；参阅下文详述)。
 *   @return No                         // 返回：无。
 *
 * @description    // 附加说明。
 *   1) 本组件用于为全站提供统一的打点服务，FE 端打点都应通过此服务进行，方便后续维护。
 *   2) 打点机制说明：使用一个 image 元素发出可跨域的请求，通过图片的 src 携带打点数据。
 *   3) 支持的打点类型：
 *      · PV/UV 打点：需要做 PV/UV 打点的页面请在 <body> 元素添加自定义属性 'zyb-log-pv'，其值为需要随 PV/UV 打点请求一同发出的数据(query 形式)。
 *        (注：PV/UV 类打点需求，最好由后端通过 access 日志来统计，比前端打点统计更准确；UV需要后端通过请求的 cookie 来计算。)
 *      · 点击打点：任何需要做点击打点的元素，请添加自定义属性 'zyb-log-click'，其值为需要随打点请求一同发出的数据(query 形式)。
 *        (注：点击打点通过事件代理方式在 body 上实现，因而须确保需要打点的元素及其各级祖先元素都不能拦截点击事件冒泡。)
 *      · 自定义打点：任何时候都可以通过 send() 方法来发出自定义打点请求，方法的参数即为打点数据(json 形式)。
 *   4) 所有打点携带的全局公共数据说明：
 *      · page：页面标识，由模块名和页面模板路径组成，形如：'common:demo/demo'。
 *      · url：页面的 url，不包含 query 和 hash 部分。
 *      · os：用户操作系统。
 *      · browser：用户浏览器。
 *      · elapse：从页面开始加载到打点请求发出时所经过的时间，单位：毫秒。(对于 PV 打点来说，此值代表了页面就绪所消耗的时间，可用于性能分析。)
 *      · screen：屏幕分辨率，形如：'1920_1080'。
 *      · type：打点类型，包括 'pv'、'click' 等，默认为 'custom'，调用者可通过覆盖此值来标识自己的打点类型。
 *   5) 点击打点所携带的公共数据(除上述全局公共数据外)说明：
 *      · offsetX：点击行为发生时鼠标的 X 坐标(相对元素本身)。
 *      · offsetY：点击行为发生时鼠标的 Y 坐标(相对元素本身)。
 *      · hits：该元素上发生的第几次有统计的点击。
 *   6) 除了内置公共打点数据外，调用者还可以通过 setCommonData() 方法来配置自定义公共打点数据，所配置的数据在所有打点请求中都将携带。
 *      · PV 打点请求在 dom ready 时自动发出，若此时 setCommonData() 方法的调用代码还没有执行，则所发出的 PV 打点请求中不包含这部分自定义公共数据。
 *      · setCommonData() 方法多次调用时，如果没有将参数 shouldOverride 置为 true，则采用 extend 的方式扩展已有公共打点数据。
 *   7) 理论上说，所有公共打点数据都可以被参数传入的同名数据覆盖，但强烈不建议(RECOMMENDED NOT)覆盖除 type 以外的其他数据字段。
 *      参数覆盖的顺序是：自定义数据→自定义公共数据→内置公共数据。
 *   8) 任何需要打点的页面都需要(MUST)引用本组件脚本，否则即使在元素上添加了 'zyb-log-xxx' 相关属性也不会生效。
 *
 * @example    // 典型的调用示例。
 var zybLog = require('common:widget/util/zybLog.js');

 // PV 打点：
 // {%block name="body_ext_attr"%}zyb-log-pv{%/block%}                    // 发送默认 PV 打点请求。
 // {%block name="body_ext_attr"%}zyb-log-pv="name=activity"{%/block%}    // 携带自定义数据。

 // Click 打点：
 // <a href="javascript:;" class="cmn-btn" zyb-log-click="name=submit">提交</a>

 // 自定义打点：
 if (isUserLogin) {
      zybLog.send({
        type: 'user-login-state',
        isLogin: true
      });
    }
 */
import urlExt from './url';
import uaExt from './ua';
import Browser from './browser';
import guid from './guid';
import type from './type';

const browser = new Browser();

// 端外设备唯一标识，和一课保持一致，打点的公用参数
let cuid = localStorage.getItem('yikeLogCuid');
if (!(/airclass/i.test(navigator.userAgent)
  || /(homework)/i.test(navigator.userAgent))
  && !cuid) {
  cuid = guid(32);
  localStorage.setItem('yikeLogCuid', cuid);
}
let commonData = {};
const inApp = /homework/i.test(navigator.userAgent);
const naData = !inApp ? {} : {
  cuid: uaExt.get('cuid'),
  vc: uaExt.get('vc'),
  vcname: uaExt.get('vcname'),
};

const conf = {
  0: 'notice.zuoyebang.cc',
  1: 'n1.zuoyebang.cc',
  2: 'n2.zuoyebang.cc',
  3: 'n3.zuoyebang.cc',
  4: 'n4.zuoyebang.cc',
  5: 'n5.zuoyebang.cc',
};

function sendLog(data) {
  const random = Math.round(Math.random() * 5);
  const quires = urlExt.queryToJson(window.location.href);
  new Image().src = `//${conf[random]}/napi/stat/addnoticev1?${urlExt.jsonToQuery(Object.assign({
    page: window.location.pathname.replace(/^\/plat\/|\.html$/g, ''),
    url: window.location.origin + window.location.pathname,
    os: browser.os(),
    cuid,
    browser: browser.kernel(),
    screen: `${(window.screen.width || 0)}_${(window.screen.height || 0)}`,
    type: 'custom',
    from: quires.from || '',
  }, commonData, naData, data), true)}`;
}

const zybLog = {
  send: (data) => {
    if (data && type(data) === 'object' && Object.keys(data).length) {
      sendLog(data);
    }
  },
  setCommonData: (data, shouldOverrideParam) => {
    const shouldOverride = typeof shouldOverrideParam === 'boolean' ? shouldOverrideParam : false;
    if (data && type(data) === 'object' && Object.keys(data).length) {
      commonData = Object.assign(shouldOverride ? {} : commonData, data);
    }
  },
};

export default zybLog;
