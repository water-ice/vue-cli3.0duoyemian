/**
 * Copyright (c) 2014-2018 Zuoyebang, All rights reserved.
 * @fileoverview 获取系统相关信息工具
 * @author xiaogaoyang@zuoyebang.com
 * @version 1.0 | 2018-10-30 | XiaoGaoYang    // 初始版本。
 *
 * @example    // 典型的调用示例。
 *  import { systemInfo } from 'plat-utils';
 *
 *  systemInfo.inIos // 是否为ios系统
 */

const ua = navigator.userAgent;

const isIos = /iphone|ipad/i.test(ua);
const isAndroid = /android/i.test(ua);
const inApp = /homework|airclass/i.test(ua);

const vcMatches = /\s+homework_vc\/(\d{1,3})\s+/i.exec(ua);
const vc = vcMatches && vcMatches[1];

const cuidMatches = /homework_cuid\/([^\\s]*)/i.exec(ua);
const cuid = cuidMatches && cuidMatches[1];

const systemType = (() => {
  let os = 'other';

  if (/\bMac/i.test(ua)) {
    if (/iPhone/i.test(ua)) {
      os = `iphone os_${/iPhone OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown'}`;
    } else if (/iPad/i.test(ua)) {
      os = `ipad os_${/iPad.*OS (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown'}`;
    } else {
      os = `mac os_${/Mac OS X (\d+(?:_\d+)?)/i.test(ua) ? RegExp.$1.replace('_', '.') : 'unknown'}`;
    }
  } else if (/Android/i.test(ua)) {
    os = `android os_${/Android (\d+(?:\.\d+)?)/i.test(ua) ? RegExp.$1 : 'unknown'}`;
  } else if (/\bWindows/i.test(ua)) {
    os = `windows os_${/Windows NT (\d+)/i.test(ua) ? RegExp.$1 : 'unknown'}_${/win64|x64|wow64/i.test(ua) ? '64' : '32'}bit`;
  }

  return os;
})();

const inWeChat = !inApp && /MicroMessenger/i.test(ua);
const inQQ = !inApp && /QQ\//i.test(ua) && !/MicroMessenger/i.test(ua) && /MQQBrowser/i.test(ua);

export {
  vc,
  cuid,
  isIos,
  isAndroid,
  inApp,
  inWeChat,
  inQQ,
  systemType as os,
};
