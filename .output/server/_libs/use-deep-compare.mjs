import { a as React } from "../_chunks/_libs/react.mjs";
import { d as dequal } from "./dequal.mjs";
function useDeepCompareMemoize(dependencies) {
  const dependenciesRef = React.useRef(dependencies);
  const signalRef = React.useRef(0);
  if (!dequal(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
    signalRef.current += 1;
  }
  return React.useMemo(() => dependenciesRef.current, [signalRef.current]);
}
function useDeepCompareMemo(factory, dependencies) {
  return React.useMemo(factory, useDeepCompareMemoize(dependencies));
}
export {
  useDeepCompareMemo as u
};
