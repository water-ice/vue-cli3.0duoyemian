// 获取cookie
export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) { return (arr[2]); }
  return null;
}

// 设置cookie
export function setCookie(name, value, expiredays = 1) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `${name}=${escape(value)}${(expiredays == null) ? '' : `;expires=${exdate.toGMTString()}`};path=/`;
}

// 删除cookie
export function delCookie(name) {
  setCookie(name, '', -1);
}
