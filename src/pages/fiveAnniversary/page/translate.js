/* eslint-disable no-param-reassign */

const browser = (() => {
  const { userAgent } = navigator;
  let agent = '';
  if (userAgent.indexOf('Trident') > -1) {
    agent = 'trident';
  } else if (userAgent.indexOf('AppleWebKit') > -1) {
    agent = 'webkit';
  } else if (userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1) {
    agent = 'gecko';
  } else if (userAgent.indexOf('Presto') > -1) {
    agent = 'presto';
  }
  return agent;
})();

const cssPrefix = {
  trident: '-ms-',
  gecko: '-moz-',
  webkit: '-webkit-',
  presto: '-o-',
}[browser];
const vendorPrefix = {
  trident: 'ms',
  gecko: 'Moz',
  webkit: 'Webkit',
  presto: 'O',
}[browser];

const transformStyleName = `${cssPrefix}transform`;
const transformProperty = `${vendorPrefix}Transform`;
const transitionStyleName = `${cssPrefix}transition`;
const transitionProperty = `${vendorPrefix}Transition`;

const getElementTranslate = (element) => {
  const result = { left: 0, top: 0 };
  const transform = element.style[transformProperty];
  const matches = /translate\((-?\d+(\.?\d+?)?)px, (-?\d+(\.?\d+?)?)px\)/g.exec(transform);
  if (matches) {
    [result.left, result.top] = [+matches[1], +matches[3]];
  }
  return result;
};
const translateElement = (element, x, y) => {
  if (x === null && y === null) return false;
  const translate = getElementTranslate(element);
  if (x === null) {
    x = translate.left;
  }
  if (y === null) {
    y = translate.top;
  }
  element.style[transformProperty] = `translate(${x || 0}px, ${y || 0}px)`;
};

export default {
  transformStyleName,
  transformProperty,
  transitionStyleName,
  transitionProperty,
  translateElement,
  getElementTranslate,
};
