/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 有关 userAgent 的扩展工具方法
 * @author wangyan01 | wangyan01@zuoyebang.com
 * @version 1.0 | 2014-07-11 | wangyan01    // 初始版本。
 @version 2.0 | 2018-05-08 | xujihao      // 可指定appName
 *
 * @description   // 附加说明。
 *  客户端会添加自定义 UA 内容，类似：
 *  ... homework homework_vc/158 homework_vcname/8.4.2
 *      homework_cuid/6bc0a5afda9abbfac9fb4166a46b841568aad257 homework_token/2_XPXQH3c5HRPtFHkSwi3sCCURmT25QfxM ...
 *
 * @method get(key)         // 方法：按自定义 UA 的规则获取相关值。
 *   @param key {String}            // 参数：key（必选）
 *   @return {String}               // 返回：value
 *
 * @example
 var uaExt = require('common:widget/util/userAgent.js');

 uaExt.get('vc');                 // 获取 ua 中的 homework_vc 。
 */

const uaExt = {};
let validKeyReg = new RegExp('homework_');

uaExt.isKeyValid = (key) => {
  // return /homework/i.test(navigator.userAgent) && _validKeyReg.test(key);
  const noUnderLineReg = new RegExp(validKeyReg.source.replace('_', ''), 'i');
  return noUnderLineReg.test(navigator.userAgent) && validKeyReg.test(key);
};

uaExt.getRaw = (key) => {
  if (uaExt.isKeyValid(key)) {
    return null;
  }

  const reg = new RegExp(`${validKeyReg.source}${key}/([^\\s]*)`);
  const result = reg.exec(navigator.userAgent);

  if (result) {
    return result[1] || null;
  }
};

uaExt.get = (key) => {
  const value = uaExt.getRaw(key);
  return value ? decodeURIComponent(value) : null;
};

uaExt.setAppName = (appName) => {
  validKeyReg = new RegExp(`${appName}_`);
};

export default uaExt;
