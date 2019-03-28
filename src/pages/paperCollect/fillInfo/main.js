import Vue from 'vue';
import fetch from '@/utils/fetch';
import '@/reset.css';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.prototype.$fetch = fetch;

new Vue({
  render: h => h(App),
}).$mount('#app');
