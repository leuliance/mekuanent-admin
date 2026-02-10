import { s as subscribeWithSelector, d as devtools, p as persist, c as createStore$1, a as createWithEqualityFn } from "./zustand.mjs";
import { p as produce } from "./immer.mjs";
import { c as create } from "./mutative.mjs";
import { c as createTrackedSelector } from "./react-tracked.mjs";
var immerImpl = (initializer) => (set, get, store) => {
  store.setState = (updater, replace, ...a) => {
    const nextState = typeof updater === "function" ? produce(updater) : updater;
    return set(
      nextState,
      typeof replace === "boolean" ? replace : true,
      ...a
    );
  };
  return initializer(store.setState, get, store);
};
var immerMiddleware = immerImpl;
var mutativeImpl = (initializer, options) => (set, get, store) => {
  store.setState = (updater, replace, ...a) => {
    const nextState = typeof updater === "function" ? create(
      updater,
      options ? { ...options, enablePatches: false } : options
    ) : updater;
    return set(
      nextState,
      typeof replace === "boolean" ? replace : true,
      ...a
    );
  };
  return initializer(store.setState, get, store);
};
var mutativeMiddleware = mutativeImpl;
var getOptions = (option, fallbackEnabled = false) => {
  const isBooleanValue = typeof option === "boolean";
  const { enabled, ...config } = isBooleanValue ? {} : option || {};
  const isValueProvided = isBooleanValue ? option : enabled;
  return {
    enabled: isValueProvided ?? fallbackEnabled,
    ...config
  };
};
var extendActions = (builder, api) => {
  const newActions = builder(api);
  const actions = {
    ...api.actions,
    ...newActions
  };
  return {
    ...api,
    actions,
    set: (key, ...args) => {
      if (key in actions) {
        const action = actions[key];
        return action?.(...args);
      }
      return api.set(key, args[0]);
    }
  };
};
var identity = (arg) => arg;
var extendSelectors = (builder, api, options) => {
  const baseGet = api.get.bind(api);
  const baseSubscribe = api.subscribe.bind(api);
  const newSelectors = builder(api);
  const selectors = {
    ...api.selectors,
    ...newSelectors
  };
  const extendedApi = {
    ...api,
    selectors,
    get: (key, ...args) => {
      if (key in selectors) {
        const selector = selectors[key];
        return selector?.(...args);
      }
      return baseGet(key);
    },
    subscribe: (key, ...args) => {
      if (key in selectors) {
        const params = [...args];
        let optionsArg;
        let selectorArg = identity;
        const maybeOptions = params.at(-1);
        if (typeof maybeOptions !== "function") {
          optionsArg = params.pop();
        }
        const listener = params.pop();
        const maybeSelector = params.at(-1);
        if (typeof maybeSelector === "function") {
          selectorArg = params.pop();
        }
        const selectorArgs = params;
        return baseSubscribe(
          "state",
          () => selectorArg(
            selectors[key](...selectorArgs)
          ),
          listener,
          optionsArg
        );
      }
      return baseSubscribe(key, ...args);
    }
  };
  if (options?.selectWithStore) {
    const selectWithStore = options.selectWithStore;
    extendedApi.useValue = (key, ...args) => {
      if (key in selectors) {
        const selector = selectors[key];
        const maybeEqualityFn = args.at(-1);
        const equalityFn = typeof maybeEqualityFn === "function" ? maybeEqualityFn : void 0;
        const selectorArgs = equalityFn ? args.slice(0, -1) : args;
        return selectWithStore(
          () => selector?.(...selectorArgs),
          equalityFn
        );
      }
      return api.useValue?.(key, ...args);
    };
  }
  return extendedApi;
};
var buildStateCreator = (initializer, options) => {
  const {
    name,
    devtools: devtoolsOptions,
    immer: immerOptions,
    mutative: mutativeOptions,
    persist: persistOptions,
    isMutativeState
  } = options;
  const middlewares = [];
  const devtoolsConfig = getOptions(devtoolsOptions);
  if (devtoolsConfig.enabled) {
    middlewares.push(
      (config) => devtools(config, {
        ...devtoolsConfig,
        name: devtoolsConfig?.name ?? name
      })
    );
  }
  const persistConfig = getOptions(persistOptions);
  if (persistConfig.enabled) {
    middlewares.push(
      (config) => persist(config, {
        ...persistConfig,
        name: persistConfig.name ?? name
      })
    );
  }
  const immerConfig = getOptions(immerOptions);
  if (immerConfig.enabled) {
    middlewares.push((config) => immerMiddleware(config));
  }
  const mutativeConfig = getOptions(mutativeOptions);
  if (mutativeConfig.enabled) {
    middlewares.push((config) => mutativeMiddleware(config, mutativeConfig));
  }
  const stateCreator = middlewares.reverse().reduce(
    (creator, middleware) => middleware(creator),
    typeof initializer === "function" ? initializer : () => initializer
  );
  const isMutative = isMutativeState || immerConfig.enabled || mutativeConfig.enabled;
  return {
    stateCreator: subscribeWithSelector(stateCreator),
    isMutative,
    name
  };
};
var createBaseApi = (store, {
  name,
  isMutative
}) => {
  const get = (key) => {
    if (key === "state") {
      return store.getState();
    }
    return store.getState()[key];
  };
  const set = (key, value) => {
    if (key === "state") {
      return store.setState(value);
    }
    const typedKey = key;
    const prevValue = store.getState()[typedKey];
    const shouldInvokeUpdater = typeof value === "function" && prevValue !== void 0 && prevValue !== null && typeof prevValue !== "function";
    if (shouldInvokeUpdater) {
      value = value(prevValue);
    }
    if (prevValue === value)
      return;
    const actionKey = key.replace(/^\S/, (s) => s.toUpperCase());
    const debugLog = name ? `@@${name}/set${actionKey}` : void 0;
    store.setState(
      isMutative ? (draft) => {
        draft[typedKey] = value;
      } : { [typedKey]: value },
      void 0,
      debugLog
    );
  };
  const subscribe = (key, selectorOrListener, listener, options) => {
    if (key === "state") {
      if (!listener) {
        return store.subscribe(selectorOrListener);
      }
      return store.subscribe(
        selectorOrListener,
        listener,
        options
      );
    }
    let wrappedSelector;
    let wrappedListener;
    let subscribeOptions;
    if (listener) {
      wrappedSelector = (state) => selectorOrListener(state[key]);
      wrappedListener = listener;
      subscribeOptions = options;
    } else {
      wrappedSelector = (state) => state[key];
      wrappedListener = selectorOrListener;
      subscribeOptions = options;
    }
    return store.subscribe(
      wrappedSelector,
      wrappedListener,
      subscribeOptions
    );
  };
  return {
    get,
    set,
    subscribe,
    store,
    name,
    actions: {},
    selectors: {}
  };
};
var storeFactory = (api, overrides) => {
  const extendSelectorsImpl = overrides?.extendSelectors ?? extendSelectors;
  const extendActionsImpl = overrides?.extendActions ?? extendActions;
  return {
    ...api,
    actions: api.actions || {},
    extendSelectors: (builder) => storeFactory(
      extendSelectorsImpl(builder, api),
      overrides
    ),
    extendActions: (builder) => storeFactory(extendActionsImpl(builder, api), overrides)
  };
};
var createVanillaStore = (initializer, options) => {
  const builder = buildStateCreator(initializer, options);
  const store = createStore$1(builder.stateCreator);
  const baseApi = createBaseApi(store, {
    name: builder.name,
    isMutative: builder.isMutative
  });
  return storeFactory(baseApi);
};
var extendSelectors2 = (builder, api) => {
  return extendSelectors(builder, api, {
    selectWithStore: (selector, equalityFn) => api.useStore(selector, equalityFn)
  });
};
var storeFactory2 = (api) => {
  return storeFactory(api, {
    extendSelectors: (builder, baseApi) => extendSelectors2(builder, baseApi),
    extendActions: (builder, baseApi) => extendActions(builder, baseApi)
  });
};
var createStore = (initializer, options) => {
  const builder = buildStateCreator(initializer, options);
  const store = createWithEqualityFn(builder.stateCreator);
  const useTrackedStore2 = createTrackedSelector(store);
  const useTracked2 = (key) => {
    return useTrackedStore2()[key];
  };
  const baseApi = createBaseApi(store, {
    name: builder.name,
    isMutative: builder.isMutative
  });
  const useValue = (key, equalityFn) => {
    return store((state) => state[key], equalityFn);
  };
  const useState = (key, equalityFn) => {
    const value = useValue(key, equalityFn);
    return [value, (val) => baseApi.set(key, val)];
  };
  const apiInternal = {
    ...baseApi,
    store,
    useStore: store,
    useValue,
    useState,
    useTracked: useTracked2,
    useTrackedStore: useTrackedStore2
  };
  return storeFactory2(apiInternal);
};
var createZustandStore = createStore;
function useStoreValue(store, key, ...args) {
  return store.useValue(key, ...args);
}
export {
  createZustandStore as a,
  createVanillaStore as c,
  useStoreValue as u
};
