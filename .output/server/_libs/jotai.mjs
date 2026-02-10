import { r as reactExports, a as React } from "../_chunks/_libs/react.mjs";
const __vite_import_meta_env__$2 = {};
let keyCount = 0;
function atom(read, write) {
  const key = `atom${++keyCount}`;
  const config = {
    toString: () => key
  };
  if (typeof read === "function") {
    config.read = read;
  } else {
    config.init = read;
    config.read = defaultRead;
    config.write = defaultWrite;
  }
  if (write) {
    config.write = write;
  }
  return config;
}
function defaultRead(get) {
  return get(this);
}
function defaultWrite(get, set, arg) {
  return set(
    this,
    typeof arg === "function" ? arg(get(this)) : arg
  );
}
const isSelfAtom = (atom2, a) => atom2.unstable_is ? atom2.unstable_is(a) : a === atom2;
const hasInitialValue = (atom2) => "init" in atom2;
const isActuallyWritableAtom = (atom2) => !!atom2.write;
const cancelPromiseMap = /* @__PURE__ */ new WeakMap();
const registerCancelPromise = (promise, cancel) => {
  cancelPromiseMap.set(promise, cancel);
  promise.catch(() => {
  }).finally(() => cancelPromiseMap.delete(promise));
};
const cancelPromise = (promise, next) => {
  const cancel = cancelPromiseMap.get(promise);
  if (cancel) {
    cancelPromiseMap.delete(promise);
    cancel(next);
  }
};
const resolvePromise = (promise, value) => {
  promise.status = "fulfilled";
  promise.value = value;
};
const rejectPromise = (promise, e) => {
  promise.status = "rejected";
  promise.reason = e;
};
const isPromiseLike$2 = (x) => typeof (x == null ? void 0 : x.then) === "function";
const isEqualAtomValue = (a, b) => !!a && "v" in a && "v" in b && Object.is(a.v, b.v);
const isEqualAtomError = (a, b) => !!a && "e" in a && "e" in b && Object.is(a.e, b.e);
const hasPromiseAtomValue = (a) => !!a && "v" in a && a.v instanceof Promise;
const isEqualPromiseAtomValue = (a, b) => "v" in a && "v" in b && a.v.orig && a.v.orig === b.v.orig;
const returnAtomValue = (atomState) => {
  if ("e" in atomState) {
    throw atomState.e;
  }
  return atomState.v;
};
const createStore$1 = () => {
  const atomStateMap = /* @__PURE__ */ new WeakMap();
  const mountedMap = /* @__PURE__ */ new WeakMap();
  const pendingStack = [];
  const pendingMap = /* @__PURE__ */ new WeakMap();
  let devListenersRev2;
  let mountedAtoms;
  if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
    devListenersRev2 = /* @__PURE__ */ new Set();
    mountedAtoms = /* @__PURE__ */ new Set();
  }
  const getAtomState = (atom2) => atomStateMap.get(atom2);
  const addPendingDependent = (atom2, atomState) => {
    atomState.d.forEach((_, a) => {
      if (!pendingMap.has(a)) {
        const aState = getAtomState(a);
        pendingMap.set(a, [aState, /* @__PURE__ */ new Set()]);
        if (aState) {
          addPendingDependent(a, aState);
        }
      }
      pendingMap.get(a)[1].add(atom2);
    });
  };
  const setAtomState = (atom2, atomState) => {
    var _a;
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      Object.freeze(atomState);
    }
    const prevAtomState = getAtomState(atom2);
    atomStateMap.set(atom2, atomState);
    (_a = pendingStack[pendingStack.length - 1]) == null ? void 0 : _a.add(atom2);
    if (!pendingMap.has(atom2)) {
      pendingMap.set(atom2, [prevAtomState, /* @__PURE__ */ new Set()]);
      addPendingDependent(atom2, atomState);
    }
    if (hasPromiseAtomValue(prevAtomState)) {
      const next = "v" in atomState ? atomState.v instanceof Promise ? atomState.v : Promise.resolve(atomState.v) : Promise.reject(atomState.e);
      if (prevAtomState.v !== next) {
        cancelPromise(prevAtomState.v, next);
      }
    }
  };
  const updateDependencies = (atom2, nextAtomState, nextDependencies, keepPreviousDependencies) => {
    const dependencies = new Map(
      keepPreviousDependencies ? nextAtomState.d : null
    );
    let changed = false;
    nextDependencies.forEach((aState, a) => {
      if (!aState && isSelfAtom(atom2, a)) {
        aState = nextAtomState;
      }
      if (aState) {
        dependencies.set(a, aState);
        if (nextAtomState.d.get(a) !== aState) {
          changed = true;
        }
      } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
        console.warn("[Bug] atom state not found");
      }
    });
    if (changed || nextAtomState.d.size !== dependencies.size) {
      nextAtomState.d = dependencies;
    }
  };
  const setAtomValue = (atom2, value, nextDependencies, keepPreviousDependencies) => {
    const prevAtomState = getAtomState(atom2);
    const nextAtomState = {
      d: (prevAtomState == null ? void 0 : prevAtomState.d) || /* @__PURE__ */ new Map(),
      v: value
    };
    if (nextDependencies) {
      updateDependencies(
        atom2,
        nextAtomState,
        nextDependencies,
        keepPreviousDependencies
      );
    }
    if (isEqualAtomValue(prevAtomState, nextAtomState) && prevAtomState.d === nextAtomState.d) {
      return prevAtomState;
    }
    if (hasPromiseAtomValue(prevAtomState) && hasPromiseAtomValue(nextAtomState) && isEqualPromiseAtomValue(prevAtomState, nextAtomState)) {
      if (prevAtomState.d === nextAtomState.d) {
        return prevAtomState;
      } else {
        nextAtomState.v = prevAtomState.v;
      }
    }
    setAtomState(atom2, nextAtomState);
    return nextAtomState;
  };
  const setAtomValueOrPromise = (atom2, valueOrPromise, nextDependencies, abortPromise) => {
    if (isPromiseLike$2(valueOrPromise)) {
      let continuePromise;
      const updatePromiseDependencies = () => {
        const prevAtomState = getAtomState(atom2);
        if (!hasPromiseAtomValue(prevAtomState) || prevAtomState.v !== promise) {
          return;
        }
        const nextAtomState = setAtomValue(
          atom2,
          promise,
          nextDependencies
        );
        if (mountedMap.has(atom2) && prevAtomState.d !== nextAtomState.d) {
          mountDependencies(atom2, nextAtomState, prevAtomState.d);
        }
      };
      const promise = new Promise((resolve, reject) => {
        let settled = false;
        valueOrPromise.then(
          (v) => {
            if (!settled) {
              settled = true;
              resolvePromise(promise, v);
              resolve(v);
              updatePromiseDependencies();
            }
          },
          (e) => {
            if (!settled) {
              settled = true;
              rejectPromise(promise, e);
              reject(e);
              updatePromiseDependencies();
            }
          }
        );
        continuePromise = (next) => {
          if (!settled) {
            settled = true;
            next.then(
              (v) => resolvePromise(promise, v),
              (e) => rejectPromise(promise, e)
            );
            resolve(next);
          }
        };
      });
      promise.orig = valueOrPromise;
      promise.status = "pending";
      registerCancelPromise(promise, (next) => {
        if (next) {
          continuePromise(next);
          abortPromise == null ? void 0 : abortPromise();
        }
      });
      return setAtomValue(atom2, promise, nextDependencies, true);
    }
    return setAtomValue(atom2, valueOrPromise, nextDependencies);
  };
  const setAtomError = (atom2, error, nextDependencies) => {
    const prevAtomState = getAtomState(atom2);
    const nextAtomState = {
      d: (prevAtomState == null ? void 0 : prevAtomState.d) || /* @__PURE__ */ new Map(),
      e: error
    };
    if (nextDependencies) {
      updateDependencies(atom2, nextAtomState, nextDependencies);
    }
    if (isEqualAtomError(prevAtomState, nextAtomState) && prevAtomState.d === nextAtomState.d) {
      return prevAtomState;
    }
    setAtomState(atom2, nextAtomState);
    return nextAtomState;
  };
  const readAtomState = (atom2, force) => {
    const atomState = getAtomState(atom2);
    if (!(force == null ? void 0 : force(atom2)) && atomState) {
      if (mountedMap.has(atom2)) {
        return atomState;
      }
      if (Array.from(atomState.d).every(([a, s]) => {
        if (a === atom2) {
          return true;
        }
        const aState = readAtomState(a, force);
        return aState === s || isEqualAtomValue(aState, s);
      })) {
        return atomState;
      }
    }
    const nextDependencies = /* @__PURE__ */ new Map();
    let isSync = true;
    const getter = (a) => {
      if (isSelfAtom(atom2, a)) {
        const aState2 = getAtomState(a);
        if (aState2) {
          nextDependencies.set(a, aState2);
          return returnAtomValue(aState2);
        }
        if (hasInitialValue(a)) {
          nextDependencies.set(a, void 0);
          return a.init;
        }
        throw new Error("no atom init");
      }
      const aState = readAtomState(a, force);
      nextDependencies.set(a, aState);
      return returnAtomValue(aState);
    };
    let controller;
    let setSelf;
    const options = {
      get signal() {
        if (!controller) {
          controller = new AbortController();
        }
        return controller.signal;
      },
      get setSelf() {
        if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && !isActuallyWritableAtom(atom2)) {
          console.warn("setSelf function cannot be used with read-only atom");
        }
        if (!setSelf && isActuallyWritableAtom(atom2)) {
          setSelf = (...args) => {
            if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production" && isSync) {
              console.warn("setSelf function cannot be called in sync");
            }
            if (!isSync) {
              return writeAtom(atom2, ...args);
            }
          };
        }
        return setSelf;
      }
    };
    try {
      const valueOrPromise = atom2.read(getter, options);
      return setAtomValueOrPromise(
        atom2,
        valueOrPromise,
        nextDependencies,
        () => controller == null ? void 0 : controller.abort()
      );
    } catch (error) {
      return setAtomError(atom2, error, nextDependencies);
    } finally {
      isSync = false;
    }
  };
  const readAtom = (atom2) => returnAtomValue(readAtomState(atom2));
  const recomputeDependents = (atom2) => {
    const getDependents = (a) => {
      var _a, _b;
      const dependents = new Set((_a = mountedMap.get(a)) == null ? void 0 : _a.t);
      (_b = pendingMap.get(a)) == null ? void 0 : _b[1].forEach((dependent) => {
        dependents.add(dependent);
      });
      return dependents;
    };
    const topsortedAtoms = new Array();
    const markedAtoms = /* @__PURE__ */ new Set();
    const visit = (n) => {
      if (markedAtoms.has(n)) {
        return;
      }
      markedAtoms.add(n);
      for (const m of getDependents(n)) {
        if (n !== m) {
          visit(m);
        }
      }
      topsortedAtoms.push(n);
    };
    visit(atom2);
    const changedAtoms = /* @__PURE__ */ new Set([atom2]);
    const isMarked = (a) => markedAtoms.has(a);
    for (let i = topsortedAtoms.length - 1; i >= 0; --i) {
      const a = topsortedAtoms[i];
      const prevAtomState = getAtomState(a);
      if (!prevAtomState) {
        continue;
      }
      let hasChangedDeps = false;
      for (const dep of prevAtomState.d.keys()) {
        if (dep !== a && changedAtoms.has(dep)) {
          hasChangedDeps = true;
          break;
        }
      }
      if (hasChangedDeps) {
        const nextAtomState = readAtomState(a, isMarked);
        addPendingDependent(a, nextAtomState);
        if (!isEqualAtomValue(prevAtomState, nextAtomState)) {
          changedAtoms.add(a);
        }
      }
      markedAtoms.delete(a);
    }
  };
  const writeAtomState = (atom2, ...args) => {
    const getter = (a) => returnAtomValue(readAtomState(a));
    const setter = (a, ...args2) => {
      const isSync = pendingStack.length > 0;
      if (!isSync) {
        pendingStack.push(/* @__PURE__ */ new Set([a]));
      }
      let r;
      if (isSelfAtom(atom2, a)) {
        if (!hasInitialValue(a)) {
          throw new Error("atom not writable");
        }
        const prevAtomState = getAtomState(a);
        const nextAtomState = setAtomValueOrPromise(a, args2[0]);
        if (!isEqualAtomValue(prevAtomState, nextAtomState)) {
          recomputeDependents(a);
        }
      } else {
        r = writeAtomState(a, ...args2);
      }
      if (!isSync) {
        const flushed = flushPending(pendingStack.pop());
        if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
          devListenersRev2.forEach(
            (l) => l({ type: "async-write", flushed })
          );
        }
      }
      return r;
    };
    const result = atom2.write(getter, setter, ...args);
    return result;
  };
  const writeAtom = (atom2, ...args) => {
    pendingStack.push(/* @__PURE__ */ new Set([atom2]));
    const result = writeAtomState(atom2, ...args);
    const flushed = flushPending(pendingStack.pop());
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      devListenersRev2.forEach((l) => l({ type: "write", flushed }));
    }
    return result;
  };
  const mountAtom = (atom2, initialDependent, onMountQueue) => {
    var _a;
    const existingMount = mountedMap.get(atom2);
    if (existingMount) {
      if (initialDependent) {
        existingMount.t.add(initialDependent);
      }
      return existingMount;
    }
    const queue = onMountQueue || [];
    (_a = getAtomState(atom2)) == null ? void 0 : _a.d.forEach((_, a) => {
      if (a !== atom2) {
        mountAtom(a, atom2, queue);
      }
    });
    readAtomState(atom2);
    const mounted = {
      t: new Set(initialDependent && [initialDependent]),
      l: /* @__PURE__ */ new Set()
    };
    mountedMap.set(atom2, mounted);
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      mountedAtoms.add(atom2);
    }
    if (isActuallyWritableAtom(atom2) && atom2.onMount) {
      const { onMount } = atom2;
      queue.push(() => {
        const onUnmount = onMount((...args) => writeAtom(atom2, ...args));
        if (onUnmount) {
          mounted.u = onUnmount;
        }
      });
    }
    if (!onMountQueue) {
      queue.forEach((f) => f());
    }
    return mounted;
  };
  const canUnmountAtom = (atom2, mounted) => !mounted.l.size && (!mounted.t.size || mounted.t.size === 1 && mounted.t.has(atom2));
  const tryUnmountAtom = (atom2, mounted) => {
    if (!canUnmountAtom(atom2, mounted)) {
      return;
    }
    const onUnmount = mounted.u;
    if (onUnmount) {
      onUnmount();
    }
    mountedMap.delete(atom2);
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      mountedAtoms.delete(atom2);
    }
    const atomState = getAtomState(atom2);
    if (atomState) {
      if (hasPromiseAtomValue(atomState)) {
        cancelPromise(atomState.v);
      }
      atomState.d.forEach((_, a) => {
        if (a !== atom2) {
          const mountedDep = mountedMap.get(a);
          if (mountedDep) {
            mountedDep.t.delete(atom2);
            tryUnmountAtom(a, mountedDep);
          }
        }
      });
    } else if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      console.warn("[Bug] could not find atom state to unmount", atom2);
    }
  };
  const mountDependencies = (atom2, atomState, prevDependencies) => {
    const depSet = new Set(atomState.d.keys());
    const maybeUnmountAtomSet = /* @__PURE__ */ new Set();
    prevDependencies == null ? void 0 : prevDependencies.forEach((_, a) => {
      if (depSet.has(a)) {
        depSet.delete(a);
        return;
      }
      maybeUnmountAtomSet.add(a);
      const mounted = mountedMap.get(a);
      if (mounted) {
        mounted.t.delete(atom2);
      }
    });
    depSet.forEach((a) => {
      mountAtom(a, atom2);
    });
    maybeUnmountAtomSet.forEach((a) => {
      const mounted = mountedMap.get(a);
      if (mounted) {
        tryUnmountAtom(a, mounted);
      }
    });
  };
  const flushPending = (pendingAtoms) => {
    let flushed;
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      flushed = /* @__PURE__ */ new Set();
    }
    const pending = [];
    const collectPending = (pendingAtom) => {
      var _a;
      if (!pendingMap.has(pendingAtom)) {
        return;
      }
      const [prevAtomState, dependents] = pendingMap.get(pendingAtom);
      pendingMap.delete(pendingAtom);
      pending.push([pendingAtom, prevAtomState]);
      dependents.forEach(collectPending);
      (_a = getAtomState(pendingAtom)) == null ? void 0 : _a.d.forEach((_, a) => collectPending(a));
    };
    pendingAtoms.forEach(collectPending);
    pending.forEach(([atom2, prevAtomState]) => {
      const atomState = getAtomState(atom2);
      if (!atomState) {
        if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
          console.warn("[Bug] no atom state to flush");
        }
        return;
      }
      if (atomState !== prevAtomState) {
        const mounted = mountedMap.get(atom2);
        if (mounted && atomState.d !== (prevAtomState == null ? void 0 : prevAtomState.d)) {
          mountDependencies(atom2, atomState, prevAtomState == null ? void 0 : prevAtomState.d);
        }
        if (mounted && !// TODO This seems pretty hacky. Hope to fix it.
        // Maybe we could `mountDependencies` in `setAtomState`?
        (!hasPromiseAtomValue(prevAtomState) && (isEqualAtomValue(prevAtomState, atomState) || isEqualAtomError(prevAtomState, atomState)))) {
          mounted.l.forEach((listener) => listener());
          if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
            flushed.add(atom2);
          }
        }
      }
    });
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      return flushed;
    }
  };
  const subscribeAtom = (atom2, listener) => {
    const mounted = mountAtom(atom2);
    const flushed = flushPending([atom2]);
    const listeners = mounted.l;
    listeners.add(listener);
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      devListenersRev2.forEach(
        (l) => l({ type: "sub", flushed })
      );
    }
    return () => {
      listeners.delete(listener);
      tryUnmountAtom(atom2, mounted);
      if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
        devListenersRev2.forEach((l) => l({ type: "unsub" }));
      }
    };
  };
  if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
    return {
      get: readAtom,
      set: writeAtom,
      sub: subscribeAtom,
      // store dev methods (these are tentative and subject to change without notice)
      dev_subscribe_store: (l) => {
        devListenersRev2.add(l);
        return () => {
          devListenersRev2.delete(l);
        };
      },
      dev_get_mounted_atoms: () => mountedAtoms.values(),
      dev_get_atom_state: (a) => atomStateMap.get(a),
      dev_get_mounted: (a) => mountedMap.get(a),
      dev_restore_atoms: (values) => {
        pendingStack.push(/* @__PURE__ */ new Set());
        for (const [atom2, valueOrPromise] of values) {
          if (hasInitialValue(atom2)) {
            setAtomValueOrPromise(atom2, valueOrPromise);
            recomputeDependents(atom2);
          }
        }
        const flushed = flushPending(pendingStack.pop());
        devListenersRev2.forEach(
          (l) => l({ type: "restore", flushed })
        );
      }
    };
  }
  return {
    get: readAtom,
    set: writeAtom,
    sub: subscribeAtom
  };
};
let defaultStore;
const getDefaultStore$1 = () => {
  if (!defaultStore) {
    defaultStore = createStore$1();
    if ((__vite_import_meta_env__$2 ? "production" : void 0) !== "production") {
      globalThis.__JOTAI_DEFAULT_STORE__ || (globalThis.__JOTAI_DEFAULT_STORE__ = defaultStore);
      if (globalThis.__JOTAI_DEFAULT_STORE__ !== defaultStore) {
        console.warn(
          "Detected multiple Jotai instances. It may cause unexpected behavior with the default store. https://github.com/pmndrs/jotai/discussions/2044"
        );
      }
    }
  }
  return defaultStore;
};
const createStore = createStore$1;
const getDefaultStore = getDefaultStore$1;
const __vite_import_meta_env__$1 = {};
const StoreContext = reactExports.createContext(
  void 0
);
const useStore = (options) => {
  const store = reactExports.useContext(StoreContext);
  return (options == null ? void 0 : options.store) || store || getDefaultStore();
};
const isPromiseLike$1 = (x) => typeof (x == null ? void 0 : x.then) === "function";
const use = React.use || ((promise) => {
  if (promise.status === "pending") {
    throw promise;
  } else if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else {
    promise.status = "pending";
    promise.then(
      (v) => {
        promise.status = "fulfilled";
        promise.value = v;
      },
      (e) => {
        promise.status = "rejected";
        promise.reason = e;
      }
    );
    throw promise;
  }
});
function useAtomValue(atom2, options) {
  const store = useStore(options);
  const [[valueFromReducer, storeFromReducer, atomFromReducer], rerender] = reactExports.useReducer(
    (prev) => {
      const nextValue = store.get(atom2);
      if (Object.is(prev[0], nextValue) && prev[1] === store && prev[2] === atom2) {
        return prev;
      }
      return [nextValue, store, atom2];
    },
    void 0,
    () => [store.get(atom2), store, atom2]
  );
  let value = valueFromReducer;
  if (storeFromReducer !== store || atomFromReducer !== atom2) {
    rerender();
    value = store.get(atom2);
  }
  const delay = options == null ? void 0 : options.delay;
  reactExports.useEffect(() => {
    const unsub = store.sub(atom2, () => {
      if (typeof delay === "number") {
        setTimeout(rerender, delay);
        return;
      }
      rerender();
    });
    rerender();
    return unsub;
  }, [store, atom2, delay]);
  reactExports.useDebugValue(value);
  return isPromiseLike$1(value) ? use(value) : value;
}
function useSetAtom(atom2, options) {
  const store = useStore(options);
  const setAtom = reactExports.useCallback(
    (...args) => {
      if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && !("write" in atom2)) {
        throw new Error("not writable atom");
      }
      return store.set(atom2, ...args);
    },
    [store, atom2]
  );
  return setAtom;
}
function useAtom(atom2, options) {
  return [
    useAtomValue(atom2, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom2, options)
  ];
}
const __vite_import_meta_env__ = {};
const getCached$2 = (c, m, k) => (m.has(k) ? m : m.set(k, c())).get(k);
const cache1$3 = /* @__PURE__ */ new WeakMap();
const memo3 = (create, dep1, dep2, dep3) => {
  const cache2 = getCached$2(() => /* @__PURE__ */ new WeakMap(), cache1$3, dep1);
  const cache3 = getCached$2(() => /* @__PURE__ */ new WeakMap(), cache2, dep2);
  return getCached$2(create, cache3, dep3);
};
function selectAtom(anAtom, selector, equalityFn = Object.is) {
  return memo3(
    () => {
      const EMPTY = /* @__PURE__ */ Symbol();
      const selectValue = ([value, prevSlice]) => {
        if (prevSlice === EMPTY) {
          return selector(value);
        }
        const slice = selector(value, prevSlice);
        return equalityFn(prevSlice, slice) ? prevSlice : slice;
      };
      const derivedAtom = atom((get) => {
        const prev = get(derivedAtom);
        const value = get(anAtom);
        return selectValue([value, prev]);
      });
      derivedAtom.init = EMPTY;
      return derivedAtom;
    },
    anAtom,
    selector,
    equalityFn
  );
}
const isPromiseLike = (x) => typeof (x == null ? void 0 : x.then) === "function";
function createJSONStorage(getStringStorage = () => {
  try {
    return window.localStorage;
  } catch (e) {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production") {
      if (typeof window !== "undefined") {
        console.warn(e);
      }
    }
    return void 0;
  }
}, options) {
  var _a;
  let lastStr;
  let lastValue;
  const storage = {
    getItem: (key, initialValue) => {
      var _a2, _b;
      const parse = (str2) => {
        str2 = str2 || "";
        if (lastStr !== str2) {
          try {
            lastValue = JSON.parse(str2, options == null ? void 0 : options.reviver);
          } catch (e) {
            return initialValue;
          }
          lastStr = str2;
        }
        return lastValue;
      };
      const str = (_b = (_a2 = getStringStorage()) == null ? void 0 : _a2.getItem(key)) != null ? _b : null;
      if (isPromiseLike(str)) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (key, newValue) => {
      var _a2;
      return (_a2 = getStringStorage()) == null ? void 0 : _a2.setItem(
        key,
        JSON.stringify(newValue, void 0)
      );
    },
    removeItem: (key) => {
      var _a2;
      return (_a2 = getStringStorage()) == null ? void 0 : _a2.removeItem(key);
    }
  };
  const createHandleSubscribe = (subscriber2) => (key, callback, initialValue) => subscriber2(key, (v) => {
    let newValue;
    try {
      newValue = JSON.parse(v || "");
    } catch (e) {
      newValue = initialValue;
    }
    callback(newValue);
  });
  let subscriber;
  try {
    subscriber = (_a = getStringStorage()) == null ? void 0 : _a.subscribe;
  } catch (e) {
  }
  if (!subscriber && typeof window !== "undefined" && typeof window.addEventListener === "function" && window.Storage) {
    subscriber = (key, callback) => {
      if (!(getStringStorage() instanceof window.Storage)) {
        return () => {
        };
      }
      const storageEventCallback = (e) => {
        if (e.storageArea === getStringStorage() && e.key === key) {
          callback(e.newValue);
        }
      };
      window.addEventListener("storage", storageEventCallback);
      return () => {
        window.removeEventListener("storage", storageEventCallback);
      };
    };
  }
  if (subscriber) {
    storage.subscribe = createHandleSubscribe(subscriber);
  }
  return storage;
}
createJSONStorage();
const hydratedMap = /* @__PURE__ */ new WeakMap();
function useHydrateAtoms(values, options) {
  const store = useStore(options);
  const hydratedSet = getHydratedSet(store);
  for (const [atom2, value] of values) {
    if (!hydratedSet.has(atom2) || (options == null ? void 0 : options.dangerouslyForceHydrate)) {
      hydratedSet.add(atom2);
      store.set(atom2, value);
    }
  }
}
const getHydratedSet = (store) => {
  let hydratedSet = hydratedMap.get(store);
  if (!hydratedSet) {
    hydratedSet = /* @__PURE__ */ new WeakSet();
    hydratedMap.set(store, hydratedSet);
  }
  return hydratedSet;
};
export {
  atom as a,
  useAtomValue as b,
  createStore as c,
  useAtom as d,
  useHydrateAtoms as e,
  getDefaultStore as g,
  selectAtom as s,
  useSetAtom as u
};
