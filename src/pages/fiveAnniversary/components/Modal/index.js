import Vue from 'vue';
import modalVue from './modal.vue';

const ModalCons = Vue.extend(modalVue);

const getInstance = (() => {
  let modalInstacne = null;
  return () => {
    if (modalInstacne === null) {
      modalInstacne = new ModalCons({
        el: document.createElement('div'),
      });
      modalInstacne.$on('update:visible', () => { modalInstacne.visible = false; });
      document.body.appendChild(modalInstacne.$el);
    }
    return modalInstacne;
  };
})();

const defaultOptions = {
  message: '',
  title: '',
  visible: true,
};
function Modal(options = {}) {
  return new Promise((resolve, reject) => {
    Object.assign(getInstance(), { resolve, reject }, defaultOptions, options);
  });
}
const install = (v) => { v.component(modalVue.name, modalVue); };
export { Modal };
export default { install };
