import { i as isPlainObject } from "./is-plain-object.mjs";
import { b as Text, R as Range, N as Node, a as Element, d as createEditor$1 } from "./slate.mjs";
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
var ANCHOR = /* @__PURE__ */ new WeakMap();
var FOCUS = /* @__PURE__ */ new WeakMap();
class Token {
}
class AnchorToken extends Token {
  constructor() {
    var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super();
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "path", void 0);
    var {
      offset,
      path
    } = props;
    this.offset = offset;
    this.path = path;
  }
}
class FocusToken extends Token {
  constructor() {
    var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super();
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "path", void 0);
    var {
      offset,
      path
    } = props;
    this.offset = offset;
    this.path = path;
  }
}
var addAnchorToken = (text, token) => {
  var offset = text.text.length;
  ANCHOR.set(text, [offset, token]);
};
var getAnchorOffset = (text) => {
  return ANCHOR.get(text);
};
var addFocusToken = (text, token) => {
  var offset = text.text.length;
  FOCUS.set(text, [offset, token]);
};
var getFocusOffset = (text) => {
  return FOCUS.get(text);
};
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
var STRINGS = /* @__PURE__ */ new WeakSet();
var resolveDescendants = (children) => {
  var nodes = [];
  var addChild = (child2) => {
    if (child2 == null) {
      return;
    }
    var prev = nodes[nodes.length - 1];
    if (typeof child2 === "string") {
      var text = {
        text: child2
      };
      STRINGS.add(text);
      child2 = text;
    }
    if (Text.isText(child2)) {
      var c = child2;
      if (Text.isText(prev) && STRINGS.has(prev) && STRINGS.has(c) && Text.equals(prev, c, {
        loose: true
      })) {
        prev.text += c.text;
      } else {
        nodes.push(c);
      }
    } else if (Element.isElement(child2)) {
      nodes.push(child2);
    } else if (child2 instanceof Token) {
      var n = nodes[nodes.length - 1];
      if (!Text.isText(n)) {
        addChild("");
        n = nodes[nodes.length - 1];
      }
      if (child2 instanceof AnchorToken) {
        addAnchorToken(n, child2);
      } else if (child2 instanceof FocusToken) {
        addFocusToken(n, child2);
      }
    } else {
      throw new Error("Unexpected hyperscript child object: ".concat(child2));
    }
  };
  for (var child of children.flat(Infinity)) {
    addChild(child);
  }
  return nodes;
};
function createAnchor(tagName, attributes, children) {
  return new AnchorToken(attributes);
}
function createCursor(tagName, attributes, children) {
  return [new AnchorToken(attributes), new FocusToken(attributes)];
}
function createElement(tagName, attributes, children) {
  return _objectSpread$1(_objectSpread$1({}, attributes), {}, {
    children: resolveDescendants(children)
  });
}
function createFocus(tagName, attributes, children) {
  return new FocusToken(attributes);
}
function createFragment(tagName, attributes, children) {
  return resolveDescendants(children);
}
function createSelection(tagName, attributes, children) {
  var anchor = children.find((c) => c instanceof AnchorToken);
  var focus = children.find((c) => c instanceof FocusToken);
  if (!anchor || anchor.offset == null || anchor.path == null) {
    throw new Error("The <selection> hyperscript tag must have an <anchor> tag as a child with `path` and `offset` attributes defined.");
  }
  if (!focus || focus.offset == null || focus.path == null) {
    throw new Error("The <selection> hyperscript tag must have a <focus> tag as a child with `path` and `offset` attributes defined.");
  }
  return _objectSpread$1({
    anchor: {
      offset: anchor.offset,
      path: anchor.path
    },
    focus: {
      offset: focus.offset,
      path: focus.path
    }
  }, attributes);
}
function createText(tagName, attributes, children) {
  var nodes = resolveDescendants(children);
  if (nodes.length > 1) {
    throw new Error("The <text> hyperscript tag must only contain a single node's worth of children.");
  }
  var [node] = nodes;
  if (node == null) {
    node = {
      text: ""
    };
  }
  if (!Text.isText(node)) {
    throw new Error("\n    The <text> hyperscript tag can only contain text content as children.");
  }
  STRINGS.delete(node);
  Object.assign(node, attributes);
  return node;
}
var createEditor = (makeEditor) => (tagName, attributes, children) => {
  var otherChildren = [];
  var selectionChild;
  for (var child of children) {
    if (Range.isRange(child)) {
      selectionChild = child;
    } else {
      otherChildren.push(child);
    }
  }
  var descendants = resolveDescendants(otherChildren);
  var selection = {};
  var editor = makeEditor();
  Object.assign(editor, attributes);
  editor.children = descendants;
  for (var [node, path] of Node.texts(editor)) {
    var anchor = getAnchorOffset(node);
    var focus = getFocusOffset(node);
    if (anchor != null) {
      var [offset] = anchor;
      selection.anchor = {
        path,
        offset
      };
    }
    if (focus != null) {
      var [_offset] = focus;
      selection.focus = {
        path,
        offset: _offset
      };
    }
  }
  if (selection.anchor && !selection.focus) {
    throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<anchor />`. For collapsed selections, use `<cursor />` instead.");
  }
  if (!selection.anchor && selection.focus) {
    throw new Error("Slate hyperscript ranges must have both `<anchor />` and `<focus />` defined if one is defined, but you only defined `<focus />`. For collapsed selections, use `<cursor />` instead.");
  }
  if (selectionChild != null) {
    editor.selection = selectionChild;
  } else if (Range.isRange(selection)) {
    editor.selection = selection;
  }
  return editor;
};
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
var DEFAULT_CREATORS = {
  anchor: createAnchor,
  cursor: createCursor,
  editor: createEditor(createEditor$1),
  element: createElement,
  focus: createFocus,
  fragment: createFragment,
  selection: createSelection,
  text: createText
};
var createHyperscript = function createHyperscript2() {
  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var {
    elements = {}
  } = options;
  var elementCreators = normalizeElements(elements);
  var creators = _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_CREATORS), elementCreators), options.creators);
  var jsx2 = createFactory(creators);
  return jsx2;
};
var createFactory = (creators) => {
  var jsx2 = function jsx3(tagName, attributes) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    var creator = creators[tagName];
    if (!creator) {
      throw new Error("No hyperscript creator found for tag: <".concat(tagName, ">"));
    }
    if (attributes == null) {
      attributes = {};
    }
    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children);
      attributes = {};
    }
    children = children.filter((child) => Boolean(child)).flat();
    var ret = creator(tagName, attributes, children);
    return ret;
  };
  return jsx2;
};
var normalizeElements = (elements) => {
  var creators = {};
  var _loop = function _loop2() {
    var props = elements[tagName];
    if (typeof props !== "object") {
      throw new Error("Properties specified for a hyperscript shorthand should be an object, but for the custom element <".concat(tagName, ">  tag you passed: ").concat(props));
    }
    creators[tagName] = (tagName2, attributes, children) => {
      return createElement("element", _objectSpread(_objectSpread({}, props), attributes), children);
    };
  };
  for (var tagName in elements) {
    _loop();
  }
  return creators;
};
var jsx = createHyperscript();
export {
  jsx as j
};
