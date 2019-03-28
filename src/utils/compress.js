const canvas = typeof document === 'object' ? document.createElement('canvas') : {};
canvas.width = 1;
canvas.height = 1;
const isWebp = canvas.toDataURL ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5 : false;
const hostName = ['hiphotos.baidu.com', 'www.zybang.com', 'imgsrc.baidu.com'];

export default (url, isTiny) => {
  if (!process.env.VUE_APP_Production) {
    return url;
  }

  const matchLength = hostName.filter(item => url.indexOf(item) > 0).length;

  if (url && !matchLength) {
    if (isWebp) {
      return isTiny ? `${url}@f_webp,q_75,w_100,h_100` : `${url}@f_webp,q_75`;
    }
    return isTiny ? `${url}@w_100,h_100` : `${url}@q_75`;
  }
  return url;
};
