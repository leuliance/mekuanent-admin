import { d as distExports } from "../../../_libs/react-compiler-runtime.mjs";
import { S as Slot } from "../@radix-ui/react-slot.mjs";
import { a as React } from "../react.mjs";
const createSlotComponent = (element) => React.forwardRef((t0, ref) => {
  const $ = distExports.c(8);
  let as;
  let props;
  let t1;
  if ($[0] !== t0) {
    ({ as, asChild: t1, ...props } = t0);
    $[0] = t0;
    $[1] = as;
    $[2] = props;
    $[3] = t1;
  } else {
    as = $[1];
    props = $[2];
    t1 = $[3];
  }
  const Comp = (t1 === void 0 ? false : t1) ? Slot : as || element;
  let t2;
  if ($[4] !== Comp || $[5] !== props || $[6] !== ref) {
    t2 = /* @__PURE__ */ React.createElement(Comp, {
      ref,
      ...props
    });
    $[4] = Comp;
    $[5] = props;
    $[6] = ref;
    $[7] = t2;
  } else t2 = $[7];
  return t2;
});
createSlotComponent("div");
React.memo((t0) => {
  const $ = distExports.c(2);
  const { children } = t0;
  let t1;
  if ($[0] !== children) {
    t1 = /* @__PURE__ */ React.createElement(React.Fragment, null, children);
    $[0] = children;
    $[1] = t1;
  } else t1 = $[1];
  return t1;
});
createSlotComponent("span");
const setRef = (ref, value) => {
  if (typeof ref === "function") return ref(value);
  if (ref !== null && ref !== void 0) ref.current = value;
};
const composeRefs = (...refs) => (node) => {
  const cleanups = [];
  refs.forEach((ref) => {
    const cleanup = setRef(ref, node);
    if (typeof cleanup === "function") cleanups.push(cleanup);
  });
  if (cleanups.length > 0) return () => {
    for (const cleanup of cleanups) cleanup?.();
  };
};
const useComposedRef = (...refs) => {
  return React.useCallback(composeRefs(...refs), refs);
};
const CAN_USE_DOM = typeof window !== "undefined" && window.document?.createElement !== void 0;
CAN_USE_DOM ? React.useLayoutEffect : React.useEffect;
function useMemoizedSelector(selector, deps, equalityFn = (a, b) => a === b) {
  const [memoizedValue, setMemoizedValue] = React.useState(() => selector());
  const previousValueRef = React.useRef(memoizedValue);
  React.useEffect(() => {
    const newValue = selector();
    if (!equalityFn(previousValueRef.current, newValue)) {
      setMemoizedValue(newValue);
      previousValueRef.current = newValue;
    }
  }, deps);
  return memoizedValue;
}
const useStableFn = (fn, deps = []) => {
  const fnRef = React.useRef(fn);
  fnRef.current = fn;
  return React.useCallback((...args) => fnRef.current(...args), deps);
};
export {
  useStableFn as a,
  useMemoizedSelector as b,
  useComposedRef as u
};
