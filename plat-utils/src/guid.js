import sparkMD5 from 'spark-md5';
import { getCookie } from '../../src/utils/cookie';

let iterator = 0;
export default function guid(len) {
  const res = parseInt(len, 0);
  const dealLen = Number.isNaN(res) ? 7 : Math.max(Math.min(res, 32), 1);

  const factors = [
    navigator.platform || '',
    navigator.appName || '',
    navigator.userAgent || '',
    window.screen.availWidth || 0,
    window.screen.availHeight || 0,
    getCookie('ZYBUSS') || getCookie('BAIDUID') || '',
    +new Date(),
    Math.random(),
    iterator += 1,
  ];

  return sparkMD5.hashBinary(factors.join('-')).substr(0, dealLen);
}
