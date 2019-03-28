/**
 * Copyright (c) 2014-2018 Zuoyebang, All rights reserved.
 * @fileoverview Toast
 * @author xiaogaoyang@zuoyebang.com
 * @version 1.0 | 2018-11-08 | XiaoGaoYang    // 从 Mint UI 移植过来
 */

import Vue from 'vue';
import ToastCompoent from './Toast.vue';

const ToastConstructor = Vue.extend(ToastCompoent);

const toastPool = [];

const getAnInstance = () => {
  if (toastPool.length > 0) {
    const instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }
  return new ToastConstructor({
    el: document.createElement('div'),
  });
};

const returnAnInstance = (instance) => {
  if (instance) {
    toastPool.push(instance);
  }
};

const removeDom = (event) => {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};

ToastConstructor.prototype.close = function close() {
  this.visible = false;
  this.$el.addEventListener('transitionend', removeDom);
  this.closed = true;
  returnAnInstance(this);
};

const Toast = (options = {}) => {
  const duration = options.duration || 3000;

  const instance = getAnInstance();
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.message = typeof options === 'string' ? options : options.message;
  instance.position = options.position || 'middle';
  instance.className = options.className || '';
  instance.iconClass = options.iconClass || '';

  document.body.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    if (~duration) { // eslint-disable-line
      instance.timer = setTimeout(() => {
        if (instance.closed) return;
        instance.close();
      }, duration);
    }
  });
  return instance;
};

export default Toast;
