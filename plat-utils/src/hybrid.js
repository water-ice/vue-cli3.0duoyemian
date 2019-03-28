/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 作业帮 app hybrid api.
 * @author WangWenshu | wangwenshu@zuoyebang.com
 * @author HouQuan | houquan@zuoyebang.com
 * @author WangYan | wangyan01@zuoyebang.com
 * @version 1.0 | 2015-09-19 | WangWenshu    // 初始版本。
 * @version 2.0 | 2016-04-20 | HouQuan       // 迁移 question 模块中的 hybrid.
 * @version 2.1 | 2016-04-28 | HouQuan       // 去掉 hybrid 的 exec 接口。
 * @version 2.2 | 2016-07-05 | HouQuan       // 修正第二个参数为回调函数时的情况。
 * @version 2.3 | 2016-12-09 | WangYan       // 删除 bridge 复用策略，解决页面多 widget 情境下，action 请求被覆盖的问题。
 * @version 2.4 | 2017-02-14 | WangYan       // 增加 hybrid 在浏览器环境下的响应。
 * @version 2.5 | 2017-02-15 | WangYan       // 增加 hybrid 在浏览器环境下的自定义请求前缀”/hybridaction/“，以防与其他请求路径冲突。
 * @version 2.6 | 2017-05-11 | WangYan       // 删除 test 环境下的浏览器环境适应能力，避免对test环境的影响。
 * @version 2.6 | 2017-06-05 | WangYan       // 修正 hybrid 只有在本地环境（localhost）下才改变协议。
 * @version 2.7 | 2018-10-31 | XiaoGaoYang   // 迁移
 *
 * @method hybrid(action, args, callback)    // 方法：App hybrid 调用.
 *   @param action {String}                  // 参数：Hybrid 调用的 action 名(可选，默认为空，不执行任何操作)。
 *   @param args {Object}                    // 参数：调用的参数(可选，默认为空)。
 *   @param callback {Function}              // 参数：回调(可选，默认无)。
 *   @return No                              // 返回：无。
 *
 * @description    // 附加说明。
 *   1) 本方法用于在 mobile 端 web 页面与作业帮 app 交互通信。
 *   2) 新增可以在浏览器环境下响应（配置server.conf的rewrite项即可）,
 *      eg: rewrite ^\/hybridaction/common  test/question/page/action/common.json
 *
 * @example    // 典型的调用示例。
  import { hybrid } from 'plat-utils';

  hybrid('actionName', {
    arg1: '',
    arg2: ''
  }, function(){
    // app 回调。
  };

  // is_login: 判断用户是否登录。
  hybrid('is_login', {}, (res) => {});    // res: {isLogin: boolean}

  // login: 跳转登录页面。
  hybrid('login');

  // openWindow: 打开一个指定的web页面。
  hybrid('openWindow', {
    url: string    // 指定页面的完整url，示例：http://www.zybang.com/zuoyebang/fudao/index.html
  });
 */

/* eslint no-underscore-dangle: [2, { "allow": ["__cb__"] }] */
/* eslint no-bitwise: [2, { allow: ["|", "&"] }] */
/* eslint no-param-reassign: [0] */

const isLocal = /(localhost|127.0.0.1)/.test(window.location.origin);
let __cb__ = null;

function guid() {
  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

// 创建hybrid
function hybrid() {
  let bridge;
  let callbackCount = 0;
  const protocol = !isLocal ? 'iknowhybrid://' : '/hybridaction/';

  function createBridge() {
    const bridge = document.createElement('iframe'); // eslint-disable-line
    bridge.setAttribute('style', 'display:none;');
    bridge.setAttribute('height', '0px');
    bridge.setAttribute('width', '0px');
    bridge.setAttribute('frameborder', '0');
    bridge.setAttribute('src', 'about:blank');

    document.documentElement.appendChild(bridge);
    return bridge;
  }

  function buildUrl(action, params, callback) {
    let url = `${protocol + action}?`;
    const id = guid();
    url += `data=${encodeURIComponent(JSON.stringify(params || {}))}`;
    if (callback) {
      const callbackName = `__cb__${id}__${callbackCount++}`;
      if (isLocal) {
        __cb__ = callbackName;
      }
      window[callbackName] = (...args) => {
        if (isLocal) {
          let result = null;
          try {
            result = JSON.parse(bridge.contentDocument.body.children[0].textContent);
            args = [result] || args;
          } catch (e) {
            throw (e);
          }
        }
        if (callback) {
          callback.apply(window, args);
        }
      };
      url += `&__callback__=${callbackName}`;
    }
    return url;
  }

  return (action, params, callback) => {
    bridge = createBridge();
    if (params && Object.prototype.toString.call(params) === '[object Function]') {
      callback = params;
      params = {};
    }
    const url = buildUrl(action, params, callback);
    if (isLocal) {
      bridge.onload = window[__cb__];
    }
    __cb__ = null;
    bridge.setAttribute('src', url);
  };
}

export default hybrid();
