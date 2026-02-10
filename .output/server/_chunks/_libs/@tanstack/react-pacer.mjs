import { r as reactExports } from "../react.mjs";
import { u as useStore } from "./react-store.mjs";
import { D as Debouncer } from "./pacer.mjs";
const PacerContext = reactExports.createContext(null);
function useDefaultPacerOptions() {
  return reactExports.useContext(PacerContext)?.defaultOptions ?? {};
}
function useDebouncer(fn, options, selector = () => ({})) {
  const mergedOptions = {
    ...useDefaultPacerOptions().debouncer,
    ...options
  };
  const [debouncer] = reactExports.useState(() => {
    const debouncerInstance = new Debouncer(fn, mergedOptions);
    debouncerInstance.Subscribe = function Subscribe(props) {
      const selected = useStore(debouncerInstance.store, props.selector);
      return typeof props.children === "function" ? props.children(selected) : props.children;
    };
    return debouncerInstance;
  });
  debouncer.fn = fn;
  debouncer.setOptions(mergedOptions);
  reactExports.useEffect(() => {
    return () => {
      debouncer.cancel();
    };
  }, [debouncer]);
  const state = useStore(debouncer.store, selector);
  return reactExports.useMemo(() => ({
    ...debouncer,
    state
  }), [debouncer, state]);
}
export {
  useDebouncer as u
};
