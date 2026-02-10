import { c as createSlatePlugin, a as createTSlatePlugin, u as useEditorSelector, b as useEditorRef, d as createTPlatePlugin, e as usePluginOption, f as useEditorReadOnly, g as useEditorComposing } from "./core.mjs";
import { T as TextApi, N as NodeApi, E as ElementApi, q as queryNode, P as PathApi } from "./slate.mjs";
import { d as distExports } from "../../../_libs/react-compiler-runtime.mjs";
import { a as React } from "../react.mjs";
import { u as useFocused } from "../../../_libs/slate-react.mjs";
const NODES = {
  a: "a",
  ai: "ai",
  aiChat: "aiChat",
  audio: "audio",
  blockquote: "blockquote",
  bold: "bold",
  callout: "callout",
  code: "code",
  codeBlock: "code_block",
  codeLine: "code_line",
  codeSyntax: "code_syntax",
  column: "column",
  columnGroup: "column_group",
  comment: "comment",
  date: "date",
  emojiInput: "emoji_input",
  equation: "equation",
  excalidraw: "excalidraw",
  file: "file",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  highlight: "highlight",
  hr: "hr",
  img: "img",
  inlineEquation: "inline_equation",
  italic: "italic",
  kbd: "kbd",
  li: "li",
  lic: "lic",
  link: "a",
  listTodoClassic: "action_item",
  mediaEmbed: "media_embed",
  mention: "mention",
  mentionInput: "mention_input",
  olClassic: "ol",
  p: "p",
  searchHighlight: "search_highlight",
  slashInput: "slash_input",
  strikethrough: "strikethrough",
  sub: "subscript",
  suggestion: "suggestion",
  sup: "superscript",
  table: "table",
  tag: "tag",
  taskList: "taskList",
  td: "td",
  th: "th",
  toc: "toc",
  toggle: "toggle",
  tr: "tr",
  ulClassic: "ul",
  underline: "underline",
  video: "video"
};
const STYLE_KEYS = {
  backgroundColor: "backgroundColor",
  color: "color",
  fontFamily: "fontFamily",
  fontSize: "fontSize",
  fontWeight: "fontWeight",
  indent: "indent",
  lineHeight: "lineHeight",
  listType: "listStyleType",
  textAlign: "textAlign",
  textIndent: "textIndent"
};
const KEYS = {
  ...NODES,
  ...STYLE_KEYS,
  blockPlaceholder: "blockPlaceholder",
  exitBreak: "exitBreak",
  normalizeTypes: "normalizeTypes",
  singleBlock: "singleBlock",
  singleLine: "singleLine",
  trailingBlock: "trailingBlock"
};
createSlatePlugin({
  key: KEYS.exitBreak,
  editOnly: true
}).extendTransforms(({ editor }) => ({
  insert: (options) => editor.tf.insertExitBreak(options),
  insertBefore: (options) => editor.tf.insertExitBreak({
    ...options,
    reverse: true
  })
}));
const withNormalizeTypes = ({ editor, getOptions, tf: { normalizeNode } }) => ({ transforms: { normalizeNode([currentNode, currentPath]) {
  const { rules, onError } = getOptions();
  if (currentPath.length === 0) {
    if (rules.some(({ path, strictType, type }) => {
      const node = NodeApi.get(editor, path);
      if (node) {
        if (strictType && ElementApi.isElement(node) && node.type !== strictType) {
          const { children, ...props } = editor.api.create.block({ type: strictType });
          editor.tf.setNodes(props, { at: path });
          return true;
        }
      } else try {
        editor.tf.insertNodes(editor.api.create.block({ type: strictType ?? type }), { at: path });
        return true;
      } catch (error) {
        onError?.(error);
      }
      return false;
    })) return;
  }
  return normalizeNode([currentNode, currentPath]);
} } });
createTSlatePlugin({
  key: KEYS.normalizeTypes,
  options: { rules: [] }
}).overrideEditor(withNormalizeTypes);
createSlatePlugin({
  key: KEYS.singleBlock,
  override: { enabled: { [KEYS.trailingBlock]: false } }
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({ transforms: {
  insertBreak() {
    editor.tf.insertSoftBreak();
  },
  normalizeNode(entry) {
    const [_node, path] = entry;
    if (path.length === 0 && editor.children.length > 1) {
      editor.tf.withoutNormalizing(() => {
        while (editor.children.length > 1) {
          editor.tf.insertText("\n", { at: editor.api.start([1]) });
          editor.tf.mergeNodes({
            at: [1],
            match: (_, path$1) => path$1.length === 1
          });
        }
      });
      return;
    }
    normalizeNode(entry);
  }
} }));
createSlatePlugin({
  key: KEYS.singleLine,
  override: { enabled: { [KEYS.trailingBlock]: false } }
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({ transforms: {
  insertBreak() {
  },
  insertSoftBreak() {
  },
  normalizeNode(entry) {
    const [node, path] = entry;
    if (TextApi.isText(node)) {
      const filteredText = node.text.replace(/[\r\n\u2028\u2029]/g, "");
      if (filteredText !== node.text) {
        editor.tf.insertText(filteredText, { at: path });
        return;
      }
    }
    if (path.length === 0 && editor.children.length > 1) {
      editor.tf.withoutNormalizing(() => {
        while (editor.children.length > 1) editor.tf.mergeNodes({
          at: [1],
          match: (_, path$1) => path$1.length === 1
        });
      });
      return;
    }
    normalizeNode(entry);
  }
} }));
const withTrailingBlock = ({ editor, getOptions, tf: { normalizeNode } }) => ({ transforms: { normalizeNode([currentNode, currentPath]) {
  const { level, type, ...query } = getOptions();
  if (currentPath.length === 0) {
    const lastChild = editor.api.last([], { level });
    const lastChildNode = lastChild?.[0];
    if (!lastChildNode || lastChildNode.type !== type && queryNode(lastChild, query)) {
      const at = lastChild ? PathApi.next(lastChild[1]) : [0];
      editor.tf.insertNodes(editor.api.create.block({ type }, at), { at });
      return;
    }
  }
  return normalizeNode([currentNode, currentPath]);
} } });
createTSlatePlugin({
  key: KEYS.trailingBlock,
  options: { level: 0 }
}).overrideEditor(withTrailingBlock).extend(({ editor }) => ({ options: { type: editor.getType(KEYS.p) } }));
const useMarkToolbarButtonState = (t0) => {
  const $ = distExports.c(7);
  const { clear, nodeType } = t0;
  let t1;
  let t2;
  if ($[0] !== nodeType) {
    t1 = (editor) => editor.api.hasMark(nodeType);
    t2 = [nodeType];
    $[0] = nodeType;
    $[1] = t1;
    $[2] = t2;
  } else {
    t1 = $[1];
    t2 = $[2];
  }
  const pressed = useEditorSelector(t1, t2);
  let t3;
  if ($[3] !== clear || $[4] !== nodeType || $[5] !== pressed) {
    t3 = {
      clear,
      nodeType,
      pressed
    };
    $[3] = clear;
    $[4] = nodeType;
    $[5] = pressed;
    $[6] = t3;
  } else t3 = $[6];
  return t3;
};
const useMarkToolbarButton = (state) => {
  const $ = distExports.c(7);
  const editor = useEditorRef();
  let t0;
  if ($[0] !== editor || $[1] !== state.clear || $[2] !== state.nodeType) {
    t0 = () => {
      editor.tf.toggleMark(state.nodeType, { remove: state.clear });
      editor.tf.focus();
    };
    $[0] = editor;
    $[1] = state.clear;
    $[2] = state.nodeType;
    $[3] = t0;
  } else t0 = $[3];
  let t1;
  if ($[4] !== state.pressed || $[5] !== t0) {
    t1 = { props: {
      pressed: state.pressed,
      onClick: t0,
      onMouseDown: _temp$3
    } };
    $[4] = state.pressed;
    $[5] = t0;
    $[6] = t1;
  } else t1 = $[6];
  return t1;
};
function _temp$3(e) {
  e.preventDefault();
}
createTPlatePlugin({
  key: KEYS.blockPlaceholder,
  editOnly: true,
  options: {
    _target: null,
    placeholders: { [KEYS.p]: "Type something..." },
    query: ({ path }) => path.length === 1
  },
  useHooks: (ctx) => {
    const { editor, getOptions, setOption } = ctx;
    const focused = useFocused();
    const readOnly = useEditorReadOnly();
    const composing = useEditorComposing();
    const entry = useEditorSelector(() => {
      if (readOnly || composing || !focused || !editor.selection || editor.api.isExpanded()) return null;
      return editor.api.block();
    }, [
      readOnly,
      composing,
      focused
    ]);
    React.useEffect(() => {
      if (!entry) {
        setOption("_target", null);
        return;
      }
      const { placeholders, query } = getOptions();
      const [element, path] = entry;
      const placeholder = Object.keys(placeholders).find((key) => editor.getType(key) === element.type);
      if (query({
        ...ctx,
        node: element,
        path
      }) && placeholder && editor.api.isEmpty(element) && !editor.api.isEmpty()) setOption("_target", {
        node: element,
        placeholder: placeholders[placeholder]
      });
      else setOption("_target", null);
    }, [
      editor,
      entry,
      setOption,
      getOptions
    ]);
  }
}).extendSelectors(({ getOption }) => ({ placeholder: (node) => {
  const target = getOption("_target");
  if (target?.node === node) return target.placeholder;
} })).extend({ inject: {
  isBlock: true,
  nodeProps: { transformProps: (props) => {
    const placeholder = usePluginOption(props.plugin, "placeholder", props.element);
    if (placeholder) return {
      className: props.getOption("className"),
      placeholder
    };
  } }
} });
export {
  KEYS as K,
  useMarkToolbarButton as a,
  useMarkToolbarButtonState as u
};
