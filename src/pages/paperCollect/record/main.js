import Vue from 'vue';
import fetch from '@/utils/fetch';
import { Loadmore } from 'mint-ui';
import '@/reset.css';
import '../my-mint.less';
import App from './App.vue';

Vue.component(Loadmore.name, Loadmore);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

new Vue({
  render: h => h(App),
}).$mount('#app');
