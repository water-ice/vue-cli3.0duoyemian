import Vue from 'vue';
import fetch from '@/utils/fetch';
import { Button } from 'element-ui';
import App from './App.vue';
Vue.use(Button);

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

new Vue({
  render: h => h(App),
}).$mount('#app');
