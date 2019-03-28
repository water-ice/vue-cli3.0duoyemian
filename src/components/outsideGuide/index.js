import Vue from 'vue';
import InvokeApp from 'plat-utils/src/invokeApp';
import { inWeChat, inApp } from 'plat-utils/src/systemInfo';

import osg from './Osg.vue';

const OutsideGuideCom = Vue.extend(osg);

const getInstance = (() => {
  let osgInstacne = null;
  return () => {
    if (osgInstacne === null) {
      osgInstacne = new OutsideGuideCom({
        el: document.createElement('div'),
      });
      osgInstacne.$on('update:visible', () => { osgInstacne.visible = false; });
      document.body.appendChild(osgInstacne.$el);
    }
    return osgInstacne;
  };
})();

const defaultOptions = {
  visible: true,
};
function Osg(options = window.location.href) {
  return new Promise((resolve, reject) => {
    if (inApp) {
      resolve();
    } else if (inWeChat) {
    // 在微信呼起弹层
      Object.assign(getInstance(), { resolve, reject }, defaultOptions, options);
    } else if (typeof options === 'string') {
      // 不在微信走invokeApp
      const naLink =
        `homework://com.baidu.homework/web?url=${
          encodeURIComponent(options)}`;
      const uniLink = `//oia.zybang.com/download/?page=${
        encodeURIComponent(`homework://com.baidu.homework/jumpApp?url=${options}`)}`;
      InvokeApp({
        downloadLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        yybLink:
          'https://www.zybang.com/napi/download/apk?channel=homenew2161010&name=com_baidu_homework',
        nativeLinkIos: naLink,
        nativeLinkAndroid: naLink,
        universalLink: uniLink,
      });
    } else {
      InvokeApp(options);
    }
  });
}
export default Osg;
