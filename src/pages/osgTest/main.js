import Vue from 'vue';
import '@/reset.css';
import App from './App.vue';
import Osg from '../../components/outsideGuide/';

Vue.config.productionTip = false;
Vue.prototype.$osg = Osg;

new Vue({
  render: h => h(App),
}).$mount('#app');
