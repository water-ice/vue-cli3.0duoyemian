import Vue from 'vue';
import { Swipe, SwipeItem } from 'mint-ui';
import fetch from '@/utils/fetch';
import compress from '@/utils/compress';
import '@/variables.less';
import './reset.css';
import './my-mint.less';
import '../../registerServiceWorker';
import App from './App.vue';
import router from './router';
import Components, { Modal } from './components/Modal';

Vue.use(Components);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;
Vue.prototype.$modal = Modal;
Vue.prototype.$compress = compress;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
