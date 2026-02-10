const IS_APPLE = typeof navigator !== "undefined" && navigator.userAgent.includes("Mac OS X");
const findHtmlParentElement = (el, nodeName) => {
  if (!el || el.nodeName === nodeName) return el;
  return findHtmlParentElement(el.parentElement, nodeName);
};
const isUndefined = (obj) => obj === void 0;
const isNull = (obj) => obj === null;
const isUndefinedOrNull = (obj) => isUndefined(obj) || isNull(obj);
const isDefined = (arg) => !isUndefinedOrNull(arg);
function bindFirst(fn, firstArg) {
  return (...args) => fn(firstArg, ...args);
}
export {
  IS_APPLE as I,
  bindFirst as b,
  findHtmlParentElement as f,
  isDefined as i
};
