import { c as createSlatePlugin, a as createTSlatePlugin, s as someHtmlElement, t as toPlatePlugin, h as createPlatePlugin } from "./core.mjs";
import { K as KEYS } from "./utils.mjs";
import { f as findHtmlParentElement } from "../@udecode/utils.mjs";
import { K as Key } from "../@udecode/react-hotkeys.mjs";
const BaseBlockquotePlugin = createSlatePlugin({
  key: KEYS.blockquote,
  node: { isElement: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: "BLOCKQUOTE" }] } } },
  render: { as: "blockquote" },
  rules: {
    break: {
      default: "lineBreak",
      empty: "reset",
      emptyLineEnd: "deleteExit"
    },
    delete: { start: "reset" }
  }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const node = { isElement: true };
const rules = {
  break: { splitReset: true },
  merge: { removeEmpty: true }
};
const BaseH1Plugin = createTSlatePlugin({
  key: "h1",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H1" }] } } },
  render: { as: "h1" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseH2Plugin = createTSlatePlugin({
  key: "h2",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H2" }] } } },
  render: { as: "h2" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseH3Plugin = createTSlatePlugin({
  key: "h3",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H3" }] } } },
  render: { as: "h3" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseH4Plugin = createTSlatePlugin({
  key: "h4",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H4" }] } } },
  render: { as: "h4" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseH5Plugin = createTSlatePlugin({
  key: "h5",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H5" }] } } },
  render: { as: "h5" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseH6Plugin = createTSlatePlugin({
  key: "h6",
  node,
  parsers: { html: { deserializer: { rules: [{ validNodeName: "H6" }] } } },
  render: { as: "h6" },
  rules
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleBlock(type);
} }));
const BaseHeadingPlugin = createTSlatePlugin({
  key: "heading",
  options: { levels: [
    1,
    2,
    3,
    4,
    5,
    6
  ] }
}).extend(({ plugin }) => {
  const { options: { levels } } = plugin;
  const headingPlugins = {
    1: BaseH1Plugin,
    2: BaseH2Plugin,
    3: BaseH3Plugin,
    4: BaseH4Plugin,
    5: BaseH5Plugin,
    6: BaseH6Plugin
  };
  return { plugins: (Array.isArray(levels) ? levels : Array.from({ length: levels || 6 }, (_, i) => i + 1)).map((level) => headingPlugins[level]) };
});
const BaseHorizontalRulePlugin = createSlatePlugin({
  key: KEYS.hr,
  node: {
    isElement: true,
    isVoid: true
  },
  parsers: { html: { deserializer: { rules: [{ validNodeName: "HR" }] } } },
  render: { as: "hr" }
});
const BaseBoldPlugin = createSlatePlugin({
  key: KEYS.bold,
  node: { isLeaf: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: ["STRONG", "B"] }, { validStyle: { fontWeight: [
      "600",
      "700",
      "bold"
    ] } }],
    query: ({ element }) => !someHtmlElement(element, (node$1) => node$1.style.fontWeight === "normal")
  } } },
  render: { as: "strong" }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseCodePlugin = createSlatePlugin({
  key: KEYS.code,
  node: { isLeaf: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: ["CODE"] }, { validStyle: { fontFamily: "Consolas" } }],
    query({ element }) {
      if (findHtmlParentElement(element, "P")?.style.fontFamily === "Consolas") return false;
      return !findHtmlParentElement(element, "PRE");
    }
  } } },
  render: { as: "code" },
  rules: { selection: { affinity: "hard" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseItalicPlugin = createSlatePlugin({
  key: KEYS.italic,
  node: { isLeaf: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: ["EM", "I"] }, { validStyle: { fontStyle: "italic" } }],
    query: ({ element }) => !someHtmlElement(element, (node$1) => node$1.style.fontStyle === "normal")
  } } },
  render: { as: "em" }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseStrikethroughPlugin = createSlatePlugin({
  key: KEYS.strikethrough,
  node: { isLeaf: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: [
      "S",
      "DEL",
      "STRIKE"
    ] }, { validStyle: { textDecoration: "line-through" } }],
    query: ({ element }) => !someHtmlElement(element, (node$1) => node$1.style.textDecoration === "none")
  } } },
  render: { as: "s" },
  rules: { selection: { affinity: "directional" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseSubscriptPlugin = createSlatePlugin({
  key: KEYS.sub,
  node: { isLeaf: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: ["SUB"] }, { validStyle: { verticalAlign: "sub" } }] } } },
  render: { as: "sub" },
  rules: { selection: { affinity: "directional" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type, { remove: editor.getType(KEYS.sup) });
} }));
const BaseSuperscriptPlugin = createSlatePlugin({
  key: KEYS.sup,
  node: { isLeaf: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: ["SUP"] }, { validStyle: { verticalAlign: "super" } }] } } },
  render: { as: "sup" },
  rules: { selection: { affinity: "directional" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type, { remove: editor.getType(KEYS.sub) });
} }));
const BaseUnderlinePlugin = createSlatePlugin({
  key: KEYS.underline,
  node: { isLeaf: true },
  parsers: { html: { deserializer: {
    rules: [{ validNodeName: ["U"] }, { validStyle: { textDecoration: ["underline"] } }],
    query: ({ element }) => !someHtmlElement(element, (node$1) => node$1.style.textDecoration === "none")
  } } },
  render: { as: "u" }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseBasicMarksPlugin = createSlatePlugin({ plugins: [
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin
] });
const BaseHighlightPlugin = createSlatePlugin({
  key: KEYS.highlight,
  node: { isLeaf: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: ["MARK"] }] } } },
  render: { as: "mark" },
  rules: { selection: { affinity: "directional" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BaseKbdPlugin = createSlatePlugin({
  key: KEYS.kbd,
  node: { isLeaf: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: ["KBD"] }] } } },
  render: { as: "kbd" },
  rules: { selection: { affinity: "hard" } }
}).extendTransforms(({ editor, type }) => ({ toggle: () => {
  editor.tf.toggleMark(type);
} }));
const BlockquotePlugin = toPlatePlugin(BaseBlockquotePlugin);
const HeadingPlugin = toPlatePlugin(BaseHeadingPlugin);
toPlatePlugin(BaseH1Plugin);
toPlatePlugin(BaseH2Plugin);
toPlatePlugin(BaseH3Plugin);
toPlatePlugin(BaseH4Plugin);
toPlatePlugin(BaseH5Plugin);
toPlatePlugin(BaseH6Plugin);
const HorizontalRulePlugin = toPlatePlugin(BaseHorizontalRulePlugin);
createPlatePlugin({ plugins: [
  BlockquotePlugin,
  HeadingPlugin,
  HorizontalRulePlugin
] });
const BoldPlugin = toPlatePlugin(BaseBoldPlugin, { shortcuts: { toggle: { keys: [[Key.Mod, "b"]] } } });
const CodePlugin = toPlatePlugin(BaseCodePlugin);
const ItalicPlugin = toPlatePlugin(BaseItalicPlugin, { shortcuts: { toggle: { keys: [[Key.Mod, "i"]] } } });
const StrikethroughPlugin = toPlatePlugin(BaseStrikethroughPlugin);
const SubscriptPlugin = toPlatePlugin(BaseSubscriptPlugin);
const SuperscriptPlugin = toPlatePlugin(BaseSuperscriptPlugin);
const UnderlinePlugin = toPlatePlugin(BaseUnderlinePlugin, { shortcuts: { toggle: { keys: [[Key.Mod, "u"]] } } });
toPlatePlugin(BaseBasicMarksPlugin, { plugins: [
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin
] });
toPlatePlugin(BaseHighlightPlugin);
toPlatePlugin(BaseKbdPlugin);
export {
  BoldPlugin as B,
  CodePlugin as C,
  ItalicPlugin as I,
  StrikethroughPlugin as S,
  UnderlinePlugin as U
};
