import Vue from 'vue';
import { Swipe, SwipeItem } from 'mint-ui';
import fetch from '@/utils/fetch';
import '@/reset.css';
import './resource/my-mint.less';
import App from './App.vue';
import '../../registerServiceWorker';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

new Vue({
  render: h => h(App),
}).$mount('#app');
