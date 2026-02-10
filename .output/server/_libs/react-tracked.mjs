import { r as reactExports } from "../_chunks/_libs/react.mjs";
import { p, a } from "./proxy-compare.mjs";
const createTrackedSelector = (useSelector) => {
  const useTrackedSelector = () => {
    const [, forceUpdate] = reactExports.useReducer((c) => c + 1, 0);
    const affected = /* @__PURE__ */ new WeakMap();
    const lastAffected = reactExports.useRef();
    const prevState = reactExports.useRef();
    const lastState = reactExports.useRef();
    reactExports.useEffect(() => {
      lastAffected.current = affected;
      if (prevState.current !== lastState.current && p(prevState.current, lastState.current, affected, /* @__PURE__ */ new WeakMap())) {
        prevState.current = lastState.current;
        forceUpdate();
      }
    });
    const selector = reactExports.useCallback((nextState) => {
      lastState.current = nextState;
      if (prevState.current && prevState.current !== nextState && lastAffected.current && !p(prevState.current, nextState, lastAffected.current, /* @__PURE__ */ new WeakMap())) {
        return prevState.current;
      }
      prevState.current = nextState;
      return nextState;
    }, []);
    const state = useSelector(selector);
    const proxyCache = reactExports.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
    return a(state, affected, proxyCache);
  };
  return useTrackedSelector;
};
export {
  createTrackedSelector as c
};
