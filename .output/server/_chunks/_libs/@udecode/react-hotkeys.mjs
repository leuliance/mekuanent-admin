import { r as reactExports } from "../react.mjs";
const BoundHotkeysProxyProvider = reactExports.createContext(void 0);
const useBoundHotkeysProxy = () => {
  return reactExports.useContext(BoundHotkeysProxyProvider);
};
function deepEqual(x, y) {
  return x && y && typeof x === "object" && typeof y === "object" ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce((isEqual, key) => isEqual && deepEqual(x[key], y[key]), true) : x === y;
}
const HotkeysContext = reactExports.createContext({
  activeScopes: [],
  hotkeys: [],
  disableScope: () => {
  },
  enableScope: () => {
  },
  toggleScope: () => {
  }
});
const useHotkeysContext = () => {
  return reactExports.useContext(HotkeysContext);
};
const reservedModifierKeywords = /* @__PURE__ */ new Set([
  "alt",
  "control",
  "ctrl",
  "meta",
  "mod",
  "shift"
]);
const mappedKeys = {
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  down: "arrowdown",
  esc: "escape",
  left: "arrowleft",
  MetaLeft: "meta",
  MetaRight: "meta",
  OSLeft: "meta",
  OSRight: "meta",
  return: "enter",
  right: "arrowright",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  up: "arrowup"
};
const KEY_PREFIX_REGEX = /key|digit|numpad/;
function mapKey(key) {
  return (mappedKeys[key.trim()] || key.trim()).toLowerCase().replace(KEY_PREFIX_REGEX, "");
}
function isHotkeyModifier(key) {
  return reservedModifierKeywords.has(key);
}
function parseKeysHookInput(keys, delimiter = ",") {
  return keys.toLowerCase().split(delimiter);
}
function parseHotkey(hotkey, splitKey = "+", useKey = false, description) {
  const keys = hotkey.toLocaleLowerCase().split(splitKey).map((k) => mapKey(k));
  const modifiers = {
    alt: keys.includes("alt"),
    ctrl: keys.includes("ctrl") || keys.includes("control"),
    meta: keys.includes("meta"),
    mod: keys.includes("mod"),
    shift: keys.includes("shift"),
    useKey
  };
  const singleCharKeys = keys.filter((k) => !reservedModifierKeywords.has(k));
  return {
    ...modifiers,
    keys: singleCharKeys,
    description
  };
}
(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", (e) => {
      if (e.code === void 0) return;
      pushToCurrentlyPressedKeys([mapKey(e.code)]);
    });
    document.addEventListener("keyup", (e) => {
      if (e.code === void 0) return;
      removeFromCurrentlyPressedKeys([mapKey(e.code)]);
    });
  }
  if (typeof window !== "undefined") window.addEventListener("blur", () => {
    currentlyPressedKeys.clear();
  });
})();
const currentlyPressedKeys = /* @__PURE__ */ new Set();
function isReadonlyArray(value) {
  return Array.isArray(value);
}
function isHotkeyPressed(key, delimiter = ",") {
  return (isReadonlyArray(key) ? key : key.split(delimiter)).every((hotkey) => currentlyPressedKeys.has(hotkey.trim().toLowerCase()));
}
function pushToCurrentlyPressedKeys(key) {
  const hotkeyArray = Array.isArray(key) ? key : [key];
  if (currentlyPressedKeys.has("meta")) {
    for (const key$1 of currentlyPressedKeys) if (!isHotkeyModifier(key$1)) currentlyPressedKeys.delete(key$1.toLowerCase());
  }
  for (const hotkey of hotkeyArray) currentlyPressedKeys.add(hotkey.toLowerCase());
}
function removeFromCurrentlyPressedKeys(key) {
  const hotkeyArray = Array.isArray(key) ? key : [key];
  if (key === "meta") currentlyPressedKeys.clear();
  else for (const hotkey of hotkeyArray) currentlyPressedKeys.delete(hotkey.toLowerCase());
}
const Key = {
  Alt: "Alt",
  Mod: "Mod",
  Shift: "Shift"
};
function useDeepEqualMemo(value) {
  const ref = reactExports.useRef(void 0);
  if (!deepEqual(ref.current, value)) ref.current = value;
  return ref.current;
}
function maybePreventDefault(e, hotkey, preventDefault) {
  if (typeof preventDefault === "function" && preventDefault(e, hotkey) || preventDefault === true) e.preventDefault();
}
function isHotkeyEnabled(e, hotkey, enabled) {
  if (typeof enabled === "function") return enabled(e, hotkey);
  return enabled === true || enabled === void 0;
}
function isKeyboardEventTriggeredByInput(ev) {
  return isHotkeyEnabledOnTag(ev, [
    "input",
    "textarea",
    "select"
  ]);
}
function isHotkeyEnabledOnTag({ target }, enabledOnTags = false) {
  const targetTagName = target && target.tagName;
  if (isReadonlyArray(enabledOnTags)) return Boolean(targetTagName && enabledOnTags?.some((tag) => tag.toLowerCase() === targetTagName.toLowerCase()));
  return Boolean(targetTagName && enabledOnTags && enabledOnTags);
}
function isScopeActive(activeScopes, scopes) {
  if (activeScopes.length === 0 && scopes) {
    console.warn('A hotkey has the "scopes" option set, however no active scopes were found. If you want to use the global scopes feature, you need to wrap your app in a <HotkeysProvider>');
    return true;
  }
  if (!scopes) return true;
  return activeScopes.some((scope) => scopes.includes(scope)) || activeScopes.includes("*");
}
const isHotkeyMatchingKeyboardEvent = (e, hotkey, ignoreModifiers = false) => {
  const { keys, alt, ctrl, meta, mod, shift, useKey } = hotkey;
  const { key: producedKey, altKey, code, ctrlKey, metaKey, shiftKey } = e;
  const mappedCode = mapKey(code);
  if (useKey && keys?.length === 1 && keys.includes(producedKey)) return true;
  if (!keys?.includes(mappedCode) && ![
    "alt",
    "control",
    "ctrl",
    "meta",
    "os",
    "shift",
    "unknown"
  ].includes(mappedCode)) return false;
  if (!ignoreModifiers) {
    if (alt !== altKey && mappedCode !== "alt") return false;
    if (shift !== shiftKey && mappedCode !== "shift") return false;
    if (mod) {
      if (!metaKey && !ctrlKey) return false;
    } else {
      if (meta !== metaKey && mappedCode !== "meta" && mappedCode !== "os") return false;
      if (ctrl !== ctrlKey && mappedCode !== "ctrl" && mappedCode !== "control") return false;
    }
  }
  if (keys && keys.length === 1 && keys.includes(mappedCode)) return true;
  if (keys) return isHotkeyPressed(keys);
  if (!keys) return true;
  return false;
};
const stopPropagation = (e) => {
  e.stopPropagation();
  e.preventDefault();
  e.stopImmediatePropagation();
};
const useSafeLayoutEffect = typeof window === "undefined" ? reactExports.useEffect : reactExports.useLayoutEffect;
function useHotkeys(keys, callback, options, dependencies) {
  const [ref, setRef] = reactExports.useState(null);
  const hasTriggeredRef = reactExports.useRef(false);
  const _options = Array.isArray(options) ? Array.isArray(dependencies) ? void 0 : dependencies : options;
  const _keys = reactExports.useMemo(() => {
    if (Array.isArray(keys) && keys.length > 0 && Array.isArray(keys[0])) return keys.map((keyCombo) => keyCombo.map((k) => k.toString()).join(_options?.splitKey || "+")).join(_options?.delimiter || ",");
    if (Array.isArray(keys)) return keys.join(_options?.delimiter || ",");
    return keys;
  }, [
    keys,
    _options?.splitKey,
    _options?.delimiter
  ]);
  const _deps = Array.isArray(options) ? options : Array.isArray(dependencies) ? dependencies : void 0;
  const memoisedCB = reactExports.useCallback(callback, _deps ?? []);
  const cbRef = reactExports.useRef(memoisedCB);
  cbRef.current = _deps ? memoisedCB : callback;
  const memoisedOptions = useDeepEqualMemo(_options);
  const { activeScopes } = useHotkeysContext();
  const proxy = useBoundHotkeysProxy();
  useSafeLayoutEffect(() => {
    if (memoisedOptions?.enabled === false || !isScopeActive(activeScopes, memoisedOptions?.scopes)) return;
    const listener = (e, isKeyUp = false) => {
      if (isKeyboardEventTriggeredByInput(e) && !isHotkeyEnabledOnTag(e, memoisedOptions?.enableOnFormTags)) return;
      if (ref !== null) {
        const rootNode = ref.getRootNode();
        if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement !== ref && !ref.contains(rootNode.activeElement)) {
          stopPropagation(e);
          return;
        }
      }
      if (e.target?.isContentEditable && !memoisedOptions?.enableOnContentEditable) return;
      parseKeysHookInput(_keys, memoisedOptions?.delimiter).forEach((key) => {
        const hotkey = parseHotkey(key, memoisedOptions?.splitKey, memoisedOptions?.useKey);
        if (isHotkeyMatchingKeyboardEvent(e, hotkey, memoisedOptions?.ignoreModifiers) || hotkey.keys?.includes("*")) {
          if ((memoisedOptions?.ignoreEventWhenPrevented ?? true) && e.defaultPrevented) return;
          if (memoisedOptions?.ignoreEventWhen?.(e)) return;
          if (isKeyUp && hasTriggeredRef.current) return;
          if (!isHotkeyEnabled(e, hotkey, memoisedOptions?.enabled)) {
            stopPropagation(e);
            return;
          }
          cbRef.current(e, hotkey);
          maybePreventDefault(e, hotkey, memoisedOptions?.preventDefault);
          if (!isKeyUp) hasTriggeredRef.current = true;
        }
      });
    };
    const handleKeyDown = (event) => {
      if (event.code === void 0) return;
      pushToCurrentlyPressedKeys(mapKey(event.code));
      if (memoisedOptions?.keydown === void 0 && memoisedOptions?.keyup !== true || memoisedOptions?.keydown) listener(event);
    };
    const handleKeyUp = (event) => {
      if (event.code === void 0) return;
      removeFromCurrentlyPressedKeys(mapKey(event.code));
      hasTriggeredRef.current = false;
      if (memoisedOptions?.keyup) listener(event, true);
    };
    const domNode = ref || _options?.document || document;
    domNode.addEventListener("keyup", handleKeyUp);
    domNode.addEventListener("keydown", handleKeyDown);
    if (proxy) for (const key of parseKeysHookInput(_keys, memoisedOptions?.delimiter)) proxy.addHotkey(parseHotkey(key, memoisedOptions?.splitKey, memoisedOptions?.useKey, memoisedOptions?.description));
    return () => {
      domNode.removeEventListener("keyup", handleKeyUp);
      domNode.removeEventListener("keydown", handleKeyDown);
      if (proxy) for (const key of parseKeysHookInput(_keys, memoisedOptions?.delimiter)) proxy.removeHotkey(parseHotkey(key, memoisedOptions?.splitKey, memoisedOptions?.useKey, memoisedOptions?.description));
    };
  }, [
    ref,
    _keys,
    memoisedOptions,
    activeScopes
  ]);
  return setRef;
}
export {
  Key as K,
  useHotkeys as u
};
