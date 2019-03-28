/* eslint-disable */
/**
 * Copyright (c) 2014-2017 Zuoyebang, All rights reserved.
 * @fileoverview 有关 url 的扩展工具方法
 * @author WangWenshu | wangwenshu@zuoyebang.com
 * @version 1.0 | 2014-07-11 | WangWenshu    // 初始版本。
 * @version 1.1 | 2014-08-08 | WangWenshu    // 增加 jsonToQuery() 方法。
 * @version 1.2 | 2014-12-09 | WangWenshu    // queryToJson() 方法修改默认 url 为 window.location.href；
 *                                           // 新增 getQuery()、setQuery() 方法。
 * @version 1.3 | 2015-04-14 | WangWenshu    // setQuery() 方法支持传入 JavaScript 对象以同时设置多个 queries；
 *                                           // setQuery() 方法支持通过将某个 query 值设置为 undefined 以移除该 query.
 * @version 1.4 | 2016-04-29 | WangWenshu    // 修改 queryToJson()、jsonToQuery() 方法关于编码的参数 shouldDecode/shouldEncode 默认值为 true.
 * @version 1.5 | 2016-06-25 | WangWenshu    // '$' 全局化。
 * @version 1.6 | 2017-06-20 | WangWenshu    // 优化 getQuery() 方法，支持获取所有 queries.
 * @version 1.7 | 2018-10-31 | zhangxiaoqing  // 平移方法
 *
 * @method queryToJson(url, shouldDecode)    // 方法：将编码在 url query 中的数据转换成 json 格式。
 *   @param url {String}                     // 参数：url 或其 query 部分(可选，默认为当前页地址)。
 *   @param shouldDecode {Boolean}           // 参数：指示是否对 query 部分进行 decodeURIComponent 解码(可选，默认值：true；请参阅下文详述)。
 *   @return {Object}                        // 返回：编码成 json 格式的数据。
 *
 * @method jsonToQuery(json, shouldEncode)    // 方法：将 json 对象(plain object)转换为可用于 url query 编码的字符串(请参阅下文详述)。
 *   @param json {Object}                     // 参数：json 对象(可选，默认为空)。
 *   @param shouldEncode {Boolean}            // 参数：指示是否对 value 部分进行 encodeURIComponent 编码(可选，默认值：true)。
 *   @return {String}                         // 返回：转换成 url query 格式的数据。
 *
 * @method getQuery(qName, url)       // 方法：从指定 url 中查询指定的 query(参阅下文详述)。
 *   @param qName {String}            // 参数：要查询的 query 名(可选，默认为空，返回所有 queries)。
 *   @param url {String}              // 参数：查找 query 的源 url 或其 query 部分(可选，默认为当前页 url)。
 *   @return {String|Array|Object}    // 返回：查询到的 query 值。
 *
 * @method setQuery(qName, qValue, url)    // 方法：在指定 url 中设置指定的 query。
 *   @param qName {String}                 // 参数：要设置的 query 名(可选，默认为空，不执行任何操作)。
 *   @param qValue {Any}                   // 参数：要设置的 query 值(可选，默认为空，不执行任何操作)。
 *   @param url {String}                   // 参数：要设置 query 的源 url 或其 query 部分(可选，默认为当前页 url)。
 *   @return {String}                      // 返回：更新后的 query 部分。
 *
 * @method setQuery(queries, url)    // 方法：在指定 url 中设置指定的(多个) query。
 *   @param queries {Object}         // 参数：要设置的 queries (可选，默认为空，不执行任何操作)。
 *   @param url {String}             // 参数：要设置 query 的源 url 或其 query 部分(可选，默认为当前页 url)。
 *   @return {String}                // 返回：更新后的 query 部分。
 *
 * @description    // 附加说明。
 *   1) queryToJson() 方法在参数 shouldDecode 为 true(默认) 时，将尝试用 decodeURIComponent() 方法对 query 部分进行解码；
 *      如果解码失败则将保留原数据。
 *   2) jsonToQuery() 方法仅对传入 json 对象的“第一层”数据做编码，仅 string、number、boolean、date、regexp、array(第一层)类型的数据会得到处理，
 *      其他类型数据或嵌套层次的数据将被忽略；
 *      Date 类型的数据将被转化成 tick 串；
 *      参数 shouldEncode 为 true(默认) 时，将使用 encodeURIComponent() 方法对 json 的 value 的部分进行编码。
 *   3) getQuery() 方法通常返回一个字符串结果；
 *      · 在不传入参数 qName 时，以 json 形式返回指定 url 中所有的 queries(如没有任何 query，返回空字符串)；
 *      · 若指定 url 中包含多个参数 qName 指定的 query，则以数组形式返回所有匹配值。
 *   3) setQuery() 方法在不传入参数 url 时，取当前页面地址进行操作；
 *      不论是否传入 url，此方法都不直接修改页面地址，仅返回修改后的 query 串。
 *   4) setQuery() 方法拥有一个重载的版本：当第一个参数为一个 JavaScript 对象时，可以同时设置多个 queries(参阅示例代码)；
 *      此时第二个参数可以传入一个 url。
 *   5) 通过 setQuery() 方法将某个 query 的值设置为 undefined(或 null) 时，该 query 将被移除(参阅示例代码)。
 *
 * @example    // 典型的调用示例。
 import urlExt from '@/utils/url';

 urlExt.queryToJson('http://tieba.baidu.com/f?ie=utf-8&kw=%E5%86%B7%E5%A8%81%E9%BE%99');      // {ie: "utf-8", kw: "冷威龙"}
 urlExt.queryToJson('ie=utf-8&kw=%E5%86%B7%E5%A8%81%E9%BE%99', false);                        // {ie: "utf-8", kw: "%E5%86%B7%E5%A8%81%E9%BE%99"}

 urlExt.jsonToQuery({
      a: 1,
      b: true,
      c: [0, 1, 2, 3, 4],
      d: [{g: 1}, {h: 2}],
      e: /^\d+$/,
      f: new Date(),
      g: '中文'
    });    // 'a=1&b=true&c=0&c=1&c=2&c=3&c=4&e=%5E%5Cd%2B%24&f=1461906289503&g=%E4%B8%AD%E6%96%87'

 urlExt.jsonToQuery({
      a: 100,
      b: '中文'
    }, false);    // 'a=100&b=中文'

 urlExt.getQuery('a', 'a=1&a=2&b=3');    // ['1', '2']

 urlExt.setQuery('a', 8, 'a=1&a=2&b=3');                      // 'a=8&b=3'
 urlExt.setQuery({'b': 4, 'c': 5}, 'a=1&a=2&b=3');            // 'a=1&a=2&b=4&c=5' (设置多个 query)
 urlExt.setQuery({'b': undefined, 'c': 5}, 'a=1&a=2&b=3');    // 'a=1&a=2&c=5' (移除“b”)
 */
import type from './type';

const urlExt = {
  queryToJson: (urlParam, shouldDecodeParam) => {
    const url = String((urlParam || window.location.href.replace(window.location.hash, '')));
    const shouldDecode = typeof shouldDecodeParam === 'boolean' ? shouldDecodeParam : true;

    const qJson = {};
    const qList = url.substr(url.lastIndexOf('?') + 1).split('&');

    function getQueryValue(val) {
      let dealVal = val;

      if (shouldDecode) {
        try {
          dealVal = decodeURIComponent(val);
        } catch (ex) {
          console.log(ex);
        }
      }

      return dealVal;
    }

    for (let i = 0; i < qList.length; ++i) {
      if (qList[i]) {
        const myQuery = qList[i].split('=');
        if (myQuery.length > 1) {
          const myKey = myQuery[0];
          const dealVal = myQuery[1];

          if (qJson[myKey] === undefined) {
            qJson[myKey] = getQueryValue(dealVal);
          } else {
            if (!Array.isArray(qJson[myKey])) {
              qJson[myKey] = [qJson[myKey]];
            }
            qJson[myKey].push(getQueryValue(dealVal));
          }
        }
      }
    }
    return qJson;
  },
  jsonToQuery: (json, shouldEncodeParam) => {
    const shouldEncode = typeof shouldEncodeParam === 'boolean' ? shouldEncodeParam : true;

    function getQuery(key, val) {
      let myQuery;

      switch (type(val)) {
        case 'boolean':
        case 'number':
        case 'string':
          myQuery = `${key}=${shouldEncode ? encodeURIComponent(val) : val}`;
          break;
        case 'regexp':
          myQuery = `${key}=${shouldEncode ? encodeURIComponent(val.source) : val.source}`;
          break;
        case 'date':
          myQuery = `${key}=${val.getTime}`;
          break;
        case 'array':
          myQuery = [];
          for (let i = 0; i < val.length; ++i) {
            if (/^boolean|number|string|regexp|date$/.test(typeof (val[i]))) {
              myQuery.push(getQuery(key, val[i]));
            }
          }
          break;
        default:
          myQuery = undefined;
      }
      return myQuery;
    }

    let queries = [];
    if (type(json) === 'object') {
      const keys = Object.keys(json);
      keys.map((key) => {
        const query = getQuery(key, json[key]);
        if (query) {
          queries = queries.concat(query);
        }
        return true;
      });
    }

    return queries.join('&');
  },
  getQuery: (qName, url) => {
    const myName = qName ? String(qName) : '';
    const myUrl = url || window.location.href.replace(window.location.hash, '');

    let curQueries = urlExt.queryToJson(myUrl);
    curQueries = (!Object.keys(curQueries).length ? '' : curQueries);
    const res = myName ? (curQueries[myName] || '') : curQueries;
    return res;
  },
  setQuery: (qNameOrQueries, qValueOrUrl, urlparam) => {
    let newQuery = '';

    if (qNameOrQueries) {
      let queries = {};
      let hash = '';
      let url = '';

      switch (type(qNameOrQueries)) {
        case 'string':
        case 'number':
          url = urlparam || window.location.href;
          queries[qNameOrQueries] = qValueOrUrl;
          break;
        case 'object':
          url = qValueOrUrl || window.location.href;
          queries = qNameOrQueries;
          break;
        default:
      }

      if (/(#.+)$/i.test(url)) {
        hash = RegExp.$1;
        url = url.replace(hash, '');
      }
      const curQueries = urlExt.queryToJson(url);

      Object.assign(curQueries, queries);
      Object.keys(queries).map((key) => {
        if (queries[key] === undefined) {
          delete curQueries[key];
        }
        return true;
      });

      newQuery = urlExt.jsonToQuery(curQueries) + hash;
    }

    return newQuery;
  },
};

export default urlExt;
