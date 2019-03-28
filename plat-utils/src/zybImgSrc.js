/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 作业帮图片 src 生成工具
 * @author WangWenshu | wangwenshu@zuoyebang.com
 * @version 1.0 | 2016-01-22 | WangWenshu    // 初始版本。
 * @version 1.1 | 2016-12-09 | WangWenshu    // 添加对 'qa_' 开头 pid 的适配规则。
 * @version 1.2 | 2017-02-28 | WangYan       // 添加对 'zyb(\d*?)_' 开头 pid 的适配规则。
 * @version 1.3 | 2017-05-27 | HouQuan       // img.zuoyebang.cc 域由 http 切换为 https.
 * @version 1.4 | 2017-06-07 | WangWenshu    // 支持 base64 编码形式的 url；
 *                                           // 修改 urlPrefix 默认值为 'https://img.zuoyebang.cc/'。
 * @version 1.5 | 2017-12-14 | ChenKai       // urlOrPid为空，则返会空值
 * @version 1.6 | 2018-10-31 | XiaoGaoYang   // 迁移
 *
 * @method zybImgSrc(urlOrPid, urlPrefix)    // 方法：生成图片 src.
 *   @param urlOrPid {String}                // 参数：原始 url 或图片 pid(必选)。
 *   @param urlPrefix {String}               // 参数：用 pid 拼接图片 src 时的 url 前缀(可选，默认为 'https://img.zuoyebang.cc/')。
 *   @return {String}                        // 返回：生成的图片 src.
 *
 * @description    // 附加说明。
 *   1) 因后端在提供页面所需图片资源时无法统一直接提供 url，本方法用于在各种情况下生成图片路径。
 *      生成规则是：
 *      · 如果 urlOrPid 传入的是完整 url(以 'http://' 或 'https://' 开头；或以 '.jpg'、'.jpeg'、'.png'、'.gif'、'.bmp' 结束)，则原样返回；
 *      · 否则认为 urlOrPid 传入的是图片 pid，此时按如下规则拼接 src：
 *        · 如果 pid 以 'zyb_' 开头，则返回 'https://img.zuoyebang.cc/' + urlOrPid + '.jpg'；
 *        · 如果 pid 以 'qa_' 开头，则返回 'https://testimg.zuoyebang.cc/' + urlOrPid + '.jpg'(仅见于线下测试环境)；
 *        · 否则返回 urlPrefix(默认 'https://img.zuoyebang.cc/') + urlOrPid + '.jpg'。
 *   2) 本组件的 PHP 版本：common:plugin/modifier.zyb_image_src.php.
 *      本组件的 JSmart 版本：common:widget/lib/jsmart/jsmt_plugins.js.
 *      更改时请同时维护这些版本。
 *
 * @example    // 典型的调用示例。
    var zybImgSrc = require('common:widget/util/zybImgSrc.js');

    // 'https:\/\/imgsrc.baidu.com\/zhidao\/pic\/item\/0b7b02087bf40ad193cedee4502c11dfa9ecce8b.jpg'
    zybImgSrc('0b7b02087bf40ad193cedee4502c11dfa9ecce8b');
 */

export default function zybImgSrc(urlOrPid, urlPrefix) {
  if (!urlOrPid) { return ''; }

  let url;
  if (/(?:^(?:https?:\/\/|data:)|\.(?:jpe?g|png|gif|bmp)$)/i.test(urlOrPid)) {
    return urlOrPid;
  } else if (/^zyb_/.test(urlOrPid)) {
    url = 'https://img.zuoyebang.cc/';
  } else if (/^qa_/.test(urlOrPid)) {
    url = 'https://testimg.zuoyebang.cc/';
  } else if (/^zyb(\d*?)_/.test(urlOrPid)) {
    url = `https://img${RegExp.$1}.zuoyebang.cc/`;
  } else {
    url = urlPrefix || 'https://imgsrc.baidu.com/zhidao/pic/item/';
  }
  url += `${urlOrPid}.jpg`;

  return url;
}
