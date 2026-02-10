import { s as syncLegacyMethods, N as NodeApi, O as OperationApi, P as PathApi, a as assignLegacyApi, b as assignLegacyTransforms, c as combineMatchOptions, R as RangeApi, d as PointApi, E as ElementApi, T as TextApi, q as queryNode, w as withHistory, e as createEditor } from "./slate.mjs";
import { n as nanoid } from "../../../_libs/nanoid.mjs";
import { i as isDefined, b as bindFirst, I as IS_APPLE } from "../@udecode/utils.mjs";
import { a as merge, b as mergeWith, p as pick, o as omitBy, d as isUndefined, c as castArray, e as cloneDeep, f as defaults, k as kebabCase, g as isEqual, h as omit } from "../../../_libs/lodash.mjs";
import { c as createVanillaStore, u as useStoreValue, a as createZustandStore } from "../../../_libs/zustand-x.mjs";
import { P as Path } from "../../../_libs/slate.mjs";
import { j as jsx } from "../../../_libs/slate-hyperscript.mjs";
import { I as IS_FIREFOX, i as isElementDecorationsEqual, a as isTextDecorationsEqual } from "../../../_libs/slate-dom.mjs";
import { l as libExports } from "../../../_libs/is-hotkey.mjs";
import { a as React, r as reactExports } from "../react.mjs";
import { c as clsx } from "../../../_libs/clsx.mjs";
import { E as Editable, u as useFocused, a as useReadOnly, w as withReact, b as useComposing, S as Slate } from "../../../_libs/slate-react.mjs";
import { d as distExports } from "../../../_libs/react-compiler-runtime.mjs";
import { u as useHotkeys, K as Key } from "../@udecode/react-hotkeys.mjs";
import { u as useStoreAtomValue, a as useAtomStoreValue, b as useAtomStoreSet, c as createAtomStore } from "../../../_libs/jotai-x.mjs";
import { u as useDeepCompareMemo } from "../../../_libs/use-deep-compare.mjs";
import { u as useComposedRef, a as useStableFn, b as useMemoizedSelector } from "../@udecode/react-utils.mjs";
import { f as focusAtom } from "../../../_libs/jotai-optics.mjs";
import { s as selectAtom, a as atom } from "../../../_libs/jotai.mjs";
function isFunction(value) {
  return typeof value === "function";
}
function mergePlugins(basePlugin, ...sourcePlugins) {
  return mergeWith({}, basePlugin, ...sourcePlugins, (objValue, srcValue, key) => {
    if (Array.isArray(srcValue)) return srcValue;
    if (key === "options") return {
      ...objValue,
      ...srcValue
    };
  });
}
function createSlatePlugin(config = {}) {
  let baseConfig;
  let initialExtension;
  if (isFunction(config)) {
    baseConfig = { key: "" };
    initialExtension = (editor) => config(editor);
  } else baseConfig = config;
  const key = baseConfig.key ?? "";
  const plugin = mergePlugins({
    key,
    __apiExtensions: [],
    __configuration: null,
    __extensions: initialExtension ? [initialExtension] : [],
    __selectorExtensions: [],
    api: {},
    dependencies: [],
    editor: {},
    handlers: {},
    inject: {},
    node: { type: key },
    options: {},
    override: {},
    parser: {},
    parsers: {},
    plugins: [],
    priority: 100,
    render: {},
    rules: {},
    shortcuts: {},
    transforms: {}
  }, config);
  if (plugin.node.isLeaf && !isDefined(plugin.node.isDecoration)) plugin.node.isDecoration = true;
  plugin.configure = (config$1) => {
    const newPlugin = { ...plugin };
    newPlugin.__configuration = (ctx) => isFunction(config$1) ? config$1(ctx) : config$1;
    return createSlatePlugin(newPlugin);
  };
  plugin.configurePlugin = (p, config$1) => {
    const newPlugin = { ...plugin };
    const configureNestedPlugin = (plugins) => {
      let found = false;
      const updatedPlugins = plugins.map((nestedPlugin) => {
        if (nestedPlugin.key === p.key) {
          found = true;
          return createSlatePlugin({
            ...nestedPlugin,
            __configuration: (ctx) => isFunction(config$1) ? config$1(ctx) : config$1
          });
        }
        if (nestedPlugin.plugins && nestedPlugin.plugins.length > 0) {
          const result = configureNestedPlugin(nestedPlugin.plugins);
          if (result.found) {
            found = true;
            return {
              ...nestedPlugin,
              plugins: result.plugins
            };
          }
        }
        return nestedPlugin;
      });
      return {
        found,
        plugins: updatedPlugins
      };
    };
    newPlugin.plugins = configureNestedPlugin(newPlugin.plugins).plugins;
    return createSlatePlugin(newPlugin);
  };
  plugin.extendEditorApi = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [...newPlugin.__apiExtensions, {
      extension,
      isPluginSpecific: false
    }];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendSelectors = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__selectorExtensions = [...newPlugin.__selectorExtensions, extension];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendApi = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [...newPlugin.__apiExtensions, {
      extension,
      isPluginSpecific: true
    }];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendEditorTransforms = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [...newPlugin.__apiExtensions, {
      extension,
      isPluginSpecific: false,
      isTransform: true
    }];
    return createSlatePlugin(newPlugin);
  };
  plugin.extendTransforms = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [...newPlugin.__apiExtensions, {
      extension,
      isPluginSpecific: true,
      isTransform: true
    }];
    return createSlatePlugin(newPlugin);
  };
  plugin.overrideEditor = (extension) => {
    const newPlugin = { ...plugin };
    newPlugin.__apiExtensions = [...newPlugin.__apiExtensions, {
      extension,
      isOverride: true,
      isPluginSpecific: false,
      isTransform: true
    }];
    return createSlatePlugin(newPlugin);
  };
  plugin.extend = (extendConfig) => {
    let newPlugin = { ...plugin };
    if (isFunction(extendConfig)) newPlugin.__extensions = [...newPlugin.__extensions, extendConfig];
    else newPlugin = mergePlugins(newPlugin, extendConfig);
    return createSlatePlugin(newPlugin);
  };
  plugin.clone = () => mergePlugins(plugin);
  plugin.extendPlugin = (p, extendConfig) => {
    const newPlugin = { ...plugin };
    const extendNestedPlugin = (plugins) => {
      let found = false;
      const updatedPlugins = plugins.map((nestedPlugin) => {
        if (nestedPlugin.key === p.key) {
          found = true;
          return createSlatePlugin({
            ...nestedPlugin,
            __extensions: [...nestedPlugin.__extensions, (ctx) => isFunction(extendConfig) ? extendConfig(ctx) : extendConfig]
          });
        }
        if (nestedPlugin.plugins && nestedPlugin.plugins.length > 0) {
          const result$1 = extendNestedPlugin(nestedPlugin.plugins);
          if (result$1.found) {
            found = true;
            return {
              ...nestedPlugin,
              plugins: result$1.plugins
            };
          }
        }
        return nestedPlugin;
      });
      return {
        found,
        plugins: updatedPlugins
      };
    };
    const result = extendNestedPlugin(newPlugin.plugins);
    newPlugin.plugins = result.plugins;
    if (!result.found) newPlugin.plugins.push(createSlatePlugin({
      key: p.key,
      __extensions: [(ctx) => isFunction(extendConfig) ? extendConfig(ctx) : extendConfig]
    }));
    return createSlatePlugin(newPlugin);
  };
  plugin.withComponent = (component) => plugin.extend({
    node: { component },
    render: { node: component }
  });
  return plugin;
}
function createTSlatePlugin(config = {}) {
  return createSlatePlugin(config);
}
function getEditorPlugin$1(editor, p) {
  const plugin = editor.getPlugin(p);
  return {
    api: editor.api,
    editor,
    plugin,
    setOption: ((keyOrOptions, value) => editor.setOption(plugin, keyOrOptions, value)),
    setOptions: ((options) => editor.setOptions(plugin, options)),
    tf: editor.transforms,
    type: plugin.node.type,
    getOption: (key, ...args) => editor.getOption(plugin, key, ...args),
    getOptions: () => editor.getOptions(plugin)
  };
}
const resolvePlugin = (editor, _plugin) => {
  let plugin = mergePlugins({}, _plugin);
  plugin.__resolved = true;
  if (plugin.__configuration) {
    const configResult = plugin.__configuration(getEditorPlugin$1(editor, plugin));
    plugin = mergePlugins(plugin, configResult);
    plugin.__configuration = void 0;
  }
  if (plugin.__extensions && plugin.__extensions.length > 0) {
    for (const extension of plugin.__extensions) plugin = mergePlugins(plugin, extension(getEditorPlugin$1(editor, plugin)));
    plugin.__extensions = [];
  }
  const targetPluginToInject = plugin.inject?.targetPluginToInject;
  const targetPlugins = plugin.inject?.targetPlugins;
  if (targetPluginToInject && targetPlugins && targetPlugins.length > 0) {
    plugin.inject = plugin.inject || {};
    plugin.inject.plugins = merge({}, plugin.inject.plugins, Object.fromEntries(targetPlugins.map((targetPlugin) => {
      return [targetPlugin, targetPluginToInject({
        ...getEditorPlugin$1(editor, plugin),
        targetPlugin
      })];
    })));
  }
  if (plugin.node?.component) plugin.render.node = plugin.node.component;
  if (plugin.render?.node) plugin.node.component = plugin.render.node;
  validatePlugin(editor, plugin);
  return plugin;
};
const validatePlugin = (editor, plugin) => {
  if (!plugin.__extensions) editor.api.debug.error(`Invalid plugin '${plugin.key}', you should use createSlatePlugin.`, "USE_CREATE_PLUGIN");
  if (plugin.node.isElement && plugin.node.isLeaf) editor.api.debug.error(`Plugin ${plugin.key} cannot be both an element and a leaf.`, "PLUGIN_NODE_TYPE");
};
function getSlatePlugin(editor, p) {
  let plugin = p;
  const editorPlugin = editor.plugins[p.key];
  if (!editorPlugin) {
    if (!plugin.node) plugin = createSlatePlugin(plugin);
    return plugin.__resolved ? plugin : resolvePlugin(editor, plugin);
  }
  return editorPlugin;
}
function getPluginType(editor, key) {
  const p = editor.getPlugin({ key });
  return p.node.type ?? p.key ?? "";
}
const getPluginKey = (editor, type) => editor.meta.pluginCache.node.types[type];
const getPluginKeys = (editor, types) => types.map((type) => {
  return getPluginKey(editor, type) ?? type;
}).filter(Boolean);
const getPluginByType = (editor, type) => {
  const key = getPluginKey(editor, type);
  if (!key) return null;
  return editor.getPlugin({ key });
};
const resolvePlugins = (editor, plugins = [], createStore = createVanillaStore) => {
  editor.plugins = {};
  editor.meta.pluginList = [];
  editor.meta.shortcuts = {};
  editor.meta.components = {};
  editor.meta.pluginCache = {
    decorate: [],
    handlers: {
      onChange: [],
      onNodeChange: [],
      onTextChange: []
    },
    inject: { nodeProps: [] },
    node: {
      isContainer: [],
      isLeaf: [],
      isText: [],
      leafProps: [],
      textProps: [],
      types: {}
    },
    normalizeInitialValue: [],
    render: {
      aboveEditable: [],
      aboveNodes: [],
      aboveSlate: [],
      afterContainer: [],
      afterEditable: [],
      beforeContainer: [],
      beforeEditable: [],
      belowNodes: [],
      belowRootNodes: []
    },
    rules: { match: [] },
    useHooks: []
  };
  const resolvedPlugins = resolveAndSortPlugins(editor, plugins);
  applyPluginsToEditor(editor, resolvedPlugins);
  resolvePluginOverrides(editor);
  resolvePluginStores(editor, createStore);
  editor.meta.pluginList.forEach((plugin) => {
    if (plugin.extendEditor) {
      editor = plugin.extendEditor(getEditorPlugin$1(editor, plugin));
      syncLegacyMethods(editor);
    }
    resolvePluginMethods(editor, plugin);
    if (plugin.node?.isContainer) editor.meta.pluginCache.node.isContainer.push(plugin.key);
    editor.meta.pluginCache.node.types[plugin.node.type] = plugin.key;
    if (plugin.inject?.nodeProps) editor.meta.pluginCache.inject.nodeProps.push(plugin.key);
    if (plugin.render?.node) editor.meta.components[plugin.key] = plugin.render.node;
    if (plugin.node?.isLeaf && (plugin.node?.isDecoration === true || plugin.render.leaf)) editor.meta.pluginCache.node.isLeaf.push(plugin.key);
    if (plugin.node.isLeaf && plugin.node.isDecoration === false) editor.meta.pluginCache.node.isText.push(plugin.key);
    if (plugin.node?.leafProps) editor.meta.pluginCache.node.leafProps.push(plugin.key);
    if (plugin.node.textProps) editor.meta.pluginCache.node.textProps.push(plugin.key);
    if (plugin.render.aboveEditable) editor.meta.pluginCache.render.aboveEditable.push(plugin.key);
    if (plugin.render.aboveSlate) editor.meta.pluginCache.render.aboveSlate.push(plugin.key);
    if (plugin.render.afterEditable) editor.meta.pluginCache.render.afterEditable.push(plugin.key);
    if (plugin.render.beforeEditable) editor.meta.pluginCache.render.beforeEditable.push(plugin.key);
    if (plugin.rules?.match) editor.meta.pluginCache.rules.match.push(plugin.key);
    if (plugin.render.afterContainer) editor.meta.pluginCache.render.afterContainer.push(plugin.key);
    if (plugin.render.beforeContainer) editor.meta.pluginCache.render.beforeContainer.push(plugin.key);
    if (plugin.render.belowRootNodes) editor.meta.pluginCache.render.belowRootNodes.push(plugin.key);
    if (plugin.normalizeInitialValue) editor.meta.pluginCache.normalizeInitialValue.push(plugin.key);
    if (plugin.decorate) editor.meta.pluginCache.decorate.push(plugin.key);
    if (plugin.render.aboveNodes) editor.meta.pluginCache.render.aboveNodes.push(plugin.key);
    if (plugin.render.belowNodes) editor.meta.pluginCache.render.belowNodes.push(plugin.key);
    if (plugin.useHooks) editor.meta.pluginCache.useHooks.push(plugin.key);
    if (plugin.handlers?.onChange) editor.meta.pluginCache.handlers.onChange.push(plugin.key);
    if (plugin.handlers?.onNodeChange) editor.meta.pluginCache.handlers.onNodeChange.push(plugin.key);
    if (plugin.handlers?.onTextChange) editor.meta.pluginCache.handlers.onTextChange.push(plugin.key);
  });
  resolvePluginShortcuts(editor);
  return editor;
};
const resolvePluginStores = (editor, createStore) => {
  editor.meta.pluginList.forEach((plugin) => {
    let store = createStore(plugin.options, {
      mutative: true,
      name: plugin.key
    });
    if (plugin.__selectorExtensions && plugin.__selectorExtensions.length > 0) plugin.__selectorExtensions.forEach((extension) => {
      const extendedOptions = extension(getEditorPlugin$1(editor, plugin));
      store = store.extendSelectors(() => extendedOptions);
    });
    plugin.optionsStore = store;
  });
};
const resolvePluginMethods = (editor, plugin) => {
  Object.entries(plugin.api).forEach(([apiKey, apiFunction]) => {
    editor.api[apiKey] = apiFunction;
  });
  if (plugin.__apiExtensions && plugin.__apiExtensions.length > 0) {
    plugin.__apiExtensions.forEach(({ extension, isOverride, isPluginSpecific, isTransform }) => {
      const newExtensions = extension(getEditorPlugin$1(editor, plugin));
      if (isOverride) {
        if (newExtensions.api) {
          merge(editor.api, newExtensions.api);
          merge(plugin.api, newExtensions.api);
          assignLegacyApi(editor, editor.api);
        }
        if (newExtensions.transforms) {
          merge(editor.transforms, newExtensions.transforms);
          merge(plugin.transforms, newExtensions.transforms);
          assignLegacyTransforms(editor, newExtensions.transforms);
        }
      } else if (isTransform) if (isPluginSpecific) {
        if (!editor.transforms[plugin.key]) editor.transforms[plugin.key] = {};
        if (!plugin.transforms[plugin.key]) plugin.transforms[plugin.key] = {};
        merge(editor.transforms[plugin.key], newExtensions);
        merge(plugin.transforms[plugin.key], newExtensions);
      } else {
        merge(editor.transforms, newExtensions);
        merge(plugin.transforms, newExtensions);
        assignLegacyTransforms(editor, newExtensions);
      }
      else if (isPluginSpecific) {
        if (!editor.api[plugin.key]) editor.api[plugin.key] = {};
        if (!plugin.api[plugin.key]) plugin.api[plugin.key] = {};
        merge(editor.api[plugin.key], newExtensions);
        merge(plugin.api[plugin.key], newExtensions);
      } else {
        merge(editor.api, newExtensions);
        merge(plugin.api, newExtensions);
        assignLegacyApi(editor, editor.api);
      }
    });
    plugin.__apiExtensions = void 0;
  }
};
const resolvePluginShortcuts = (editor) => {
  editor.meta.shortcuts = {};
  editor.meta.pluginList.forEach((plugin) => {
    Object.entries(plugin.shortcuts).forEach(([originalKey, hotkey]) => {
      const namespacedKey = `${plugin.key}.${originalKey}`;
      if (hotkey === null) delete editor.meta.shortcuts[namespacedKey];
      else if (hotkey && typeof hotkey === "object") {
        const resolvedHotkey = { ...hotkey };
        if (!resolvedHotkey.handler) {
          const pluginSpecificTransforms = plugin.transforms?.[plugin.key];
          const pluginSpecificApi = plugin.api?.[plugin.key];
          if (pluginSpecificTransforms?.[originalKey]) resolvedHotkey.handler = () => pluginSpecificTransforms[originalKey]();
          else if (pluginSpecificApi?.[originalKey]) resolvedHotkey.handler = () => pluginSpecificApi[originalKey]();
        }
        resolvedHotkey.priority = resolvedHotkey.priority ?? plugin.priority;
        editor.meta.shortcuts[namespacedKey] = resolvedHotkey;
      }
    });
  });
};
const flattenAndResolvePlugins = (editor, plugins) => {
  const pluginMap = /* @__PURE__ */ new Map();
  const processPlugin = (plugin) => {
    const resolvedPlugin = resolvePlugin(editor, plugin);
    if (resolvedPlugin.key) {
      const existingPlugin = pluginMap.get(resolvedPlugin.key);
      if (existingPlugin) pluginMap.set(resolvedPlugin.key, mergePlugins(existingPlugin, resolvedPlugin));
      else pluginMap.set(resolvedPlugin.key, resolvedPlugin);
    }
    if (resolvedPlugin.plugins && resolvedPlugin.plugins.length > 0) resolvedPlugin.plugins.forEach(processPlugin);
  };
  plugins.forEach(processPlugin);
  return pluginMap;
};
const resolveAndSortPlugins = (editor, plugins) => {
  const pluginMap = flattenAndResolvePlugins(editor, plugins);
  const enabledPlugins = Array.from(pluginMap.values()).filter((plugin) => plugin.enabled !== false);
  enabledPlugins.sort((a, b) => b.priority - a.priority);
  const orderedPlugins = [];
  const visited = /* @__PURE__ */ new Set();
  const visit = (plugin) => {
    if (visited.has(plugin.key)) return;
    visited.add(plugin.key);
    plugin.dependencies?.forEach((depKey) => {
      const depPlugin = pluginMap.get(depKey);
      if (depPlugin) visit(depPlugin);
      else editor.api.debug.warn(`Plugin "${plugin.key}" depends on missing plugin "${depKey}"`, "PLUGIN_DEPENDENCY_MISSING");
    });
    orderedPlugins.push(plugin);
  };
  enabledPlugins.forEach(visit);
  return orderedPlugins;
};
const applyPluginsToEditor = (editor, plugins) => {
  editor.meta.pluginList = plugins;
  editor.plugins = Object.fromEntries(plugins.map((plugin) => [plugin.key, plugin]));
};
const resolvePluginOverrides = (editor) => {
  const applyOverrides = (plugins) => {
    let overriddenPlugins = [...plugins];
    const enabledOverrides = {};
    const componentOverrides = {};
    const pluginOverrides = {};
    for (const plugin of plugins) {
      if (plugin.override.enabled) Object.assign(enabledOverrides, plugin.override.enabled);
      if (plugin.override.components) Object.entries(plugin.override.components).forEach(([key, component]) => {
        if (!componentOverrides[key] || plugin.priority > componentOverrides[key].priority) componentOverrides[key] = {
          component,
          priority: plugin.priority
        };
      });
      if (plugin.override.plugins) Object.entries(plugin.override.plugins).forEach(([key, value]) => {
        pluginOverrides[key] = mergePlugins(pluginOverrides[key], value);
        if (value.enabled !== void 0) enabledOverrides[key] = value.enabled;
      });
    }
    overriddenPlugins = overriddenPlugins.map((p) => {
      let updatedPlugin = { ...p };
      if (pluginOverrides[p.key]) updatedPlugin = mergePlugins(updatedPlugin, pluginOverrides[p.key]);
      if (componentOverrides[p.key] && (!p.render.node && !p.node.component || componentOverrides[p.key].priority > p.priority)) {
        updatedPlugin.render.node = componentOverrides[p.key].component;
        updatedPlugin.node.component = componentOverrides[p.key].component;
      }
      const enabled = enabledOverrides[p.key] ?? updatedPlugin.enabled;
      if (isDefined(enabled)) updatedPlugin.enabled = enabled;
      return updatedPlugin;
    });
    return overriddenPlugins.filter((p) => p.enabled !== false).map((plugin) => ({
      ...plugin,
      plugins: applyOverrides(plugin.plugins || [])
    }));
  };
  editor.meta.pluginList = applyOverrides(editor.meta.pluginList);
  editor.plugins = Object.fromEntries(editor.meta.pluginList.map((plugin) => [plugin.key, plugin]));
};
const AstPlugin = createSlatePlugin({
  key: "ast",
  parser: {
    format: "application/x-slate-fragment",
    deserialize: ({ data }) => {
      const decoded = decodeURIComponent(window.atob(data));
      let parsed;
      try {
        parsed = JSON.parse(decoded);
      } catch {
      }
      return parsed;
    }
  }
});
const withPlateHistory = ({ editor }) => withHistory(editor);
const HistoryPlugin = createSlatePlugin({
  key: "history",
  extendEditor: withPlateHistory
});
const BaseParagraphPlugin = createSlatePlugin({
  key: "p",
  node: { isElement: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: "P" }],
    query: ({ element }) => element.style.fontFamily !== "Consolas"
  } } },
  rules: { merge: { removeEmpty: true } }
});
const withBreakRules = (ctx) => {
  const { editor, tf: { insertBreak } } = ctx;
  const checkMatchRulesOverride = (rule, blockNode, blockPath) => {
    const matchRulesKeys = editor.meta.pluginCache.rules.match;
    for (const key of matchRulesKeys) {
      const overridePlugin = editor.getPlugin({ key });
      if (overridePlugin.rules?.break && overridePlugin.rules?.match?.({
        ...ctx,
        node: blockNode,
        path: blockPath,
        rule
      })) return overridePlugin.rules.break;
    }
    return null;
  };
  const executeBreakAction = (action, blockPath) => {
    if (action === "reset") {
      editor.tf.resetBlock({ at: blockPath });
      return true;
    }
    if (action === "exit") {
      editor.tf.insertExitBreak();
      return true;
    }
    if (action === "deleteExit") {
      editor.tf.deleteBackward("character");
      editor.tf.insertExitBreak();
      return true;
    }
    if (action === "lineBreak") {
      editor.tf.insertSoftBreak();
      return true;
    }
    return false;
  };
  return { transforms: { insertBreak() {
    if (editor.selection && editor.api.isCollapsed()) {
      const block = editor.api.block();
      if (block) {
        const [blockNode, blockPath] = block;
        const breakRules = getPluginByType(editor, blockNode.type)?.rules.break;
        if (editor.api.isEmpty(editor.selection, { block: true })) {
          const emptyAction = (checkMatchRulesOverride("break.empty", blockNode, blockPath) || breakRules)?.empty;
          if (executeBreakAction(emptyAction, blockPath)) return;
        }
        if (!editor.api.isEmpty(editor.selection, { block: true }) && editor.api.isAt({ end: true })) {
          const range = editor.api.range("before", editor.selection);
          if (range) {
            if (editor.api.string(range) === "\n") {
              const emptyLineEndAction = (checkMatchRulesOverride("break.emptyLineEnd", blockNode, blockPath) || breakRules)?.emptyLineEnd;
              if (executeBreakAction(emptyLineEndAction, blockPath)) return;
            }
          }
        }
        const defaultAction = (checkMatchRulesOverride("break.default", blockNode, blockPath) || breakRules)?.default;
        if (executeBreakAction(defaultAction, blockPath)) return;
        if (checkMatchRulesOverride("break.splitReset", blockNode, blockPath)?.splitReset ?? breakRules?.splitReset) {
          const isAtStart = editor.api.isAt({ start: true });
          insertBreak();
          editor.tf.resetBlock({ at: isAtStart ? blockPath : PathApi.next(blockPath) });
          return;
        }
      }
    }
    insertBreak();
  } } };
};
const withDeleteRules = (ctx) => {
  const { editor, tf: { deleteBackward, deleteForward, deleteFragment } } = ctx;
  const resetMarks = () => {
    if (editor.api.isAt({ start: true })) editor.tf.removeMarks();
  };
  const checkMatchRulesOverride = (rule, blockNode, blockPath) => {
    const matchRulesKeys = editor.meta.pluginCache.rules.match;
    for (const key of matchRulesKeys) {
      const overridePlugin = editor.getPlugin({ key });
      if (overridePlugin.rules?.delete && overridePlugin.rules?.match?.({
        ...ctx,
        node: blockNode,
        path: blockPath,
        rule
      })) return overridePlugin.rules.delete;
    }
    return null;
  };
  const executeDeleteAction = (action, blockPath) => {
    if (action === "reset") {
      editor.tf.resetBlock({ at: blockPath });
      return true;
    }
    return false;
  };
  return { transforms: {
    deleteBackward(unit) {
      if (editor.selection && editor.api.isCollapsed()) {
        const block = editor.api.block();
        if (block) {
          const [blockNode, blockPath] = block;
          const deleteRules = getPluginByType(editor, blockNode.type)?.rules.delete;
          if (editor.api.isAt({ start: true })) {
            const startAction = (checkMatchRulesOverride("delete.start", blockNode, blockPath) || deleteRules)?.start;
            if (executeDeleteAction(startAction, blockPath)) return;
          }
          if (editor.api.isEmpty(editor.selection, { block: true })) {
            const emptyAction = (checkMatchRulesOverride("delete.empty", blockNode, blockPath) || deleteRules)?.empty;
            if (executeDeleteAction(emptyAction, blockPath)) return;
          }
        }
        if (PointApi.equals(editor.selection.anchor, editor.api.start([]))) {
          editor.tf.resetBlock({ at: [0] });
          return;
        }
      }
      deleteBackward(unit);
      resetMarks();
    },
    deleteForward(unit) {
      deleteForward(unit);
      resetMarks();
    },
    deleteFragment(options) {
      if (editor.selection && RangeApi.equals(editor.selection, editor.api.range([]))) {
        editor.tf.reset({
          children: true,
          select: true
        });
        return;
      }
      deleteFragment(options);
      resetMarks();
    }
  } };
};
const withMergeRules = (ctx) => {
  const { editor, tf: { removeNodes } } = ctx;
  const checkMatchRulesOverride = (rule, blockNode, blockPath) => {
    const matchRulesKeys = editor.meta.pluginCache.rules.match;
    for (const key of matchRulesKeys) {
      const overridePlugin = editor.getPlugin({ key });
      if (overridePlugin.rules.merge && overridePlugin.rules?.match?.({
        ...ctx,
        node: blockNode,
        path: blockPath,
        rule
      })) return overridePlugin.rules.merge;
    }
    return null;
  };
  return {
    api: { shouldMergeNodes(prevNodeEntry, nextNodeEntry, { reverse } = {}) {
      const [prevNode, prevPath] = prevNodeEntry;
      const [, nextPath] = nextNodeEntry;
      const [curNode, curPath] = reverse ? prevNodeEntry : nextNodeEntry;
      const [targetNode, targetPath] = reverse ? nextNodeEntry : prevNodeEntry;
      if (TextApi.isText(prevNode) && prevNode.text === "" && prevPath.at(-1) !== 0) {
        editor.tf.removeNodes({ at: prevPath });
        return false;
      }
      const shouldRemove = (node, path) => {
        const plugin = getPluginByType(editor, node.type);
        if (!plugin) return true;
        if (!plugin.rules.merge?.removeEmpty) return false;
        if (checkMatchRulesOverride("merge.removeEmpty", node, path)?.removeEmpty === false) return false;
        return true;
      };
      if (ElementApi.isElement(targetNode) && editor.api.isVoid(targetNode)) {
        if (shouldRemove(targetNode, targetPath)) editor.tf.removeNodes({ at: prevPath });
        else if (ElementApi.isElement(curNode) && editor.api.isEmpty(curNode)) editor.tf.removeNodes({ at: curPath });
        return false;
      }
      if (ElementApi.isElement(prevNode) && editor.api.isEmpty(prevNode) && PathApi.isSibling(prevPath, nextPath) && shouldRemove(prevNode, prevPath)) {
        editor.tf.removeNodes({ at: prevPath });
        return false;
      }
      return true;
    } },
    transforms: { removeNodes(options = {}) {
      if (options.event?.type === "mergeNodes" && options.at) {
        const nodeEntry = editor.api.node(options.at);
        if (nodeEntry) {
          const [node, path] = nodeEntry;
          if (ElementApi.isElement(node)) {
            const plugin = getPluginByType(editor, node.type);
            if (plugin) {
              const mergeRules = plugin.rules.merge;
              if (checkMatchRulesOverride("merge.removeEmpty", node, path)?.removeEmpty === false || mergeRules?.removeEmpty === false) return;
            }
          }
        }
      }
      removeNodes(options);
    } }
  };
};
const withNormalizeRules = (ctx) => {
  const { editor, tf: { normalizeNode } } = ctx;
  const checkMatchRulesOverride = (rule, node, path) => {
    const matchRulesKeys = editor.meta.pluginCache.rules.match;
    for (const key of matchRulesKeys) {
      const overridePlugin = editor.getPlugin({ key });
      if (overridePlugin.rules?.normalize && overridePlugin.rules?.match?.({
        ...ctx,
        node,
        path,
        rule
      })) return overridePlugin.rules.normalize;
    }
    return null;
  };
  return { transforms: { normalizeNode([node, path]) {
    if (ElementApi.isElement(node) && node.type) {
      const normalizeRules = getPluginByType(editor, node.type)?.rules.normalize;
      if ((checkMatchRulesOverride("normalize.removeEmpty", node, path) || normalizeRules)?.removeEmpty && editor.api.isEmpty(node)) {
        editor.tf.removeNodes({ at: path });
        return;
      }
    }
    normalizeNode([node, path]);
  } } };
};
const withOverrides = ({ api: { isInline, isSelectable, isVoid, markableVoid }, editor }) => {
  return { api: {
    create: { block: (node) => ({
      children: [{ text: "" }],
      type: editor.getType(BaseParagraphPlugin.key),
      ...node
    }) },
    isInline(element) {
      return getPluginByType(editor, element.type)?.node.isInline ? true : isInline(element);
    },
    isSelectable(element) {
      return getPluginByType(editor, element.type)?.node.isSelectable === false ? false : isSelectable(element);
    },
    isVoid(element) {
      return getPluginByType(editor, element.type)?.node.isVoid ? true : isVoid(element);
    },
    markableVoid(element) {
      return getPluginByType(editor, element.type)?.node.isMarkableVoid ? true : markableVoid(element);
    }
  } };
};
const OverridePlugin = createSlatePlugin({ key: "override" }).overrideEditor(withOverrides).overrideEditor(withBreakRules).overrideEditor(withDeleteRules).overrideEditor(withMergeRules).overrideEditor(withNormalizeRules);
const pipeInsertFragment = (editor, injectedPlugins, { fragment, ...options }) => {
  editor.tf.withoutNormalizing(() => {
    injectedPlugins.some((p) => p.parser?.preInsert?.({
      ...getEditorPlugin$1(editor, p),
      fragment,
      ...options
    }) === true);
    editor.tf.insertFragment(fragment);
  });
};
const pipeTransformData = (editor, plugins, { data, ...options }) => {
  plugins.forEach((p) => {
    const transformData = p.parser?.transformData;
    if (!transformData) return;
    data = transformData({
      ...getEditorPlugin$1(editor, p),
      data,
      ...options
    });
  });
  return data;
};
const pipeTransformFragment = (editor, plugins, { fragment, ...options }) => {
  plugins.forEach((p) => {
    const transformFragment = p.parser?.transformFragment;
    if (!transformFragment) return;
    fragment = transformFragment({
      fragment,
      ...options,
      ...getEditorPlugin$1(editor, p)
    });
  });
  return fragment;
};
const applyDeepToNodes = ({ apply, node, path = [], query, source }) => {
  if (queryNode([node, path], query)) if (typeof source === "function") apply(node, source());
  else apply(node, source);
  if (!NodeApi.isAncestor(node)) return;
  node.children.forEach((child, index) => {
    applyDeepToNodes({
      apply,
      node: child,
      path: path.concat([index]),
      query,
      source
    });
  });
};
const isSlateVoid = (element) => element.dataset.slateVoid === "true";
const isSlateElement = (element) => element.dataset.slateNode === "element";
const isSlateText = (element) => element.dataset.slateNode === "text";
const isSlateString = (element) => element.dataset.slateString === "true";
const isSlateLeaf = (element) => element.dataset.slateLeaf === "true";
const isSlateNode = (element) => isSlateLeaf(element) || isSlateElement(element) || isSlateVoid(element) || isSlateString(element) || isSlateText(element);
const isSlatePluginNode = (element, pluginKey) => element.classList.contains(`slate-${pluginKey}`);
const defaultsDeepToNodes = (options) => {
  applyDeepToNodes({
    ...options,
    apply: defaults
  });
};
const getInjectMatch = (editor, plugin) => {
  return (node, path) => {
    const { inject: { excludeBelowPlugins, excludePlugins, isBlock: _isBlock, isElement: _isElement, isLeaf, maxLevel, targetPlugins } } = plugin;
    const element = ElementApi.isElement(node) ? node : void 0;
    if (_isElement && !element) return false;
    if (_isBlock && (!element || !editor.api.isBlock(element))) return false;
    if (isLeaf && element) return false;
    if (element?.type) {
      if (excludePlugins?.includes(getPluginKey(editor, element.type))) return false;
      if (targetPlugins && !targetPlugins.includes(getPluginKey(editor, element.type))) return false;
    }
    if (excludeBelowPlugins || maxLevel) {
      if (maxLevel && path.length > maxLevel) return false;
      if (excludeBelowPlugins) {
        const excludeTypes = getPluginKeys(editor, excludeBelowPlugins);
        if (editor.api.above({
          at: path,
          match: (n) => ElementApi.isElement(n) && excludeTypes.includes(n.type)
        })) return false;
      }
    }
    return true;
  };
};
const getInjectedPlugins = (editor, plugin) => {
  const injectedPlugins = [];
  [...editor.meta.pluginList].reverse().forEach((p) => {
    const injectedPlugin = p.inject.plugins?.[plugin.key];
    if (injectedPlugin) injectedPlugins.push(injectedPlugin);
  });
  return [plugin, ...injectedPlugins];
};
const getNodeDataAttributeKeys = (node) => Object.keys(node).filter((key) => typeof node[key] !== "object" && (!TextApi.isText(node) || key !== "text")).map((key) => keyToDataAttribute(key));
const keyToDataAttribute = (key) => `data-slate-${kebabCase(key)}`;
const getPluginNodeProps = ({ attributes: nodeAttributes, node, plugin, props }) => {
  const newProps = {
    ...props,
    attributes: { ...props.attributes }
  };
  if (plugin?.node.props) {
    const pluginNodeProps = (typeof plugin.node.props === "function" ? plugin.node.props(newProps) : plugin.node.props) ?? {};
    newProps.attributes = {
      ...newProps.attributes,
      ...pluginNodeProps
    };
  }
  if (nodeAttributes && plugin) newProps.attributes = {
    ...newProps.attributes,
    ...pick(
      nodeAttributes,
      ...plugin.node.dangerouslyAllowAttributes ?? [],
      [...node ? getNodeDataAttributeKeys(node) : []]
    )
  };
  Object.keys(newProps.attributes).forEach((key) => {
    if (newProps.attributes?.[key] === void 0) delete newProps.attributes?.[key];
  });
  return newProps;
};
const getSlateClass = (type) => type ? `slate-${type}` : "";
const mergeDeepToNodes = (options) => {
  applyDeepToNodes({
    ...options,
    apply: merge
  });
};
const getEdgeNodes = (editor) => {
  if (!editor.api.isCollapsed()) return null;
  const cursor = editor.selection.anchor;
  const textRange = editor.api.range(cursor.path);
  if (!textRange) return null;
  const edge = editor.api.isStart(cursor, textRange) ? "start" : editor.api.isEnd(cursor, textRange) ? "end" : null;
  if (!edge) return null;
  const parent = NodeApi.parent(editor, cursor.path) ?? null;
  const isAffinityInlineElement = (() => {
    if (!parent || !ElementApi.isElement(parent)) return false;
    const parentAffinity = getPluginByType(editor, parent.type)?.rules.selection?.affinity;
    return parentAffinity === "hard" || parentAffinity === "directional";
  })();
  const nodeEntry = isAffinityInlineElement ? [parent, PathApi.parent(cursor.path)] : [NodeApi.get(editor, cursor.path), cursor.path];
  if (edge === "start" && cursor.path.at(-1) === 0 && !isAffinityInlineElement) return [null, nodeEntry];
  const siblingPath = edge === "end" ? Path.next(nodeEntry[1]) : Path.previous(nodeEntry[1]);
  const siblingNode = NodeApi.get(editor, siblingPath);
  const siblingEntry = siblingNode ? [siblingNode, siblingPath] : null;
  return edge === "end" ? [nodeEntry, siblingEntry] : [siblingEntry, nodeEntry];
};
const getMarkBoundaryAffinity = (editor, markBoundary) => {
  const { marks, selection } = editor;
  if (!selection) return;
  const marksMatchLeaf = (leaf) => marks && isEqual(NodeApi.extractProps(leaf), marks) && Object.keys(marks).length > 1;
  const [backwardLeafEntry, forwardLeafEntry] = markBoundary;
  if (!backwardLeafEntry || !forwardLeafEntry) {
    const leafEntry = backwardLeafEntry || forwardLeafEntry;
    if (!marks || marksMatchLeaf(leafEntry[0])) return leafEntry === backwardLeafEntry ? "backward" : "forward";
    return;
  }
  const marksDirection = marks && (() => {
    if (backwardLeafEntry && marksMatchLeaf(backwardLeafEntry[0])) return "backward";
    if (forwardLeafEntry && marksMatchLeaf(forwardLeafEntry[0])) return "forward";
    return null;
  })();
  const selectionDirection = selection.anchor.offset === 0 ? "forward" : "backward";
  if (selectionDirection === "backward" && marksDirection === "forward") return "forward";
  if (IS_FIREFOX && selectionDirection === "forward" && marksDirection !== "backward") return "forward";
  return "backward";
};
const isNodeAffinity = (editor, node, affinity) => {
  const marks = Object.keys(NodeApi.extractProps(node));
  return (ElementApi.isElement(node) ? [node.type] : marks).some((type) => getPluginByType(editor, type)?.rules.selection?.affinity === affinity);
};
const isNodesAffinity = (editor, edgeNodes, affinity) => {
  const [backwardLeafEntry, forwardLeafEntry] = edgeNodes;
  return backwardLeafEntry && isNodeAffinity(editor, backwardLeafEntry[0], affinity) || forwardLeafEntry && isNodeAffinity(editor, forwardLeafEntry[0], affinity);
};
const setAffinitySelection = (editor, edgeNodes, affinity) => {
  const setMarks = (marks) => {
    editor.marks = marks;
    editor.api.onChange();
  };
  const select = (point) => {
    editor.tf.setSelection({
      anchor: point,
      focus: point
    });
  };
  const [before, after] = edgeNodes;
  if (affinity === "backward") {
    if (before === null) {
      setMarks({});
      return;
    }
    const beforeEnd = editor.api.end(before[1]);
    if (beforeEnd) select(beforeEnd);
    if (ElementApi.isElement(before[0])) return;
    setMarks(null);
    return;
  }
  if (before === null) {
    setMarks(null);
    return;
  }
  if (after === null) {
    setMarks({});
    return;
  }
  select(editor.api.end(before[1]));
  if (ElementApi.isElement(after[0])) return;
  setMarks(NodeApi.extractProps(after[0]));
};
const AffinityPlugin = createTSlatePlugin({ key: "affinity" }).overrideEditor(({ editor, tf: { deleteBackward, insertText, move } }) => ({ transforms: {
  deleteBackward: (unit) => {
    const apply = () => {
      if (unit === "character" && editor.api.isCollapsed()) {
        const [start] = getEdgeNodes(editor) ?? [null];
        const startText = start && (TextApi.isText(start[0]) ? start[0].text : NodeApi.string(start[0]));
        deleteBackward(unit);
        const edgeNodes = getEdgeNodes(editor);
        if (edgeNodes && isNodesAffinity(editor, edgeNodes, "directional") && !hasElement(edgeNodes)) setAffinitySelection(editor, edgeNodes, startText && startText.length > 1 ? "backward" : "forward");
        return true;
      }
    };
    if (apply()) return;
    deleteBackward(unit);
  },
  insertText(text, options) {
    const applyOutwardAffinity = () => {
      if (!editor.selection || editor.api.isExpanded()) return;
      const textPath = editor.selection.focus.path;
      const textNode = NodeApi.get(editor, textPath);
      if (!textNode) return;
      const outwardMarks = Object.keys(NodeApi.extractProps(textNode)).filter((type) => getPluginByType(editor, type)?.rules.selection?.affinity === "outward");
      if (!outwardMarks.length || !editor.api.isEnd(editor.selection.focus, textPath)) return;
      const nextPoint = editor.api.start(textPath, { next: true });
      const marksToRemove = [];
      let nextTextNode = null;
      if (nextPoint) {
        const nextTextPath = nextPoint.path;
        nextTextNode = NodeApi.get(editor, nextTextPath) || null;
      }
      for (const markKey of outwardMarks) {
        if (!textNode[markKey]) continue;
        if (!nextTextNode?.[markKey]) marksToRemove.push(markKey);
      }
      if (marksToRemove.length > 0) editor.tf.removeMarks(marksToRemove);
    };
    applyOutwardAffinity();
    return insertText(text, options);
  },
  move: (options) => {
    const apply = () => {
      const { distance = 1, reverse = false, unit = "character" } = options || {};
      if (unit === "character" && distance === 1 && editor.api.isCollapsed()) {
        const preEdgeNodes = getEdgeNodes(editor);
        if (preEdgeNodes && isNodesAffinity(editor, preEdgeNodes, "hard")) {
          if (preEdgeNodes && preEdgeNodes[reverse ? 0 : 1] === null && getMarkBoundaryAffinity(editor, preEdgeNodes) === (reverse ? "forward" : "backward")) {
            setAffinitySelection(editor, preEdgeNodes, reverse ? "backward" : "forward");
            return true;
          }
          move({
            ...options,
            unit: "offset"
          });
          return true;
        }
        move(options);
        const postEdgeNodes = getEdgeNodes(editor);
        if (postEdgeNodes && isNodesAffinity(editor, postEdgeNodes, "directional") && !hasElement(postEdgeNodes)) setAffinitySelection(editor, postEdgeNodes, reverse ? "forward" : "backward");
        return true;
      }
    };
    if (apply()) return;
    move(options);
  }
} }));
const hasElement = (edgeNodes) => {
  const [before, after] = edgeNodes;
  return before && ElementApi.isElement(before[0]) || after && ElementApi.isElement(after[0]);
};
const withChunking = ({ editor, getOptions }) => {
  const { chunkSize, query } = getOptions();
  editor.getChunkSize = (ancestor) => query(ancestor) ? chunkSize : null;
  return {};
};
const ChunkingPlugin = createTSlatePlugin({
  key: "chunking",
  options: {
    chunkSize: 1e3,
    contentVisibilityAuto: true,
    query: NodeApi.isEditor
  }
}).overrideEditor(withChunking);
const DebugPlugin = createTSlatePlugin({
  key: "debug",
  options: {
    isProduction: true,
    logger: {
      error: (message, type, details) => console.error(`${type ? `[${type}] ` : ""}${message}`, details),
      info: (message, type, details) => console.info(`${type ? `[${type}] ` : ""}${message}`, details),
      log: (message, type, details) => console.log(`${type ? `[${type}] ` : ""}${message}`, details),
      warn: (message, type, details) => console.warn(`${type ? `[${type}] ` : ""}${message}`, details)
    },
    logLevel: "error",
    throwErrors: true
  }
}).extendEditorApi(({ getOptions }) => {
  const log = (level, message, type, details) => {
    return;
  };
  return { debug: {
    error: (message, type, details) => log(),
    info: (message, type, details) => log(),
    log: (message, type, details) => log(),
    warn: (message, type, details) => log()
  } };
});
const withScrolling = (editor, fn, options) => {
  const prevOptions = editor.getOptions(DOMPlugin);
  const prevAutoScroll = AUTO_SCROLL.get(editor) ?? false;
  if (options) {
    const ops = {
      ...prevOptions,
      ...omitBy(options, isUndefined)
    };
    editor.setOptions(DOMPlugin, ops);
  }
  AUTO_SCROLL.set(editor, true);
  fn();
  AUTO_SCROLL.set(editor, prevAutoScroll);
  editor.setOptions(DOMPlugin, prevOptions);
};
const AUTO_SCROLL = /* @__PURE__ */ new WeakMap();
const DOMPlugin = createTSlatePlugin({
  key: "dom",
  options: {
    scrollMode: "last",
    scrollOperations: {
      insert_node: true,
      insert_text: true
    },
    scrollOptions: { scrollMode: "if-needed" }
  }
}).extendEditorApi(({ editor }) => ({ isScrolling: () => AUTO_SCROLL.get(editor) ?? false })).extendEditorTransforms(({ editor }) => ({ withScrolling: bindFirst(withScrolling, editor) })).overrideEditor(({ api, editor, getOption, tf: { apply } }) => ({ transforms: { apply(operation) {
  if (api.isScrolling()) {
    apply(operation);
    const scrollOperations = getOption("scrollOperations");
    if (!scrollOperations[operation.type]) return;
    const matched = editor.operations.filter((op) => !!scrollOperations[op.type]);
    if (matched.length === 0) return;
    const targetOp = getOption("scrollMode") === "first" ? matched[0] : matched.at(-1);
    if (!targetOp) return;
    const { offset, path } = targetOp.path ? targetOp : {};
    if (!path) return;
    const scrollOptions = getOption("scrollOptions");
    const scrollTarget = {
      offset: offset ?? 0,
      path
    };
    api.scrollIntoView(scrollTarget, scrollOptions);
    return;
  }
  return apply(operation);
} } })).overrideEditor(({ editor, tf: { apply } }) => ({ transforms: { apply(operation) {
  if (operation.type === "set_selection") {
    const { properties } = operation;
    editor.dom.prevSelection = properties;
    apply(operation);
    editor.dom.currentKeyboardEvent = null;
    return;
  }
  apply(operation);
} } }));
const isHtmlElement = (node) => node.nodeType === Node.ELEMENT_NODE;
const isHtmlText = (node) => node.nodeType === Node.TEXT_NODE;
const inlineTagNames = /* @__PURE__ */ new Set([
  "A",
  "ABBR",
  "ACRONYM",
  "B",
  "BDI",
  "BDO",
  "BIG",
  "BR",
  "BUTTON",
  "CANVAS",
  "CITE",
  "CODE",
  "CONTENT",
  "DATA",
  "DEL",
  "DFN",
  "EM",
  "EMBED",
  "FONT",
  "I",
  "IFRAME",
  "IMG",
  "IMG",
  "INPUT",
  "INS",
  "KBD",
  "LABEL",
  "MAP",
  "MARK",
  "MARQUEE",
  "math",
  "MENUITEM",
  "METER",
  "NOBR",
  "OBJECT",
  "OUTPUT",
  "PICTURE",
  "PORTAL",
  "PROGRESS",
  "Q",
  "S",
  "SAMP",
  "SELECT",
  "SHADOW",
  "SMALL",
  "SOURCE",
  "SPAN",
  "STRIKE",
  "STRONG",
  "SUB",
  "SUP",
  "svg",
  "TEXTAREA",
  "TIME",
  "TRACK",
  "TT",
  "U",
  "VAR",
  "VIDEO",
  "WBR"
]);
const isHtmlInlineElement = (node) => {
  if (!isHtmlElement(node)) return false;
  const element = node;
  const tagNameIsInline = inlineTagNames.has(element.tagName);
  const displayProperty = element.style.display.split(" ")[0];
  if (displayProperty === "") return tagNameIsInline;
  if (displayProperty.startsWith("inline")) return true;
  if (displayProperty === "inherit" && element.parentElement) return isHtmlInlineElement(element.parentElement);
  if ([
    "contents",
    "initial",
    "none",
    "revert",
    "revert-layer",
    "unset"
  ].includes(displayProperty)) return tagNameIsInline;
  return false;
};
const isHtmlBlockElement = (node) => {
  if (!isHtmlElement(node)) return false;
  return !isHtmlInlineElement(node);
};
const LEADING_WHITESPACE_REGEX = /^\s+/;
const TRAILING_NEWLINE_REGEX = /\n$/;
const collapseString = (text, { shouldCollapseWhiteSpace = true, trimEnd = "collapse", trimStart = "collapse", whiteSpaceIncludesNewlines = true } = {}) => {
  let result = text;
  if (trimStart === "all") result = result.replace(LEADING_WHITESPACE_REGEX, "");
  if (trimEnd === "single-newline") result = result.replace(TRAILING_NEWLINE_REGEX, "");
  if (shouldCollapseWhiteSpace) if (whiteSpaceIncludesNewlines) result = result.replaceAll(/\s+/g, " ");
  else {
    result = result.replaceAll(/[^\S\n\r]+/g, " ");
    result = result.replaceAll(/^[^\S\n\r]+/gm, "");
    result = result.replaceAll(/[^\S\n\r]+$/gm, "");
  }
  return result;
};
const isLastNonEmptyTextOfInlineFormattingContext = (initialText) => {
  let currentNode = initialText;
  while (true) {
    if (currentNode.nextSibling) currentNode = currentNode.nextSibling;
    else {
      currentNode = currentNode.parentElement;
      if (currentNode && isHtmlBlockElement(currentNode)) return true;
      currentNode = currentNode?.nextSibling || null;
    }
    if (!currentNode) return true;
    if (isHtmlBlockElement(currentNode)) return true;
    if ((currentNode.textContent || "").length > 0) return false;
  }
};
const upsertInlineFormattingContext = (state) => {
  if (state.inlineFormattingContext) state.inlineFormattingContext.atStart = false;
  else state.inlineFormattingContext = {
    atStart: true,
    lastHasTrailingWhiteSpace: false
  };
};
const endInlineFormattingContext = (state) => {
  state.inlineFormattingContext = null;
};
const collapseWhiteSpaceText = (text, state) => {
  const textContent = text.textContent || "";
  const isWhiteSpaceOnly = textContent.trim() === "";
  if (state.inlineFormattingContext || !isWhiteSpaceOnly) upsertInlineFormattingContext(state);
  const { whiteSpaceRule } = state;
  const trimStart = (() => {
    if (whiteSpaceRule !== "normal") return "collapse";
    if (!state.inlineFormattingContext || state.inlineFormattingContext.atStart || state.inlineFormattingContext.lastHasTrailingWhiteSpace) return "all";
    return "collapse";
  })();
  const trimEnd = (() => {
    if (whiteSpaceRule === "normal") return "collapse";
    if (isLastNonEmptyTextOfInlineFormattingContext(text)) return "single-newline";
    return "collapse";
  })();
  const shouldCollapseWhiteSpace = {
    normal: true,
    pre: false,
    "pre-line": true
  }[whiteSpaceRule];
  const collapsedTextContent = collapseString(textContent || "", {
    shouldCollapseWhiteSpace,
    trimEnd,
    trimStart,
    whiteSpaceIncludesNewlines: whiteSpaceRule !== "pre-line"
  });
  if (state.inlineFormattingContext && shouldCollapseWhiteSpace) state.inlineFormattingContext.lastHasTrailingWhiteSpace = collapsedTextContent.endsWith(" ");
  text.textContent = collapsedTextContent;
};
const collapseWhiteSpaceNode = (node, state) => {
  if (isHtmlElement(node)) {
    collapseWhiteSpaceElement(node, state);
    return;
  }
  if (isHtmlText(node)) {
    collapseWhiteSpaceText(node, state);
    return;
  }
  collapseWhiteSpaceChildren(node, state);
};
const collapseWhiteSpaceChildren = (node, state) => {
  const childNodes = Array.from(node.childNodes);
  for (const childNode of childNodes) collapseWhiteSpaceNode(childNode, state);
};
const inferWhiteSpaceRule = (element) => {
  const whiteSpaceProperty = element.style.whiteSpace;
  switch (whiteSpaceProperty) {
    case "break-spaces":
    case "pre":
    case "pre-wrap":
      return "pre";
    case "normal":
    case "nowrap":
      return "normal";
    case "pre-line":
      return "pre-line";
  }
  if (element.tagName === "PRE") return "pre";
  if (whiteSpaceProperty === "initial") return "normal";
  return null;
};
const collapseWhiteSpaceElement = (element, state) => {
  const isInlineElement = isHtmlInlineElement(element);
  const previousWhiteSpaceRule = state.whiteSpaceRule;
  const inferredWhiteSpaceRule = inferWhiteSpaceRule(element);
  if (inferredWhiteSpaceRule) state.whiteSpaceRule = inferredWhiteSpaceRule;
  if (!isInlineElement) endInlineFormattingContext(state);
  collapseWhiteSpaceChildren(element, state);
  if (!isInlineElement) endInlineFormattingContext(state);
  state.whiteSpaceRule = previousWhiteSpaceRule;
};
const collapseWhiteSpace = (element) => {
  const clonedElement = element.cloneNode(true);
  collapseWhiteSpaceElement(clonedElement, {
    inlineFormattingContext: null,
    whiteSpaceRule: "normal"
  });
  return clonedElement;
};
const deserializeHtmlNodeChildren = (editor, node, isSlateParent = false) => Array.from(node.childNodes).flatMap((child) => {
  if (child.nodeType === 1 && !isSlateNode(child) && isSlateParent) return deserializeHtmlNodeChildren(editor, child, isSlateParent);
  return deserializeHtmlNode(editor)(child);
});
const htmlBodyToFragment = (editor, element) => {
  if (element.nodeName === "BODY") return jsx("fragment", {}, deserializeHtmlNodeChildren(editor, element));
};
const htmlBrToNewLine = (node) => {
  if (node.nodeName === "BR") return "\n";
};
const getDefaultNodeProps = ({ element, type }) => {
  if (!isSlatePluginNode(element, type) && !isSlateLeaf(element)) return;
  const dataAttributes = {};
  Object.entries(element.dataset).forEach(([key, value]) => {
    if (key.startsWith("slate") && value && ![
      "slateInline",
      "slateLeaf",
      "slateNode",
      "slateVoid"
    ].includes(key)) {
      const attributeKey = key.slice(5).charAt(0).toLowerCase() + key.slice(6);
      if (value === void 0) return;
      let parsedValue = value;
      if (value === "true") parsedValue = true;
      else if (value === "false") parsedValue = false;
      else if (!Number.isNaN(Number(value))) parsedValue = Number(value);
      dataAttributes[attributeKey] = parsedValue;
    }
  });
  if (Object.keys(dataAttributes).length > 0) return dataAttributes;
};
const getDataNodeProps = ({ editor, element, plugin }) => {
  const toNodeProps = plugin.parsers.html?.deserializer?.toNodeProps;
  const defaultNodeProps = plugin.parsers.html?.deserializer?.disableDefaultNodeProps ?? false ? {} : getDefaultNodeProps({
    ...getEditorPlugin$1(editor, plugin),
    element
  });
  if (!toNodeProps) return defaultNodeProps;
  const customNodeProps = toNodeProps({
    ...getEditorPlugin$1(editor, plugin),
    element
  }) ?? {};
  return {
    ...defaultNodeProps,
    ...customNodeProps
  };
};
const getDeserializedWithStaticRules = (plugin) => {
  let deserializer = plugin.parsers?.html?.deserializer;
  const rules = deserializer?.rules ?? [];
  const staticRules = rules.some((rule) => rule.validClassName?.includes(`slate-${plugin.key}`)) ? rules : [{
    validClassName: `slate-${plugin.key}`,
    validNodeName: "*"
  }, ...rules];
  if (!deserializer) deserializer = { rules: staticRules };
  deserializer.rules = staticRules;
  return deserializer;
};
const pluginDeserializeHtml = (editor, plugin, { deserializeLeaf, element: el }) => {
  const { node: { isElement: isElementRoot, isLeaf: isLeafRoot } } = plugin;
  const deserializer = getDeserializedWithStaticRules(plugin);
  if (!deserializer) return;
  const { attributeNames, isElement: isElementRule, isLeaf: isLeafRule, query, rules } = deserializer;
  let { parse } = deserializer;
  const isElement = isElementRule || isElementRoot;
  const isLeaf = isLeafRule || isLeafRoot;
  if (!deserializeLeaf && !isElement) return;
  if (deserializeLeaf && !isLeaf) return;
  if (rules) {
    if (!rules.some(({ validAttribute, validClassName, validNodeName = "*", validStyle }) => {
      if (validNodeName) {
        const validNodeNames = castArray(validNodeName);
        if (validNodeNames.length > 0 && !validNodeNames.includes(el.nodeName) && validNodeName !== "*") return false;
      }
      if (validClassName && !el.classList.contains(validClassName)) return false;
      if (validStyle) for (const [key, value] of Object.entries(validStyle)) {
        if (!castArray(value).includes(el.style[key]) && value !== "*") return false;
        if (value === "*" && !el.style[key]) return false;
        const defaultNodeValue = plugin.inject.nodeProps?.defaultNodeValue;
        if (defaultNodeValue && defaultNodeValue === el.style[key]) return false;
      }
      if (validAttribute) if (typeof validAttribute === "string") {
        if (!el.getAttributeNames().includes(validAttribute)) return false;
      } else for (const [attributeName, attributeValue] of Object.entries(validAttribute)) {
        const attributeValues = castArray(attributeValue);
        const elAttribute = el.getAttribute(attributeName);
        if (!isDefined(elAttribute) || !attributeValues.includes(elAttribute)) return false;
      }
      return true;
    })) return;
  }
  if (query && !query({
    ...getEditorPlugin$1(editor, plugin),
    element: el
  })) return;
  if (!parse) if (isElement) parse = ({ type }) => ({ type });
  else if (isLeaf) parse = ({ type }) => ({ [type]: true });
  else return;
  const parsedNode = (() => {
    if (isSlateNode(el)) return {};
    return parse({
      ...getEditorPlugin$1(editor, plugin),
      element: el,
      node: {}
    }) ?? {};
  })();
  const dataNodeProps = getDataNodeProps({
    editor,
    element: el,
    plugin
  });
  let node = {
    ...parsedNode,
    ...dataNodeProps
  };
  if (Object.keys(node).length === 0) return;
  getInjectedPlugins(editor, plugin).forEach((injectedPlugin) => {
    const res = injectedPlugin.parsers?.html?.deserializer?.parse?.({
      ...getEditorPlugin$1(editor, plugin),
      element: el,
      node
    });
    if (res && !isSlateNode(el)) node = {
      ...node,
      ...res
    };
  });
  if (attributeNames) {
    const elementAttributes = {};
    const elementAttributeNames = el.getAttributeNames();
    for (const elementAttributeName of elementAttributeNames) if (attributeNames.includes(elementAttributeName)) elementAttributes[elementAttributeName] = el.getAttribute(elementAttributeName);
    if (Object.keys(elementAttributes).length > 0) node.attributes = elementAttributes;
  }
  return {
    ...deserializer,
    node
  };
};
const pipeDeserializeHtmlElement = (editor, element) => {
  let result;
  [...editor.meta.pluginList].reverse().some((plugin) => {
    result = pluginDeserializeHtml(editor, plugin, { element });
    return !!result;
  });
  return result;
};
const htmlElementToElement = (editor, element, isSlate = false) => {
  const deserialized = pipeDeserializeHtmlElement(editor, element);
  if (deserialized) {
    const { node, withoutChildren } = deserialized;
    let descendants = node.children ?? deserializeHtmlNodeChildren(editor, element, isSlate);
    if (descendants.length === 0 || withoutChildren || isSlateVoid(element)) descendants = [{ text: "" }];
    return jsx("element", node, descendants);
  }
};
const pipeDeserializeHtmlLeaf = (editor, element) => {
  let node = {};
  [...editor.meta.pluginList].reverse().forEach((plugin) => {
    const deserialized = pluginDeserializeHtml(editor, plugin, {
      deserializeLeaf: true,
      element
    });
    if (!deserialized) return;
    node = {
      ...node,
      ...deserialized.node
    };
  });
  return node;
};
const htmlElementToLeaf = (editor, element) => {
  const node = pipeDeserializeHtmlLeaf(editor, element);
  return deserializeHtmlNodeChildren(editor, element).reduce((arr, child) => {
    if (!child) return arr;
    if (ElementApi.isElement(child)) {
      if (Object.keys(node).length > 0) mergeDeepToNodes({
        node: child,
        query: { filter: ([n]) => TextApi.isText(n) },
        source: node
      });
      arr.push(child);
    } else {
      const attributes = { ...node };
      if (TextApi.isText(child) && child.text) Object.keys(attributes).forEach((key) => {
        if (attributes[key] && child[key]) attributes[key] = child[key];
      });
      arr.push(jsx("text", attributes, child));
    }
    return arr;
  }, []);
};
const htmlTextNodeToString = (node) => {
  if (isHtmlText(node)) {
    if (node.parentElement?.dataset.platePreventDeserialization) return "";
    return node.textContent || "";
  }
};
const shouldBrBecomeEmptyParagraph = (node) => {
  if (node.nodeName !== "BR") return false;
  if (node.className === "Apple-interchange-newline") return false;
  const parent = node.parentElement;
  if (!parent) return false;
  if (parent.tagName === "P" || parent.tagName === "SPAN") return false;
  const hasAdjacentText = () => {
    let sibling = node.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent?.trim()) return true;
      sibling = sibling.previousSibling;
    }
    sibling = node.nextSibling;
    while (sibling) {
      if (sibling.nodeType === Node.TEXT_NODE && sibling.textContent?.trim()) return true;
      sibling = sibling.nextSibling;
    }
    return false;
  };
  if (hasAdjacentText()) return false;
  return true;
};
const deserializeHtmlNode = (editor) => (node) => {
  const textNode = htmlTextNodeToString(node);
  if (textNode) return textNode;
  if (!isHtmlElement(node)) return null;
  if (shouldBrBecomeEmptyParagraph(node)) return {
    children: [{ text: "" }],
    type: editor.getType("p")
  };
  if (node.nodeName === "BR" && node.className === "Apple-interchange-newline") return null;
  const breakLine = htmlBrToNewLine(node);
  if (breakLine) return breakLine;
  const fragment = htmlBodyToFragment(editor, node);
  if (fragment) return fragment;
  const element = htmlElementToElement(editor, node, isSlateNode(node));
  if (element) return element;
  return htmlElementToLeaf(editor, node);
};
const deserializeHtmlElement = (editor, element) => deserializeHtmlNode(editor)(element);
const htmlStringToDOMNode = (rawHtml) => {
  const node = document.createElement("body");
  node.innerHTML = rawHtml;
  return node;
};
const deserializeHtml = (editor, { collapseWhiteSpace: shouldCollapseWhiteSpace = true, defaultElementPlugin, element }) => {
  if (typeof element === "string") element = htmlStringToDOMNode(element);
  if (shouldCollapseWhiteSpace) element = collapseWhiteSpace(element);
  return normalizeDescendantsToDocumentFragment(editor, {
    defaultElementPlugin,
    descendants: deserializeHtmlElement(editor, element)
  });
};
const parseHtmlDocument = (html) => new DOMParser().parseFromString(html, "text/html");
const HtmlPlugin = createSlatePlugin({ key: "html" }).extendApi(({ editor }) => ({ deserialize: bindFirst(deserializeHtml, editor) })).extend({ parser: {
  format: "text/html",
  deserialize: ({ api, data }) => {
    const document$1 = parseHtmlDocument(data);
    return api.html.deserialize({ element: document$1.body });
  }
} });
const LengthPlugin = createTSlatePlugin({ key: "length" }).overrideEditor(({ editor, getOptions, tf: { apply } }) => ({ transforms: { apply(operation) {
  editor.tf.withoutNormalizing(() => {
    apply(operation);
    const options = getOptions();
    if (options.maxLength) {
      const length = editor.api.string([]).length;
      if (length > options.maxLength) {
        const overflowLength = length - options.maxLength;
        editor.tf.delete({
          distance: overflowLength,
          reverse: true,
          unit: "character"
        });
      }
    }
  });
} } }));
const withNodeId = ({ editor, getOptions, tf: { apply, insertNode, insertNodes } }) => {
  const idPropsCreator = () => ({ [getOptions().idKey ?? ""]: getOptions().idCreator() });
  const filterNode = (nodeEntry) => {
    const { filter, filterText } = getOptions();
    return filter(nodeEntry) && (!filterText || nodeEntry[0]?.type !== void 0);
  };
  const removeIdFromNodeIfDuplicate = (node) => {
    const { idKey = "", reuseId } = getOptions();
    if (!reuseId && editor.api.some({
      at: [],
      match: { [idKey]: node[idKey] }
    })) delete node[idKey];
  };
  const overrideIdIfSet = (node) => {
    const { idKey = "" } = getOptions();
    if (isDefined(node._id)) {
      const id = node._id;
      node._id = void 0;
      if (!editor.api.some({
        at: [],
        match: { [idKey]: id }
      })) node[idKey] = id;
    }
  };
  return { transforms: {
    apply(operation) {
      const { allow, disableInsertOverrides, exclude, idCreator, idKey = "", reuseId } = getOptions();
      const query = {
        allow,
        exclude,
        filter: filterNode
      };
      if (operation.type === "insert_node") {
        const node = cloneDeep(operation.node);
        applyDeepToNodes({
          apply: removeIdFromNodeIfDuplicate,
          node,
          query,
          source: {}
        });
        defaultsDeepToNodes({
          node,
          path: operation.path,
          query,
          source: idPropsCreator
        });
        if (!disableInsertOverrides) applyDeepToNodes({
          apply: overrideIdIfSet,
          node,
          query,
          source: {}
        });
        return apply({
          ...operation,
          node
        });
      }
      if (operation.type === "split_node") {
        const node = operation.properties;
        let id = operation.properties[idKey];
        if (queryNode([node, operation.path], query)) {
          if (!reuseId || id === void 0 || editor.api.some({
            at: [],
            match: { [idKey]: id }
          })) id = idCreator();
          return apply({
            ...operation,
            properties: {
              ...operation.properties,
              [idKey]: id
            }
          });
        }
        if (id) delete operation.properties[idKey];
      }
      return apply(operation);
    },
    insertNode(node) {
      const { disableInsertOverrides, idKey = "" } = getOptions();
      if (!disableInsertOverrides && node[idKey]) {
        if (!Object.isExtensible(node)) node = cloneDeep(node);
        node._id = node[idKey];
      }
      insertNode(node);
    },
    insertNodes(_nodes, options) {
      const nodes = castArray(_nodes).filter((node) => !!node);
      if (nodes.length === 0) return;
      const { disableInsertOverrides, idKey = "" } = getOptions();
      insertNodes(nodes.map((node) => {
        if (!disableInsertOverrides && node[idKey]) {
          if (!Object.isExtensible(node)) node = cloneDeep(node);
          node._id = node[idKey];
        }
        return node;
      }), options);
    }
  } };
};
const NodeIdPlugin = createTSlatePlugin({
  key: "nodeId",
  options: {
    filterInline: true,
    filterText: true,
    idKey: "id",
    normalizeInitialValue: false,
    filter: () => true,
    idCreator: () => nanoid(10)
  }
}).extendTransforms(({ editor, getOptions }) => ({ normalize() {
  const { allow, exclude, filter, filterInline, filterText, idKey } = getOptions();
  const addNodeId = (entry) => {
    const [node, path] = entry;
    if (!node[idKey] && queryNode([node, path], {
      allow,
      exclude,
      filter: (entry$1) => {
        const [node$1] = entry$1;
        if (filterText && !ElementApi.isElement(node$1)) return false;
        if (filterInline && ElementApi.isElement(node$1) && !editor.api.isBlock(node$1)) return false;
        return filter(entry$1);
      }
    })) {
      if (!editor.api.node(path)) return;
      editor.tf.withoutSaving(() => {
        editor.tf.setNodes({ [idKey]: getOptions().idCreator() }, { at: path });
      });
    }
    if (ElementApi.isElement(node)) node.children.forEach((child, index) => {
      addNodeId([child, [...path, index]]);
    });
  };
  editor.children.forEach((node, index) => {
    addNodeId([node, [index]]);
  });
} })).extend({ normalizeInitialValue: ({ editor, getOptions, tf }) => {
  const { normalizeInitialValue } = getOptions();
  if (!normalizeInitialValue) {
    const firstNode = editor.children[0];
    const lastNode = editor.children.at(-1);
    if (firstNode?.id && lastNode?.id) return;
  }
  tf.nodeId.normalize();
} }).overrideEditor(withNodeId);
const pipeOnNodeChange = (editor, node, prevNode, operation) => {
  return editor.meta.pluginCache.handlers.onNodeChange.some((key) => {
    const plugin = editor.getPlugin({ key });
    if (!plugin || editor.dom?.readOnly) return false;
    const handler = plugin.handlers?.onNodeChange;
    if (!handler) return false;
    const shouldTreatEventAsHandled = handler({
      editor,
      node,
      operation,
      plugin,
      prevNode
    });
    if (shouldTreatEventAsHandled != null) return shouldTreatEventAsHandled;
    return false;
  });
};
const pipeOnTextChange = (editor, node, text, prevText, operation) => {
  return editor.meta.pluginCache.handlers.onTextChange.some((key) => {
    const plugin = editor.getPlugin({ key });
    if (!plugin || editor.dom?.readOnly) return false;
    const handler = plugin.handlers?.onTextChange;
    if (!handler) return false;
    const shouldTreatEventAsHandled = handler({
      editor,
      node,
      operation,
      plugin,
      prevText,
      text
    });
    if (shouldTreatEventAsHandled != null) return shouldTreatEventAsHandled;
    return false;
  });
};
const DEFAULT = {
  handlers: true,
  inject: true,
  normalizeInitialValue: false,
  render: true
};
const isEditOnly = (readOnly, plugin, feature) => {
  if (!readOnly) return false;
  if (plugin.editOnly === true) return DEFAULT[feature];
  if (typeof plugin.editOnly === "object") return plugin.editOnly[feature] ?? DEFAULT[feature];
  return false;
};
const pipeNormalizeInitialValue = (editor) => {
  const value = editor.meta.isNormalizing;
  editor.meta.isNormalizing = true;
  editor.meta.pluginCache.normalizeInitialValue.forEach((key) => {
    const p = editor.getPlugin({ key });
    if (isEditOnly(editor.dom.readOnly, p, "normalizeInitialValue")) return;
    p.normalizeInitialValue?.({
      ...getEditorPlugin$1(editor, p),
      value: editor.children
    });
  });
  editor.meta.isNormalizing = value;
};
const init = (editor, { autoSelect, selection, shouldNormalizeEditor, value, onReady }) => {
  const onValueLoaded = (isAsync = false) => {
    if (!editor.children || editor.children?.length === 0) editor.children = editor.api.create.value();
    if (selection) editor.selection = selection;
    else if (autoSelect) {
      const target = (autoSelect === "start" ? "start" : "end") === "start" ? editor.api.start([]) : editor.api.end([]);
      editor.tf.select(target);
    }
    if (editor.children.length > 0) pipeNormalizeInitialValue(editor);
    if (shouldNormalizeEditor) editor.tf.normalize({ force: true });
    if (onReady) onReady({
      editor,
      isAsync,
      value: editor.children
    });
  };
  if (value === null) onValueLoaded();
  else if (typeof value === "string") {
    editor.children = editor.api.html.deserialize({ element: value });
    onValueLoaded();
  } else if (typeof value === "function") {
    const result = value(editor);
    if (result && typeof result.then === "function") result.then((resolvedValue) => {
      editor.children = resolvedValue;
      onValueLoaded(true);
    });
    else {
      editor.children = result;
      onValueLoaded();
    }
  } else if (value) {
    editor.children = value;
    onValueLoaded();
  } else onValueLoaded();
};
const insertExitBreak = (editor, { match, reverse } = {}) => {
  if (!editor.selection || !editor.api.isCollapsed()) return;
  const block = editor.api.block();
  if (!block) return;
  const ancestorPath = editor.api.above({
    at: block[1],
    match: combineMatchOptions(editor, (n, p) => p.length === 1 || p.length > 1 && !!n.type && !getPluginByType(editor, n.type)?.node.isStrictSiblings, { match })
  })?.[1] ?? block[1];
  const targetPath = reverse ? ancestorPath : PathApi.next(ancestorPath);
  if (!targetPath) return;
  editor.tf.insertNodes(editor.api.create.block(), {
    at: targetPath,
    select: true
  });
  return true;
};
const resetBlock = (editor, { at } = {}) => {
  const entry = editor.api.block({ at });
  if (!entry?.[0]) return;
  const [block, path] = entry;
  editor.tf.withoutNormalizing(() => {
    const { id, type, ...otherProps } = NodeApi.extractProps(block);
    Object.keys(otherProps).forEach((key) => {
      editor.tf.unsetNodes(key, { at: path });
    });
    const paragraphType = editor.getType(BaseParagraphPlugin.key);
    if (block.type !== paragraphType) editor.tf.setNodes({ type: paragraphType }, { at: path });
  });
  return true;
};
const setValue = (editor, value) => {
  let children = value;
  if (typeof value === "string") children = editor.api.html.deserialize({ element: value });
  else if (!value || value.length === 0) children = editor.api.create.value();
  editor.tf.replaceNodes(children, {
    at: [],
    children: true
  });
};
const SlateExtensionPlugin = createTSlatePlugin({
  key: "slateExtension",
  options: {
    onNodeChange: () => {
    },
    onTextChange: () => {
    }
  }
}).extendEditorTransforms(({ editor, getOption, tf: { apply } }) => ({
  init: bindFirst(init, editor),
  insertExitBreak: bindFirst(insertExitBreak, editor),
  resetBlock: bindFirst(resetBlock, editor),
  setValue: bindFirst(setValue, editor),
  apply(operation) {
    const noop = () => {
    };
    const hasNodeHandlers = editor.meta.pluginCache.handlers.onNodeChange.length > 0 || getOption("onNodeChange") !== noop;
    const hasTextHandlers = editor.meta.pluginCache.handlers.onTextChange.length > 0 || getOption("onTextChange") !== noop;
    if (!hasNodeHandlers && !hasTextHandlers) {
      apply(operation);
      return;
    }
    let prevNode;
    let node;
    let prevText;
    let text;
    let parentNode;
    if (OperationApi.isNodeOperation(operation) && hasNodeHandlers) switch (operation.type) {
      case "insert_node":
        prevNode = operation.node;
        node = operation.node;
        break;
      case "merge_node":
      case "move_node":
      case "set_node":
      case "split_node":
        prevNode = NodeApi.get(editor, operation.path);
        break;
      case "remove_node":
        prevNode = operation.node;
        node = operation.node;
        break;
    }
    else if (OperationApi.isTextOperation(operation) && hasTextHandlers) {
      const parentPath = PathApi.parent(operation.path);
      parentNode = NodeApi.get(editor, parentPath);
      prevText = NodeApi.get(editor, operation.path).text;
    }
    apply(operation);
    if (OperationApi.isNodeOperation(operation) && hasNodeHandlers) {
      switch (operation.type) {
        case "insert_node":
        case "remove_node":
          break;
        case "merge_node": {
          const prevPath = PathApi.previous(operation.path);
          if (prevPath) node = NodeApi.get(editor, prevPath);
          break;
        }
        case "move_node":
          node = NodeApi.get(editor, operation.newPath);
          break;
        case "set_node":
          node = NodeApi.get(editor, operation.path);
          break;
        case "split_node":
          node = NodeApi.get(editor, operation.path);
          break;
      }
      if (!node) node = prevNode;
      if (!pipeOnNodeChange(editor, node, prevNode, operation)) getOption("onNodeChange")({
        editor,
        node,
        operation,
        prevNode
      });
    }
    if (OperationApi.isTextOperation(operation) && hasTextHandlers) {
      const textNodeAfter = NodeApi.get(editor, operation.path);
      if (textNodeAfter) text = textNodeAfter.text;
      if (!pipeOnTextChange(editor, parentNode, text, prevText, operation)) getOption("onTextChange")({
        editor,
        node: parentNode,
        operation,
        prevText,
        text
      });
    }
  }
}));
const isInlineNode = (editor) => (node) => TextApi.isText(node) || ElementApi.isElement(node) && editor.api.isInline(node);
const makeBlockLazy = (type) => () => ({
  children: [],
  type
});
const hasDifferentChildNodes = (descendants, isInline) => descendants.some((descendant, index, arr) => {
  const prevDescendant = arr[index - 1];
  if (index !== 0) return isInline(descendant) !== isInline(prevDescendant);
  return false;
});
const normalizeDifferentNodeTypes = (descendants, isInline, makeDefaultBlock) => {
  const hasDifferentNodes = hasDifferentChildNodes(descendants, isInline);
  const { fragment } = descendants.reduce((memo, node) => {
    if (hasDifferentNodes && isInline(node)) {
      let block = memo.precedingBlock;
      if (!block) {
        block = makeDefaultBlock();
        memo.precedingBlock = block;
        memo.fragment.push(block);
      }
      block.children.push(node);
    } else {
      memo.fragment.push(node);
      memo.precedingBlock = null;
    }
    return memo;
  }, {
    fragment: [],
    precedingBlock: null
  });
  return fragment;
};
const normalizeEmptyChildren = (descendants) => {
  if (descendants.length === 0) return [{ text: "" }];
  return descendants;
};
const normalize = (descendants, isInline, makeDefaultBlock) => {
  descendants = normalizeEmptyChildren(descendants);
  descendants = normalizeDifferentNodeTypes(descendants, isInline, makeDefaultBlock);
  descendants = descendants.map((node) => {
    if (ElementApi.isElement(node)) return {
      ...node,
      children: normalize(node.children, isInline, makeDefaultBlock)
    };
    return node;
  });
  return descendants;
};
const normalizeDescendantsToDocumentFragment = (editor, { defaultElementPlugin = BaseParagraphPlugin, descendants }) => {
  return normalize(descendants, isInlineNode(editor), makeBlockLazy(editor.getType(defaultElementPlugin.key)));
};
const pipeInsertDataQuery = (editor, plugins, options) => plugins.every((p) => {
  const query = p.parser?.query;
  return !query || query({
    ...getEditorPlugin$1(editor, p),
    ...options
  });
});
const ParserPlugin = createSlatePlugin({ key: "parser" }).overrideEditor(({ editor, tf: { insertData } }) => ({ transforms: { insertData(dataTransfer) {
  if ([...editor.meta.pluginList].reverse().some((plugin) => {
    const parser = plugin.parser;
    if (!parser) return false;
    const injectedPlugins = getInjectedPlugins(editor, plugin);
    const { deserialize, format, mimeTypes } = parser;
    if (!format && !mimeTypes) return false;
    const mimeTypeList = mimeTypes || (Array.isArray(format) ? format : format ? [format] : []).map((fmt) => fmt.includes("/") ? fmt : `text/${fmt}`);
    for (const mimeType of mimeTypeList) {
      let data = dataTransfer.getData(mimeType);
      if (mimeType !== "Files" && !data || mimeType === "Files" && dataTransfer.files.length === 0) continue;
      if (!pipeInsertDataQuery(editor, injectedPlugins, {
        data,
        dataTransfer,
        mimeType
      })) continue;
      data = pipeTransformData(editor, injectedPlugins, {
        data,
        dataTransfer,
        mimeType
      });
      let fragment = deserialize?.({
        ...getEditorPlugin$1(editor, plugin),
        data,
        dataTransfer,
        mimeType
      });
      if (!fragment?.length) continue;
      fragment = pipeTransformFragment(editor, injectedPlugins, {
        data,
        dataTransfer,
        fragment,
        mimeType
      });
      if (fragment.length === 0) continue;
      pipeInsertFragment(editor, injectedPlugins, {
        data,
        dataTransfer,
        fragment,
        mimeType
      });
      return true;
    }
    return false;
  })) return;
  insertData(dataTransfer);
} } }));
const getCorePlugins = ({ affinity, chunking, maxLength, nodeId, plugins = [] }) => {
  let resolvedNodeId = nodeId;
  let corePlugins = [
    DebugPlugin,
    SlateExtensionPlugin,
    DOMPlugin,
    HistoryPlugin,
    OverridePlugin,
    ParserPlugin,
    maxLength ? LengthPlugin.configure({ options: { maxLength } }) : LengthPlugin,
    HtmlPlugin,
    AstPlugin,
    NodeIdPlugin.configure({
      enabled: resolvedNodeId !== false,
      options: resolvedNodeId === false ? void 0 : resolvedNodeId
    }),
    AffinityPlugin.configure({ enabled: affinity }),
    BaseParagraphPlugin,
    ChunkingPlugin.configure({
      enabled: chunking !== false,
      options: typeof chunking === "boolean" ? void 0 : chunking
    })
  ];
  const customPluginsMap = new Map(plugins.map((plugin) => [plugin.key, plugin]));
  corePlugins = corePlugins.map((corePlugin) => {
    const customPlugin = customPluginsMap.get(corePlugin.key);
    if (customPlugin) {
      const index = plugins.findIndex((p) => p.key === corePlugin.key);
      if (index !== -1) plugins.splice(index, 1);
      return customPlugin;
    }
    return corePlugin;
  });
  return corePlugins;
};
const withSlate = (e, { id, affinity = true, autoSelect, chunking = true, maxLength, nodeId, optionsStoreFactory, plugins = [], readOnly = false, rootPlugin, selection, shouldNormalizeEditor, skipInitialization, userId, value, onReady, ...pluginConfig } = {}) => {
  const editor = e;
  editor.id = id ?? editor.id ?? nanoid();
  editor.meta.key = editor.meta.key ?? nanoid();
  editor.meta.isFallback = false;
  editor.meta.userId = userId;
  editor.dom = {
    composing: false,
    currentKeyboardEvent: null,
    focused: false,
    prevSelection: null,
    readOnly
  };
  editor.getApi = () => editor.api;
  editor.getTransforms = () => editor.transforms;
  editor.getPlugin = (plugin) => getSlatePlugin(editor, plugin);
  editor.getType = (pluginKey) => getPluginType(editor, pluginKey);
  editor.getInjectProps = (plugin) => {
    const nodeProps = editor.getPlugin(plugin).inject?.nodeProps ?? {};
    nodeProps.nodeKey = nodeProps.nodeKey ?? editor.getType(plugin.key);
    nodeProps.styleKey = nodeProps.styleKey ?? nodeProps.nodeKey;
    return nodeProps;
  };
  editor.getOptionsStore = (plugin) => editor.getPlugin(plugin).optionsStore;
  editor.getOptions = (plugin) => {
    if (!editor.getOptionsStore(plugin)) return editor.getPlugin(plugin).options;
    return editor.getOptionsStore(plugin).get("state");
  };
  editor.getOption = (plugin, key, ...args) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return editor.getPlugin(plugin).options[key];
    if (!(key in store.get("state")) && !(key in store.selectors)) {
      editor.api.debug.error(`editor.getOption: ${key} option is not defined in plugin ${plugin.key}.`, "OPTION_UNDEFINED");
      return;
    }
    return store.get(key, ...args);
  };
  editor.setOption = (plugin, key, ...args) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return;
    if (!(key in store.get("state"))) {
      editor.api.debug.error(`editor.setOption: ${key} option is not defined in plugin ${plugin.key}.`, "OPTION_UNDEFINED");
      return;
    }
    store.set(key, ...args);
  };
  editor.setOptions = (plugin, options) => {
    const store = editor.getOptionsStore(plugin);
    if (!store) return;
    if (typeof options === "object") store.set("state", (draft) => {
      Object.assign(draft, options);
    });
    else if (typeof options === "function") store.set("state", options);
  };
  const corePlugins = getCorePlugins({
    affinity,
    chunking,
    maxLength,
    nodeId,
    plugins
  });
  let rootPluginInstance = createSlatePlugin({
    key: "root",
    priority: 1e4,
    ...pluginConfig,
    override: {
      ...pluginConfig.override,
      components: {
        ...pluginConfig.components,
        ...pluginConfig.override?.components
      }
    },
    plugins: [...corePlugins, ...plugins]
  });
  if (rootPlugin) rootPluginInstance = rootPlugin(rootPluginInstance);
  resolvePlugins(editor, [rootPluginInstance], optionsStoreFactory);
  const normalizeNode = editor.tf.normalizeNode;
  editor.tf.normalizeNode = (...args) => {
    if (!editor.api.shouldNormalizeNode(args[0])) return;
    return normalizeNode(...args);
  };
  editor.normalizeNode = editor.tf.normalizeNode;
  if (!skipInitialization) editor.tf.init({
    autoSelect,
    selection,
    shouldNormalizeEditor,
    value,
    onReady
  });
  return editor;
};
const HOTKEYS = {
  bold: "mod+b",
  compose: [
    "down",
    "left",
    "right",
    "up",
    "backspace",
    "enter"
  ],
  deleteBackward: "shift?+backspace",
  deleteForward: "shift?+delete",
  escape: "escape",
  extendBackward: "shift+left",
  extendDownward: "shift+down",
  extendForward: "shift+right",
  extendUpward: "shift+up",
  insertSoftBreak: "shift+enter",
  italic: "mod+i",
  moveBackward: "left",
  moveDownward: "down",
  moveForward: "right",
  moveUpward: "up",
  moveWordBackward: "ctrl+left",
  moveWordForward: "ctrl+right",
  selectAll: "mod+a",
  splitBlock: "enter",
  tab: "tab",
  undo: "mod+z",
  untab: "shift+tab"
};
const APPLE_HOTKEYS = {
  deleteBackward: ["ctrl+backspace", "ctrl+h"],
  deleteForward: ["ctrl+delete", "ctrl+d"],
  deleteLineBackward: "cmd+shift?+backspace",
  deleteLineForward: ["cmd+shift?+delete", "ctrl+k"],
  deleteWordBackward: "opt+shift?+backspace",
  deleteWordForward: "opt+shift?+delete",
  extendLineBackward: "opt+shift+up",
  extendLineForward: "opt+shift+down",
  moveLineBackward: "opt+up",
  moveLineForward: "opt+down",
  moveWordBackward: "opt+left",
  moveWordForward: "opt+right",
  redo: "cmd+shift+z",
  transposeCharacter: "ctrl+t"
};
const WINDOWS_HOTKEYS = {
  deleteWordBackward: "ctrl+shift?+backspace",
  deleteWordForward: "ctrl+shift?+delete",
  redo: ["ctrl+y", "ctrl+shift+z"]
};
const createHotkey = (key) => {
  const generic = HOTKEYS[key];
  const apple = APPLE_HOTKEYS[key];
  const windows = WINDOWS_HOTKEYS[key];
  const isGeneric = generic && libExports.isKeyHotkey(generic);
  const isApple = apple && libExports.isKeyHotkey(apple);
  const isWindows = windows && libExports.isKeyHotkey(windows);
  return (event) => {
    if (isGeneric?.(event)) return true;
    if (IS_APPLE && isApple?.(event)) return true;
    if (!IS_APPLE && isWindows?.(event)) return true;
    return false;
  };
};
const createComposing = (key) => (editor, event, { composing } = {}) => {
  if (!createHotkey(key)(event)) return false;
  if (!!composing !== editor.api.isComposing()) return false;
  return true;
};
const Hotkeys = {
  isBold: createHotkey("bold"),
  isCompose: createHotkey("compose"),
  isDeleteBackward: createHotkey("deleteBackward"),
  isDeleteForward: createHotkey("deleteForward"),
  isDeleteLineBackward: createHotkey("deleteLineBackward"),
  isDeleteLineForward: createHotkey("deleteLineForward"),
  isDeleteWordBackward: createHotkey("deleteWordBackward"),
  isDeleteWordForward: createHotkey("deleteWordForward"),
  isEscape: createHotkey("escape"),
  isExtendBackward: createHotkey("extendBackward"),
  isExtendDownward: createHotkey("extendDownward"),
  isExtendForward: createHotkey("extendForward"),
  isExtendLineBackward: createHotkey("extendLineBackward"),
  isExtendLineForward: createHotkey("extendLineForward"),
  isExtendUpward: createHotkey("extendUpward"),
  isItalic: createHotkey("italic"),
  isMoveBackward: createHotkey("moveBackward"),
  isMoveDownward: createHotkey("moveDownward"),
  isMoveForward: createHotkey("moveForward"),
  isMoveLineBackward: createHotkey("moveLineBackward"),
  isMoveLineForward: createHotkey("moveLineForward"),
  isMoveUpward: createHotkey("moveUpward"),
  isMoveWordBackward: createHotkey("moveWordBackward"),
  isMoveWordForward: createHotkey("moveWordForward"),
  isRedo: createHotkey("redo"),
  isSelectAll: createHotkey("selectAll"),
  isSoftBreak: createHotkey("insertSoftBreak"),
  isSplitBlock: createHotkey("splitBlock"),
  isTab: createComposing("tab"),
  isTransposeCharacter: createHotkey("transposeCharacter"),
  isUndo: createHotkey("undo"),
  isUntab: createComposing("untab")
};
const traverseHtmlNode = (node, callback) => {
  if (!callback(node)) return;
  let child = node.firstChild;
  while (child) {
    const currentChild = child;
    const previousChild = child.previousSibling;
    child = child.nextSibling;
    traverseHtmlNode(currentChild, callback);
    if (!currentChild.previousSibling && !currentChild.nextSibling && !currentChild.parentNode && child && previousChild !== child.previousSibling && child.parentNode) child = previousChild ? previousChild.nextSibling : node.firstChild;
    else if (!currentChild.previousSibling && !currentChild.nextSibling && !currentChild.parentNode && child && !child.previousSibling && !child.nextSibling && !child.parentNode) {
      if (previousChild) child = previousChild.nextSibling ? previousChild.nextSibling.nextSibling : null;
      else if (node.firstChild) child = node.firstChild.nextSibling;
    }
  }
};
const traverseHtmlElements = (rootNode, callback) => {
  traverseHtmlNode(rootNode, (node) => {
    if (!isHtmlElement(node)) return true;
    return callback(node);
  });
};
const findHtmlElement = (rootNode, predicate) => {
  let res = null;
  traverseHtmlElements(rootNode, (node) => {
    if (predicate(node)) {
      res = node;
      return false;
    }
    return true;
  });
  return res;
};
const someHtmlElement = (rootNode, predicate) => !!findHtmlElement(rootNode, predicate);
const pluginInjectNodeProps = (editor, plugin, nodeProps, getElementPath) => {
  const { key, inject: { nodeProps: injectNodeProps } } = plugin;
  const { element, text } = nodeProps;
  const node = element ?? text;
  if (!node) return;
  if (!injectNodeProps) return;
  const { classNames, defaultNodeValue, nodeKey = editor.getType(key), query, styleKey = nodeKey, transformClassName, transformNodeValue, transformProps, transformStyle, validNodeValues } = injectNodeProps;
  if (!getInjectMatch(editor, plugin)(node, getElementPath(node))) return;
  const queryResult = query?.({
    ...injectNodeProps,
    ...getEditorPlugin$1(editor, plugin),
    nodeProps
  });
  if (query && !queryResult) return;
  const nodeValue = node[nodeKey];
  if (!transformProps && (!isDefined(nodeValue) || validNodeValues && !validNodeValues.includes(nodeValue) || nodeValue === defaultNodeValue)) return;
  const transformOptions = {
    ...nodeProps,
    ...getEditorPlugin$1(editor, plugin),
    nodeValue
  };
  const value = transformNodeValue?.(transformOptions) ?? nodeValue;
  transformOptions.value = value;
  let newProps = {};
  if (element && nodeKey && nodeValue) newProps.className = `slate-${nodeKey}-${nodeValue}`;
  if (classNames?.[nodeValue] || transformClassName) newProps.className = transformClassName?.(transformOptions) ?? classNames?.[value];
  if (styleKey) newProps.style = transformStyle?.(transformOptions) ?? { [styleKey]: value };
  if (transformProps) newProps = transformProps({
    ...transformOptions,
    props: newProps
  }) ?? newProps;
  return newProps;
};
const pipeInjectNodeProps = (editor, nodeProps, getElementPath, readOnly = false) => {
  editor.meta.pluginCache.inject.nodeProps.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    const newAttributes = pluginInjectNodeProps(editor, plugin, nodeProps, getElementPath);
    if (isEditOnly(readOnly, plugin, "inject")) return;
    if (!newAttributes) return;
    const attributes = nodeProps.attributes;
    nodeProps.attributes = {
      ...attributes,
      ...newAttributes,
      className: clsx(attributes?.className, newAttributes.className) || void 0,
      style: {
        ...attributes?.style,
        ...newAttributes.style
      }
    };
  });
  return nodeProps;
};
const pipeDecorate = (editor, decorateProp) => {
  if (editor.meta.pluginCache.decorate.length === 0 && !decorateProp) return;
  return (entry) => {
    let ranges = [];
    const addRanges = (newRanges) => {
      if (newRanges?.length) ranges = [...ranges, ...newRanges];
    };
    editor.meta.pluginCache.decorate.forEach((key) => {
      const plugin = editor.getPlugin({ key });
      addRanges(plugin.decorate({
        ...getEditorPlugin$1(editor, plugin),
        entry
      }));
    });
    if (decorateProp) addRanges(decorateProp({
      editor,
      entry
    }));
    return ranges;
  };
};
const getDefaultView = (value) => value?.ownerDocument?.defaultView || null;
const isDOMElement = (value) => isDOMNode(value) && value.nodeType === 1;
const isDOMNode = (value) => {
  const window$1 = getDefaultView(value);
  return !!window$1 && value instanceof window$1.Node;
};
const isDOMText = (value) => isDOMNode(value) && value.nodeType === 3;
const getPlainText = (domNode) => {
  let text = "";
  if (isDOMText(domNode) && domNode.nodeValue) return domNode.nodeValue;
  if (isDOMElement(domNode)) {
    for (const childNode of Array.from(domNode.childNodes)) text += getPlainText(childNode);
    const display = getComputedStyle(domNode).getPropertyValue("display");
    if (display === "block" || display === "list" || domNode.tagName === "BR") text += "\n";
  }
  return text;
};
const getSelectedDomFragment = (editor) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return [];
  const _domBlocks = selection.getRangeAt(0).cloneContents().querySelectorAll('[data-slate-node="element"][data-slate-id]');
  const domBlocks = Array.from(_domBlocks);
  if (domBlocks.length === 0) return [];
  const nodes = [];
  domBlocks.forEach((node, index) => {
    const blockId = node.dataset.slateId;
    const block = editor.api.node({
      id: blockId,
      at: []
    });
    if (!block || block[1].length !== 1) return;
    if ((index === 0 || index === domBlocks.length - 1) && node.textContent?.trim() !== NodeApi.string(block[0]) && ElementApi.isElement(block[0]) && !editor.api.isVoid(block[0])) {
      const html = document.createElement("div");
      html.append(node);
      const results = editor.api.html.deserialize({ element: html });
      nodes.push(results[0]);
    } else nodes.push(block[0]);
  });
  return nodes;
};
const getSelectedDomNode = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const htmlFragment = selection.getRangeAt(0).cloneContents();
  const div = document.createElement("div");
  div.append(htmlFragment);
  return div;
};
const isSelectOutside = (html) => {
  const domNodes = html ?? getSelectedDomNode();
  if (!domNodes) return false;
  return !!domNodes?.querySelector('[data-slate-editor="true"]');
};
DOMPlugin.extendEditorApi(({ editor }) => ({ getFragment() {
  return getSelectedDomFragment(editor);
} })).overrideEditor(({ editor, tf: { setFragmentData } }) => ({ transforms: { setFragmentData(data, originEvent) {
  if (originEvent !== "copy") return setFragmentData(data, originEvent);
  const fragment = getSelectedDomFragment(editor);
  const html = getSelectedDomNode();
  if (!html || !fragment) return;
  if (isSelectOutside(html)) return;
  if (fragment.length > 0) {
    const string = JSON.stringify(fragment);
    const encoded = window.btoa(encodeURIComponent(string));
    data.setData("application/x-slate-fragment", encoded);
    data.setData("text/html", html.innerHTML);
    data.setData("text/plain", getPlainText(html));
  }
} } }));
const useNodeAttributes$1 = (props, ref) => ({
  ...props.attributes,
  className: clsx(props.attributes.className, props.className) || void 0,
  ref,
  style: {
    ...props.attributes.style,
    ...props.style
  }
});
const SlateElement = React.forwardRef(function SlateElement$1({ as: Tag = "div", children, ...props }, ref) {
  const attributes = useNodeAttributes$1(props, ref);
  const block = !!props.element.id && !!props.editor.api.isBlock(props.element);
  return /* @__PURE__ */ React.createElement(Tag, {
    "data-slate-node": "element",
    "data-slate-inline": attributes["data-slate-inline"],
    "data-block-id": block ? props.element.id : void 0,
    ...attributes,
    style: {
      position: "relative",
      ...attributes?.style
    }
  }, children);
});
const SlateText = React.forwardRef(({ as: Tag = "span", children, ...props }, ref) => {
  const attributes = useNodeAttributes$1(props, ref);
  return /* @__PURE__ */ React.createElement(Tag, attributes, children);
});
const NonBreakingSpace$1 = () => /* @__PURE__ */ React.createElement("span", {
  style: {
    fontSize: 0,
    lineHeight: 0
  },
  contentEditable: false
}, String.fromCodePoint(160));
const SlateLeaf = React.forwardRef(({ as: Tag = "span", children, inset, ...props }, ref) => {
  const attributes = useNodeAttributes$1(props, ref);
  if (inset) return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NonBreakingSpace$1, null), /* @__PURE__ */ React.createElement(Tag, attributes, children, /* @__PURE__ */ React.createElement(NonBreakingSpace$1, null)));
  return /* @__PURE__ */ React.createElement(Tag, attributes, children);
});
const getNodeDataAttributes = (editor, node, { isElement, isLeaf, isText }) => {
  return Object.keys(node).reduce((acc, key) => {
    if (typeof node[key] === "object") return acc;
    if (isElement && key === "children") return acc;
    if ((isLeaf || isText) && key === "text") return acc;
    const plugin = editor.getPlugin({ key });
    if (isLeaf && plugin?.node.isLeaf && plugin?.node.isDecoration !== true) return acc;
    if (isText && plugin?.node.isLeaf && plugin?.node.isDecoration !== false) return acc;
    const attributeName = keyToDataAttribute(key);
    acc[attributeName] = node[key];
    return acc;
  }, {});
};
const getPluginDataAttributes = (editor, plugin, node) => {
  const isElement = plugin.node.isElement;
  const dataAttributes = getNodeDataAttributes(editor, node, {
    isElement,
    isLeaf: plugin.node.isLeaf && plugin.node.isDecoration === true,
    isText: plugin.node.isLeaf && plugin.node.isDecoration === false
  });
  const customAttributes = plugin.node.toDataAttributes?.({
    ...plugin ? getEditorPlugin$1(editor, plugin) : {},
    node
  }) ?? {};
  return {
    ...dataAttributes,
    ...customAttributes
  };
};
const getRenderNodeStaticProps = ({ attributes: nodeAttributes, editor, node, plugin, props }) => {
  let newProps = {
    ...props,
    ...plugin ? getEditorPlugin$1(editor, plugin) : {
      api: editor.api,
      editor,
      tf: editor.transforms
    }
  };
  const { className } = props;
  const pluginProps = getPluginNodeProps({
    attributes: nodeAttributes,
    node,
    plugin,
    props: newProps
  });
  newProps = {
    ...pluginProps,
    attributes: {
      ...pluginProps.attributes,
      className: clsx(getSlateClass(plugin?.node.type), className) || void 0
    }
  };
  newProps = pipeInjectNodeProps(editor, newProps, (node$1) => editor.api.findPath(node$1));
  if (newProps.style && Object.keys(newProps.style).length === 0) newProps.style = void 0;
  return newProps;
};
const pluginRenderElementStatic = (editor, plugin) => function render(nodeProps) {
  const element = nodeProps.element;
  const Component = editor.meta.components?.[plugin.key];
  const Element = Component ?? SlateElement;
  let { children } = nodeProps;
  const dataAttributes = getPluginDataAttributes(editor, plugin, element);
  nodeProps = getRenderNodeStaticProps({
    attributes: {
      ...element.attributes,
      ...dataAttributes
    },
    editor,
    node: element,
    plugin,
    props: nodeProps
  });
  editor.meta.pluginCache.render.belowNodes.forEach((key) => {
    const hoc = editor.getPlugin({ key }).render.belowNodes({
      ...nodeProps,
      key
    });
    if (hoc) children = hoc({
      ...nodeProps,
      children
    });
  });
  const defaultProps = Component ? {} : { as: plugin.render?.as };
  let component = /* @__PURE__ */ React.createElement(Element, {
    ...defaultProps,
    ...nodeProps
  }, children, editor.meta.pluginCache.render.belowRootNodes.map((key) => {
    const Component$1 = editor.getPlugin({ key }).render.belowRootNodes;
    return /* @__PURE__ */ React.createElement(Component$1, {
      key,
      ...defaultProps,
      ...nodeProps
    });
  }));
  editor.meta.pluginCache.render.aboveNodes.forEach((key) => {
    const hoc = editor.getPlugin({ key }).render.aboveNodes({
      ...nodeProps,
      key
    });
    if (hoc) component = hoc({
      ...nodeProps,
      children: component
    });
  });
  return component;
};
const pipeRenderElementStatic = (editor, { renderElement: renderElementProp } = {}) => function render(props) {
  const plugin = getPluginByType(editor, props.element.type);
  if (plugin?.node.isElement) return pluginRenderElementStatic(editor, plugin)(props);
  if (renderElementProp) return renderElementProp(props);
  const ctxProps = getRenderNodeStaticProps({
    editor,
    props: { ...props }
  });
  return /* @__PURE__ */ React.createElement(SlateElement, ctxProps, props.children, editor.meta.pluginCache.render.belowRootNodes.map((key) => {
    const Component = editor.getPlugin({ key }).render.belowRootNodes;
    return /* @__PURE__ */ React.createElement(Component, {
      key,
      ...ctxProps
    });
  }));
};
const pluginRenderTextStatic = (editor, plugin) => function render(nodeProps) {
  const { children, text } = nodeProps;
  if (text[plugin.node.type ?? plugin.key]) {
    const Component = editor.meta.components?.[plugin.key];
    const Text = Component ?? SlateText;
    const ctxProps = getRenderNodeStaticProps({
      attributes: { ...text.attributes },
      editor,
      node: text,
      plugin,
      props: nodeProps
    });
    const defaultProps = Component ? {} : { as: plugin.render?.as };
    return /* @__PURE__ */ React.createElement(Text, {
      ...defaultProps,
      ...ctxProps
    }, children);
  }
  return children;
};
const pipeRenderTextStatic = (editor, { renderText: renderTextProp } = {}) => {
  const renderTexts = [];
  const textPropsPlugins = [];
  editor.meta.pluginCache.node.isText.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) renderTexts.push(pluginRenderTextStatic(editor, plugin));
  });
  editor.meta.pluginCache.node.textProps.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) textPropsPlugins.push(plugin);
  });
  return function render({ attributes, ...props }) {
    renderTexts.forEach((render$1) => {
      const newChildren = render$1(props);
      if (newChildren !== void 0) props.children = newChildren;
    });
    textPropsPlugins.forEach((plugin) => {
      if (props.text[plugin.node.type ?? plugin.key]) {
        const pluginTextProps = typeof plugin.node.textProps === "function" ? plugin.node.textProps(props) : plugin.node.textProps ?? {};
        if (pluginTextProps.className) pluginTextProps.className = clsx(props.className, pluginTextProps.className);
        attributes = {
          ...attributes,
          ...pluginTextProps
        };
      }
    });
    if (renderTextProp) return renderTextProp({
      attributes,
      ...props
    });
    const ctxProps = getRenderNodeStaticProps({
      editor,
      props: {
        attributes,
        ...props
      }
    });
    const text = ctxProps.text;
    const dataAttributes = getNodeDataAttributes(editor, text, { isText: true });
    return /* @__PURE__ */ React.createElement(SlateText, {
      ...ctxProps,
      attributes: {
        ...ctxProps.attributes,
        ...dataAttributes
      }
    });
  };
};
function BaseElementStatic({ decorate, decorations, editor, element = {
  children: [],
  type: ""
} }) {
  const renderElement = pipeRenderElementStatic(editor);
  const attributes = {
    "data-slate-node": "element",
    ref: null
  };
  let children = /* @__PURE__ */ React.createElement(Children, {
    decorate,
    decorations,
    editor
  }, element.children);
  if (editor.api.isVoid(element)) {
    attributes["data-slate-void"] = true;
    children = /* @__PURE__ */ React.createElement("span", {
      style: {
        color: "transparent",
        height: "0",
        outline: "none",
        position: "absolute"
      },
      "data-slate-spacer": true
    }, /* @__PURE__ */ React.createElement(Children, {
      decorate,
      decorations,
      editor
    }, element.children));
  }
  if (editor.api.isInline(element)) attributes["data-slate-inline"] = true;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderElement?.({
    attributes,
    children,
    element
  }));
}
const ElementStatic = React.memo(BaseElementStatic, (prev, next) => (prev.element === next.element || prev.element._memo !== void 0 && prev.element._memo === next.element._memo) && isElementDecorationsEqual(prev.decorations, next.decorations));
function BaseLeafStatic({ decorations, editor, text = { text: "" } }) {
  const renderLeaf = pipeRenderLeafStatic(editor);
  const renderText = pipeRenderTextStatic(editor);
  const leafElements = TextApi.decorations(text, decorations).map(({ leaf, position }, index) => {
    const leafElement = renderLeaf({
      attributes: { "data-slate-leaf": true },
      children: /* @__PURE__ */ React.createElement("span", { "data-slate-string": true }, leaf.text === "" ? "\uFEFF" : leaf.text),
      leaf,
      leafPosition: position,
      text: leaf
    });
    return /* @__PURE__ */ React.createElement(React.Fragment, { key: index }, leafElement);
  });
  return renderText({
    attributes: {
      "data-slate-node": "text",
      ref: null
    },
    children: leafElements,
    text
  });
}
const LeafStatic = React.memo(BaseLeafStatic, (prev, next) => {
  return TextApi.equals(next.text, prev.text) && isTextDecorationsEqual(next.decorations, prev.decorations);
});
const defaultDecorate = () => [];
function Children({ children = [], decorate = defaultDecorate, decorations = [], editor }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children.map((child, i) => {
    const p = editor.api.findPath(child);
    let ds = [];
    if (p) {
      const range = editor.api.range(p);
      ds = decorate([child, p]);
      for (const dec of decorations) {
        const d = RangeApi.intersection(dec, range);
        if (d) ds.push(d);
      }
    }
    return ElementApi.isElement(child) ? /* @__PURE__ */ React.createElement(ElementStatic, {
      key: i,
      decorate,
      decorations: ds,
      editor,
      element: child
    }) : /* @__PURE__ */ React.createElement(LeafStatic, {
      key: i,
      decorations: ds,
      editor,
      text: child
    });
  }));
}
const pluginRenderLeafStatic = (editor, plugin) => function render(props) {
  const { children, leaf } = props;
  if (leaf[plugin.node.type]) {
    const Component = plugin.render.leaf ?? editor.meta.components?.[plugin.key];
    const Leaf = Component ?? SlateLeaf;
    const ctxProps = getRenderNodeStaticProps({
      attributes: { ...leaf.attributes },
      editor,
      node: leaf,
      plugin,
      props
    });
    const defaultProps = Component ? {} : { as: plugin.render?.as };
    return /* @__PURE__ */ React.createElement(Leaf, {
      ...defaultProps,
      ...ctxProps
    }, children);
  }
  return children;
};
const pipeRenderLeafStatic = (editor, { renderLeaf: renderLeafProp } = {}) => {
  const renderLeafs = [];
  const leafPropsPlugins = [];
  editor.meta.pluginCache.node.isLeaf.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) renderLeafs.push(pluginRenderLeafStatic(editor, plugin));
  });
  editor.meta.pluginCache.node.leafProps.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) leafPropsPlugins.push(plugin);
  });
  return function render({ attributes, ...props }) {
    renderLeafs.forEach((render$1) => {
      const newChildren = render$1(props);
      if (newChildren !== void 0) props.children = newChildren;
    });
    leafPropsPlugins.forEach((plugin) => {
      if (props.leaf[plugin.node.type]) {
        const pluginLeafProps = typeof plugin.node.leafProps === "function" ? plugin.node.leafProps(props) : plugin.node.leafProps ?? {};
        if (pluginLeafProps.className) pluginLeafProps.className = clsx(props.className, pluginLeafProps.className);
        attributes = {
          ...attributes,
          ...pluginLeafProps
        };
      }
    });
    if (renderLeafProp) return renderLeafProp({
      attributes,
      ...props
    });
    const ctxProps = getRenderNodeStaticProps({
      editor,
      props: {
        attributes,
        ...props
      }
    });
    const leaf = ctxProps.leaf;
    const dataAttributes = getNodeDataAttributes(editor, leaf, { isLeaf: true });
    return /* @__PURE__ */ React.createElement(SlateLeaf, {
      ...ctxProps,
      attributes: {
        ...ctxProps.attributes,
        ...dataAttributes
      }
    });
  };
};
const ContentVisibilityChunk = (t0) => {
  const $ = distExports.c(4);
  const { attributes, children, lowest } = t0;
  if (!lowest) return children;
  let t1;
  if ($[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    t1 = { contentVisibility: "auto" };
    $[0] = t1;
  } else t1 = $[0];
  let t2;
  if ($[1] !== attributes || $[2] !== children) {
    t2 = /* @__PURE__ */ React.createElement("div", {
      ...attributes,
      style: t1
    }, children);
    $[1] = attributes;
    $[2] = children;
    $[3] = t2;
  } else t2 = $[3];
  return t2;
};
const methodsToWrap = [
  "configure",
  "configurePlugin",
  "extendEditorApi",
  "extendSelectors",
  "extendApi",
  "extendEditorTransforms",
  "extendTransforms",
  "overrideEditor",
  "extend",
  "extendPlugin"
];
function toPlatePlugin(basePlugin, extendConfig) {
  const plugin = { ...basePlugin };
  methodsToWrap.forEach((method) => {
    const originalMethod = plugin[method];
    plugin[method] = (...args) => {
      return toPlatePlugin(originalMethod(...args));
    };
  });
  if (!extendConfig) return plugin;
  return plugin.extend(extendConfig);
}
const createPlatePlugin = (config = {}) => {
  return toPlatePlugin(createSlatePlugin(config));
};
function createTPlatePlugin(config = {}) {
  return createPlatePlugin(config);
}
function getEditorPlugin(editor, plugin) {
  return getEditorPlugin$1(editor, plugin);
}
function getPlugin(editor, plugin) {
  return editor.plugins[plugin.key] ?? createPlatePlugin({ key: plugin.key });
}
const SlateReactExtensionPlugin = toPlatePlugin(SlateExtensionPlugin, { handlers: { onKeyDown: ({ editor, event }) => {
  event.persist();
  editor.dom.currentKeyboardEvent = event;
  if (Hotkeys.isMoveUpward(event)) {
    if (editor.tf.moveLine({ reverse: true })) {
      event.preventDefault();
      event.stopPropagation();
    }
  } else if (Hotkeys.isMoveDownward(event)) {
    if (editor.tf.moveLine({ reverse: false })) {
      event.preventDefault();
      event.stopPropagation();
    }
  } else if (Hotkeys.isTab(editor, event) || Hotkeys.isUntab(editor, event)) {
    if (editor.tf.tab({ reverse: Hotkeys.isUntab(editor, event) })) {
      event.preventDefault();
      event.stopPropagation();
    }
  } else if (Hotkeys.isSelectAll(event)) {
    if (editor.tf.selectAll()) {
      event.preventDefault();
      event.stopPropagation();
    }
  } else if (Hotkeys.isEscape(event) && editor.tf.escape()) {
    event.preventDefault();
    event.stopPropagation();
  }
} } }).extendEditorApi(({ editor }) => ({ redecorate: () => {
  editor.api.debug.warn("The method editor.api.redecorate() has not been overridden. This may cause unexpected behavior. Please ensure that all required editor methods are properly defined.", "OVERRIDE_MISSING");
} })).extendEditorTransforms(({ editor, tf: { reset } }) => ({ reset(options) {
  const isFocused = editor.api.isFocused();
  reset(options);
  if (isFocused) editor.tf.focus({ edge: "startEditor" });
} })).overrideEditor(({ editor, tf: { normalizeNode } }) => ({ transforms: { normalizeNode(entry, options) {
  if (isDefined(entry[0]._memo)) {
    editor.tf.unsetNodes("_memo", { at: entry[1] });
    return;
  }
  normalizeNode(entry, options);
} } }));
const EventEditorStore = createZustandStore({
  blur: null,
  focus: null,
  last: null
}, {
  mutative: true,
  name: "event-editor"
});
const { useValue: useEventEditorValue } = EventEditorStore;
const FOCUS_EDITOR_EVENT = "focus-editor-event";
const BLUR_EDITOR_EVENT = "blur-editor-event";
const EventEditorPlugin = createPlatePlugin({
  key: "eventEditor",
  handlers: {
    onBlur: ({ editor }) => {
      if (EventEditorStore.get("focus") === editor.id) EventEditorStore.set("focus", null);
      EventEditorStore.set("blur", editor.id);
      document.dispatchEvent(new CustomEvent(BLUR_EDITOR_EVENT, { detail: { id: editor.id } }));
    },
    onFocus: ({ editor }) => {
      EventEditorStore.set("focus", editor.id);
      EventEditorStore.set("last", editor.id);
      document.dispatchEvent(new CustomEvent(FOCUS_EDITOR_EVENT, { detail: { id: editor.id } }));
    }
  }
});
const ParagraphPlugin = toPlatePlugin(BaseParagraphPlugin, ({ editor, type }) => ({ shortcuts: { toggleParagraph: {
  keys: [[
    Key.Mod,
    Key.Alt,
    "0"
  ], [
    Key.Mod,
    Key.Shift,
    "0"
  ]],
  preventDefault: true,
  handler: () => {
    editor.tf.toggleBlock(type);
  }
} } }));
const withPlateReact = ({ editor }) => withReact(editor);
const ReactPlugin = toPlatePlugin(DOMPlugin, {
  key: "dom",
  extendEditor: withPlateReact
});
const getPlateCorePlugins = () => [
  SlateReactExtensionPlugin,
  ReactPlugin,
  EventEditorPlugin,
  ParagraphPlugin
];
const withPlate = (e, options = {}) => {
  const { optionsStoreFactory, plugins = [], ...rest } = options;
  return withSlate(e, {
    ...rest,
    optionsStoreFactory: optionsStoreFactory ?? createZustandStore,
    plugins: [...getPlateCorePlugins(), ...plugins]
  });
};
const createPlateEditor = ({ editor = createEditor(), ...options } = {}) => withPlate(editor, options);
const createPlateFallbackEditor = (options = {}) => {
  const editor = createPlateEditor(options);
  editor.meta.isFallback = true;
  editor.apply = () => {
    throw new Error("Cannot apply operations on the fallback editor. The fallback editor is used when a hook that depends on the Plate store was unable to locate a valid store. If you are using PlateController, use `useEditorMounted(id?: string)` or `!editor.meta.isFallback` to ensure that a valid Plate store is available before attempting to call operations on the editor.");
  };
  return editor;
};
const DOM_HANDLERS = [
  "onCopy",
  "onCopyCapture",
  "onCut",
  "onCutCapture",
  "onPaste",
  "onPasteCapture",
  "onCompositionEnd",
  "onCompositionEndCapture",
  "onCompositionStart",
  "onCompositionStartCapture",
  "onCompositionUpdate",
  "onCompositionUpdateCapture",
  "onFocus",
  "onFocusCapture",
  "onBlur",
  "onBlurCapture",
  "onDOMBeforeInput",
  "onBeforeInput",
  "onBeforeInputCapture",
  "onInput",
  "onInputCapture",
  "onReset",
  "onResetCapture",
  "onSubmit",
  "onSubmitCapture",
  "onInvalid",
  "onInvalidCapture",
  "onLoad",
  "onLoadCapture",
  "onKeyDown",
  "onKeyDownCapture",
  "onKeyPress",
  "onKeyPressCapture",
  "onKeyUp",
  "onKeyUpCapture",
  "onAbort",
  "onAbortCapture",
  "onCanPlay",
  "onCanPlayCapture",
  "onCanPlayThrough",
  "onCanPlayThroughCapture",
  "onDurationChange",
  "onDurationChangeCapture",
  "onEmptied",
  "onEmptiedCapture",
  "onEncrypted",
  "onEncryptedCapture",
  "onEnded",
  "onEndedCapture",
  "onLoadedData",
  "onLoadedDataCapture",
  "onLoadedMetadata",
  "onLoadedMetadataCapture",
  "onLoadStart",
  "onLoadStartCapture",
  "onPause",
  "onPauseCapture",
  "onPlay",
  "onPlayCapture",
  "onPlaying",
  "onPlayingCapture",
  "onProgress",
  "onProgressCapture",
  "onRateChange",
  "onRateChangeCapture",
  "onSeeked",
  "onSeekedCapture",
  "onSeeking",
  "onSeekingCapture",
  "onStalled",
  "onStalledCapture",
  "onSuspend",
  "onSuspendCapture",
  "onTimeUpdate",
  "onTimeUpdateCapture",
  "onVolumeChange",
  "onVolumeChangeCapture",
  "onWaiting",
  "onWaitingCapture",
  "onAuxClick",
  "onAuxClickCapture",
  "onClick",
  "onClickCapture",
  "onContextMenu",
  "onContextMenuCapture",
  "onDoubleClick",
  "onDoubleClickCapture",
  "onDrag",
  "onDragCapture",
  "onDragEnd",
  "onDragEndCapture",
  "onDragEnter",
  "onDragEnterCapture",
  "onDragExit",
  "onDragExitCapture",
  "onDragLeave",
  "onDragLeaveCapture",
  "onDragOver",
  "onDragOverCapture",
  "onDragStart",
  "onDragStartCapture",
  "onDrop",
  "onDropCapture",
  "onMouseDown",
  "onMouseDownCapture",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseMoveCapture",
  "onMouseOut",
  "onMouseOutCapture",
  "onMouseOver",
  "onMouseOverCapture",
  "onMouseUp",
  "onMouseUpCapture",
  "onSelect",
  "onSelectCapture",
  "onTouchCancel",
  "onTouchCancelCapture",
  "onTouchEnd",
  "onTouchEndCapture",
  "onTouchMove",
  "onTouchMoveCapture",
  "onTouchStart",
  "onTouchStartCapture",
  "onPointerDown",
  "onPointerDownCapture",
  "onPointerMove",
  "onPointerUp",
  "onPointerUpCapture",
  "onPointerCancel",
  "onPointerCancelCapture",
  "onPointerEnter",
  "onPointerLeave",
  "onPointerOver",
  "onPointerOverCapture",
  "onPointerOut",
  "onPointerOutCapture",
  "onGotPointerCapture",
  "onGotPointerCaptureCapture",
  "onLostPointerCapture",
  "onLostPointerCaptureCapture",
  "onScroll",
  "onScrollCapture",
  "onWheel",
  "onWheelCapture",
  "onAnimationStart",
  "onAnimationStartCapture",
  "onAnimationEnd",
  "onAnimationEndCapture",
  "onAnimationIteration",
  "onAnimationIterationCapture",
  "onTransitionEnd",
  "onTransitionEndCapture"
];
const getRenderNodeProps = ({ attributes: nodeAttributes, disableInjectNodeProps, editor, plugin, props, readOnly }) => {
  let newProps = {
    ...props,
    ...plugin ? getEditorPlugin(editor, plugin) : {
      api: editor.api,
      editor,
      tf: editor.transforms
    }
  };
  const { className } = props;
  const pluginProps = getPluginNodeProps({
    attributes: nodeAttributes,
    plugin,
    props: newProps
  });
  newProps = {
    ...pluginProps,
    attributes: {
      ...pluginProps.attributes,
      className: clsx(getSlateClass(plugin?.node.type), pluginProps.attributes?.className, className) || void 0
    }
  };
  if (!disableInjectNodeProps) newProps = pipeInjectNodeProps(editor, newProps, (node) => editor.api.findPath(node), readOnly);
  if (newProps.attributes?.style && Object.keys(newProps.attributes.style).length === 0) newProps.attributes.style = void 0;
  return newProps;
};
const convertDomEventToSyntheticEvent = (domEvent) => {
  let propagationStopped = false;
  return {
    ...domEvent,
    bubbles: domEvent.bubbles,
    cancelable: domEvent.cancelable,
    currentTarget: domEvent.currentTarget,
    defaultPrevented: domEvent.defaultPrevented,
    eventPhase: domEvent.eventPhase,
    isTrusted: domEvent.isTrusted,
    nativeEvent: domEvent,
    target: domEvent.target,
    timeStamp: domEvent.timeStamp,
    type: domEvent.type,
    isDefaultPrevented: () => domEvent.defaultPrevented,
    isPropagationStopped: () => propagationStopped,
    persist: () => {
      throw new Error("persist is not implemented for synthetic events created using convertDomEventToSyntheticEvent");
    },
    preventDefault: () => domEvent.preventDefault(),
    stopPropagation: () => {
      propagationStopped = true;
      domEvent.stopPropagation();
    }
  };
};
const isEventHandled = (event, handler) => {
  if (!handler) return false;
  const shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) return shouldTreatEventAsHandled;
  return event.isPropagationStopped();
};
const pipeHandler = (editor, { editableProps, handlerKey }) => {
  const propsHandler = editableProps?.[handlerKey];
  const relevantPlugins = editor.meta.pluginList.filter((plugin) => plugin.handlers?.[handlerKey]);
  if (relevantPlugins.length === 0 && !propsHandler) return;
  return (event) => {
    const handledEvent = event instanceof Event ? convertDomEventToSyntheticEvent(event) : event;
    if (relevantPlugins.some((plugin) => {
      if (isEditOnly(editor.dom.readOnly, plugin, "handlers")) return false;
      const pluginHandler = plugin.handlers[handlerKey];
      const shouldTreatEventAsHandled = pluginHandler({
        ...getEditorPlugin(editor, plugin),
        event: handledEvent
      });
      if (shouldTreatEventAsHandled != null) return shouldTreatEventAsHandled;
      return false;
    })) return true;
    return isEventHandled(handledEvent, propsHandler);
  };
};
const pipeOnChange = (editor, value) => {
  return editor.meta.pluginCache.handlers.onChange.some((key) => {
    const plugin = getPlugin(editor, { key });
    if (isEditOnly(editor.dom.readOnly, plugin, "handlers")) return false;
    const handler = plugin.handlers.onChange;
    const shouldTreatEventAsHandled = handler({
      ...getEditorPlugin(editor, plugin),
      value
    });
    if (shouldTreatEventAsHandled != null) return shouldTreatEventAsHandled;
    return false;
  });
};
const useNodeAttributes = (props, ref) => {
  const $ = distExports.c(11);
  const t0 = props.attributes;
  let t1;
  if ($[0] !== props.attributes || $[1] !== props.className) {
    t1 = clsx(props.attributes.className, props.className) || void 0;
    $[0] = props.attributes;
    $[1] = props.className;
    $[2] = t1;
  } else t1 = $[2];
  const t2 = useComposedRef(ref, props.attributes.ref);
  const t3 = props.attributes;
  let t4;
  if ($[3] !== props.style || $[4] !== t3.style) {
    t4 = {
      ...t3.style,
      ...props.style
    };
    $[3] = props.style;
    $[4] = t3.style;
    $[5] = t4;
  } else t4 = $[5];
  let t5;
  if ($[6] !== props.attributes || $[7] !== t1 || $[8] !== t2 || $[9] !== t4) {
    t5 = {
      ...t0,
      className: t1,
      ref: t2,
      style: t4
    };
    $[6] = props.attributes;
    $[7] = t1;
    $[8] = t2;
    $[9] = t4;
    $[10] = t5;
  } else t5 = $[10];
  return t5;
};
const PlateElement = React.forwardRef(function PlateElement$1(t0, ref) {
  const $ = distExports.c(22);
  let children;
  let insetProp;
  let props;
  let t1;
  if ($[0] !== t0) {
    ({ as: t1, children, insetProp, ...props } = t0);
    $[0] = t0;
    $[1] = children;
    $[2] = insetProp;
    $[3] = props;
    $[4] = t1;
  } else {
    children = $[1];
    insetProp = $[2];
    props = $[3];
    t1 = $[4];
  }
  const Tag = t1 === void 0 ? "div" : t1;
  const attributes = useNodeAttributes(props, ref);
  const block = useEditorMounted() && !!props.element.id && !!props.editor.api.isBlock(props.element);
  const inset = insetProp ?? props.plugin?.rules.selection?.affinity === "directional";
  let t2;
  if ($[5] !== inset) {
    t2 = inset && /* @__PURE__ */ React.createElement(NonBreakingSpace, null);
    $[5] = inset;
    $[6] = t2;
  } else t2 = $[6];
  const t3 = attributes["data-slate-inline"];
  const t4 = block ? props.element.id : void 0;
  const t5 = attributes?.style;
  let t6;
  if ($[7] !== t5) {
    t6 = {
      position: "relative",
      ...t5
    };
    $[7] = t5;
    $[8] = t6;
  } else t6 = $[8];
  const t7 = t6;
  let t8;
  if ($[9] !== inset) {
    t8 = inset && /* @__PURE__ */ React.createElement(NonBreakingSpace, null);
    $[9] = inset;
    $[10] = t8;
  } else t8 = $[10];
  let t9;
  if ($[11] !== Tag || $[12] !== attributes || $[13] !== children || $[14] !== t3 || $[15] !== t4 || $[16] !== t7 || $[17] !== t8) {
    t9 = /* @__PURE__ */ React.createElement(Tag, {
      "data-slate-node": "element",
      "data-slate-inline": t3,
      "data-block-id": t4,
      ...attributes,
      style: t7
    }, children, t8);
    $[11] = Tag;
    $[12] = attributes;
    $[13] = children;
    $[14] = t3;
    $[15] = t4;
    $[16] = t7;
    $[17] = t8;
    $[18] = t9;
  } else t9 = $[18];
  let t10;
  if ($[19] !== t2 || $[20] !== t9) {
    t10 = /* @__PURE__ */ React.createElement(React.Fragment, null, t2, t9);
    $[19] = t2;
    $[20] = t9;
    $[21] = t10;
  } else t10 = $[21];
  return t10;
});
const PlateText = React.forwardRef((t0, ref) => {
  const $ = distExports.c(8);
  let children;
  let props;
  let t1;
  if ($[0] !== t0) {
    ({ as: t1, children, ...props } = t0);
    $[0] = t0;
    $[1] = children;
    $[2] = props;
    $[3] = t1;
  } else {
    children = $[1];
    props = $[2];
    t1 = $[3];
  }
  const Tag = t1 === void 0 ? "span" : t1;
  const attributes = useNodeAttributes(props, ref);
  let t2;
  if ($[4] !== Tag || $[5] !== attributes || $[6] !== children) {
    t2 = /* @__PURE__ */ React.createElement(Tag, attributes, children);
    $[4] = Tag;
    $[5] = attributes;
    $[6] = children;
    $[7] = t2;
  } else t2 = $[7];
  return t2;
});
const NonBreakingSpace = () => {
  const $ = distExports.c(2);
  let t0;
  if ($[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    t0 = {
      fontSize: 0,
      lineHeight: 0
    };
    $[0] = t0;
  } else t0 = $[0];
  let t1;
  if ($[1] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    t1 = /* @__PURE__ */ React.createElement("span", {
      style: t0,
      contentEditable: false
    }, String.fromCodePoint(160));
    $[1] = t1;
  } else t1 = $[1];
  return t1;
};
const PlateLeaf = React.forwardRef((t0, ref) => {
  const $ = distExports.c(15);
  let children;
  let insetProp;
  let props;
  let t1;
  if ($[0] !== t0) {
    ({ as: t1, children, inset: insetProp, ...props } = t0);
    $[0] = t0;
    $[1] = children;
    $[2] = insetProp;
    $[3] = props;
    $[4] = t1;
  } else {
    children = $[1];
    insetProp = $[2];
    props = $[3];
    t1 = $[4];
  }
  const Tag = t1 === void 0 ? "span" : t1;
  const attributes = useNodeAttributes(props, ref);
  if (insetProp ?? props.plugin?.rules.selection?.affinity === "hard") {
    let t2$1;
    if ($[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
      t2$1 = /* @__PURE__ */ React.createElement(NonBreakingSpace, null);
      $[5] = t2$1;
    } else t2$1 = $[5];
    let t3;
    if ($[6] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
      t3 = /* @__PURE__ */ React.createElement(NonBreakingSpace, null);
      $[6] = t3;
    } else t3 = $[6];
    let t4;
    if ($[7] !== Tag || $[8] !== attributes || $[9] !== children) {
      t4 = /* @__PURE__ */ React.createElement(React.Fragment, null, t2$1, /* @__PURE__ */ React.createElement(Tag, attributes, children, t3));
      $[7] = Tag;
      $[8] = attributes;
      $[9] = children;
      $[10] = t4;
    } else t4 = $[10];
    return t4;
  }
  let t2;
  if ($[11] !== Tag || $[12] !== attributes || $[13] !== children) {
    t2 = /* @__PURE__ */ React.createElement(Tag, attributes, children);
    $[11] = Tag;
    $[12] = attributes;
    $[13] = children;
    $[14] = t2;
  } else t2 = $[14];
  return t2;
});
const pluginRenderLeaf = (editor, plugin) => function render(props) {
  const { render: { leaf: leafComponent, node } } = plugin;
  const { children, leaf } = props;
  const readOnly = useReadOnly();
  if (isEditOnly(readOnly, plugin, "render")) return children;
  if (leaf[plugin.node.type]) {
    const Component = leafComponent ?? node;
    const Leaf = Component ?? PlateLeaf;
    const ctxProps = getRenderNodeProps({
      attributes: leaf.attributes,
      editor,
      plugin,
      props,
      readOnly
    });
    const defaultProps = Component ? {} : { as: plugin.render?.as };
    return /* @__PURE__ */ React.createElement(Leaf, {
      ...defaultProps,
      ...ctxProps
    }, children);
  }
  return children;
};
const pipeRenderLeaf = (editor, renderLeafProp) => {
  const renderLeafs = [];
  const leafPropsPlugins = [];
  editor.meta.pluginCache.node.isLeaf.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) renderLeafs.push(pluginRenderLeaf(editor, plugin));
  });
  editor.meta.pluginCache.node.leafProps.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (plugin) leafPropsPlugins.push(plugin);
  });
  return function render({ attributes, ...props }) {
    const readOnly = useReadOnly();
    renderLeafs.forEach((renderLeaf) => {
      const newChildren = renderLeaf(props);
      if (newChildren !== void 0) props.children = newChildren;
    });
    leafPropsPlugins.forEach((plugin) => {
      if (props.leaf[plugin.node.type]) {
        const pluginLeafProps = typeof plugin.node.leafProps === "function" ? plugin.node.leafProps(props) : plugin.node.leafProps ?? {};
        if (pluginLeafProps.className) pluginLeafProps.className = clsx(props.className, pluginLeafProps.className);
        attributes = {
          ...attributes,
          ...pluginLeafProps
        };
      }
    });
    if (renderLeafProp) return renderLeafProp({
      attributes,
      ...props
    });
    const ctxProps = getRenderNodeProps({
      editor,
      props: {
        attributes,
        ...props
      },
      readOnly
    });
    return /* @__PURE__ */ React.createElement(PlateLeaf, ctxProps, props.children);
  };
};
const pluginRenderText = (editor, plugin) => function render(nodeProps) {
  const { render: { node } } = plugin;
  const { children, text } = nodeProps;
  const readOnly = useReadOnly();
  if (isEditOnly(readOnly, plugin, "render")) return children;
  if (text[plugin.node.type ?? plugin.key]) {
    const Text = node ?? PlateText;
    const ctxProps = getRenderNodeProps({
      attributes: nodeProps.attributes,
      editor,
      plugin,
      props: nodeProps,
      readOnly
    });
    const defaultProps = node ? {} : { as: plugin.render?.as };
    return /* @__PURE__ */ React.createElement(Text, {
      ...defaultProps,
      ...ctxProps
    }, children);
  }
  return children;
};
const pipeRenderText = (editor, renderTextProp) => {
  const renderTexts = [];
  const textPropsPlugins = [];
  editor.meta.pluginList.forEach((plugin) => {
    if (plugin.node.isLeaf && plugin.node.isDecoration === false) renderTexts.push(pluginRenderText(editor, plugin));
    if (plugin.node.textProps) textPropsPlugins.push(plugin);
  });
  return function render({ attributes, ...props }) {
    const readOnly = useReadOnly();
    renderTexts.forEach((renderText) => {
      const newChildren = renderText(props);
      if (newChildren !== void 0) props.children = newChildren;
    });
    textPropsPlugins.forEach((plugin) => {
      if (props.text[plugin.node.type ?? plugin.key]) {
        const pluginTextProps = typeof plugin.node.textProps === "function" ? plugin.node.textProps(props) : plugin.node.textProps ?? {};
        if (pluginTextProps.className) pluginTextProps.className = clsx(props.className, pluginTextProps.className);
        attributes = {
          ...attributes,
          ...pluginTextProps
        };
      }
    });
    if (renderTextProp) return renderTextProp({
      attributes,
      ...props
    });
    const ctxProps = getRenderNodeProps({
      editor,
      props: {
        attributes,
        ...props
      },
      readOnly
    });
    return /* @__PURE__ */ React.createElement(PlateText, ctxProps, props.children);
  };
};
const useEditableProps = ({ disabled, readOnly, ...editableProps } = {}) => {
  const { id } = editableProps;
  const editor = useEditorRef(id);
  const store = usePlateStore(id);
  const versionDecorate = useAtomStoreValue(store, "versionDecorate");
  const storeDecorate = useAtomStoreValue(store, "decorate");
  const storeRenderChunk = useAtomStoreValue(store, "renderChunk");
  const storeRenderElement = useAtomStoreValue(store, "renderElement");
  const storeRenderLeaf = useAtomStoreValue(store, "renderLeaf");
  const storeRenderText = useAtomStoreValue(store, "renderText");
  const decorateMemo = React.useMemo(() => pipeDecorate(editor, storeDecorate ?? editableProps?.decorate), [
    editableProps?.decorate,
    editor,
    storeDecorate
  ]);
  const decorate = React.useMemo(() => {
    if (!versionDecorate || !decorateMemo) return;
    return (entry) => decorateMemo(entry);
  }, [decorateMemo, versionDecorate]);
  const defaultRenderChunk = usePluginOption(ChunkingPlugin, "contentVisibilityAuto") ? ContentVisibilityChunk : void 0;
  const renderChunk = storeRenderChunk ?? editableProps?.renderChunk ?? defaultRenderChunk;
  const renderElement = React.useMemo(() => pipeRenderElement(editor, storeRenderElement ?? editableProps?.renderElement), [
    editableProps?.renderElement,
    editor,
    storeRenderElement
  ]);
  const renderLeaf = React.useMemo(() => pipeRenderLeaf(editor, storeRenderLeaf ?? editableProps?.renderLeaf), [
    editableProps?.renderLeaf,
    editor,
    storeRenderLeaf
  ]);
  const renderText = React.useMemo(() => pipeRenderText(editor, storeRenderText ?? editableProps?.renderText), [
    editableProps?.renderText,
    editor,
    storeRenderText
  ]);
  const props = useDeepCompareMemo(() => {
    const _props = {
      decorate,
      renderChunk,
      renderElement,
      renderLeaf,
      renderText
    };
    DOM_HANDLERS.forEach((handlerKey) => {
      const handler = pipeHandler(editor, {
        editableProps,
        handlerKey
      });
      if (handler) _props[handlerKey] = handler;
    });
    return _props;
  }, [
    decorate,
    editableProps,
    renderChunk,
    renderElement,
    renderLeaf,
    renderText
  ]);
  return useDeepCompareMemo(() => ({
    ...omit(editableProps, [
      ...DOM_HANDLERS,
      "renderChunk",
      "renderElement",
      "renderLeaf",
      "renderText",
      "decorate"
    ]),
    ...props,
    "aria-disabled": disabled,
    className: clsx("slate-editor", "ignore-click-outside/toolbar", editableProps.className),
    "data-readonly": readOnly ? "true" : void 0,
    readOnly
  }), [
    editableProps,
    props,
    readOnly
  ]);
};
const useNodePath = (node) => {
  const $ = distExports.c(6);
  const editor = useEditorRef();
  let t0;
  if ($[0] !== editor.api || $[1] !== node) {
    t0 = () => editor.api.findPath(node);
    $[0] = editor.api;
    $[1] = node;
    $[2] = t0;
  } else t0 = $[2];
  let t1;
  if ($[3] !== editor || $[4] !== node) {
    t1 = [editor, node];
    $[3] = editor;
    $[4] = node;
    $[5] = t1;
  } else t1 = $[5];
  return useMemoizedSelector(t0, t1, _temp);
};
function _temp(a, b) {
  return !!a && !!b && PathApi.equals(a, b);
}
const useSlateProps = (t0) => {
  const $ = distExports.c(17);
  const { id } = t0;
  const editor = useEditorRef(id);
  const store = usePlateStore(id);
  const onChangeProp = useAtomStoreValue(store, "onChange");
  const onValueChangeProp = useAtomStoreValue(store, "onValueChange");
  const onSelectionChangeProp = useAtomStoreValue(store, "onSelectionChange");
  const updateVersionEditor = useIncrementVersion("versionEditor", id);
  const updateVersionSelection = useIncrementVersion("versionSelection", id);
  const updateVersionValue = useIncrementVersion("versionValue", id);
  let t1;
  if ($[0] !== editor || $[1] !== onChangeProp || $[2] !== updateVersionEditor) {
    t1 = (newValue) => {
      updateVersionEditor();
      if (!pipeOnChange(editor, newValue)) onChangeProp?.({
        editor,
        value: newValue
      });
    };
    $[0] = editor;
    $[1] = onChangeProp;
    $[2] = updateVersionEditor;
    $[3] = t1;
  } else t1 = $[3];
  const onChange = t1;
  let t2;
  if ($[4] !== editor || $[5] !== onValueChangeProp || $[6] !== updateVersionValue) {
    t2 = (value) => {
      updateVersionValue();
      onValueChangeProp?.({
        editor,
        value
      });
    };
    $[4] = editor;
    $[5] = onValueChangeProp;
    $[6] = updateVersionValue;
    $[7] = t2;
  } else t2 = $[7];
  const onValueChange = t2;
  let t3;
  if ($[8] !== editor || $[9] !== onSelectionChangeProp || $[10] !== updateVersionSelection) {
    t3 = (selection) => {
      updateVersionSelection();
      onSelectionChangeProp?.({
        editor,
        selection
      });
    };
    $[8] = editor;
    $[9] = onSelectionChangeProp;
    $[10] = updateVersionSelection;
    $[11] = t3;
  } else t3 = $[11];
  const onSelectionChange = t3;
  let t4;
  if ($[12] !== editor || $[13] !== onChange || $[14] !== onSelectionChange || $[15] !== onValueChange) {
    t4 = {
      key: editor.meta.key,
      editor,
      initialValue: editor.children,
      value: editor.children,
      onChange,
      onSelectionChange,
      onValueChange
    };
    $[12] = editor;
    $[13] = onChange;
    $[14] = onSelectionChange;
    $[15] = onValueChange;
    $[16] = t4;
  } else t4 = $[16];
  return t4;
};
const usePath = (pluginKey) => {
  const editor = useEditorRef();
  const value = useAtomStoreValue(useElementStore(pluginKey), "path");
  if (!value) {
    editor.api.debug.warn(`usePath(${pluginKey}) hook must be used inside the node component's context`, "USE_ELEMENT_CONTEXT");
    return;
  }
  return value;
};
const SCOPE_ELEMENT = "element";
const initialState = {
  element: null,
  entry: null,
  path: null
};
const { ElementProvider, useElementStore } = createAtomStore(initialState, {
  effect: Effect,
  name: "element",
  suppressWarnings: true
});
function Effect() {
  const $ = distExports.c(1);
  const path = usePath();
  if (path && PathApi.equals(path, [0])) {
    let t0;
    if ($[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
      t0 = /* @__PURE__ */ React.createElement(FirstBlockEffect, null);
      $[0] = t0;
    } else t0 = $[0];
    return t0;
  }
  return null;
}
function FirstBlockEffect() {
  const editor = useEditorRef();
  const store = usePlateStore();
  const composing = useComposing();
  const readOnly = useReadOnly();
  editor.dom.readOnly = readOnly;
  editor.dom.composing = composing;
  React.useLayoutEffect(() => {
    store.set("composing", composing);
  }, [composing, store]);
  return null;
}
function ElementContent(t0) {
  const $ = distExports.c(3);
  const { editor, plugin, ...t1 } = t0;
  let props = t1;
  const element = useElement();
  const readOnly = useReadOnly();
  if (isEditOnly(readOnly, plugin, "render")) return null;
  const { children: _children } = props;
  const Component = plugin.render?.node;
  const Element = Component ?? PlateElement;
  props = getRenderNodeProps({
    attributes: element.attributes,
    editor,
    plugin,
    props,
    readOnly
  });
  let children = _children;
  editor.meta.pluginCache.render.belowNodes.forEach((key) => {
    const plugin_0 = editor.getPlugin({ key });
    const withHOC$1 = plugin_0.render.belowNodes;
    const hoc = withHOC$1({
      ...props,
      key
    });
    if (hoc && !isEditOnly(readOnly, plugin_0, "render")) children = hoc({
      ...props,
      children
    });
  });
  let t2;
  if ($[0] !== Component || $[1] !== plugin.render?.as) {
    t2 = Component ? {} : { as: plugin.render?.as };
    $[0] = Component;
    $[1] = plugin.render?.as;
    $[2] = t2;
  } else t2 = $[2];
  const defaultProps = t2;
  let component = /* @__PURE__ */ React.createElement(Element, {
    ...defaultProps,
    ...props
  }, children, /* @__PURE__ */ React.createElement(BelowRootNodes, {
    ...defaultProps,
    ...props
  }));
  editor.meta.pluginCache.render.aboveNodes.forEach((key_0) => {
    const plugin_1 = editor.getPlugin({ key: key_0 });
    const withHOC_0 = plugin_1.render.aboveNodes;
    const hoc_0 = withHOC_0({
      ...props,
      key: key_0
    });
    if (hoc_0 && !isEditOnly(readOnly, plugin_1, "render")) component = hoc_0({
      ...props,
      children: component
    });
  });
  return component;
}
function BelowRootNodes(props) {
  const $ = distExports.c(6);
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  let t0;
  if ($[0] !== editor || $[1] !== props || $[2] !== readOnly) {
    t0 = editor.meta.pluginCache.render.belowRootNodes.map((key) => {
      const plugin = editor.getPlugin({ key });
      if (isEditOnly(readOnly, plugin, "render")) return null;
      const Component = plugin.render.belowRootNodes;
      return /* @__PURE__ */ React.createElement(Component, {
        key,
        ...props
      });
    });
    $[0] = editor;
    $[1] = props;
    $[2] = readOnly;
    $[3] = t0;
  } else t0 = $[3];
  let t1;
  if ($[4] !== t0) {
    t1 = /* @__PURE__ */ React.createElement(React.Fragment, null, t0);
    $[4] = t0;
    $[5] = t1;
  } else t1 = $[5];
  return t1;
}
const pluginRenderElement = (editor, plugin) => function render(props) {
  const { element, path } = props;
  return /* @__PURE__ */ React.createElement(ElementProvider, {
    element,
    entry: [element, path],
    path,
    scope: plugin.key
  }, /* @__PURE__ */ React.createElement(ElementContent, {
    editor,
    plugin,
    ...props
  }));
};
const pipeRenderElement = (editor, renderElementProp) => {
  return function render(props) {
    const readOnly = useReadOnly();
    const path = useNodePath(props.element);
    const plugin = getPluginByType(editor, props.element.type);
    if (plugin?.node.isElement) return pluginRenderElement(editor, plugin)({
      ...props,
      path
    });
    if (renderElementProp) return renderElementProp({
      ...props,
      path
    });
    const ctxProps = getRenderNodeProps({
      disableInjectNodeProps: true,
      editor,
      props: {
        ...props,
        path
      },
      readOnly
    });
    return /* @__PURE__ */ React.createElement(ElementProvider, {
      element: ctxProps.element,
      entry: [ctxProps.element, path],
      path,
      scope: ctxProps.element.type ?? "default"
    }, /* @__PURE__ */ React.createElement(PlateElement, ctxProps, props.children, /* @__PURE__ */ React.createElement(BelowRootNodes, ctxProps)));
  };
};
const { plateControllerStore, usePlateControllerStore: _usePlateControllerStore } = createAtomStore({
  activeId: atom(null),
  editorStores: atom({}),
  primaryEditorIds: atom([])
}, { name: "plateController" });
const usePlateControllerLocalStore = (options) => _usePlateControllerStore({
  scope: void 0,
  warnIfNoStore: false,
  ...{}
});
const usePlateControllerExists = () => {
  return !!usePlateControllerLocalStore().store;
};
const usePlateControllerStore = (idProp) => {
  const $ = distExports.c(2);
  let t0;
  if ($[0] !== idProp) {
    t0 = atom((get) => {
      const editorStores = get(plateControllerStore.atom.editorStores);
      const forId = (id) => {
        if (!id) return null;
        return editorStores[id] ?? null;
      };
      if (idProp) return forId(idProp);
      const lookupOrder = [get(plateControllerStore.atom.activeId), ...get(plateControllerStore.atom.primaryEditorIds)];
      for (const id_0 of lookupOrder) {
        const store = forId(id_0);
        if (store) return store;
      }
      return null;
    });
    $[0] = idProp;
    $[1] = t0;
  } else t0 = $[1];
  const storeAtom = t0;
  return useStoreAtomValue(usePlateControllerLocalStore(), storeAtom);
};
const createPlateStore = ({ id, composing = false, containerRef = { current: null }, decorate = null, editor, isMounted = false, primary = true, readOnly = null, renderChunk = null, renderElement = null, renderLeaf = null, renderText = null, scrollRef = { current: null }, versionDecorate = 1, versionEditor = 1, versionSelection = 1, versionValue = 1, onChange = null, onNodeChange = null, onSelectionChange = null, onTextChange = null, onValueChange = null, ...state } = {}) => createAtomStore({
  composing,
  containerRef,
  decorate,
  editor,
  isMounted,
  primary,
  readOnly,
  renderChunk,
  renderElement,
  renderLeaf,
  renderText,
  scrollRef,
  versionDecorate,
  versionEditor,
  versionSelection,
  versionValue,
  onChange,
  onNodeChange,
  onSelectionChange,
  onTextChange,
  onValueChange,
  ...state
}, {
  name: "plate",
  suppressWarnings: true,
  extend: (atoms) => ({
    trackedEditor: atom((get) => ({
      editor: get(atoms.editor),
      version: get(atoms.versionEditor)
    })),
    trackedSelection: atom((get) => ({
      selection: get(atoms.editor).selection,
      version: get(atoms.versionSelection)
    })),
    trackedValue: atom((get) => ({
      value: get(atoms.editor).children,
      version: get(atoms.versionValue)
    }))
  })
});
const { PlateProvider: PlateStoreProvider, plateStore, usePlateStore: usePlateLocalStore } = createPlateStore();
const { usePlateStore: useFallbackPlateStore } = createPlateStore();
const usePlateStore = (id) => {
  const localStore = usePlateLocalStore({
    scope: id,
    warnIfNoStore: false
  }) ?? null;
  const [localStoreExists] = React.useState(!!localStore.store);
  const store = localStoreExists ? localStore : usePlateControllerStore(id);
  const plateControllerExists = usePlateControllerExists();
  const fallbackStore = useFallbackPlateStore();
  if (!store) {
    if (plateControllerExists) return fallbackStore;
    throw new Error("Plate hooks must be used inside a Plate or PlateController");
  }
  return store;
};
const useEditorId = () => {
  return useAtomStoreValue(usePlateStore(), "editor").id;
};
const useEditorContainerRef = (id) => {
  return useAtomStoreValue(usePlateStore(id), "containerRef");
};
const useEditorMounted = (id) => {
  return !!useAtomStoreValue(usePlateStore(id), "isMounted");
};
const useEditorReadOnly = (id) => {
  return !!useAtomStoreValue(usePlateStore(id), "readOnly");
};
const useEditorComposing = (id) => {
  return !!useAtomStoreValue(usePlateStore(id), "composing");
};
const useEditorRef = (id) => {
  const store = usePlateStore(id);
  const editor = useAtomStoreValue(store, "editor") ?? createPlateFallbackEditor();
  editor.store = store;
  return editor;
};
const useIncrementVersion = (key, id) => {
  const $ = distExports.c(6);
  const previousVersionRef = React.useRef(1);
  const store = usePlateStore(id);
  const setVersionDecorate = useAtomStoreSet(store, "versionDecorate");
  const setVersionSelection = useAtomStoreSet(store, "versionSelection");
  const setVersionValue = useAtomStoreSet(store, "versionValue");
  const setVersionEditor = useAtomStoreSet(store, "versionEditor");
  let t0;
  if ($[0] !== key || $[1] !== setVersionDecorate || $[2] !== setVersionEditor || $[3] !== setVersionSelection || $[4] !== setVersionValue) {
    t0 = () => {
      const nextVersion = previousVersionRef.current + 1;
      bb2: switch (key) {
        case "versionDecorate":
          setVersionDecorate(nextVersion);
          break bb2;
        case "versionEditor":
          setVersionEditor(nextVersion);
          break bb2;
        case "versionSelection":
          setVersionSelection(nextVersion);
          break bb2;
        case "versionValue":
          setVersionValue(nextVersion);
      }
      previousVersionRef.current = nextVersion;
    };
    $[0] = key;
    $[1] = setVersionDecorate;
    $[2] = setVersionEditor;
    $[3] = setVersionSelection;
    $[4] = setVersionValue;
    $[5] = t0;
  } else t0 = $[5];
  return t0;
};
const useRedecorate = (id) => {
  const $ = distExports.c(2);
  const updateDecorate = useIncrementVersion("versionDecorate", id);
  let t0;
  if ($[0] !== updateDecorate) {
    t0 = () => {
      updateDecorate();
    };
    $[0] = updateDecorate;
    $[1] = t0;
  } else t0 = $[1];
  return t0;
};
const useEditorSelector = (selector, deps, { id, equalityFn = (a, b) => a === b } = {}) => {
  const selectorAtom = React.useMemo(() => selectAtom(plateStore.atom.trackedEditor, ({ editor }, prev) => selector(editor, prev), equalityFn), deps);
  return useStoreAtomValue(usePlateStore(id), selectorAtom);
};
function usePluginOption(plugin, key, ...args) {
  return useEditorPluginOption(useEditorRef(), plugin, key, ...args);
}
function useEditorPluginOption(editor, plugin, key, ...args) {
  const store = editor.getOptionsStore(plugin);
  if (!store) return;
  if (!(key in store.get("state")) && !(key in store.selectors)) {
    editor.api.debug.error(`usePluginOption: ${key} option is not defined in plugin ${plugin.key}`, "OPTION_UNDEFINED");
    return;
  }
  return useStoreValue(store, key, ...args);
}
const useElement = (t0) => {
  const $ = distExports.c(1);
  const pluginKey = SCOPE_ELEMENT;
  const editor = useEditorRef();
  const value = useAtomStoreValue(useElementStore(pluginKey), "element");
  if (!value) {
    editor.api.debug.warn(`useElement(${pluginKey}) hook must be used inside the node component's context`, "USE_ELEMENT_CONTEXT");
    let t1;
    if ($[0] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
      t1 = {};
      $[0] = t1;
    } else t1 = $[0];
    return t1;
  }
  return value;
};
function EditorHotkeysEffect(t0) {
  const $ = distExports.c(4);
  const { id, editableRef } = t0;
  const editor = useEditorRef(id);
  let t1;
  if ($[0] !== editableRef || $[1] !== editor.meta.shortcuts || $[2] !== id) {
    t1 = /* @__PURE__ */ React.createElement(React.Fragment, null, Object.entries(editor.meta.shortcuts).map((t2) => {
      const [hotkeyString, hotkeyConfig] = t2;
      if (!hotkeyConfig || !isDefined(hotkeyConfig.keys) || !hotkeyConfig.handler) return null;
      return /* @__PURE__ */ React.createElement(HotkeyEffect, {
        id,
        key: hotkeyString,
        editableRef,
        hotkeyConfig
      });
    }));
    $[0] = editableRef;
    $[1] = editor.meta.shortcuts;
    $[2] = id;
    $[3] = t1;
  } else t1 = $[3];
  return t1;
}
function HotkeyEffect(t0) {
  const $ = distExports.c(15);
  const { id, editableRef, hotkeyConfig } = t0;
  const editor = useEditorRef(id);
  let handler;
  let keys;
  let options;
  if ($[0] !== hotkeyConfig) {
    ({ keys, handler, ...options } = hotkeyConfig);
    $[0] = hotkeyConfig;
    $[1] = handler;
    $[2] = keys;
    $[3] = options;
  } else {
    handler = $[1];
    keys = $[2];
    options = $[3];
  }
  let t1;
  if ($[4] !== editor || $[5] !== handler || $[6] !== options) {
    t1 = (event, eventDetails) => {
      if (handler({
        editor,
        event,
        eventDetails
      }) !== false && !isDefined(options.preventDefault)) {
        event.preventDefault();
        event.stopPropagation?.();
      }
    };
    $[4] = editor;
    $[5] = handler;
    $[6] = options;
    $[7] = t1;
  } else t1 = $[7];
  let t2;
  if ($[8] !== options) {
    t2 = {
      enableOnContentEditable: true,
      ...options
    };
    $[8] = options;
    $[9] = t2;
  } else t2 = $[9];
  let t3;
  if ($[10] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel")) {
    t3 = [];
    $[10] = t3;
  } else t3 = $[10];
  const setHotkeyRef = useHotkeys(keys, t1, t2, t3);
  let t4;
  let t5;
  if ($[11] !== editableRef || $[12] !== setHotkeyRef) {
    t4 = () => {
      if (editableRef.current) setHotkeyRef(editableRef.current);
    };
    t5 = [setHotkeyRef, editableRef];
    $[11] = editableRef;
    $[12] = setHotkeyRef;
    $[13] = t4;
    $[14] = t5;
  } else {
    t4 = $[13];
    t5 = $[14];
  }
  reactExports.useEffect(t4, t5);
  return null;
}
const EditorMethodsEffect = ({ id }) => {
  const editor = useEditorRef(id);
  const redecorate = useRedecorate(id);
  React.useEffect(() => {
    editor.api.redecorate = redecorate;
  }, [editor, redecorate]);
  return null;
};
function EditorRefPluginEffect({ id, plugin }) {
  const editor = useEditorRef(id);
  plugin.useHooks?.(getEditorPlugin(editor, plugin));
  return null;
}
function EditorRefEffect({ id }) {
  const store = usePlateStore(id);
  const editor = useAtomStoreValue(store, "editor");
  const setIsMounted = useAtomStoreSet(store, "isMounted");
  React.useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, editor.meta.pluginCache.useHooks.map((key) => /* @__PURE__ */ React.createElement(EditorRefPluginEffect, {
    id,
    key,
    plugin: getPlugin(editor, { key })
  })));
}
function checkPlateInstances() {
  globalThis.__PLATE_INSTANCES__ = (globalThis.__PLATE_INSTANCES__ || 0) + 1;
}
checkPlateInstances();
function usePlateInstancesWarn(disabled) {
  const $ = distExports.c(3);
  let t0;
  let t1;
  if ($[0] !== disabled) {
    t0 = () => {
      if (!disabled && globalThis.__PLATE_INSTANCES__ && globalThis.__PLATE_INSTANCES__ > 1) console.warn("Detected multiple @platejs/core instances!");
    };
    t1 = [disabled];
    $[0] = disabled;
    $[1] = t0;
    $[2] = t1;
  } else {
    t0 = $[1];
    t1 = $[2];
  }
  React.useEffect(t0, t1);
}
function PlateInner(t0) {
  const $ = distExports.c(15);
  const { children, containerRef, decorate, editor, primary, readOnly, renderElement, renderLeaf, scrollRef, onChange, onNodeChange, onSelectionChange, onTextChange, onValueChange } = t0;
  const t1 = readOnly ?? editor?.dom.readOnly;
  let t2;
  if ($[0] !== children || $[1] !== containerRef || $[2] !== decorate || $[3] !== editor || $[4] !== onChange || $[5] !== onNodeChange || $[6] !== onSelectionChange || $[7] !== onTextChange || $[8] !== onValueChange || $[9] !== primary || $[10] !== renderElement || $[11] !== renderLeaf || $[12] !== scrollRef || $[13] !== t1) {
    t2 = /* @__PURE__ */ React.createElement(PlateStoreProvider, {
      readOnly: t1,
      onChange,
      onNodeChange,
      onSelectionChange,
      onTextChange,
      onValueChange,
      containerRef,
      decorate,
      editor,
      primary,
      renderElement,
      renderLeaf,
      scope: editor.id,
      scrollRef
    }, children);
    $[0] = children;
    $[1] = containerRef;
    $[2] = decorate;
    $[3] = editor;
    $[4] = onChange;
    $[5] = onNodeChange;
    $[6] = onSelectionChange;
    $[7] = onTextChange;
    $[8] = onValueChange;
    $[9] = primary;
    $[10] = renderElement;
    $[11] = renderLeaf;
    $[12] = scrollRef;
    $[13] = t1;
    $[14] = t2;
  } else t2 = $[14];
  return t2;
}
function Plate(props) {
  const id = reactExports.useId();
  const containerRef = React.useRef(null);
  const scrollRef = React.useRef(null);
  usePlateInstancesWarn(props.suppressInstanceWarning);
  if (!props.editor) return null;
  props.editor.meta.uid = `e-${id.replaceAll(":", "")}`;
  return /* @__PURE__ */ React.createElement(PlateInner, {
    key: props.editor.meta.key,
    containerRef,
    scrollRef,
    ...props
  });
}
const PlateContainer = (t0) => {
  const $ = distExports.c(20);
  let children;
  let props;
  if ($[0] !== t0) {
    ({ children, ...props } = t0);
    $[0] = t0;
    $[1] = children;
    $[2] = props;
  } else {
    children = $[1];
    props = $[2];
  }
  const editor = useEditorRef();
  const readOnly = useEditorReadOnly();
  const containerRef = useEditorContainerRef();
  let afterContainer;
  let beforeContainer;
  let mainContainer;
  if ($[3] !== children || $[4] !== containerRef || $[5] !== editor || $[6] !== props || $[7] !== readOnly) {
    afterContainer = null;
    beforeContainer = null;
    let t1$1;
    if ($[11] !== children || $[12] !== containerRef || $[13] !== editor.meta.uid || $[14] !== props) {
      t1$1 = /* @__PURE__ */ React.createElement("div", {
        id: editor.meta.uid,
        ref: containerRef,
        ...props
      }, children);
      $[11] = children;
      $[12] = containerRef;
      $[13] = editor.meta.uid;
      $[14] = props;
      $[15] = t1$1;
    } else t1$1 = $[15];
    mainContainer = t1$1;
    editor.meta.pluginCache.render.beforeContainer.forEach((key) => {
      const plugin = editor.getPlugin({ key });
      if (isEditOnly(readOnly, plugin, "render")) return;
      const BeforeContainer = plugin.render.beforeContainer;
      beforeContainer = /* @__PURE__ */ React.createElement(React.Fragment, null, beforeContainer, /* @__PURE__ */ React.createElement(BeforeContainer, props));
    });
    editor.meta.pluginCache.render.afterContainer.forEach((key_0) => {
      const plugin_0 = editor.getPlugin({ key: key_0 });
      if (isEditOnly(readOnly, plugin_0, "render")) return;
      const AfterContainer = plugin_0.render.afterContainer;
      afterContainer = /* @__PURE__ */ React.createElement(React.Fragment, null, afterContainer, /* @__PURE__ */ React.createElement(AfterContainer, props));
    });
    $[3] = children;
    $[4] = containerRef;
    $[5] = editor;
    $[6] = props;
    $[7] = readOnly;
    $[8] = afterContainer;
    $[9] = beforeContainer;
    $[10] = mainContainer;
  } else {
    afterContainer = $[8];
    beforeContainer = $[9];
    mainContainer = $[10];
  }
  let t1;
  if ($[16] !== afterContainer || $[17] !== beforeContainer || $[18] !== mainContainer) {
    t1 = /* @__PURE__ */ React.createElement(React.Fragment, null, beforeContainer, mainContainer, afterContainer);
    $[16] = afterContainer;
    $[17] = beforeContainer;
    $[18] = mainContainer;
    $[19] = t1;
  } else t1 = $[19];
  return t1;
};
PlateContainer.displayName = "PlateContainer";
const PlateControllerEffect = (t0) => {
  const $ = distExports.c(23);
  const { id: idProp } = t0;
  const idFromStore = useEditorId();
  const id = idProp ?? idFromStore;
  let t1;
  if ($[0] !== id) {
    t1 = focusAtom(plateControllerStore.atom.editorStores, (optic) => optic.prop(id));
    $[0] = id;
    $[1] = t1;
  } else t1 = $[1];
  const currentStoreAtom = t1;
  const t2 = usePlateControllerLocalStore();
  let t3;
  if ($[2] !== currentStoreAtom || $[3] !== t2) {
    t3 = t2.setAtom(currentStoreAtom);
    $[2] = currentStoreAtom;
    $[3] = t2;
    $[4] = t3;
  } else t3 = $[4];
  let t4;
  if ($[5] !== currentStoreAtom) {
    t4 = [currentStoreAtom];
    $[5] = currentStoreAtom;
    $[6] = t4;
  } else t4 = $[6];
  const setCurrentStore = useStableFn(t3, t4);
  const setPrimaryEditorIds = useStableFn(useAtomStoreSet(usePlateControllerLocalStore(), "primaryEditorIds"));
  const setActiveId = useStableFn(useAtomStoreSet(usePlateControllerLocalStore(), "activeId"));
  const store = usePlateStore(id);
  const primary = useAtomStoreValue(store, "primary");
  const focused = useFocused();
  let t5;
  let t6;
  if ($[7] !== id || $[8] !== setActiveId || $[9] !== setCurrentStore || $[10] !== store) {
    t5 = () => {
      setCurrentStore(store ?? null);
      return () => {
        setCurrentStore(null);
        setActiveId((activeId) => activeId === id ? null : activeId);
      };
    };
    t6 = [
      store,
      setCurrentStore,
      setActiveId,
      id
    ];
    $[7] = id;
    $[8] = setActiveId;
    $[9] = setCurrentStore;
    $[10] = store;
    $[11] = t5;
    $[12] = t6;
  } else {
    t5 = $[11];
    t6 = $[12];
  }
  React.useEffect(t5, t6);
  let t7;
  let t8;
  if ($[13] !== id || $[14] !== primary || $[15] !== setPrimaryEditorIds) {
    t7 = () => {
      if (primary) {
        setPrimaryEditorIds((ids) => [...ids, id]);
        return () => {
          setPrimaryEditorIds((ids_0) => ids_0.filter((i) => i !== id));
        };
      }
    };
    t8 = [
      id,
      primary,
      setPrimaryEditorIds
    ];
    $[13] = id;
    $[14] = primary;
    $[15] = setPrimaryEditorIds;
    $[16] = t7;
    $[17] = t8;
  } else {
    t7 = $[16];
    t8 = $[17];
  }
  React.useEffect(t7, t8);
  let t10;
  let t9;
  if ($[18] !== focused || $[19] !== id || $[20] !== setActiveId) {
    t9 = () => {
      if (id && focused) setActiveId(id);
    };
    t10 = [
      id,
      focused,
      setActiveId
    ];
    $[18] = focused;
    $[19] = id;
    $[20] = setActiveId;
    $[21] = t10;
    $[22] = t9;
  } else {
    t10 = $[21];
    t9 = $[22];
  }
  React.useEffect(t9, t10);
  return null;
};
function PlateSlate(t0) {
  const $ = distExports.c(6);
  const { id, children } = t0;
  let t1;
  if ($[0] !== id) {
    t1 = { id };
    $[0] = id;
    $[1] = t1;
  } else t1 = $[1];
  const slateProps = useSlateProps(t1);
  const editor = useEditorRef(id);
  const t2 = slateProps;
  let aboveSlate;
  if ($[2] !== children || $[3] !== editor || $[4] !== t2) {
    aboveSlate = /* @__PURE__ */ React.createElement(Slate, t2, children);
    editor.meta.pluginCache.render.aboveSlate.forEach((key) => {
      const AboveSlate = editor.getPlugin({ key }).render.aboveSlate;
      aboveSlate = /* @__PURE__ */ React.createElement(AboveSlate, null, aboveSlate);
    });
    $[2] = children;
    $[3] = editor;
    $[4] = t2;
    $[5] = aboveSlate;
  } else aboveSlate = $[5];
  return aboveSlate;
}
const PlateContent = React.forwardRef(({ autoFocusOnEditable, readOnly: readOnlyProp, renderEditable, ...props }, ref) => {
  const { id } = props;
  const editor = useEditorRef(id);
  const storeReadOnly = useEditorReadOnly();
  const readOnly = props.disabled ? true : readOnlyProp ?? storeReadOnly;
  editor.dom.readOnly = readOnly;
  if (!editor) throw new Error("Editor not found. Please ensure that PlateContent is rendered below Plate.");
  const editableProps = useEditableProps({
    ...props,
    readOnly
  });
  const editableRef = reactExports.useRef(null);
  const combinedRef = useComposedRef(ref, editableRef);
  if (!editor.children || editor.children.length === 0) return null;
  const editable = /* @__PURE__ */ React.createElement(Editable, {
    ref: combinedRef,
    ...editableProps
  });
  let afterEditable = null;
  let beforeEditable = null;
  editor.meta.pluginCache.render.beforeEditable.forEach((key) => {
    const plugin = editor.getPlugin({ key });
    if (isEditOnly(readOnly, plugin, "render")) return;
    const BeforeEditable = plugin.render.beforeEditable;
    beforeEditable = /* @__PURE__ */ React.createElement(React.Fragment, null, beforeEditable, /* @__PURE__ */ React.createElement(BeforeEditable, editableProps));
  });
  editor.meta.pluginCache.render.afterEditable.forEach((key_0) => {
    const plugin_0 = editor.getPlugin({ key: key_0 });
    if (isEditOnly(readOnly, plugin_0, "render")) return;
    const AfterEditable = plugin_0.render.afterEditable;
    afterEditable = /* @__PURE__ */ React.createElement(React.Fragment, null, afterEditable, /* @__PURE__ */ React.createElement(AfterEditable, editableProps));
  });
  let aboveEditable = /* @__PURE__ */ React.createElement(React.Fragment, null, renderEditable ? renderEditable(editable) : editable, /* @__PURE__ */ React.createElement(EditorMethodsEffect, { id }), /* @__PURE__ */ React.createElement(EditorHotkeysEffect, {
    id,
    editableRef
  }), /* @__PURE__ */ React.createElement(EditorRefEffect, { id }), /* @__PURE__ */ React.createElement(PlateControllerEffect, { id }));
  editor.meta.pluginCache.render.aboveEditable.forEach((key_1) => {
    const plugin_1 = editor.getPlugin({ key: key_1 });
    if (isEditOnly(readOnly, plugin_1, "render")) return;
    const AboveEditable = plugin_1.render.aboveEditable;
    aboveEditable = /* @__PURE__ */ React.createElement(AboveEditable, null, aboveEditable);
  });
  return /* @__PURE__ */ React.createElement(PlateSlate, { id }, /* @__PURE__ */ React.createElement(EditorStateEffect, {
    id,
    disabled: props.disabled,
    readOnly: readOnlyProp,
    autoFocusOnEditable,
    editor
  }), beforeEditable, aboveEditable, afterEditable);
});
PlateContent.displayName = "PlateContent";
function EditorStateEffect(t0) {
  const $ = distExports.c(25);
  const { id, autoFocusOnEditable, disabled, editor, readOnly } = t0;
  const store = usePlateStore(id);
  let t1;
  if ($[0] !== disabled || $[1] !== readOnly || $[2] !== store) {
    t1 = () => {
      if (disabled) {
        store.setReadOnly(true);
        return;
      }
      if (isDefined(readOnly)) store.setReadOnly(readOnly);
    };
    $[0] = disabled;
    $[1] = readOnly;
    $[2] = store;
    $[3] = t1;
  } else t1 = $[3];
  let t2;
  if ($[4] !== disabled || $[5] !== editor.dom || $[6] !== readOnly || $[7] !== store) {
    t2 = [
      disabled,
      editor.dom,
      readOnly,
      store
    ];
    $[4] = disabled;
    $[5] = editor.dom;
    $[6] = readOnly;
    $[7] = store;
    $[8] = t2;
  } else t2 = $[8];
  React.useLayoutEffect(t1, t2);
  const onNodeChange = useAtomStoreValue(store, "onNodeChange");
  let t3;
  let t4;
  if ($[9] !== editor || $[10] !== onNodeChange) {
    t3 = () => {
      if (onNodeChange) editor.setOption(SlateExtensionPlugin, "onNodeChange", onNodeChange);
    };
    t4 = [editor, onNodeChange];
    $[9] = editor;
    $[10] = onNodeChange;
    $[11] = t3;
    $[12] = t4;
  } else {
    t3 = $[11];
    t4 = $[12];
  }
  React.useLayoutEffect(t3, t4);
  const onTextChange = useAtomStoreValue(store, "onTextChange");
  let t5;
  let t6;
  if ($[13] !== editor || $[14] !== onTextChange) {
    t5 = () => {
      if (onTextChange) editor.setOption(SlateExtensionPlugin, "onTextChange", onTextChange);
    };
    t6 = [editor, onTextChange];
    $[13] = editor;
    $[14] = onTextChange;
    $[15] = t5;
    $[16] = t6;
  } else {
    t5 = $[15];
    t6 = $[16];
  }
  React.useLayoutEffect(t5, t6);
  const prevReadOnly = React.useRef(readOnly);
  let t7;
  if ($[17] !== autoFocusOnEditable || $[18] !== editor.tf || $[19] !== readOnly) {
    t7 = () => {
      if (autoFocusOnEditable && prevReadOnly.current && !readOnly) editor.tf.focus({ edge: "endEditor" });
      prevReadOnly.current = readOnly;
    };
    $[17] = autoFocusOnEditable;
    $[18] = editor.tf;
    $[19] = readOnly;
    $[20] = t7;
  } else t7 = $[20];
  let t8;
  if ($[21] !== autoFocusOnEditable || $[22] !== editor || $[23] !== readOnly) {
    t8 = [
      autoFocusOnEditable,
      editor,
      readOnly
    ];
    $[21] = autoFocusOnEditable;
    $[22] = editor;
    $[23] = readOnly;
    $[24] = t8;
  } else t8 = $[24];
  React.useEffect(t7, t8);
  return null;
}
function usePlateEditor(options = {}, deps = []) {
  const [, forceRender] = React.useState({});
  const isMountedRef = React.useRef(false);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return React.useMemo(() => {
    if (options.enabled === false) return null;
    return createPlateEditor({
      ...options,
      onReady: (ctx) => {
        if (ctx.isAsync && isMountedRef.current) forceRender({});
        options.onReady?.(ctx);
      }
    });
  }, [
    options.id,
    options.enabled,
    ...deps
  ]);
}
export {
  Plate as P,
  createTSlatePlugin as a,
  useEditorRef as b,
  createSlatePlugin as c,
  createTPlatePlugin as d,
  usePluginOption as e,
  useEditorReadOnly as f,
  useEditorComposing as g,
  createPlatePlugin as h,
  usePlateEditor as i,
  PlateContainer as j,
  PlateContent as k,
  someHtmlElement as s,
  toPlatePlugin as t,
  useEditorSelector as u
};
