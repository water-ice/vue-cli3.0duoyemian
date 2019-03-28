import Vue from 'vue';
import fetch from '@/utils/fetch';
import '@/reset.css';
import { Swipe, SwipeItem } from 'mint-ui';
import '../../registerServiceWorker';
import App from './App.vue';


Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
new Vue({
  render: h => h(App),
}).$mount('#app');
