import { a as atom } from "./jotai.mjs";
import { o as optic, m as modify, s as set, c as collect, p as preview, g as get } from "./optics-ts.mjs";
const getCached = (c, m, k) => (m.has(k) ? m : m.set(k, c())).get(k);
const cache1 = /* @__PURE__ */ new WeakMap();
const memo2 = (create, dep1, dep2) => {
  const cache2 = getCached(() => /* @__PURE__ */ new WeakMap(), cache1, dep1);
  return getCached(create, cache2, dep2);
};
const isFunction = (x) => typeof x === "function";
function focusAtom(baseAtom, callback) {
  return memo2(() => {
    const focus = callback(optic());
    const derivedAtom = atom((get2) => {
      const base = get2(baseAtom);
      return base instanceof Promise ? base.then((v) => getValueUsingOptic(focus, v)) : getValueUsingOptic(focus, base);
    }, (get2, set$1, update) => {
      const newValueProducer = isFunction(update) ? modify(focus)(update) : set(focus)(update);
      const base = get2(baseAtom);
      return set$1(baseAtom, base instanceof Promise ? base.then(newValueProducer) : newValueProducer(base));
    });
    return derivedAtom;
  }, baseAtom, callback);
}
const getValueUsingOptic = (focus, bigValue) => {
  if (focus._tag === "Traversal") {
    const values = collect(focus)(bigValue);
    return values;
  }
  if (focus._tag === "Prism") {
    const value2 = preview(focus)(bigValue);
    return value2;
  }
  const value = get(focus)(bigValue);
  return value;
};
export {
  focusAtom as f
};
