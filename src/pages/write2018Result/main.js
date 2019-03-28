import Vue from 'vue';
import { Swipe, SwipeItem } from 'h2';
import compress from '@/utils/compress';
import fetch from '@/utils/fetch';
import '@/reset.css';
import App from './App.vue';
import '../../registerServiceWorker';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;
Vue.prototype.$compress = compress;
new Vue({
  render: h => h(App),
}).$mount('#app');
