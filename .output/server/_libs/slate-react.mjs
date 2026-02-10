import { g as getDirection } from "./direction.mjs";
import { t as throttle, j as debounce } from "./lodash.mjs";
import { r as reactExports, a as React } from "../_chunks/_libs/react.mjs";
import { e } from "./scroll-into-view-if-needed.mjs";
import { T as Transforms, R as Range, E as Editor, a as Element$1, N as Node, b as Text$1, P as Path, c as Point, S as Scrubber } from "./slate.mjs";
import { E as EDITOR_TO_FORCE_RENDER, b as IS_READ_ONLY, c as IS_NODE_MAP_DIRTY, D as DOMEditor, d as IS_WEBKIT, g as getActiveElement, e as IS_ANDROID, f as getSelection, h as IS_FOCUSED, j as getDefaultView, k as EDITOR_TO_WINDOW, l as EDITOR_TO_ELEMENT, N as NODE_TO_ELEMENT, m as ELEMENT_TO_NODE, I as IS_FIREFOX, n as containsShadowAware, o as EDITOR_TO_USER_SELECTION, p as IS_COMPOSING, H as HAS_BEFORE_INPUT_SUPPORT, P as PLACEHOLDER_SYMBOL, M as MARK_PLACEHOLDER_SYMBOL, q as EDITOR_TO_PENDING_INSERTION_MARKS, r as isPlainTextOnlyPaste, s as hotkeys, t as IS_CHROME, u as IS_FIREFOX_LEGACY, v as IS_IOS, w as IS_WECHATBROWSER, x as IS_UC_MOBILE, y as EDITOR_TO_USER_MARKS, z as isDOMNode, T as TRIPLE_CLICK, A as isDOMElement, C as CAN_USE_DOM, B as EDITOR_TO_SCHEDULE_FLUSH, F as NODE_TO_INDEX, G as NODE_TO_PARENT, J as isTrackedMutation, K as EDITOR_TO_PENDING_DIFFS, L as applyStringDiff, O as isDOMSelection, Q as EDITOR_TO_PENDING_SELECTION, R as EDITOR_TO_PENDING_ACTION, S as targetRange, U as verifyDiffState, V as splitDecorationsByChild, i as isElementDecorationsEqual, W as withDOM, X as EDITOR_TO_PLACEHOLDER_ELEMENT, Y as normalizeStringDiff, Z as mergeStringDiffs, _ as normalizeRange, $ as normalizePoint, a0 as EDITOR_TO_KEY_TO_ELEMENT, a as isTextDecorationsEqual, a1 as Key, a2 as EDITOR_TO_ON_CHANGE } from "./slate-dom.mjs";
import { a as ReactDOM } from "../_chunks/_libs/react-dom.mjs";
import { R as ResizeObserver } from "../_chunks/_libs/@juggle/resize-observer.mjs";
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint);
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var EditorContext = /* @__PURE__ */ reactExports.createContext(null);
var useSlateStatic = () => {
  var editor = reactExports.useContext(EditorContext);
  if (!editor) {
    throw new Error("The `useSlateStatic` hook must be used inside the <Slate> component's context.");
  }
  return editor;
};
var ReactEditor = DOMEditor;
function ownKeys$7(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$7(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$7(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var RESOLVE_DELAY = 25;
var FLUSH_DELAY = 200;
var debug = function debug2() {
};
var isDataTransfer = (value) => (value === null || value === void 0 ? void 0 : value.constructor.name) === "DataTransfer";
function createAndroidInputManager(_ref) {
  var {
    editor,
    scheduleOnDOMSelectionChange,
    onDOMSelectionChange
  } = _ref;
  var flushing = false;
  var compositionEndTimeoutId = null;
  var flushTimeoutId = null;
  var actionTimeoutId = null;
  var idCounter = 0;
  var insertPositionHint = false;
  var applyPendingSelection = () => {
    var pendingSelection = EDITOR_TO_PENDING_SELECTION.get(editor);
    EDITOR_TO_PENDING_SELECTION.delete(editor);
    if (pendingSelection) {
      var {
        selection
      } = editor;
      var normalized = normalizeRange(editor, pendingSelection);
      if (normalized && (!selection || !Range.equals(normalized, selection))) {
        Transforms.select(editor, normalized);
      }
    }
  };
  var performAction = () => {
    var action = EDITOR_TO_PENDING_ACTION.get(editor);
    EDITOR_TO_PENDING_ACTION.delete(editor);
    if (!action) {
      return;
    }
    if (action.at) {
      var target = Point.isPoint(action.at) ? normalizePoint(editor, action.at) : normalizeRange(editor, action.at);
      if (!target) {
        return;
      }
      var _targetRange = Editor.range(editor, target);
      if (!editor.selection || !Range.equals(editor.selection, _targetRange)) {
        Transforms.select(editor, target);
      }
    }
    action.run();
  };
  var flush = () => {
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    if (actionTimeoutId) {
      clearTimeout(actionTimeoutId);
      actionTimeoutId = null;
    }
    if (!hasPendingDiffs() && !hasPendingAction()) {
      applyPendingSelection();
      return;
    }
    if (!flushing) {
      flushing = true;
      setTimeout(() => flushing = false);
    }
    if (hasPendingAction()) {
      flushing = "action";
    }
    var selectionRef = editor.selection && Editor.rangeRef(editor, editor.selection, {
      affinity: "forward"
    });
    EDITOR_TO_USER_MARKS.set(editor, editor.marks);
    debug("flush", EDITOR_TO_PENDING_ACTION.get(editor), EDITOR_TO_PENDING_DIFFS.get(editor));
    var scheduleSelectionChange = hasPendingDiffs();
    var diff;
    while (diff = (_EDITOR_TO_PENDING_DI = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI === void 0 ? void 0 : _EDITOR_TO_PENDING_DI[0]) {
      var _EDITOR_TO_PENDING_DI, _EDITOR_TO_PENDING_DI2;
      var pendingMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
      if (pendingMarks !== void 0) {
        EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
        editor.marks = pendingMarks;
      }
      if (pendingMarks && insertPositionHint === false) {
        insertPositionHint = null;
      }
      var range = targetRange(diff);
      if (!editor.selection || !Range.equals(editor.selection, range)) {
        Transforms.select(editor, range);
      }
      if (diff.diff.text) {
        Editor.insertText(editor, diff.diff.text);
      } else {
        Editor.deleteFragment(editor);
      }
      EDITOR_TO_PENDING_DIFFS.set(editor, (_EDITOR_TO_PENDING_DI2 = EDITOR_TO_PENDING_DIFFS.get(editor)) === null || _EDITOR_TO_PENDING_DI2 === void 0 ? void 0 : _EDITOR_TO_PENDING_DI2.filter((_ref2) => {
        var {
          id
        } = _ref2;
        return id !== diff.id;
      }));
      if (!verifyDiffState(editor, diff)) {
        scheduleSelectionChange = false;
        EDITOR_TO_PENDING_ACTION.delete(editor);
        EDITOR_TO_USER_MARKS.delete(editor);
        flushing = "action";
        EDITOR_TO_PENDING_SELECTION.delete(editor);
        scheduleOnDOMSelectionChange.cancel();
        onDOMSelectionChange.cancel();
        selectionRef === null || selectionRef === void 0 || selectionRef.unref();
      }
    }
    var selection = selectionRef === null || selectionRef === void 0 ? void 0 : selectionRef.unref();
    if (selection && !EDITOR_TO_PENDING_SELECTION.get(editor) && (!editor.selection || !Range.equals(selection, editor.selection))) {
      Transforms.select(editor, selection);
    }
    if (hasPendingAction()) {
      performAction();
      return;
    }
    if (scheduleSelectionChange) {
      scheduleOnDOMSelectionChange();
    }
    scheduleOnDOMSelectionChange.flush();
    onDOMSelectionChange.flush();
    applyPendingSelection();
    var userMarks = EDITOR_TO_USER_MARKS.get(editor);
    EDITOR_TO_USER_MARKS.delete(editor);
    if (userMarks !== void 0) {
      editor.marks = userMarks;
      editor.onChange();
    }
  };
  var handleCompositionEnd = (_event) => {
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
    }
    compositionEndTimeoutId = setTimeout(() => {
      IS_COMPOSING.set(editor, false);
      flush();
    }, RESOLVE_DELAY);
  };
  var handleCompositionStart = (_event) => {
    IS_COMPOSING.set(editor, true);
    if (compositionEndTimeoutId) {
      clearTimeout(compositionEndTimeoutId);
      compositionEndTimeoutId = null;
    }
  };
  var updatePlaceholderVisibility = function updatePlaceholderVisibility2() {
    var forceHide = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var placeholderElement = EDITOR_TO_PLACEHOLDER_ELEMENT.get(editor);
    if (!placeholderElement) {
      return;
    }
    if (hasPendingDiffs() || forceHide) {
      placeholderElement.style.display = "none";
      return;
    }
    placeholderElement.style.removeProperty("display");
  };
  var storeDiff = (path, diff) => {
    var _EDITOR_TO_PENDING_DI3;
    var pendingDiffs = (_EDITOR_TO_PENDING_DI3 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI3 !== void 0 ? _EDITOR_TO_PENDING_DI3 : [];
    EDITOR_TO_PENDING_DIFFS.set(editor, pendingDiffs);
    var target = Node.leaf(editor, path);
    var idx = pendingDiffs.findIndex((change) => Path.equals(change.path, path));
    if (idx < 0) {
      var normalized = normalizeStringDiff(target.text, diff);
      if (normalized) {
        pendingDiffs.push({
          path,
          diff,
          id: idCounter++
        });
      }
      updatePlaceholderVisibility();
      return;
    }
    var merged = mergeStringDiffs(target.text, pendingDiffs[idx].diff, diff);
    if (!merged) {
      pendingDiffs.splice(idx, 1);
      updatePlaceholderVisibility();
      return;
    }
    pendingDiffs[idx] = _objectSpread$7(_objectSpread$7({}, pendingDiffs[idx]), {}, {
      diff: merged
    });
  };
  var scheduleAction = function scheduleAction2(run) {
    var {
      at
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    insertPositionHint = false;
    EDITOR_TO_PENDING_SELECTION.delete(editor);
    scheduleOnDOMSelectionChange.cancel();
    onDOMSelectionChange.cancel();
    if (hasPendingAction()) {
      flush();
    }
    EDITOR_TO_PENDING_ACTION.set(editor, {
      at,
      run
    });
    actionTimeoutId = setTimeout(flush);
  };
  var handleDOMBeforeInput = (event) => {
    var _targetRange2;
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    if (IS_NODE_MAP_DIRTY.get(editor)) {
      return;
    }
    var {
      inputType: type
    } = event;
    var targetRange2 = null;
    var data = event.dataTransfer || event.data || void 0;
    if (insertPositionHint !== false && type !== "insertText" && type !== "insertCompositionText") {
      insertPositionHint = false;
    }
    var [nativeTargetRange] = event.getTargetRanges();
    if (nativeTargetRange) {
      targetRange2 = ReactEditor.toSlateRange(editor, nativeTargetRange, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    var window2 = ReactEditor.getWindow(editor);
    var domSelection = window2.getSelection();
    if (!targetRange2 && domSelection) {
      nativeTargetRange = domSelection;
      targetRange2 = ReactEditor.toSlateRange(editor, domSelection, {
        exactMatch: false,
        suppressThrow: true
      });
    }
    targetRange2 = (_targetRange2 = targetRange2) !== null && _targetRange2 !== void 0 ? _targetRange2 : editor.selection;
    if (!targetRange2) {
      return;
    }
    var canStoreDiff = true;
    if (type.startsWith("delete")) {
      var direction = type.endsWith("Backward") ? "backward" : "forward";
      var [start, end] = Range.edges(targetRange2);
      var [leaf, path] = Editor.leaf(editor, start.path);
      if (Range.isExpanded(targetRange2)) {
        if (leaf.text.length === start.offset && end.offset === 0) {
          var next = Editor.next(editor, {
            at: start.path,
            match: Text$1.isText
          });
          if (next && Path.equals(next[1], end.path)) {
            if (direction === "backward") {
              targetRange2 = {
                anchor: end,
                focus: end
              };
              start = end;
              [leaf, path] = next;
            } else {
              targetRange2 = {
                anchor: start,
                focus: start
              };
              end = start;
            }
          }
        }
      }
      var diff = {
        text: "",
        start: start.offset,
        end: end.offset
      };
      var pendingDiffs = EDITOR_TO_PENDING_DIFFS.get(editor);
      var relevantPendingDiffs = pendingDiffs === null || pendingDiffs === void 0 ? void 0 : pendingDiffs.find((change) => Path.equals(change.path, path));
      var diffs = relevantPendingDiffs ? [relevantPendingDiffs.diff, diff] : [diff];
      var text = applyStringDiff(leaf.text, ...diffs);
      if (text.length === 0) {
        canStoreDiff = false;
      }
      if (Range.isExpanded(targetRange2)) {
        if (canStoreDiff && Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
          var point = {
            path: targetRange2.anchor.path,
            offset: start.offset
          };
          var range = Editor.range(editor, point, point);
          handleUserSelect(range);
          return storeDiff(targetRange2.anchor.path, {
            text: "",
            end: end.offset,
            start: start.offset
          });
        }
        return scheduleAction(() => Editor.deleteFragment(editor, {
          direction
        }), {
          at: targetRange2
        });
      }
    }
    switch (type) {
      case "deleteByComposition":
      case "deleteByCut":
      case "deleteByDrag": {
        return scheduleAction(() => Editor.deleteFragment(editor), {
          at: targetRange2
        });
      }
      case "deleteContent":
      case "deleteContentForward": {
        var {
          anchor
        } = targetRange2;
        if (canStoreDiff && Range.isCollapsed(targetRange2)) {
          var targetNode = Node.leaf(editor, anchor.path);
          if (anchor.offset < targetNode.text.length) {
            return storeDiff(anchor.path, {
              text: "",
              start: anchor.offset,
              end: anchor.offset + 1
            });
          }
        }
        return scheduleAction(() => Editor.deleteForward(editor), {
          at: targetRange2
        });
      }
      case "deleteContentBackward": {
        var _nativeTargetRange;
        var {
          anchor: _anchor
        } = targetRange2;
        var nativeCollapsed = isDOMSelection(nativeTargetRange) ? nativeTargetRange.isCollapsed : !!((_nativeTargetRange = nativeTargetRange) !== null && _nativeTargetRange !== void 0 && _nativeTargetRange.collapsed);
        if (canStoreDiff && nativeCollapsed && Range.isCollapsed(targetRange2) && _anchor.offset > 0) {
          return storeDiff(_anchor.path, {
            text: "",
            start: _anchor.offset - 1,
            end: _anchor.offset
          });
        }
        return scheduleAction(() => Editor.deleteBackward(editor), {
          at: targetRange2
        });
      }
      case "deleteEntireSoftLine": {
        return scheduleAction(() => {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          Editor.deleteForward(editor, {
            unit: "line"
          });
        }, {
          at: targetRange2
        });
      }
      case "deleteHardLineBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "block"
        }), {
          at: targetRange2
        });
      }
      case "deleteSoftLineBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "line"
        }), {
          at: targetRange2
        });
      }
      case "deleteHardLineForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "block"
        }), {
          at: targetRange2
        });
      }
      case "deleteSoftLineForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "line"
        }), {
          at: targetRange2
        });
      }
      case "deleteWordBackward": {
        return scheduleAction(() => Editor.deleteBackward(editor, {
          unit: "word"
        }), {
          at: targetRange2
        });
      }
      case "deleteWordForward": {
        return scheduleAction(() => Editor.deleteForward(editor, {
          unit: "word"
        }), {
          at: targetRange2
        });
      }
      case "insertLineBreak": {
        return scheduleAction(() => Editor.insertSoftBreak(editor), {
          at: targetRange2
        });
      }
      case "insertParagraph": {
        return scheduleAction(() => Editor.insertBreak(editor), {
          at: targetRange2
        });
      }
      case "insertCompositionText":
      case "deleteCompositionText":
      case "insertFromComposition":
      case "insertFromDrop":
      case "insertFromPaste":
      case "insertFromYank":
      case "insertReplacementText":
      case "insertText": {
        if (isDataTransfer(data)) {
          return scheduleAction(() => ReactEditor.insertData(editor, data), {
            at: targetRange2
          });
        }
        var _text = data !== null && data !== void 0 ? data : "";
        if (EDITOR_TO_PENDING_INSERTION_MARKS.get(editor)) {
          _text = _text.replace("\uFEFF", "");
        }
        if (type === "insertText" && /.*\n.*\n$/.test(_text)) {
          _text = _text.slice(0, -1);
        }
        if (_text.includes("\n")) {
          return scheduleAction(() => {
            var parts = _text.split("\n");
            parts.forEach((line, i) => {
              if (line) {
                Editor.insertText(editor, line);
              }
              if (i !== parts.length - 1) {
                Editor.insertSoftBreak(editor);
              }
            });
          }, {
            at: targetRange2
          });
        }
        if (Path.equals(targetRange2.anchor.path, targetRange2.focus.path)) {
          var [_start, _end] = Range.edges(targetRange2);
          var _diff = {
            start: _start.offset,
            end: _end.offset,
            text: _text
          };
          if (_text && insertPositionHint && type === "insertCompositionText") {
            var hintPosition = insertPositionHint.start + insertPositionHint.text.search(/\S|$/);
            var diffPosition = _diff.start + _diff.text.search(/\S|$/);
            if (diffPosition === hintPosition + 1 && _diff.end === insertPositionHint.start + insertPositionHint.text.length) {
              _diff.start -= 1;
              insertPositionHint = null;
              scheduleFlush();
            } else {
              insertPositionHint = false;
            }
          } else if (type === "insertText") {
            if (insertPositionHint === null) {
              insertPositionHint = _diff;
            } else if (insertPositionHint && Range.isCollapsed(targetRange2) && insertPositionHint.end + insertPositionHint.text.length === _start.offset) {
              insertPositionHint = _objectSpread$7(_objectSpread$7({}, insertPositionHint), {}, {
                text: insertPositionHint.text + _text
              });
            } else {
              insertPositionHint = false;
            }
          } else {
            insertPositionHint = false;
          }
          if (canStoreDiff) {
            var currentSelection = editor.selection;
            storeDiff(_start.path, _diff);
            if (currentSelection) {
              var newPoint = {
                path: _start.path,
                offset: _start.offset + _text.length
              };
              scheduleAction(() => {
                Transforms.select(editor, {
                  anchor: newPoint,
                  focus: newPoint
                });
              }, {
                at: newPoint
              });
            }
            return;
          }
        }
        return scheduleAction(() => Editor.insertText(editor, _text), {
          at: targetRange2
        });
      }
    }
  };
  var hasPendingAction = () => {
    return !!EDITOR_TO_PENDING_ACTION.get(editor);
  };
  var hasPendingDiffs = () => {
    var _EDITOR_TO_PENDING_DI4;
    return !!((_EDITOR_TO_PENDING_DI4 = EDITOR_TO_PENDING_DIFFS.get(editor)) !== null && _EDITOR_TO_PENDING_DI4 !== void 0 && _EDITOR_TO_PENDING_DI4.length);
  };
  var hasPendingChanges = () => {
    return hasPendingAction() || hasPendingDiffs();
  };
  var isFlushing = () => {
    return flushing;
  };
  var handleUserSelect = (range) => {
    EDITOR_TO_PENDING_SELECTION.set(editor, range);
    if (flushTimeoutId) {
      clearTimeout(flushTimeoutId);
      flushTimeoutId = null;
    }
    var {
      selection
    } = editor;
    if (!range) {
      return;
    }
    var pathChanged = !selection || !Path.equals(selection.anchor.path, range.anchor.path);
    var parentPathChanged = !selection || !Path.equals(selection.anchor.path.slice(0, -1), range.anchor.path.slice(0, -1));
    if (pathChanged && insertPositionHint || parentPathChanged) {
      insertPositionHint = false;
    }
    if (pathChanged || hasPendingDiffs()) {
      flushTimeoutId = setTimeout(flush, FLUSH_DELAY);
    }
  };
  var handleInput = () => {
    if (hasPendingAction() || !hasPendingDiffs()) {
      flush();
    }
  };
  var handleKeyDown = (_) => {
    if (!hasPendingDiffs()) {
      updatePlaceholderVisibility(true);
      setTimeout(updatePlaceholderVisibility);
    }
  };
  var scheduleFlush = () => {
    if (!hasPendingAction()) {
      actionTimeoutId = setTimeout(flush);
    }
  };
  var handleDomMutations = (mutations) => {
    if (hasPendingDiffs() || hasPendingAction()) {
      return;
    }
    if (mutations.some((mutation) => isTrackedMutation(editor, mutation, mutations))) {
      var _EDITOR_TO_FORCE_REND;
      (_EDITOR_TO_FORCE_REND = EDITOR_TO_FORCE_RENDER.get(editor)) === null || _EDITOR_TO_FORCE_REND === void 0 || _EDITOR_TO_FORCE_REND();
    }
  };
  return {
    flush,
    scheduleFlush,
    hasPendingDiffs,
    hasPendingAction,
    hasPendingChanges,
    isFlushing,
    handleUserSelect,
    handleCompositionEnd,
    handleCompositionStart,
    handleDOMBeforeInput,
    handleKeyDown,
    handleDomMutations,
    handleInput
  };
}
function useIsMounted() {
  var isMountedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef.current;
}
var useIsomorphicLayoutEffect = CAN_USE_DOM ? reactExports.useLayoutEffect : reactExports.useEffect;
function useMutationObserver(node, callback, options) {
  var [mutationObserver] = reactExports.useState(() => new MutationObserver(callback));
  useIsomorphicLayoutEffect(() => {
    mutationObserver.takeRecords();
  });
  reactExports.useEffect(() => {
    if (!node.current) {
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    }
    mutationObserver.observe(node.current, options);
    return () => mutationObserver.disconnect();
  }, [mutationObserver, node, options]);
}
var _excluded$2 = ["node"];
function ownKeys$6(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$6(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$6(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var MUTATION_OBSERVER_CONFIG$1 = {
  subtree: true,
  childList: true,
  characterData: true
};
var useAndroidInputManager = !IS_ANDROID ? () => null : (_ref) => {
  var {
    node
  } = _ref, options = _objectWithoutProperties(_ref, _excluded$2);
  if (!IS_ANDROID) {
    return null;
  }
  var editor = useSlateStatic();
  var isMounted = useIsMounted();
  var [inputManager] = reactExports.useState(() => createAndroidInputManager(_objectSpread$6({
    editor
  }, options)));
  useMutationObserver(node, inputManager.handleDomMutations, MUTATION_OBSERVER_CONFIG$1);
  EDITOR_TO_SCHEDULE_FLUSH.set(editor, inputManager.scheduleFlush);
  if (isMounted) {
    inputManager.flush();
  }
  return inputManager;
};
function ownKeys$5(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$5(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$5(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var String$1 = (props) => {
  var {
    isLast,
    leaf,
    parent,
    text
  } = props;
  var editor = useSlateStatic();
  var path = ReactEditor.findPath(editor, text);
  var parentPath = Path.parent(path);
  var isMarkPlaceholder = Boolean(leaf[MARK_PLACEHOLDER_SYMBOL]);
  if (editor.isVoid(parent)) {
    return /* @__PURE__ */ React.createElement(ZeroWidthString, {
      length: Node.string(parent).length
    });
  }
  if (leaf.text === "" && parent.children[parent.children.length - 1] === text && !editor.isInline(parent) && Editor.string(editor, parentPath) === "") {
    return /* @__PURE__ */ React.createElement(ZeroWidthString, {
      isLineBreak: true,
      isMarkPlaceholder
    });
  }
  if (leaf.text === "") {
    return /* @__PURE__ */ React.createElement(ZeroWidthString, {
      isMarkPlaceholder
    });
  }
  if (isLast && leaf.text.slice(-1) === "\n") {
    return /* @__PURE__ */ React.createElement(TextString, {
      isTrailing: true,
      text: leaf.text
    });
  }
  return /* @__PURE__ */ React.createElement(TextString, {
    text: leaf.text
  });
};
var TextString = (props) => {
  var {
    text,
    isTrailing = false
  } = props;
  var ref = reactExports.useRef(null);
  var getTextContent = () => {
    return "".concat(text !== null && text !== void 0 ? text : "").concat(isTrailing ? "\n" : "");
  };
  var [initialText] = reactExports.useState(getTextContent);
  useIsomorphicLayoutEffect(() => {
    var textWithTrailing = getTextContent();
    if (ref.current && ref.current.textContent !== textWithTrailing) {
      ref.current.textContent = textWithTrailing;
    }
  });
  return /* @__PURE__ */ React.createElement(MemoizedText$1, {
    ref
  }, initialText);
};
var MemoizedText$1 = /* @__PURE__ */ reactExports.memo(/* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ React.createElement("span", {
    "data-slate-string": true,
    ref
  }, props.children);
}));
var ZeroWidthString = (props) => {
  var {
    length = 0,
    isLineBreak = false,
    isMarkPlaceholder = false
  } = props;
  var attributes = {
    "data-slate-zero-width": isLineBreak ? "n" : "z",
    "data-slate-length": length
  };
  if (isMarkPlaceholder) {
    attributes["data-slate-mark-placeholder"] = true;
  }
  return /* @__PURE__ */ React.createElement("span", _objectSpread$5({}, attributes), !IS_ANDROID || !isLineBreak ? "\uFEFF" : null, isLineBreak ? /* @__PURE__ */ React.createElement("br", null) : null);
};
function ownKeys$4(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$4(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$4(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var PLACEHOLDER_DELAY = IS_ANDROID ? 300 : 0;
function disconnectPlaceholderResizeObserver(placeholderResizeObserver, releaseObserver) {
  if (placeholderResizeObserver.current) {
    placeholderResizeObserver.current.disconnect();
    if (releaseObserver) {
      placeholderResizeObserver.current = null;
    }
  }
}
function clearTimeoutRef(timeoutRef) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
}
var defaultRenderLeaf = (props) => /* @__PURE__ */ React.createElement(DefaultLeaf, _objectSpread$4({}, props));
var Leaf = (props) => {
  var {
    leaf,
    isLast,
    text,
    parent,
    renderPlaceholder,
    renderLeaf = defaultRenderLeaf,
    leafPosition
  } = props;
  var editor = useSlateStatic();
  var placeholderResizeObserver = reactExports.useRef(null);
  var placeholderRef = reactExports.useRef(null);
  var [showPlaceholder, setShowPlaceholder] = reactExports.useState(false);
  var showPlaceholderTimeoutRef = reactExports.useRef(null);
  var callbackPlaceholderRef = reactExports.useCallback((placeholderEl) => {
    disconnectPlaceholderResizeObserver(placeholderResizeObserver, placeholderEl == null);
    if (placeholderEl == null) {
      var _leaf$onPlaceholderRe;
      EDITOR_TO_PLACEHOLDER_ELEMENT.delete(editor);
      (_leaf$onPlaceholderRe = leaf.onPlaceholderResize) === null || _leaf$onPlaceholderRe === void 0 || _leaf$onPlaceholderRe.call(leaf, null);
    } else {
      EDITOR_TO_PLACEHOLDER_ELEMENT.set(editor, placeholderEl);
      if (!placeholderResizeObserver.current) {
        var ResizeObserver$1 = window.ResizeObserver || ResizeObserver;
        placeholderResizeObserver.current = new ResizeObserver$1(() => {
          var _leaf$onPlaceholderRe2;
          (_leaf$onPlaceholderRe2 = leaf.onPlaceholderResize) === null || _leaf$onPlaceholderRe2 === void 0 || _leaf$onPlaceholderRe2.call(leaf, placeholderEl);
        });
      }
      placeholderResizeObserver.current.observe(placeholderEl);
      placeholderRef.current = placeholderEl;
    }
  }, [placeholderRef, leaf, editor]);
  var children = /* @__PURE__ */ React.createElement(String$1, {
    isLast,
    leaf,
    parent,
    text
  });
  var leafIsPlaceholder = Boolean(leaf[PLACEHOLDER_SYMBOL]);
  reactExports.useEffect(() => {
    if (leafIsPlaceholder) {
      if (!showPlaceholderTimeoutRef.current) {
        showPlaceholderTimeoutRef.current = setTimeout(() => {
          setShowPlaceholder(true);
          showPlaceholderTimeoutRef.current = null;
        }, PLACEHOLDER_DELAY);
      }
    } else {
      clearTimeoutRef(showPlaceholderTimeoutRef);
      setShowPlaceholder(false);
    }
    return () => clearTimeoutRef(showPlaceholderTimeoutRef);
  }, [leafIsPlaceholder, setShowPlaceholder]);
  if (leafIsPlaceholder && showPlaceholder) {
    var placeholderProps = {
      children: leaf.placeholder,
      attributes: {
        "data-slate-placeholder": true,
        style: {
          position: "absolute",
          top: 0,
          pointerEvents: "none",
          width: "100%",
          maxWidth: "100%",
          display: "block",
          opacity: "0.333",
          userSelect: "none",
          textDecoration: "none",
          // Fixes https://github.com/udecode/plate/issues/2315
          WebkitUserModify: IS_WEBKIT ? "inherit" : void 0
        },
        contentEditable: false,
        ref: callbackPlaceholderRef
      }
    };
    children = /* @__PURE__ */ React.createElement(React.Fragment, null, children, renderPlaceholder(placeholderProps));
  }
  var attributes = {
    "data-slate-leaf": true
  };
  return renderLeaf({
    attributes,
    children,
    leaf,
    text,
    leafPosition
  });
};
var MemoizedLeaf = /* @__PURE__ */ React.memo(Leaf, (prev, next) => {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderLeaf === prev.renderLeaf && next.renderPlaceholder === prev.renderPlaceholder && next.text === prev.text && Text$1.equals(next.leaf, prev.leaf) && next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL];
});
var DefaultLeaf = (props) => {
  var {
    attributes,
    children
  } = props;
  return /* @__PURE__ */ React.createElement("span", _objectSpread$4({}, attributes), children);
};
function useGenericSelector(selector, equalityFn) {
  var [, forceRender] = reactExports.useReducer((s) => s + 1, 0);
  var latestSubscriptionCallbackError = reactExports.useRef();
  var latestSelector = reactExports.useRef(() => null);
  var latestSelectedState = reactExports.useRef(null);
  var selectedState;
  try {
    if (selector !== latestSelector.current || latestSubscriptionCallbackError.current) {
      var selectorResult = selector();
      if (equalityFn(latestSelectedState.current, selectorResult)) {
        selectedState = latestSelectedState.current;
      } else {
        selectedState = selectorResult;
      }
    } else {
      selectedState = latestSelectedState.current;
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current && isError(err)) {
      err.message += "\nThe error may be correlated with this previous error:\n".concat(latestSubscriptionCallbackError.current.stack, "\n\n");
    }
    throw err;
  }
  latestSelector.current = selector;
  latestSelectedState.current = selectedState;
  latestSubscriptionCallbackError.current = void 0;
  var update = reactExports.useCallback(() => {
    try {
      var newSelectedState = latestSelector.current();
      if (equalityFn(latestSelectedState.current, newSelectedState)) {
        return;
      }
      latestSelectedState.current = newSelectedState;
    } catch (err) {
      if (err instanceof Error) {
        latestSubscriptionCallbackError.current = err;
      } else {
        latestSubscriptionCallbackError.current = new Error(String(err));
      }
    }
    forceRender();
  }, []);
  return [selectedState, update];
}
function isError(error) {
  return error instanceof Error;
}
var DecorateContext = /* @__PURE__ */ reactExports.createContext({});
var useDecorations = (node, parentDecorations) => {
  var editor = useSlateStatic();
  var {
    decorate,
    addEventListener
  } = reactExports.useContext(DecorateContext);
  var selector = () => {
    var path = ReactEditor.findPath(editor, node);
    return decorate([node, path]);
  };
  var equalityFn = Text$1.isText(node) ? isTextDecorationsEqual : isElementDecorationsEqual;
  var [decorations, update] = useGenericSelector(selector, equalityFn);
  useIsomorphicLayoutEffect(() => {
    var unsubscribe = addEventListener(update);
    update();
    return unsubscribe;
  }, [addEventListener, update]);
  return reactExports.useMemo(() => [...decorations, ...parentDecorations], [decorations, parentDecorations]);
};
var useDecorateContext = (decorateProp) => {
  var eventListeners = reactExports.useRef(/* @__PURE__ */ new Set());
  var latestDecorate = reactExports.useRef(decorateProp);
  useIsomorphicLayoutEffect(() => {
    latestDecorate.current = decorateProp;
    eventListeners.current.forEach((listener) => listener());
  }, [decorateProp]);
  var decorate = reactExports.useCallback((entry) => latestDecorate.current(entry), []);
  var addEventListener = reactExports.useCallback((callback) => {
    eventListeners.current.add(callback);
    return () => {
      eventListeners.current.delete(callback);
    };
  }, []);
  return reactExports.useMemo(() => ({
    decorate,
    addEventListener
  }), [decorate, addEventListener]);
};
function ownKeys$3(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var defaultRenderText = (props) => /* @__PURE__ */ React.createElement(DefaultText, _objectSpread$3({}, props));
var Text = (props) => {
  var {
    decorations: parentDecorations,
    isLast,
    parent,
    renderPlaceholder,
    renderLeaf,
    renderText = defaultRenderText,
    text
  } = props;
  var editor = useSlateStatic();
  var ref = reactExports.useRef(null);
  var decorations = useDecorations(text, parentDecorations);
  var decoratedLeaves = Text$1.decorations(text, decorations);
  var key = ReactEditor.findKey(editor, text);
  var children = [];
  for (var i = 0; i < decoratedLeaves.length; i++) {
    var {
      leaf,
      position
    } = decoratedLeaves[i];
    children.push(/* @__PURE__ */ React.createElement(MemoizedLeaf, {
      isLast: isLast && i === decoratedLeaves.length - 1,
      key: "".concat(key.id, "-").concat(i),
      renderPlaceholder,
      leaf,
      leafPosition: position,
      text,
      parent,
      renderLeaf
    }));
  }
  var callbackRef = reactExports.useCallback((span) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (span) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, span);
      NODE_TO_ELEMENT.set(text, span);
      ELEMENT_TO_NODE.set(span, text);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.delete(key);
      NODE_TO_ELEMENT.delete(text);
      if (ref.current) {
        ELEMENT_TO_NODE.delete(ref.current);
      }
    }
    ref.current = span;
  }, [ref, editor, key, text]);
  var attributes = {
    "data-slate-node": "text",
    ref: callbackRef
  };
  return renderText({
    text,
    children,
    attributes
  });
};
var MemoizedText = /* @__PURE__ */ React.memo(Text, (prev, next) => {
  return next.parent === prev.parent && next.isLast === prev.isLast && next.renderText === prev.renderText && next.renderLeaf === prev.renderLeaf && next.renderPlaceholder === prev.renderPlaceholder && next.text === prev.text && isTextDecorationsEqual(next.decorations, prev.decorations);
});
var DefaultText = (props) => {
  var {
    attributes,
    children
  } = props;
  return /* @__PURE__ */ React.createElement("span", _objectSpread$3({}, attributes), children);
};
function ownKeys$2(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var defaultRenderElement = (props) => /* @__PURE__ */ React.createElement(DefaultElement, _objectSpread$2({}, props));
var Element = (props) => {
  var {
    decorations: parentDecorations,
    element,
    renderElement = defaultRenderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  } = props;
  var editor = useSlateStatic();
  var readOnly = useReadOnly();
  var isInline = editor.isInline(element);
  var decorations = useDecorations(element, parentDecorations);
  var key = ReactEditor.findKey(editor, element);
  var ref = reactExports.useCallback((ref2) => {
    var KEY_TO_ELEMENT = EDITOR_TO_KEY_TO_ELEMENT.get(editor);
    if (ref2) {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.set(key, ref2);
      NODE_TO_ELEMENT.set(element, ref2);
      ELEMENT_TO_NODE.set(ref2, element);
    } else {
      KEY_TO_ELEMENT === null || KEY_TO_ELEMENT === void 0 || KEY_TO_ELEMENT.delete(key);
      NODE_TO_ELEMENT.delete(element);
    }
  }, [editor, key, element]);
  var children = useChildren({
    decorations,
    node: element,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  });
  var attributes = {
    "data-slate-node": "element",
    ref
  };
  if (isInline) {
    attributes["data-slate-inline"] = true;
  }
  if (!isInline && Editor.hasInlines(editor, element)) {
    var text = Node.string(element);
    var dir = getDirection(text);
    if (dir === "rtl") {
      attributes.dir = dir;
    }
  }
  if (Editor.isVoid(editor, element)) {
    attributes["data-slate-void"] = true;
    if (!readOnly && isInline) {
      attributes.contentEditable = false;
    }
    var Tag = isInline ? "span" : "div";
    var [[_text]] = Node.texts(element);
    children = /* @__PURE__ */ React.createElement(Tag, {
      "data-slate-spacer": true,
      style: {
        height: "0",
        color: "transparent",
        outline: "none",
        position: "absolute"
      }
    }, /* @__PURE__ */ React.createElement(MemoizedText, {
      renderPlaceholder,
      decorations: [],
      isLast: false,
      parent: element,
      text: _text
    }));
    NODE_TO_INDEX.set(_text, 0);
    NODE_TO_PARENT.set(_text, element);
  }
  return renderElement({
    attributes,
    children,
    element
  });
};
var MemoizedElement = /* @__PURE__ */ React.memo(Element, (prev, next) => {
  return prev.element === next.element && prev.renderElement === next.renderElement && prev.renderChunk === next.renderChunk && prev.renderText === next.renderText && prev.renderLeaf === next.renderLeaf && prev.renderPlaceholder === next.renderPlaceholder && isElementDecorationsEqual(prev.decorations, next.decorations);
});
var DefaultElement = (props) => {
  var {
    attributes,
    children,
    element
  } = props;
  var editor = useSlateStatic();
  var Tag = editor.isInline(element) ? "span" : "div";
  return /* @__PURE__ */ React.createElement(Tag, _objectSpread$2(_objectSpread$2({}, attributes), {}, {
    style: {
      position: "relative"
    }
  }), children);
};
class ChunkTreeHelper {
  constructor(chunkTree, _ref) {
    var {
      chunkSize,
      debug: debug3
    } = _ref;
    _defineProperty(this, "root", void 0);
    _defineProperty(this, "chunkSize", void 0);
    _defineProperty(this, "debug", void 0);
    _defineProperty(this, "reachedEnd", void 0);
    _defineProperty(this, "pointerChunk", void 0);
    _defineProperty(this, "pointerIndex", void 0);
    _defineProperty(this, "pointerIndexStack", void 0);
    _defineProperty(this, "cachedPointerNode", void 0);
    this.root = chunkTree;
    this.chunkSize = chunkSize;
    this.debug = debug3 !== null && debug3 !== void 0 ? debug3 : false;
    this.pointerChunk = chunkTree;
    this.pointerIndex = -1;
    this.pointerIndexStack = [];
    this.reachedEnd = false;
    this.validateState();
  }
  /**
   * Move the pointer to the next leaf in the chunk tree
   */
  readLeaf() {
    if (this.reachedEnd) return null;
    while (true) {
      if (this.pointerIndex + 1 < this.pointerSiblings.length) {
        this.pointerIndex++;
        this.cachedPointerNode = void 0;
        break;
      } else if (this.pointerChunk.type === "root") {
        this.reachedEnd = true;
        return null;
      } else {
        this.exitChunk();
      }
    }
    this.validateState();
    this.enterChunkUntilLeaf(false);
    return this.pointerNode;
  }
  /**
   * Move the pointer to the previous leaf in the chunk tree
   */
  returnToPreviousLeaf() {
    if (this.reachedEnd) {
      this.reachedEnd = false;
      this.enterChunkUntilLeaf(true);
      return;
    }
    while (true) {
      if (this.pointerIndex >= 1) {
        this.pointerIndex--;
        this.cachedPointerNode = void 0;
        break;
      } else if (this.pointerChunk.type === "root") {
        this.pointerIndex = -1;
        return;
      } else {
        this.exitChunk();
      }
    }
    this.validateState();
    this.enterChunkUntilLeaf(true);
  }
  /**
   * Insert leaves before the current leaf, leaving the pointer unchanged
   */
  insertBefore(leaves) {
    this.returnToPreviousLeaf();
    this.insertAfter(leaves);
    this.readLeaf();
  }
  /**
   * Insert leaves after the current leaf, leaving the pointer on the last
   * inserted leaf
   *
   * The insertion algorithm first checks for any chunk we're currently at the
   * end of that can receive additional leaves. Next, it tries to insert leaves
   * at the starts of any subsequent chunks.
   *
   * Any remaining leaves are passed to rawInsertAfter to be chunked and
   * inserted at the highest possible level.
   */
  insertAfter(leaves) {
    if (leaves.length === 0) return;
    var beforeDepth = 0;
    var afterDepth = 0;
    while (this.pointerChunk.type === "chunk" && this.pointerIndex === this.pointerSiblings.length - 1) {
      var remainingCapacity = this.chunkSize - this.pointerSiblings.length;
      var toInsertCount = Math.min(remainingCapacity, leaves.length);
      if (toInsertCount > 0) {
        var leavesToInsert = leaves.splice(0, toInsertCount);
        this.rawInsertAfter(leavesToInsert, beforeDepth);
      }
      this.exitChunk();
      beforeDepth++;
    }
    if (leaves.length === 0) return;
    var rawInsertPointer = this.savePointer();
    var finalPointer = null;
    if (this.readLeaf()) {
      while (this.pointerChunk.type === "chunk" && this.pointerIndex === 0) {
        var _remainingCapacity = this.chunkSize - this.pointerSiblings.length;
        var _toInsertCount = Math.min(_remainingCapacity, leaves.length);
        if (_toInsertCount > 0) {
          var _leavesToInsert = leaves.splice(-_toInsertCount, _toInsertCount);
          this.pointerIndex = -1;
          this.cachedPointerNode = void 0;
          this.rawInsertAfter(_leavesToInsert, afterDepth);
          if (!finalPointer) {
            finalPointer = this.savePointer();
          }
        }
        this.exitChunk();
        afterDepth++;
      }
    }
    this.restorePointer(rawInsertPointer);
    var minDepth = Math.max(beforeDepth, afterDepth);
    this.rawInsertAfter(leaves, minDepth);
    if (finalPointer) {
      this.restorePointer(finalPointer);
    }
    this.validateState();
  }
  /**
   * Remove the current node and decrement the pointer, deleting any ancestor
   * chunk that becomes empty as a result
   */
  remove() {
    this.pointerSiblings.splice(this.pointerIndex--, 1);
    this.cachedPointerNode = void 0;
    if (this.pointerSiblings.length === 0 && this.pointerChunk.type === "chunk") {
      this.exitChunk();
      this.remove();
    } else {
      this.invalidateChunk();
    }
    this.validateState();
  }
  /**
   * Add the current chunk and all ancestor chunks to the list of modified
   * chunks
   */
  invalidateChunk() {
    for (var c = this.pointerChunk; c.type === "chunk"; c = c.parent) {
      this.root.modifiedChunks.add(c);
    }
  }
  /**
   * Whether the pointer is at the start of the tree
   */
  get atStart() {
    return this.pointerChunk.type === "root" && this.pointerIndex === -1;
  }
  /**
   * The siblings of the current node
   */
  get pointerSiblings() {
    return this.pointerChunk.children;
  }
  /**
   * Get the current node (uncached)
   *
   * If the pointer is at the start or end of the document, returns null.
   *
   * Usually, the current node is a chunk leaf, although it can be a chunk
   * while insertions are in progress.
   */
  getPointerNode() {
    if (this.reachedEnd || this.pointerIndex === -1) {
      return null;
    }
    return this.pointerSiblings[this.pointerIndex];
  }
  /**
   * Cached getter for the current node
   */
  get pointerNode() {
    if (this.cachedPointerNode !== void 0) return this.cachedPointerNode;
    var pointerNode = this.getPointerNode();
    this.cachedPointerNode = pointerNode;
    return pointerNode;
  }
  /**
   * Get the path of a chunk relative to the root, returning null if the chunk
   * is not connected to the root
   */
  getChunkPath(chunk) {
    var path = [];
    for (var c = chunk; c.type === "chunk"; c = c.parent) {
      var index = c.parent.children.indexOf(c);
      if (index === -1) {
        return null;
      }
      path.unshift(index);
    }
    return path;
  }
  /**
   * Save the current pointer to be restored later
   */
  savePointer() {
    if (this.atStart) return "start";
    if (!this.pointerNode) {
      throw new Error("Cannot save pointer when pointerNode is null");
    }
    return {
      chunk: this.pointerChunk,
      node: this.pointerNode
    };
  }
  /**
   * Restore the pointer to a previous state
   */
  restorePointer(savedPointer) {
    if (savedPointer === "start") {
      this.pointerChunk = this.root;
      this.pointerIndex = -1;
      this.pointerIndexStack = [];
      this.reachedEnd = false;
      this.cachedPointerNode = void 0;
      return;
    }
    var {
      chunk,
      node
    } = savedPointer;
    var index = chunk.children.indexOf(node);
    if (index === -1) {
      throw new Error("Cannot restore point because saved node is no longer in saved chunk");
    }
    var indexStack = this.getChunkPath(chunk);
    if (!indexStack) {
      throw new Error("Cannot restore point because saved chunk is no longer connected to root");
    }
    this.pointerChunk = chunk;
    this.pointerIndex = index;
    this.pointerIndexStack = indexStack;
    this.reachedEnd = false;
    this.cachedPointerNode = node;
    this.validateState();
  }
  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  enterChunk(end) {
    var _this$pointerNode;
    if (((_this$pointerNode = this.pointerNode) === null || _this$pointerNode === void 0 ? void 0 : _this$pointerNode.type) !== "chunk") {
      throw new Error("Cannot enter non-chunk");
    }
    this.pointerIndexStack.push(this.pointerIndex);
    this.pointerChunk = this.pointerNode;
    this.pointerIndex = end ? this.pointerSiblings.length - 1 : 0;
    this.cachedPointerNode = void 0;
    this.validateState();
    if (this.pointerChunk.children.length === 0) {
      throw new Error("Cannot enter empty chunk");
    }
  }
  /**
   * Assuming the current node is a chunk, move the pointer into that chunk
   * repeatedly until the current node is a leaf
   *
   * @param end If true, place the pointer on the last node of the chunk.
   * Otherwise, place the pointer on the first node.
   */
  enterChunkUntilLeaf(end) {
    while (((_this$pointerNode2 = this.pointerNode) === null || _this$pointerNode2 === void 0 ? void 0 : _this$pointerNode2.type) === "chunk") {
      var _this$pointerNode2;
      this.enterChunk(end);
    }
  }
  /**
   * Move the pointer to the parent chunk
   */
  exitChunk() {
    if (this.pointerChunk.type === "root") {
      throw new Error("Cannot exit root");
    }
    var previousPointerChunk = this.pointerChunk;
    this.pointerChunk = previousPointerChunk.parent;
    this.pointerIndex = this.pointerIndexStack.pop();
    this.cachedPointerNode = void 0;
    this.validateState();
  }
  /**
   * Insert leaves immediately after the current node, leaving the pointer on
   * the last inserted leaf
   *
   * Leaves are chunked according to the number of nodes already in the parent
   * plus the number of nodes being inserted, or the minimum depth if larger
   */
  rawInsertAfter(leaves, minDepth) {
    if (leaves.length === 0) return;
    var groupIntoChunks = (leaves2, parent, perChunk) => {
      if (perChunk === 1) return leaves2;
      var chunks2 = [];
      for (var i2 = 0; i2 < this.chunkSize; i2++) {
        var chunkNodes = leaves2.slice(i2 * perChunk, (i2 + 1) * perChunk);
        if (chunkNodes.length === 0) break;
        var chunk = {
          type: "chunk",
          key: new Key(),
          parent,
          children: []
        };
        chunk.children = groupIntoChunks(chunkNodes, chunk, perChunk / this.chunkSize);
        chunks2.push(chunk);
      }
      return chunks2;
    };
    var newTotal = this.pointerSiblings.length + leaves.length;
    var depthForTotal = 0;
    for (var i = this.chunkSize; i < newTotal; i *= this.chunkSize) {
      depthForTotal++;
    }
    var depth = Math.max(depthForTotal, minDepth);
    var perTopLevelChunk = Math.pow(this.chunkSize, depth);
    var chunks = groupIntoChunks(leaves, this.pointerChunk, perTopLevelChunk);
    this.pointerSiblings.splice(this.pointerIndex + 1, 0, ...chunks);
    this.pointerIndex += chunks.length;
    this.cachedPointerNode = void 0;
    this.invalidateChunk();
    this.validateState();
  }
  /**
   * If debug mode is enabled, ensure that the state is internally consistent
   */
  // istanbul ignore next
  validateState() {
    if (!this.debug) return;
    var validateDescendant = (node) => {
      if (node.type === "chunk") {
        var {
          parent,
          children
        } = node;
        if (!parent.children.includes(node)) {
          throw new Error("Debug: Chunk ".concat(node.key.id, " has an incorrect parent property"));
        }
        children.forEach(validateDescendant);
      }
    };
    this.root.children.forEach(validateDescendant);
    if (this.cachedPointerNode !== void 0 && this.cachedPointerNode !== this.getPointerNode()) {
      throw new Error("Debug: The cached pointer is incorrect and has not been invalidated");
    }
    var actualIndexStack = this.getChunkPath(this.pointerChunk);
    if (!actualIndexStack) {
      throw new Error("Debug: The pointer chunk is not connected to the root");
    }
    if (!Path.equals(this.pointerIndexStack, actualIndexStack)) {
      throw new Error("Debug: The cached index stack [".concat(this.pointerIndexStack.join(", "), "] does not match the path of the pointer chunk [").concat(actualIndexStack.join(", "), "]"));
    }
  }
}
class ChildrenHelper {
  constructor(editor, children) {
    _defineProperty(this, "editor", void 0);
    _defineProperty(this, "children", void 0);
    _defineProperty(this, "cachedKeys", void 0);
    _defineProperty(this, "pointerIndex", void 0);
    this.editor = editor;
    this.children = children;
    this.cachedKeys = new Array(children.length);
    this.pointerIndex = 0;
  }
  /**
   * Read a given number of nodes, advancing the pointer by that amount
   */
  read(n) {
    if (n === 1) {
      return [this.children[this.pointerIndex++]];
    }
    var slicedChildren = this.remaining(n);
    this.pointerIndex += n;
    return slicedChildren;
  }
  /**
   * Get the remaining children without advancing the pointer
   *
   * @param [maxChildren] Limit the number of children returned.
   */
  remaining(maxChildren) {
    if (maxChildren === void 0) {
      return this.children.slice(this.pointerIndex);
    }
    return this.children.slice(this.pointerIndex, this.pointerIndex + maxChildren);
  }
  /**
   * Whether all children have been read
   */
  get reachedEnd() {
    return this.pointerIndex >= this.children.length;
  }
  /**
   * Determine whether a node with a given key appears in the unread part of the
   * children array, and return its index relative to the current pointer if so
   *
   * Searching for the node object itself using indexOf is most efficient, but
   * will fail to locate nodes that have been modified. In this case, nodes
   * should be identified by their keys instead.
   *
   * Searching an array of keys using indexOf is very inefficient since fetching
   * the keys for all children in advance is very slow. Insead, if the node
   * search fails to return a value, fetch the keys of each remaining child one
   * by one and compare it to the known key.
   */
  lookAhead(node, key) {
    var elementResult = this.children.indexOf(node, this.pointerIndex);
    if (elementResult > -1) return elementResult - this.pointerIndex;
    for (var i = this.pointerIndex; i < this.children.length; i++) {
      var candidateNode = this.children[i];
      var candidateKey = this.findKey(candidateNode, i);
      if (candidateKey === key) return i - this.pointerIndex;
    }
    return -1;
  }
  /**
   * Convert an array of Slate nodes to an array of chunk leaves, each
   * containing the node and its key
   */
  toChunkLeaves(nodes, startIndex) {
    return nodes.map((node, i) => ({
      type: "leaf",
      node,
      key: this.findKey(node, startIndex + i),
      index: startIndex + i
    }));
  }
  /**
   * Get the key for a Slate node, cached using the node's index
   */
  findKey(node, index) {
    var cachedKey = this.cachedKeys[index];
    if (cachedKey) return cachedKey;
    var key = ReactEditor.findKey(this.editor, node);
    this.cachedKeys[index] = key;
    return key;
  }
}
var reconcileChildren = (editor, _ref) => {
  var {
    chunkTree,
    children,
    chunkSize,
    rerenderChildren = [],
    onInsert,
    onUpdate,
    onIndexChange,
    debug: debug3
  } = _ref;
  chunkTree.modifiedChunks.clear();
  var chunkTreeHelper = new ChunkTreeHelper(chunkTree, {
    chunkSize,
    debug: debug3
  });
  var childrenHelper = new ChildrenHelper(editor, children);
  var treeLeaf;
  var _loop = function _loop2() {
    var lookAhead = childrenHelper.lookAhead(treeLeaf.node, treeLeaf.key);
    var wasMoved = lookAhead > 0 && chunkTree.movedNodeKeys.has(treeLeaf.key);
    if (lookAhead === -1 || wasMoved) {
      chunkTreeHelper.remove();
      return 1;
    }
    var insertedChildrenStartIndex = childrenHelper.pointerIndex;
    var insertedChildren = childrenHelper.read(lookAhead + 1);
    var matchingChild = insertedChildren.pop();
    if (insertedChildren.length) {
      var _leavesToInsert = childrenHelper.toChunkLeaves(insertedChildren, insertedChildrenStartIndex);
      chunkTreeHelper.insertBefore(_leavesToInsert);
      insertedChildren.forEach((node, relativeIndex) => {
        onInsert === null || onInsert === void 0 || onInsert(node, insertedChildrenStartIndex + relativeIndex);
      });
    }
    var matchingChildIndex = childrenHelper.pointerIndex - 1;
    if (treeLeaf.node !== matchingChild) {
      treeLeaf.node = matchingChild;
      chunkTreeHelper.invalidateChunk();
      onUpdate === null || onUpdate === void 0 || onUpdate(matchingChild, matchingChildIndex);
    }
    if (treeLeaf.index !== matchingChildIndex) {
      treeLeaf.index = matchingChildIndex;
      onIndexChange === null || onIndexChange === void 0 || onIndexChange(matchingChild, matchingChildIndex);
    }
    if (rerenderChildren.includes(matchingChildIndex)) {
      chunkTreeHelper.invalidateChunk();
    }
  };
  while (treeLeaf = chunkTreeHelper.readLeaf()) {
    if (_loop()) continue;
  }
  if (!childrenHelper.reachedEnd) {
    var remainingChildren = childrenHelper.remaining();
    var leavesToInsert = childrenHelper.toChunkLeaves(remainingChildren, childrenHelper.pointerIndex);
    chunkTreeHelper.returnToPreviousLeaf();
    chunkTreeHelper.insertAfter(leavesToInsert);
    remainingChildren.forEach((node, relativeIndex) => {
      onInsert === null || onInsert === void 0 || onInsert(node, childrenHelper.pointerIndex + relativeIndex);
    });
  }
  chunkTree.movedNodeKeys.clear();
};
function ownKeys$1(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var KEY_TO_CHUNK_TREE = /* @__PURE__ */ new WeakMap();
var getChunkTreeForNode = function getChunkTreeForNode2(editor, node) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var key = ReactEditor.findKey(editor, node);
  var chunkTree = KEY_TO_CHUNK_TREE.get(key);
  if (!chunkTree) {
    chunkTree = {
      type: "root",
      movedNodeKeys: /* @__PURE__ */ new Set(),
      modifiedChunks: /* @__PURE__ */ new Set(),
      children: []
    };
    KEY_TO_CHUNK_TREE.set(key, chunkTree);
  }
  if (options.reconcile) {
    reconcileChildren(editor, _objectSpread$1({
      chunkTree,
      children: node.children
    }, options.reconcile));
  }
  return chunkTree;
};
var defaultRenderChunk = (_ref) => {
  var {
    children
  } = _ref;
  return children;
};
var ChunkAncestor = (props) => {
  var {
    root,
    ancestor,
    renderElement,
    renderChunk = defaultRenderChunk
  } = props;
  return ancestor.children.map((chunkNode) => {
    if (chunkNode.type === "chunk") {
      var key = chunkNode.key.id;
      var renderedChunk = renderChunk({
        highest: ancestor === root,
        lowest: chunkNode.children.some((c) => c.type === "leaf"),
        attributes: {
          "data-slate-chunk": true
        },
        children: /* @__PURE__ */ React.createElement(MemoizedChunk, {
          root,
          ancestor: chunkNode,
          renderElement,
          renderChunk
        })
      });
      return /* @__PURE__ */ React.createElement(reactExports.Fragment, {
        key
      }, renderedChunk);
    }
    var element = chunkNode.node;
    return renderElement(element, chunkNode.index, chunkNode.key);
  });
};
var ChunkTree = ChunkAncestor;
var MemoizedChunk = /* @__PURE__ */ React.memo(ChunkAncestor, (prev, next) => prev.root === next.root && prev.renderElement === next.renderElement && prev.renderChunk === next.renderChunk && !next.root.modifiedChunks.has(next.ancestor));
var ElementContext = /* @__PURE__ */ reactExports.createContext(null);
var useChildren = (props) => {
  var {
    decorations,
    node,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderText,
    renderLeaf
  } = props;
  var editor = useSlateStatic();
  IS_NODE_MAP_DIRTY.set(editor, false);
  var isEditor = Editor.isEditor(node);
  var isBlock = !isEditor && Element$1.isElement(node) && !editor.isInline(node);
  var isLeafBlock = isBlock && Editor.hasInlines(editor, node);
  var chunkSize = isLeafBlock ? null : editor.getChunkSize(node);
  var chunking = !!chunkSize;
  var {
    decorationsByChild,
    childrenToRedecorate
  } = useDecorationsByChild(editor, node, decorations);
  if (!chunking) {
    node.children.forEach((n, i) => {
      NODE_TO_INDEX.set(n, i);
      NODE_TO_PARENT.set(n, node);
    });
  }
  var renderElementComponent = reactExports.useCallback((n, i, cachedKey) => {
    var key = cachedKey !== null && cachedKey !== void 0 ? cachedKey : ReactEditor.findKey(editor, n);
    return /* @__PURE__ */ React.createElement(ElementContext.Provider, {
      key: "provider-".concat(key.id),
      value: n
    }, /* @__PURE__ */ React.createElement(MemoizedElement, {
      decorations: decorationsByChild[i],
      element: n,
      key: key.id,
      renderElement,
      renderChunk,
      renderPlaceholder,
      renderLeaf,
      renderText
    }));
  }, [editor, decorationsByChild, renderElement, renderChunk, renderPlaceholder, renderLeaf, renderText]);
  var renderTextComponent = (n, i) => {
    var key = ReactEditor.findKey(editor, n);
    return /* @__PURE__ */ React.createElement(MemoizedText, {
      decorations: decorationsByChild[i],
      key: key.id,
      isLast: i === node.children.length - 1,
      parent: node,
      renderPlaceholder,
      renderLeaf,
      renderText,
      text: n
    });
  };
  if (!chunking) {
    return node.children.map((n, i) => Text$1.isText(n) ? renderTextComponent(n, i) : renderElementComponent(n, i));
  }
  var chunkTree = getChunkTreeForNode(editor, node, {
    reconcile: {
      chunkSize,
      rerenderChildren: childrenToRedecorate,
      onInsert: (n, i) => {
        NODE_TO_INDEX.set(n, i);
        NODE_TO_PARENT.set(n, node);
      },
      onUpdate: (n, i) => {
        NODE_TO_INDEX.set(n, i);
        NODE_TO_PARENT.set(n, node);
      },
      onIndexChange: (n, i) => {
        NODE_TO_INDEX.set(n, i);
      }
    }
  });
  return /* @__PURE__ */ React.createElement(ChunkTree, {
    root: chunkTree,
    ancestor: chunkTree,
    renderElement: renderElementComponent,
    renderChunk
  });
};
var useDecorationsByChild = (editor, node, decorations) => {
  var decorationsByChild = splitDecorationsByChild(editor, node, decorations);
  var mutableDecorationsByChild = reactExports.useRef(decorationsByChild).current;
  var childrenToRedecorate = [];
  mutableDecorationsByChild.length = decorationsByChild.length;
  for (var i = 0; i < decorationsByChild.length; i++) {
    var _mutableDecorationsBy;
    var _decorations = decorationsByChild[i];
    var previousDecorations = (_mutableDecorationsBy = mutableDecorationsByChild[i]) !== null && _mutableDecorationsBy !== void 0 ? _mutableDecorationsBy : null;
    if (!isElementDecorationsEqual(previousDecorations, _decorations)) {
      mutableDecorationsByChild[i] = _decorations;
      childrenToRedecorate.push(i);
    }
  }
  return {
    decorationsByChild: mutableDecorationsByChild,
    childrenToRedecorate
  };
};
var ReadOnlyContext = /* @__PURE__ */ reactExports.createContext(false);
var useReadOnly = () => {
  return reactExports.useContext(ReadOnlyContext);
};
var SlateSelectorContext = /* @__PURE__ */ reactExports.createContext({});
function useSelectorContext() {
  var eventListeners = reactExports.useRef(/* @__PURE__ */ new Set());
  var deferredEventListeners = reactExports.useRef(/* @__PURE__ */ new Set());
  var onChange = reactExports.useCallback(() => {
    eventListeners.current.forEach((listener) => listener());
  }, []);
  var flushDeferred = reactExports.useCallback(() => {
    deferredEventListeners.current.forEach((listener) => listener());
    deferredEventListeners.current.clear();
  }, []);
  var addEventListener = reactExports.useCallback(function(callbackProp) {
    var {
      deferred = false
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var callback = deferred ? () => deferredEventListeners.current.add(callbackProp) : callbackProp;
    eventListeners.current.add(callback);
    return () => {
      eventListeners.current.delete(callback);
    };
  }, []);
  var selectorContext = reactExports.useMemo(() => ({
    addEventListener,
    flushDeferred
  }), [addEventListener, flushDeferred]);
  return {
    selectorContext,
    onChange
  };
}
function useFlushDeferredSelectorsOnRender() {
  var {
    flushDeferred
  } = reactExports.useContext(SlateSelectorContext);
  useIsomorphicLayoutEffect(flushDeferred);
}
var useSlate = () => {
  var {
    addEventListener
  } = reactExports.useContext(SlateSelectorContext);
  var [, forceRender] = reactExports.useReducer((s) => s + 1, 0);
  if (!addEventListener) {
    throw new Error("The `useSlate` hook must be used inside the <Slate> component's context.");
  }
  useIsomorphicLayoutEffect(() => addEventListener(forceRender), [addEventListener]);
  return useSlateStatic();
};
function useTrackUserInput() {
  var editor = useSlateStatic();
  var receivedUserInput = reactExports.useRef(false);
  var animationFrameIdRef = reactExports.useRef(0);
  var onUserInput = reactExports.useCallback(() => {
    if (receivedUserInput.current) {
      return;
    }
    receivedUserInput.current = true;
    var window2 = ReactEditor.getWindow(editor);
    window2.cancelAnimationFrame(animationFrameIdRef.current);
    animationFrameIdRef.current = window2.requestAnimationFrame(() => {
      receivedUserInput.current = false;
    });
  }, [editor]);
  reactExports.useEffect(() => () => cancelAnimationFrame(animationFrameIdRef.current), []);
  return {
    receivedUserInput,
    onUserInput
  };
}
var createRestoreDomManager = (editor, receivedUserInput) => {
  var bufferedMutations = [];
  var clear = () => {
    bufferedMutations = [];
  };
  var registerMutations = (mutations) => {
    if (!receivedUserInput.current) {
      return;
    }
    var trackedMutations = mutations.filter((mutation) => isTrackedMutation(editor, mutation, mutations));
    bufferedMutations.push(...trackedMutations);
  };
  function restoreDOM() {
    if (bufferedMutations.length > 0) {
      bufferedMutations.reverse().forEach((mutation) => {
        if (mutation.type === "characterData") {
          return;
        }
        mutation.removedNodes.forEach((node) => {
          mutation.target.insertBefore(node, mutation.nextSibling);
        });
        mutation.addedNodes.forEach((node) => {
          mutation.target.removeChild(node);
        });
      });
      clear();
    }
  }
  return {
    registerMutations,
    restoreDOM,
    clear
  };
};
var MUTATION_OBSERVER_CONFIG = {
  subtree: true,
  childList: true,
  characterData: true,
  characterDataOldValue: true
};
class RestoreDOMComponent extends reactExports.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "context", null);
    _defineProperty(this, "manager", null);
    _defineProperty(this, "mutationObserver", null);
  }
  observe() {
    var _this$mutationObserve;
    var {
      node
    } = this.props;
    if (!node.current) {
      throw new Error("Failed to attach MutationObserver, `node` is undefined");
    }
    (_this$mutationObserve = this.mutationObserver) === null || _this$mutationObserve === void 0 || _this$mutationObserve.observe(node.current, MUTATION_OBSERVER_CONFIG);
  }
  componentDidMount() {
    var {
      receivedUserInput
    } = this.props;
    var editor = this.context;
    this.manager = createRestoreDomManager(editor, receivedUserInput);
    this.mutationObserver = new MutationObserver(this.manager.registerMutations);
    this.observe();
  }
  getSnapshotBeforeUpdate() {
    var _this$mutationObserve2, _this$mutationObserve3, _this$manager2;
    var pendingMutations = (_this$mutationObserve2 = this.mutationObserver) === null || _this$mutationObserve2 === void 0 ? void 0 : _this$mutationObserve2.takeRecords();
    if (pendingMutations !== null && pendingMutations !== void 0 && pendingMutations.length) {
      var _this$manager;
      (_this$manager = this.manager) === null || _this$manager === void 0 || _this$manager.registerMutations(pendingMutations);
    }
    (_this$mutationObserve3 = this.mutationObserver) === null || _this$mutationObserve3 === void 0 || _this$mutationObserve3.disconnect();
    (_this$manager2 = this.manager) === null || _this$manager2 === void 0 || _this$manager2.restoreDOM();
    return null;
  }
  componentDidUpdate() {
    var _this$manager3;
    (_this$manager3 = this.manager) === null || _this$manager3 === void 0 || _this$manager3.clear();
    this.observe();
  }
  componentWillUnmount() {
    var _this$mutationObserve4;
    (_this$mutationObserve4 = this.mutationObserver) === null || _this$mutationObserve4 === void 0 || _this$mutationObserve4.disconnect();
  }
  render() {
    return this.props.children;
  }
}
_defineProperty(RestoreDOMComponent, "contextType", EditorContext);
var RestoreDOM = IS_ANDROID ? RestoreDOMComponent : (_ref) => {
  var {
    children
  } = _ref;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};
var ComposingContext = /* @__PURE__ */ reactExports.createContext(false);
var useComposing = () => {
  return reactExports.useContext(ComposingContext);
};
var _excluded$1 = ["autoFocus", "decorate", "onDOMBeforeInput", "placeholder", "readOnly", "renderElement", "renderChunk", "renderLeaf", "renderText", "renderPlaceholder", "scrollSelectionIntoView", "style", "as", "disableDefaultStyles"], _excluded2 = ["text"];
function ownKeys(e2, r) {
  var t = Object.keys(e2);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e2);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e2, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e2) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e2, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e2, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e2;
}
var Children = (props) => /* @__PURE__ */ React.createElement(React.Fragment, null, useChildren(props));
var Editable = /* @__PURE__ */ reactExports.forwardRef((props, forwardedRef) => {
  var defaultRenderPlaceholder = reactExports.useCallback((props2) => /* @__PURE__ */ React.createElement(DefaultPlaceholder, _objectSpread({}, props2)), []);
  var {
    autoFocus,
    decorate = defaultDecorate,
    onDOMBeforeInput: propsOnDOMBeforeInput,
    placeholder,
    readOnly = false,
    renderElement,
    renderChunk,
    renderLeaf,
    renderText,
    renderPlaceholder = defaultRenderPlaceholder,
    scrollSelectionIntoView = defaultScrollSelectionIntoView,
    style: userStyle = {},
    as: Component = "div",
    disableDefaultStyles = false
  } = props, attributes = _objectWithoutProperties(props, _excluded$1);
  var editor = useSlate();
  var [isComposing, setIsComposing] = reactExports.useState(false);
  var ref = reactExports.useRef(null);
  var deferredOperations = reactExports.useRef([]);
  var [placeholderHeight, setPlaceholderHeight] = reactExports.useState();
  var processing = reactExports.useRef(false);
  var {
    onUserInput,
    receivedUserInput
  } = useTrackUserInput();
  var [, forceRender] = reactExports.useReducer((s) => s + 1, 0);
  EDITOR_TO_FORCE_RENDER.set(editor, forceRender);
  IS_READ_ONLY.set(editor, readOnly);
  var state = reactExports.useMemo(() => ({
    isDraggingInternally: false,
    isUpdatingSelection: false,
    latestElement: null,
    hasMarkPlaceholder: false
  }), []);
  reactExports.useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);
  var androidInputManagerRef = reactExports.useRef();
  var onDOMSelectionChange = reactExports.useMemo(() => throttle(() => {
    if (IS_NODE_MAP_DIRTY.get(editor)) {
      onDOMSelectionChange();
      return;
    }
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = el.getRootNode();
    if (!processing.current && IS_WEBKIT && root instanceof ShadowRoot) {
      processing.current = true;
      var active = getActiveElement();
      if (active) {
        document.execCommand("indent");
      } else {
        Transforms.deselect(editor);
      }
      processing.current = false;
      return;
    }
    var androidInputManager = androidInputManagerRef.current;
    if ((IS_ANDROID || !ReactEditor.isComposing(editor)) && (!state.isUpdatingSelection || androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing()) && !state.isDraggingInternally) {
      var _root = ReactEditor.findDocumentOrShadowRoot(editor);
      var {
        activeElement
      } = _root;
      var _el = ReactEditor.toDOMNode(editor, editor);
      var domSelection = getSelection(_root);
      if (activeElement === _el) {
        state.latestElement = activeElement;
        IS_FOCUSED.set(editor, true);
      } else {
        IS_FOCUSED.delete(editor);
      }
      if (!domSelection) {
        return Transforms.deselect(editor);
      }
      var {
        anchorNode,
        focusNode
      } = domSelection;
      var anchorNodeSelectable = ReactEditor.hasEditableTarget(editor, anchorNode) || ReactEditor.isTargetInsideNonReadonlyVoid(editor, anchorNode);
      var focusNodeInEditor = ReactEditor.hasTarget(editor, focusNode);
      if (anchorNodeSelectable && focusNodeInEditor) {
        var range = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true
        });
        if (range) {
          if (!ReactEditor.isComposing(editor) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.hasPendingChanges()) && !(androidInputManager !== null && androidInputManager !== void 0 && androidInputManager.isFlushing())) {
            Transforms.select(editor, range);
          } else {
            androidInputManager === null || androidInputManager === void 0 || androidInputManager.handleUserSelect(range);
          }
        }
      }
      if (readOnly && (!anchorNodeSelectable || !focusNodeInEditor)) {
        Transforms.deselect(editor);
      }
    }
  }, 100), [editor, readOnly, state]);
  var scheduleOnDOMSelectionChange = reactExports.useMemo(() => debounce(onDOMSelectionChange, 0), [onDOMSelectionChange]);
  androidInputManagerRef.current = useAndroidInputManager({
    node: ref,
    onDOMSelectionChange,
    scheduleOnDOMSelectionChange
  });
  useIsomorphicLayoutEffect(() => {
    var _androidInputManagerR, _androidInputManagerR2;
    var window2;
    if (ref.current && (window2 = getDefaultView(ref.current))) {
      EDITOR_TO_WINDOW.set(editor, window2);
      EDITOR_TO_ELEMENT.set(editor, ref.current);
      NODE_TO_ELEMENT.set(editor, ref.current);
      ELEMENT_TO_NODE.set(ref.current, editor);
    } else {
      NODE_TO_ELEMENT.delete(editor);
    }
    var {
      selection
    } = editor;
    var root = ReactEditor.findDocumentOrShadowRoot(editor);
    var domSelection = getSelection(root);
    if (!domSelection || !ReactEditor.isFocused(editor) || (_androidInputManagerR = androidInputManagerRef.current) !== null && _androidInputManagerR !== void 0 && _androidInputManagerR.hasPendingAction()) {
      return;
    }
    var setDomSelection = (forceChange) => {
      var hasDomSelection = domSelection.type !== "None";
      if (!selection && !hasDomSelection) {
        return;
      }
      var focusNode = domSelection.focusNode;
      var anchorNode;
      if (IS_FIREFOX && domSelection.rangeCount > 1) {
        var firstRange = domSelection.getRangeAt(0);
        var lastRange = domSelection.getRangeAt(domSelection.rangeCount - 1);
        if (firstRange.startContainer === focusNode) {
          anchorNode = lastRange.endContainer;
        } else {
          anchorNode = firstRange.startContainer;
        }
      } else {
        anchorNode = domSelection.anchorNode;
      }
      var editorElement = EDITOR_TO_ELEMENT.get(editor);
      var hasDomSelectionInEditor = false;
      if (containsShadowAware(editorElement, anchorNode) && containsShadowAware(editorElement, focusNode)) {
        hasDomSelectionInEditor = true;
      }
      if (hasDomSelection && hasDomSelectionInEditor && selection && !forceChange) {
        var slateRange = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: true,
          // domSelection is not necessarily a valid Slate range
          // (e.g. when clicking on contentEditable:false element)
          suppressThrow: true
        });
        if (slateRange && Range.equals(slateRange, selection)) {
          var _anchorNode;
          if (!state.hasMarkPlaceholder) {
            return;
          }
          if ((_anchorNode = anchorNode) !== null && _anchorNode !== void 0 && (_anchorNode = _anchorNode.parentElement) !== null && _anchorNode !== void 0 && _anchorNode.hasAttribute("data-slate-mark-placeholder")) {
            return;
          }
        }
      }
      if (selection && !ReactEditor.hasRange(editor, selection)) {
        editor.selection = ReactEditor.toSlateRange(editor, domSelection, {
          exactMatch: false,
          suppressThrow: true
        });
        return;
      }
      state.isUpdatingSelection = true;
      var newDomRange = null;
      try {
        newDomRange = selection && ReactEditor.toDOMRange(editor, selection);
      } catch (e2) {
      }
      if (newDomRange) {
        if (ReactEditor.isComposing(editor) && !IS_ANDROID) {
          domSelection.collapseToEnd();
        } else if (Range.isBackward(selection)) {
          domSelection.setBaseAndExtent(newDomRange.endContainer, newDomRange.endOffset, newDomRange.startContainer, newDomRange.startOffset);
        } else {
          domSelection.setBaseAndExtent(newDomRange.startContainer, newDomRange.startOffset, newDomRange.endContainer, newDomRange.endOffset);
        }
        scrollSelectionIntoView(editor, newDomRange);
      } else {
        domSelection.removeAllRanges();
      }
      return newDomRange;
    };
    if (domSelection.rangeCount <= 1) {
      setDomSelection();
    }
    var ensureSelection = ((_androidInputManagerR2 = androidInputManagerRef.current) === null || _androidInputManagerR2 === void 0 ? void 0 : _androidInputManagerR2.isFlushing()) === "action";
    if (!IS_ANDROID || !ensureSelection) {
      setTimeout(() => {
        state.isUpdatingSelection = false;
      });
      return;
    }
    var timeoutId = null;
    var animationFrameId = requestAnimationFrame(() => {
      if (ensureSelection) {
        var ensureDomSelection = (forceChange) => {
          try {
            var el = ReactEditor.toDOMNode(editor, editor);
            el.focus();
            setDomSelection(forceChange);
          } catch (e2) {
          }
        };
        ensureDomSelection();
        timeoutId = setTimeout(() => {
          ensureDomSelection(true);
          state.isUpdatingSelection = false;
        });
      }
    });
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });
  var onDOMBeforeInput = reactExports.useCallback((event) => {
    handleNativeHistoryEvents(editor, event);
    var el = ReactEditor.toDOMNode(editor, editor);
    var root = el.getRootNode();
    if (processing !== null && processing !== void 0 && processing.current && IS_WEBKIT && root instanceof ShadowRoot) {
      var ranges = event.getTargetRanges();
      var range = ranges[0];
      var newRange = new window.Range();
      newRange.setStart(range.startContainer, range.startOffset);
      newRange.setEnd(range.endContainer, range.endOffset);
      var slateRange = ReactEditor.toSlateRange(editor, newRange, {
        exactMatch: false,
        suppressThrow: false
      });
      Transforms.select(editor, slateRange);
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    onUserInput();
    if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isDOMEventHandled(event, propsOnDOMBeforeInput)) {
      var _EDITOR_TO_USER_SELEC;
      if (androidInputManagerRef.current) {
        return androidInputManagerRef.current.handleDOMBeforeInput(event);
      }
      scheduleOnDOMSelectionChange.flush();
      onDOMSelectionChange.flush();
      var {
        selection
      } = editor;
      var {
        inputType: type
      } = event;
      var data = event.dataTransfer || event.data || void 0;
      var isCompositionChange = type === "insertCompositionText" || type === "deleteCompositionText";
      if (isCompositionChange && ReactEditor.isComposing(editor)) {
        return;
      }
      var native = false;
      if (type === "insertText" && selection && Range.isCollapsed(selection) && // Only use native character insertion for single characters a-z or space for now.
      // Long-press events (hold a + press 4 = ä) to choose a special character otherwise
      // causes duplicate inserts.
      event.data && event.data.length === 1 && /[a-z ]/i.test(event.data) && // Chrome has issues correctly editing the start of nodes: https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
      // When there is an inline element, e.g. a link, and you select
      // right after it (the start of the next node).
      selection.anchor.offset !== 0) {
        native = true;
        if (editor.marks) {
          native = false;
        }
        if (!IS_NODE_MAP_DIRTY.get(editor)) {
          var _node$parentElement, _window$getComputedSt;
          var {
            anchor: anchor2
          } = selection;
          var [node, offset] = ReactEditor.toDOMPoint(editor, anchor2);
          var anchorNode = (_node$parentElement = node.parentElement) === null || _node$parentElement === void 0 ? void 0 : _node$parentElement.closest("a");
          var _window = ReactEditor.getWindow(editor);
          if (native && anchorNode && ReactEditor.hasDOMNode(editor, anchorNode)) {
            var _lastText$textContent;
            var lastText = _window === null || _window === void 0 ? void 0 : _window.document.createTreeWalker(anchorNode, NodeFilter.SHOW_TEXT).lastChild();
            if (lastText === node && ((_lastText$textContent = lastText.textContent) === null || _lastText$textContent === void 0 ? void 0 : _lastText$textContent.length) === offset) {
              native = false;
            }
          }
          if (native && node.parentElement && (_window === null || _window === void 0 || (_window$getComputedSt = _window.getComputedStyle(node.parentElement)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.whiteSpace) === "pre") {
            var block = Editor.above(editor, {
              at: anchor2.path,
              match: (n) => Element$1.isElement(n) && Editor.isBlock(editor, n)
            });
            if (block && Node.string(block[0]).includes("	")) {
              native = false;
            }
          }
        }
      }
      if ((!type.startsWith("delete") || type.startsWith("deleteBy")) && !IS_NODE_MAP_DIRTY.get(editor)) {
        var [targetRange2] = event.getTargetRanges();
        if (targetRange2) {
          var _range = ReactEditor.toSlateRange(editor, targetRange2, {
            exactMatch: false,
            suppressThrow: false
          });
          if (!selection || !Range.equals(selection, _range)) {
            native = false;
            var selectionRef = !isCompositionChange && editor.selection && Editor.rangeRef(editor, editor.selection);
            Transforms.select(editor, _range);
            if (selectionRef) {
              EDITOR_TO_USER_SELECTION.set(editor, selectionRef);
            }
          }
        }
      }
      if (isCompositionChange) {
        return;
      }
      if (!native) {
        event.preventDefault();
      }
      if (selection && Range.isExpanded(selection) && type.startsWith("delete")) {
        var direction = type.endsWith("Backward") ? "backward" : "forward";
        Editor.deleteFragment(editor, {
          direction
        });
        return;
      }
      switch (type) {
        case "deleteByComposition":
        case "deleteByCut":
        case "deleteByDrag": {
          Editor.deleteFragment(editor);
          break;
        }
        case "deleteContent":
        case "deleteContentForward": {
          Editor.deleteForward(editor);
          break;
        }
        case "deleteContentBackward": {
          Editor.deleteBackward(editor);
          break;
        }
        case "deleteEntireSoftLine": {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineBackward": {
          Editor.deleteBackward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteHardLineForward": {
          Editor.deleteForward(editor, {
            unit: "block"
          });
          break;
        }
        case "deleteSoftLineForward": {
          Editor.deleteForward(editor, {
            unit: "line"
          });
          break;
        }
        case "deleteWordBackward": {
          Editor.deleteBackward(editor, {
            unit: "word"
          });
          break;
        }
        case "deleteWordForward": {
          Editor.deleteForward(editor, {
            unit: "word"
          });
          break;
        }
        case "insertLineBreak":
          Editor.insertSoftBreak(editor);
          break;
        case "insertParagraph": {
          Editor.insertBreak(editor);
          break;
        }
        case "insertFromComposition":
        case "insertFromDrop":
        case "insertFromPaste":
        case "insertFromYank":
        case "insertReplacementText":
        case "insertText": {
          if (type === "insertFromComposition") {
            if (ReactEditor.isComposing(editor)) {
              setIsComposing(false);
              IS_COMPOSING.set(editor, false);
            }
          }
          if ((data === null || data === void 0 ? void 0 : data.constructor.name) === "DataTransfer") {
            ReactEditor.insertData(editor, data);
          } else if (typeof data === "string") {
            if (native) {
              deferredOperations.current.push(() => Editor.insertText(editor, data));
            } else {
              Editor.insertText(editor, data);
            }
          }
          break;
        }
      }
      var toRestore = (_EDITOR_TO_USER_SELEC = EDITOR_TO_USER_SELECTION.get(editor)) === null || _EDITOR_TO_USER_SELEC === void 0 ? void 0 : _EDITOR_TO_USER_SELEC.unref();
      EDITOR_TO_USER_SELECTION.delete(editor);
      if (toRestore && (!editor.selection || !Range.equals(editor.selection, toRestore))) {
        Transforms.select(editor, toRestore);
      }
    }
  }, [editor, onDOMSelectionChange, onUserInput, propsOnDOMBeforeInput, readOnly, scheduleOnDOMSelectionChange]);
  var callbackRef = reactExports.useCallback((node) => {
    if (node == null) {
      onDOMSelectionChange.cancel();
      scheduleOnDOMSelectionChange.cancel();
      EDITOR_TO_ELEMENT.delete(editor);
      NODE_TO_ELEMENT.delete(editor);
      if (ref.current && HAS_BEFORE_INPUT_SUPPORT) {
        ref.current.removeEventListener("beforeinput", onDOMBeforeInput);
      }
    } else {
      if (HAS_BEFORE_INPUT_SUPPORT) {
        node.addEventListener("beforeinput", onDOMBeforeInput);
      }
    }
    ref.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }, [onDOMSelectionChange, scheduleOnDOMSelectionChange, editor, onDOMBeforeInput, forwardedRef]);
  useIsomorphicLayoutEffect(() => {
    var window2 = ReactEditor.getWindow(editor);
    var onSelectionChange = (_ref) => {
      var {
        target
      } = _ref;
      var targetElement = target instanceof HTMLElement ? target : null;
      var targetTagName = targetElement === null || targetElement === void 0 ? void 0 : targetElement.tagName;
      if (targetTagName === "INPUT" || targetTagName === "TEXTAREA") {
        return;
      }
      scheduleOnDOMSelectionChange();
    };
    window2.document.addEventListener("selectionchange", onSelectionChange);
    var stoppedDragging = () => {
      state.isDraggingInternally = false;
    };
    window2.document.addEventListener("dragend", stoppedDragging);
    window2.document.addEventListener("drop", stoppedDragging);
    return () => {
      window2.document.removeEventListener("selectionchange", onSelectionChange);
      window2.document.removeEventListener("dragend", stoppedDragging);
      window2.document.removeEventListener("drop", stoppedDragging);
    };
  }, [scheduleOnDOMSelectionChange, state]);
  var decorations = decorate([editor, []]);
  var decorateContext = useDecorateContext(decorate);
  var showPlaceholder = placeholder && editor.children.length === 1 && Array.from(Node.texts(editor)).length === 1 && Node.string(editor) === "" && !isComposing;
  var placeHolderResizeHandler = reactExports.useCallback((placeholderEl) => {
    if (placeholderEl && showPlaceholder) {
      var _placeholderEl$getBou;
      setPlaceholderHeight((_placeholderEl$getBou = placeholderEl.getBoundingClientRect()) === null || _placeholderEl$getBou === void 0 ? void 0 : _placeholderEl$getBou.height);
    } else {
      setPlaceholderHeight(void 0);
    }
  }, [showPlaceholder]);
  if (showPlaceholder) {
    var start = Editor.start(editor, []);
    decorations.push({
      [PLACEHOLDER_SYMBOL]: true,
      placeholder,
      onPlaceholderResize: placeHolderResizeHandler,
      anchor: start,
      focus: start
    });
  }
  var {
    marks
  } = editor;
  state.hasMarkPlaceholder = false;
  if (editor.selection && Range.isCollapsed(editor.selection) && marks) {
    var {
      anchor
    } = editor.selection;
    var leaf = Node.leaf(editor, anchor.path);
    var rest = _objectWithoutProperties(leaf, _excluded2);
    if (!Text$1.equals(leaf, marks, {
      loose: true
    })) {
      state.hasMarkPlaceholder = true;
      var unset = Object.fromEntries(Object.keys(rest).map((mark) => [mark, null]));
      decorations.push(_objectSpread(_objectSpread(_objectSpread({
        [MARK_PLACEHOLDER_SYMBOL]: true
      }, unset), marks), {}, {
        anchor,
        focus: anchor
      }));
    }
  }
  reactExports.useEffect(() => {
    setTimeout(() => {
      var {
        selection
      } = editor;
      if (selection) {
        var {
          anchor: _anchor
        } = selection;
        var _text = Node.leaf(editor, _anchor.path);
        if (marks && !Text$1.equals(_text, marks, {
          loose: true
        })) {
          EDITOR_TO_PENDING_INSERTION_MARKS.set(editor, marks);
          return;
        }
      }
      EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
    });
  });
  useFlushDeferredSelectorsOnRender();
  return /* @__PURE__ */ React.createElement(ReadOnlyContext.Provider, {
    value: readOnly
  }, /* @__PURE__ */ React.createElement(ComposingContext.Provider, {
    value: isComposing
  }, /* @__PURE__ */ React.createElement(DecorateContext.Provider, {
    value: decorateContext
  }, /* @__PURE__ */ React.createElement(RestoreDOM, {
    node: ref,
    receivedUserInput
  }, /* @__PURE__ */ React.createElement(Component, _objectSpread(_objectSpread({
    role: readOnly ? void 0 : "textbox",
    "aria-multiline": readOnly ? void 0 : true,
    translate: "no"
  }, attributes), {}, {
    // COMPAT: Certain browsers don't support the `beforeinput` event, so we'd
    // have to use hacks to make these replacement-based features work.
    // For SSR situations HAS_BEFORE_INPUT_SUPPORT is false and results in prop
    // mismatch warning app moves to browser. Pass-through consumer props when
    // not CAN_USE_DOM (SSR) and default to falsy value
    spellCheck: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.spellCheck : false,
    autoCorrect: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCorrect : "false",
    autoCapitalize: HAS_BEFORE_INPUT_SUPPORT || !CAN_USE_DOM ? attributes.autoCapitalize : "false",
    "data-slate-editor": true,
    "data-slate-node": "value",
    // explicitly set this
    contentEditable: !readOnly,
    // in some cases, a decoration needs access to the range / selection to decorate a text node,
    // then you will select the whole text node when you select part the of text
    // this magic zIndex="-1" will fix it
    zindex: -1,
    suppressContentEditableWarning: true,
    ref: callbackRef,
    style: _objectSpread(_objectSpread({}, disableDefaultStyles ? {} : _objectSpread({
      // Allow positioning relative to the editable element.
      position: "relative",
      // Preserve adjacent whitespace and new lines.
      whiteSpace: "pre-wrap",
      // Allow words to break if they are too long.
      wordWrap: "break-word"
    }, placeholderHeight ? {
      minHeight: placeholderHeight
    } : {})), userStyle),
    onBeforeInput: reactExports.useCallback((event) => {
      if (!HAS_BEFORE_INPUT_SUPPORT && !readOnly && !isEventHandled(event, attributes.onBeforeInput) && ReactEditor.hasSelectableTarget(editor, event.target)) {
        event.preventDefault();
        if (!ReactEditor.isComposing(editor)) {
          var _text2 = event.data;
          Editor.insertText(editor, _text2);
        }
      }
    }, [attributes.onBeforeInput, editor, readOnly]),
    onInput: reactExports.useCallback((event) => {
      if (isEventHandled(event, attributes.onInput)) {
        return;
      }
      if (androidInputManagerRef.current) {
        androidInputManagerRef.current.handleInput();
        return;
      }
      for (var op of deferredOperations.current) {
        op();
      }
      deferredOperations.current = [];
      if (!ReactEditor.isFocused(editor)) {
        handleNativeHistoryEvents(editor, event.nativeEvent);
      }
    }, [attributes.onInput, editor]),
    onBlur: reactExports.useCallback((event) => {
      if (readOnly || state.isUpdatingSelection || !ReactEditor.hasSelectableTarget(editor, event.target) || isEventHandled(event, attributes.onBlur)) {
        return;
      }
      var root = ReactEditor.findDocumentOrShadowRoot(editor);
      if (state.latestElement === root.activeElement) {
        return;
      }
      var {
        relatedTarget
      } = event;
      var el = ReactEditor.toDOMNode(editor, editor);
      if (relatedTarget === el) {
        return;
      }
      if (isDOMElement(relatedTarget) && relatedTarget.hasAttribute("data-slate-spacer")) {
        return;
      }
      if (relatedTarget != null && isDOMNode(relatedTarget) && ReactEditor.hasDOMNode(editor, relatedTarget)) {
        var node = ReactEditor.toSlateNode(editor, relatedTarget);
        if (Element$1.isElement(node) && !editor.isVoid(node)) {
          return;
        }
      }
      if (IS_WEBKIT) {
        var domSelection = getSelection(root);
        domSelection === null || domSelection === void 0 || domSelection.removeAllRanges();
      }
      IS_FOCUSED.delete(editor);
    }, [readOnly, state.isUpdatingSelection, state.latestElement, editor, attributes.onBlur]),
    onClick: reactExports.useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onClick) && isDOMNode(event.target)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node);
        if (!Editor.hasPath(editor, path) || Node.get(editor, path) !== node) {
          return;
        }
        if (event.detail === TRIPLE_CLICK && path.length >= 1) {
          var blockPath = path;
          if (!(Element$1.isElement(node) && Editor.isBlock(editor, node))) {
            var _block$;
            var block = Editor.above(editor, {
              match: (n) => Element$1.isElement(n) && Editor.isBlock(editor, n),
              at: path
            });
            blockPath = (_block$ = block === null || block === void 0 ? void 0 : block[1]) !== null && _block$ !== void 0 ? _block$ : path.slice(0, 1);
          }
          var range = Editor.range(editor, blockPath);
          Transforms.select(editor, range);
          return;
        }
        if (readOnly) {
          return;
        }
        var _start = Editor.start(editor, path);
        var end = Editor.end(editor, path);
        var startVoid = Editor.void(editor, {
          at: _start
        });
        var endVoid = Editor.void(editor, {
          at: end
        });
        if (startVoid && endVoid && Path.equals(startVoid[1], endVoid[1])) {
          var _range2 = Editor.range(editor, _start);
          Transforms.select(editor, _range2);
        }
      }
    }, [editor, attributes.onClick, readOnly]),
    onCompositionEnd: reactExports.useCallback((event) => {
      if (isDOMEventTargetInput(event)) {
        return;
      }
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR3;
        if (ReactEditor.isComposing(editor)) {
          Promise.resolve().then(() => {
            setIsComposing(false);
            IS_COMPOSING.set(editor, false);
          });
        }
        (_androidInputManagerR3 = androidInputManagerRef.current) === null || _androidInputManagerR3 === void 0 || _androidInputManagerR3.handleCompositionEnd(event);
        if (isEventHandled(event, attributes.onCompositionEnd) || IS_ANDROID) {
          return;
        }
        if (!IS_WEBKIT && !IS_FIREFOX_LEGACY && !IS_IOS && !IS_WECHATBROWSER && !IS_UC_MOBILE && event.data) {
          var placeholderMarks = EDITOR_TO_PENDING_INSERTION_MARKS.get(editor);
          EDITOR_TO_PENDING_INSERTION_MARKS.delete(editor);
          if (placeholderMarks !== void 0) {
            EDITOR_TO_USER_MARKS.set(editor, editor.marks);
            editor.marks = placeholderMarks;
          }
          Editor.insertText(editor, event.data);
          var userMarks = EDITOR_TO_USER_MARKS.get(editor);
          EDITOR_TO_USER_MARKS.delete(editor);
          if (userMarks !== void 0) {
            editor.marks = userMarks;
          }
        }
      }
    }, [attributes.onCompositionEnd, editor]),
    onCompositionUpdate: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCompositionUpdate) && !isDOMEventTargetInput(event)) {
        if (!ReactEditor.isComposing(editor)) {
          setIsComposing(true);
          IS_COMPOSING.set(editor, true);
        }
      }
    }, [attributes.onCompositionUpdate, editor]),
    onCompositionStart: reactExports.useCallback((event) => {
      if (isDOMEventTargetInput(event)) {
        return;
      }
      if (ReactEditor.hasSelectableTarget(editor, event.target)) {
        var _androidInputManagerR4;
        (_androidInputManagerR4 = androidInputManagerRef.current) === null || _androidInputManagerR4 === void 0 || _androidInputManagerR4.handleCompositionStart(event);
        if (isEventHandled(event, attributes.onCompositionStart) || IS_ANDROID) {
          return;
        }
        setIsComposing(true);
        var {
          selection
        } = editor;
        if (selection && Range.isExpanded(selection)) {
          Editor.deleteFragment(editor);
          return;
        }
      }
    }, [attributes.onCompositionStart, editor]),
    onCopy: reactExports.useCallback((event) => {
      if (ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCopy) && !isDOMEventTargetInput(event)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, "copy");
      }
    }, [attributes.onCopy, editor]),
    onCut: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasSelectableTarget(editor, event.target) && !isEventHandled(event, attributes.onCut) && !isDOMEventTargetInput(event)) {
        event.preventDefault();
        ReactEditor.setFragmentData(editor, event.clipboardData, "cut");
        var {
          selection
        } = editor;
        if (selection) {
          if (Range.isExpanded(selection)) {
            Editor.deleteFragment(editor);
          } else {
            var node = Node.parent(editor, selection.anchor.path);
            if (Editor.isVoid(editor, node)) {
              Transforms.delete(editor);
            }
          }
        }
      }
    }, [readOnly, editor, attributes.onCut]),
    onDragOver: reactExports.useCallback((event) => {
      if (ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragOver)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        if (Element$1.isElement(node) && Editor.isVoid(editor, node)) {
          event.preventDefault();
        }
      }
    }, [attributes.onDragOver, editor]),
    onDragStart: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDragStart)) {
        var node = ReactEditor.toSlateNode(editor, event.target);
        var path = ReactEditor.findPath(editor, node);
        var voidMatch = Element$1.isElement(node) && Editor.isVoid(editor, node) || Editor.void(editor, {
          at: path,
          voids: true
        });
        if (voidMatch) {
          var range = Editor.range(editor, path);
          Transforms.select(editor, range);
        }
        state.isDraggingInternally = true;
        ReactEditor.setFragmentData(editor, event.dataTransfer, "drag");
      }
    }, [readOnly, editor, attributes.onDragStart, state]),
    onDrop: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasTarget(editor, event.target) && !isEventHandled(event, attributes.onDrop)) {
        event.preventDefault();
        var draggedRange = editor.selection;
        var range = ReactEditor.findEventRange(editor, event);
        var data = event.dataTransfer;
        Transforms.select(editor, range);
        if (state.isDraggingInternally) {
          if (draggedRange && !Range.equals(draggedRange, range) && !Editor.void(editor, {
            at: range,
            voids: true
          })) {
            Transforms.delete(editor, {
              at: draggedRange
            });
          }
        }
        ReactEditor.insertData(editor, data);
        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor);
        }
      }
    }, [readOnly, editor, attributes.onDrop, state]),
    onDragEnd: reactExports.useCallback((event) => {
      if (!readOnly && state.isDraggingInternally && attributes.onDragEnd && ReactEditor.hasTarget(editor, event.target)) {
        attributes.onDragEnd(event);
      }
    }, [readOnly, state, attributes, editor]),
    onFocus: reactExports.useCallback((event) => {
      if (!readOnly && !state.isUpdatingSelection && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onFocus)) {
        var el = ReactEditor.toDOMNode(editor, editor);
        var root = ReactEditor.findDocumentOrShadowRoot(editor);
        state.latestElement = root.activeElement;
        if (IS_FIREFOX && event.target !== el) {
          el.focus();
          return;
        }
        IS_FOCUSED.set(editor, true);
      }
    }, [readOnly, state, editor, attributes.onFocus]),
    onKeyDown: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target)) {
        var _androidInputManagerR5;
        (_androidInputManagerR5 = androidInputManagerRef.current) === null || _androidInputManagerR5 === void 0 || _androidInputManagerR5.handleKeyDown(event);
        var {
          nativeEvent
        } = event;
        if (ReactEditor.isComposing(editor) && nativeEvent.isComposing === false) {
          IS_COMPOSING.set(editor, false);
          setIsComposing(false);
        }
        if (isEventHandled(event, attributes.onKeyDown) || ReactEditor.isComposing(editor)) {
          return;
        }
        var {
          selection
        } = editor;
        var element = editor.children[selection !== null ? selection.focus.path[0] : 0];
        var isRTL = getDirection(Node.string(element)) === "rtl";
        if (hotkeys.isRedo(nativeEvent)) {
          event.preventDefault();
          var maybeHistoryEditor = editor;
          if (typeof maybeHistoryEditor.redo === "function") {
            maybeHistoryEditor.redo();
          }
          return;
        }
        if (hotkeys.isUndo(nativeEvent)) {
          event.preventDefault();
          var _maybeHistoryEditor = editor;
          if (typeof _maybeHistoryEditor.undo === "function") {
            _maybeHistoryEditor.undo();
          }
          return;
        }
        if (hotkeys.isMoveLineBackward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            reverse: true
          });
          return;
        }
        if (hotkeys.isMoveLineForward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line"
          });
          return;
        }
        if (hotkeys.isExtendLineBackward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            edge: "focus",
            reverse: true
          });
          return;
        }
        if (hotkeys.isExtendLineForward(nativeEvent)) {
          event.preventDefault();
          Transforms.move(editor, {
            unit: "line",
            edge: "focus"
          });
          return;
        }
        if (hotkeys.isMoveBackward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, {
              reverse: !isRTL
            });
          } else {
            Transforms.collapse(editor, {
              edge: isRTL ? "end" : "start"
            });
          }
          return;
        }
        if (hotkeys.isMoveForward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isCollapsed(selection)) {
            Transforms.move(editor, {
              reverse: isRTL
            });
          } else {
            Transforms.collapse(editor, {
              edge: isRTL ? "start" : "end"
            });
          }
          return;
        }
        if (hotkeys.isMoveWordBackward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, {
              edge: "focus"
            });
          }
          Transforms.move(editor, {
            unit: "word",
            reverse: !isRTL
          });
          return;
        }
        if (hotkeys.isMoveWordForward(nativeEvent)) {
          event.preventDefault();
          if (selection && Range.isExpanded(selection)) {
            Transforms.collapse(editor, {
              edge: "focus"
            });
          }
          Transforms.move(editor, {
            unit: "word",
            reverse: isRTL
          });
          return;
        }
        if (!HAS_BEFORE_INPUT_SUPPORT) {
          if (hotkeys.isBold(nativeEvent) || hotkeys.isItalic(nativeEvent) || hotkeys.isTransposeCharacter(nativeEvent)) {
            event.preventDefault();
            return;
          }
          if (hotkeys.isSoftBreak(nativeEvent)) {
            event.preventDefault();
            Editor.insertSoftBreak(editor);
            return;
          }
          if (hotkeys.isSplitBlock(nativeEvent)) {
            event.preventDefault();
            Editor.insertBreak(editor);
            return;
          }
          if (hotkeys.isDeleteBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor);
            }
            return;
          }
          if (hotkeys.isDeleteForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor);
            }
            return;
          }
          if (hotkeys.isDeleteLineBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor, {
                unit: "line"
              });
            }
            return;
          }
          if (hotkeys.isDeleteLineForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor, {
                unit: "line"
              });
            }
            return;
          }
          if (hotkeys.isDeleteWordBackward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "backward"
              });
            } else {
              Editor.deleteBackward(editor, {
                unit: "word"
              });
            }
            return;
          }
          if (hotkeys.isDeleteWordForward(nativeEvent)) {
            event.preventDefault();
            if (selection && Range.isExpanded(selection)) {
              Editor.deleteFragment(editor, {
                direction: "forward"
              });
            } else {
              Editor.deleteForward(editor, {
                unit: "word"
              });
            }
            return;
          }
        } else {
          if (IS_CHROME || IS_WEBKIT) {
            if (selection && (hotkeys.isDeleteBackward(nativeEvent) || hotkeys.isDeleteForward(nativeEvent)) && Range.isCollapsed(selection)) {
              var currentNode = Node.parent(editor, selection.anchor.path);
              if (Element$1.isElement(currentNode) && Editor.isVoid(editor, currentNode) && (Editor.isInline(editor, currentNode) || Editor.isBlock(editor, currentNode))) {
                event.preventDefault();
                Editor.deleteBackward(editor, {
                  unit: "block"
                });
                return;
              }
            }
          }
        }
      }
    }, [readOnly, editor, attributes.onKeyDown]),
    onPaste: reactExports.useCallback((event) => {
      if (!readOnly && ReactEditor.hasEditableTarget(editor, event.target) && !isEventHandled(event, attributes.onPaste)) {
        if (!HAS_BEFORE_INPUT_SUPPORT || isPlainTextOnlyPaste(event.nativeEvent) || IS_WEBKIT) {
          event.preventDefault();
          ReactEditor.insertData(editor, event.clipboardData);
        }
      }
    }, [readOnly, editor, attributes.onPaste])
  }), /* @__PURE__ */ React.createElement(Children, {
    decorations,
    node: editor,
    renderElement,
    renderChunk,
    renderPlaceholder,
    renderLeaf,
    renderText
  }))))));
});
var DefaultPlaceholder = (_ref2) => {
  var {
    attributes,
    children
  } = _ref2;
  return (
    // COMPAT: Artificially add a line-break to the end on the placeholder element
    // to prevent Android IMEs to pick up its content in autocorrect and to auto-capitalize the first letter
    /* @__PURE__ */ React.createElement("span", _objectSpread({}, attributes), children, IS_ANDROID && /* @__PURE__ */ React.createElement("br", null))
  );
};
var defaultDecorate = () => [];
var defaultScrollSelectionIntoView = (editor, domRange) => {
  var isBackward = !!editor.selection && Range.isBackward(editor.selection);
  var domFocusPoint = domRange.cloneRange();
  domFocusPoint.collapse(isBackward);
  if (domFocusPoint.getBoundingClientRect) {
    var leafEl = domFocusPoint.startContainer.parentElement;
    var domRect = domFocusPoint.getBoundingClientRect();
    var isZeroDimensionRect = domRect.width === 0 && domRect.height === 0 && domRect.x === 0 && domRect.y === 0;
    if (isZeroDimensionRect) {
      var leafRect = leafEl.getBoundingClientRect();
      var leafHasDimensions = leafRect.width > 0 || leafRect.height > 0;
      if (leafHasDimensions) {
        return;
      }
    }
    leafEl.getBoundingClientRect = domFocusPoint.getBoundingClientRect.bind(domFocusPoint);
    e(leafEl, {
      scrollMode: "if-needed"
    });
    delete leafEl.getBoundingClientRect;
  }
};
var isEventHandled = (event, handler) => {
  if (!handler) {
    return false;
  }
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.isDefaultPrevented() || event.isPropagationStopped();
};
var isDOMEventTargetInput = (event) => {
  return isDOMNode(event.target) && (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement);
};
var isDOMEventHandled = (event, handler) => {
  if (!handler) {
    return false;
  }
  var shouldTreatEventAsHandled = handler(event);
  if (shouldTreatEventAsHandled != null) {
    return shouldTreatEventAsHandled;
  }
  return event.defaultPrevented;
};
var handleNativeHistoryEvents = (editor, event) => {
  var maybeHistoryEditor = editor;
  if (event.inputType === "historyUndo" && typeof maybeHistoryEditor.undo === "function") {
    maybeHistoryEditor.undo();
    return;
  }
  if (event.inputType === "historyRedo" && typeof maybeHistoryEditor.redo === "function") {
    maybeHistoryEditor.redo();
    return;
  }
};
var FocusedContext = /* @__PURE__ */ reactExports.createContext(false);
var useFocused = () => {
  return reactExports.useContext(FocusedContext);
};
var REACT_MAJOR_VERSION = parseInt(React.version.split(".")[0], 10);
var _excluded = ["editor", "children", "onChange", "onSelectionChange", "onValueChange", "initialValue"];
var Slate = (props) => {
  var {
    editor,
    children,
    onChange,
    onSelectionChange,
    onValueChange,
    initialValue
  } = props, rest = _objectWithoutProperties(props, _excluded);
  React.useState(() => {
    if (!Node.isNodeList(initialValue)) {
      throw new Error("[Slate] initialValue is invalid! Expected a list of elements but got: ".concat(Scrubber.stringify(initialValue)));
    }
    if (!Editor.isEditor(editor)) {
      throw new Error("[Slate] editor is invalid! You passed: ".concat(Scrubber.stringify(editor)));
    }
    editor.children = initialValue;
    Object.assign(editor, rest);
  });
  var {
    selectorContext,
    onChange: handleSelectorChange
  } = useSelectorContext();
  var onContextChange = reactExports.useCallback(() => {
    if (onChange) {
      onChange(editor.children);
    }
    if (onSelectionChange && editor.operations.find((op) => op.type === "set_selection")) {
      onSelectionChange(editor.selection);
    }
    if (onValueChange && editor.operations.find((op) => op.type !== "set_selection")) {
      onValueChange(editor.children);
    }
    handleSelectorChange();
  }, [editor, handleSelectorChange, onChange, onSelectionChange, onValueChange]);
  reactExports.useEffect(() => {
    EDITOR_TO_ON_CHANGE.set(editor, onContextChange);
    return () => {
      EDITOR_TO_ON_CHANGE.set(editor, () => {
      });
    };
  }, [editor, onContextChange]);
  var [isFocused, setIsFocused] = reactExports.useState(ReactEditor.isFocused(editor));
  reactExports.useEffect(() => {
    setIsFocused(ReactEditor.isFocused(editor));
  }, [editor]);
  useIsomorphicLayoutEffect(() => {
    var fn = () => setIsFocused(ReactEditor.isFocused(editor));
    if (REACT_MAJOR_VERSION >= 17) {
      document.addEventListener("focusin", fn);
      document.addEventListener("focusout", fn);
      return () => {
        document.removeEventListener("focusin", fn);
        document.removeEventListener("focusout", fn);
      };
    } else {
      document.addEventListener("focus", fn, true);
      document.addEventListener("blur", fn, true);
      return () => {
        document.removeEventListener("focus", fn, true);
        document.removeEventListener("blur", fn, true);
      };
    }
  }, []);
  return /* @__PURE__ */ React.createElement(SlateSelectorContext.Provider, {
    value: selectorContext
  }, /* @__PURE__ */ React.createElement(EditorContext.Provider, {
    value: editor
  }, /* @__PURE__ */ React.createElement(FocusedContext.Provider, {
    value: isFocused
  }, children)));
};
var withReact = function withReact2(editor) {
  var clipboardFormatKey = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "x-slate-fragment";
  var e2 = editor;
  e2 = withDOM(e2, clipboardFormatKey);
  var {
    onChange,
    apply,
    insertText
  } = e2;
  e2.getChunkSize = () => null;
  if (IS_ANDROID) {
    e2.insertText = (text, options) => {
      EDITOR_TO_PENDING_SELECTION.delete(e2);
      return insertText(text, options);
    };
  }
  e2.onChange = (options) => {
    var maybeBatchUpdates = REACT_MAJOR_VERSION < 18 ? ReactDOM.unstable_batchedUpdates : (callback) => callback();
    maybeBatchUpdates(() => {
      onChange(options);
    });
  };
  e2.apply = (operation) => {
    if (operation.type === "move_node") {
      var parent = Node.parent(e2, operation.path);
      var chunking = !!e2.getChunkSize(parent);
      if (chunking) {
        var node = Node.get(e2, operation.path);
        var chunkTree = getChunkTreeForNode(e2, parent);
        var key = ReactEditor.findKey(e2, node);
        chunkTree.movedNodeKeys.add(key);
      }
    }
    apply(operation);
  };
  return e2;
};
export {
  Editable as E,
  Slate as S,
  useReadOnly as a,
  useComposing as b,
  useFocused as u,
  withReact as w
};
