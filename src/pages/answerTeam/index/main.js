import Vue from 'vue';
import fetch from '@/utils/fetch';
import compress from '@/utils/compress';
import '@/reset.css';
import App from './App.vue';
import '../../../registerServiceWorker';

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;
Vue.prototype.$compress = compress;

new Vue({
  render: h => h(App),
}).$mount('#app');
