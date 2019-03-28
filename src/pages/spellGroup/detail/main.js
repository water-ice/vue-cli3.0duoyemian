import Vue from 'vue';
import fetch from '@/utils/fetch';
import '@/reset.css';
import { Swipe, SwipeItem } from 'h2';

import '../resource/my-mint.less';
import App from './App.vue';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

new Vue({
  render: h => h(App),
}).$mount('#app');
