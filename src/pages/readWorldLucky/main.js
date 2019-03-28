import Vue from 'vue';
import fetch from '@/utils/fetch';
import '@/reset.css';
import { Icon } from 'h2';
import compress from '@/utils/compress';
import '../../registerServiceWorker';
import App from './App.vue';
import Osg from '../../components/outsideGuide/';

Vue.component(Icon.name, Icon);
Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;
Vue.prototype.$osg = Osg;
Vue.prototype.$compress = compress;
new Vue({
  render: h => h(App),
}).$mount('#app');
