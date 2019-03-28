import Vue from 'vue';
import fetch from '@/utils/fetch';
import '@/reset.css';
import { Swipe, SwipeItem } from 'h2';
import '../../registerServiceWorker';
import App from './App.vue';
import Osg from '../../components/outsideGuide/';

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;
Vue.prototype.$osg = Osg;
new Vue({
  render: h => h(App),
}).$mount('#app');
