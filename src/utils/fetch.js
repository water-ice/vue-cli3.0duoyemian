import axios from 'axios';
import qs from 'qs';
import Toast from '../components/Toast';

// 创建axios实例
const service = axios.create({
  timeout: 30000, // 请求超时时间
});

service.defaults.withCredentials = true; // 跨域传cookie需要
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const configs = config;
    // 包装api
    if (process.env.NODE_ENV === 'development') {
      configs.url = `/api${configs.url}`;
    } else if (process.env.VUE_APP_Production && /(h5\.zybang\.com|h5\.zuoyebang\.com)/.test(window.location.host)) {
      configs.url = `/platApi${configs.url}`;
    }
    // configs.headers['Cache-Control'] = 'no-cache,no-store,must-revalidate,max-age=-1,private';
    // post请求并且需要将data以form data 形式传给后端 需要传一个formType为true boolean
    if (configs.method === 'post' && configs.formType) {
      configs.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      configs.data = qs.stringify(configs.data);
    }
    return configs;
  },
  (error) => {
    // Do something with request error
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    if (response.data.errNo) {
      Toast(response.data.errstr || '服务异常，请联系系统管理员');
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    if (error.message === 'Network Error') {
      Toast('网络正忙，请稍后重试~');
    } else {
      Toast(error.message || '网络异常，请稍后重试~');
    }

    return Promise.reject(error);
  },
);

export default service;
