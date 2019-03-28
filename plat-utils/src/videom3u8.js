import hybrid from 'plat-utils/src/hybrid';
import { isIos } from 'plat-utils/src/systemInfo';

// 播放视频
const Video = {
  newAction(videoSrc) {
    const urls = Video.getQueryString('c', videoSrc);
    const videoplaykey = Video.getQueryString('n', videoSrc);
    const videoid = Video.getQueryString('i', videoSrc);
    const types = 0;
    hybrid('platformRTCVideo', {
      url: urls,
      encrypt: 1,
      videoPlayKey: videoplaykey,
      courseId: 0,
      subId: 0,
      videoId: videoid,
      product_line: 0,
      type: types,
      autoRotate: false,
      landscape: true,
    });
  },
  oldAction(videoSrc) {
    const url = Video.getQueryString('c', videoSrc);
    const videoplaykey = Video.getQueryString('n', videoSrc);
    const videoExpire = Video.getQueryString('t', videoSrc);
    hybrid('playLiveVideo', {
      url,
      encrypt: 1,
      videoPlayKey: videoplaykey,
      videoExpire,
      courseId: 0,
      lessonId: 0,
      from: '',
    });
  },
  getQueryString(name, videoSrc) {
    const reg = new RegExp(`(^|&|\\?)${name}=([^&]*)(&|$)`, 'i');
    const r = videoSrc.match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  appPlayVideo(videoSrc) {
    hybrid('common', ({ vc }) => {
      if (isIos) {
        if (vc >= 223) {
          Video.newAction(videoSrc);
        } else {
          Video.oldAction(videoSrc);
        }
        return;
      }
      if (vc === 485) {
        Video.oldAction(videoSrc);
      } else if (vc >= 479) {
        Video.newAction(videoSrc);
      } else {
        Video.oldAction(videoSrc);
      }
    });
  },
};

export default Video.appPlayVideo;
