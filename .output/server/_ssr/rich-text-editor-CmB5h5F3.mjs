import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { B as BoldPlugin, I as ItalicPlugin, U as UnderlinePlugin, S as StrikethroughPlugin, C as CodePlugin } from "../_chunks/_libs/@platejs/basic-nodes.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { a as cn } from "./router-deJypcsT.mjs";
import { c as TooltipProvider } from "./tooltip-BpKl2fwd.mjs";
import { i as usePlateEditor, P as Plate, j as PlateContainer, k as PlateContent } from "../_chunks/_libs/@platejs/core.mjs";
import { al as TextAlignStart, am as TextAlignCenter, an as TextAlignEnd, ao as TextAlignJustify, ap as List, aq as ListOrdered, $ as ChevronDown } from "../_libs/lucide-react.mjs";
import { u as useMarkToolbarButtonState, a as useMarkToolbarButton } from "../_chunks/_libs/@platejs/utils.mjs";
import { Z as ToolbarRoot, i as TooltipRoot, o as TooltipTrigger, j as TooltipPortal, k as TooltipPositioner, l as TooltipPopup, n as TooltipArrow, _ as ToolbarButton$1 } from "../_chunks/_libs/@base-ui/react.mjs";
const editorContainerVariants = cva(
  "relative w-full cursor-text select-text overflow-y-auto caret-primary selection:bg-brand/25 focus-visible:outline-none [&_.slate-selection-area]:z-50 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-brand/25 [&_.slate-selection-area]:bg-brand/15",
  {
    defaultVariants: {
      variant: "default"
    },
    variants: {
      variant: {
        comment: cn(
          "flex flex-wrap justify-between gap-1 px-1 py-0.5 text-sm",
          "rounded-md border-[1.5px] border-transparent bg-transparent",
          "has-[[data-slate-editor]:focus]:border-brand/50 has-[[data-slate-editor]:focus]:ring-2 has-[[data-slate-editor]:focus]:ring-brand/30",
          "has-aria-disabled:border-input has-aria-disabled:bg-muted"
        ),
        default: "h-full",
        demo: "h-[650px]",
        select: cn(
          "group rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "has-data-readonly:w-fit has-data-readonly:cursor-default has-data-readonly:border-transparent has-data-readonly:focus-within:[box-shadow:none]"
        )
      }
    }
  }
);
function EditorContainer({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    PlateContainer,
    {
      className: cn(
        "ignore-click-outside/toolbar",
        editorContainerVariants({ variant }),
        className
      ),
      ...props
    }
  );
}
const editorVariants = cva(
  cn(
    "group/editor",
    "relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words",
    "rounded-md ring-offset-background focus-visible:outline-none",
    "**:data-slate-placeholder:!top-1/2 **:data-slate-placeholder:-translate-y-1/2 placeholder:text-muted-foreground/80 **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!",
    "[&_strong]:font-bold"
  ),
  {
    defaultVariants: {
      variant: "default"
    },
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-50"
      },
      focused: {
        true: "ring-2 ring-ring ring-offset-2"
      },
      variant: {
        ai: "w-full px-0 text-base md:text-sm",
        aiChat: "max-h-[min(70vh,320px)] w-full overflow-y-auto px-3 py-2 text-base md:text-sm",
        comment: cn("rounded-none border-none bg-transparent text-sm"),
        default: "size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]",
        demo: "size-full px-16 pt-4 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]",
        fullWidth: "size-full px-16 pt-4 pb-72 text-base sm:px-24",
        none: "",
        select: "px-3 py-2 text-base data-readonly:w-fit"
      }
    }
  }
);
const Editor = ({
  className,
  disabled,
  focused,
  variant,
  ref,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  PlateContent,
  {
    ref,
    className: cn(
      editorVariants({
        disabled,
        focused,
        variant
      }),
      className
    ),
    disabled,
    disableDefaultStyles: true,
    ...props
  }
);
Editor.displayName = "Editor";
function Toolbar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ToolbarRoot,
    {
      className: cn("relative flex select-none items-center", className),
      ...props
    }
  );
}
function ToolbarSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("mx-2 my-1 w-px shrink-0 bg-border", className),
      ...props
    }
  );
}
const toolbarButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default"
    },
    variants: {
      size: {
        default: "h-9 min-w-9 px-2",
        lg: "h-10 min-w-10 px-2.5",
        sm: "h-8 min-w-8 px-1.5"
      },
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      }
    }
  }
);
cva(
  cn(
    "inline-flex items-center justify-center rounded-r-md font-medium text-foreground text-sm transition-colors disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    defaultVariants: {
      size: "sm",
      variant: "default"
    },
    variants: {
      size: {
        default: "h-9 w-6",
        lg: "h-10 w-8",
        sm: "h-8 w-4"
      },
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        outline: "border border-input border-l-0 bg-transparent hover:bg-accent hover:text-accent-foreground"
      }
    }
  }
);
const ToolbarButton = withTooltip(function ToolbarButton2({
  children,
  className,
  isDropdown,
  pressed,
  size = "sm",
  variant,
  ...props
}) {
  const buttonContent = isDropdown ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-center gap-2 whitespace-nowrap", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChevronDown,
      {
        className: "size-3.5 text-muted-foreground",
        "data-icon": true
      }
    ) })
  ] }) : children;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ToolbarButton$1,
    {
      className: cn(
        toolbarButtonVariants({
          size,
          variant
        }),
        isDropdown && (typeof pressed === "boolean" ? "justify-between gap-1 pr-1" : "pr-1"),
        className
      ),
      "data-pressed": pressed,
      ...props,
      children: buttonContent
    }
  );
});
function withTooltip(Component) {
  return function ExtendComponent({
    tooltip,
    tooltipContentProps,
    tooltipProps,
    tooltipTriggerProps,
    ...props
  }) {
    const [mounted, setMounted] = reactExports.useState(false);
    reactExports.useEffect(() => {
      setMounted(true);
    }, []);
    const component = /* @__PURE__ */ jsxRuntimeExports.jsx(Component, { ...props });
    if (tooltip && mounted) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipRoot, { ...tooltipProps, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { render: component, ...tooltipTriggerProps }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipPositioner, { sideOffset: 4, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TooltipPopup,
          {
            className: cn(
              "z-50 w-fit origin-(--transform-origin) text-balance rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs",
              tooltipContentProps?.className
            ),
            ...tooltipContentProps,
            children: [
              tooltip,
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipArrow, { className: "data-[side=bottom]:top-[-4px] data-[side=left]:right-[-4px] data-[side=right]:left-[-4px] data-[side=top]:bottom-[-4px]" })
            ]
          }
        ) }) })
      ] });
    }
    return component;
  };
}
function FixedToolbar(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toolbar,
    {
      ...props,
      className: cn(
        "scrollbar-hide sticky top-0 left-0 z-50 w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60",
        props.className
      )
    }
  );
}
function MarkToolbarButton({
  clear,
  nodeType,
  ...props
}) {
  const state = useMarkToolbarButtonState({ clear, nodeType });
  const { props: buttonProps } = useMarkToolbarButton(state);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarButton, { ...props, ...buttonProps });
}
function htmlToPlateValue(html) {
  if (!html || html.trim() === "") {
    return [{ type: "p", children: [{ text: "" }] }];
  }
  const isPlainText = !/<[^>]+>/.test(html);
  if (isPlainText) {
    return [{ type: "p", align: "left", children: [{ text: html }] }];
  }
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const nodes = [];
  const parseNode = (element) => {
    const children = [];
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || "";
        if (text) {
          children.push({ text });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child;
        const tagName = el.tagName.toLowerCase();
        if (tagName === "p") {
          const innerChildren = parseNode(el);
          const style = el.getAttribute("style") || "";
          let align = "left";
          if (style.includes("text-align: center")) align = "center";
          else if (style.includes("text-align: right")) align = "right";
          else if (style.includes("text-align: justify")) align = "justify";
          nodes.push({
            type: "p",
            align,
            children: innerChildren.length > 0 ? innerChildren : [{ text: "" }]
          });
        } else if (tagName === "ul") {
          const innerChildren = parseNode(el);
          nodes.push({
            type: "ul",
            children: innerChildren.length > 0 ? innerChildren : [{ text: "" }]
          });
        } else if (tagName === "ol") {
          const innerChildren = parseNode(el);
          nodes.push({
            type: "ol",
            children: innerChildren.length > 0 ? innerChildren : [{ text: "" }]
          });
        } else if (tagName === "li") {
          const innerChildren = parseNode(el);
          nodes.push({
            type: "li",
            children: innerChildren.length > 0 ? innerChildren : [{ text: "" }]
          });
        } else if (tagName === "strong" || tagName === "b") {
          const text = el.textContent || "";
          children.push({ text, bold: true });
        } else if (tagName === "em" || tagName === "i") {
          const text = el.textContent || "";
          children.push({ text, italic: true });
        } else if (tagName === "u") {
          const text = el.textContent || "";
          children.push({ text, underline: true });
        } else if (tagName === "s" || tagName === "strike") {
          const text = el.textContent || "";
          children.push({ text, strikethrough: true });
        } else if (tagName === "code") {
          const text = el.textContent || "";
          children.push({ text, code: true });
        } else {
          children.push(...parseNode(el));
        }
      }
    });
    return children;
  };
  parseNode(tempDiv);
  return nodes.length > 0 ? nodes : [{ type: "p", align: "left", children: [{ text: "" }] }];
}
function plateValueToHtml(value) {
  const serializeNode = (node) => {
    if (node.text !== void 0) {
      let text = node.text;
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;
      if (node.code) text = `<code>${text}</code>`;
      return text;
    }
    if (node.type === "p") {
      const children = node.children?.map(serializeNode).join("") || "";
      const align = node.align || "left";
      const style = align !== "left" ? ` style="text-align: ${align}"` : "";
      return `<p${style}>${children}</p>`;
    }
    if (node.type === "ul") {
      const children = node.children?.map(serializeNode).join("") || "";
      return `<ul>${children}</ul>`;
    }
    if (node.type === "ol") {
      const children = node.children?.map(serializeNode).join("") || "";
      return `<ol>${children}</ol>`;
    }
    if (node.type === "li") {
      const children = node.children?.map(serializeNode).join("") || "";
      return `<li>${children}</li>`;
    }
    return "";
  };
  return value.map(serializeNode).join("");
}
function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Type your content here...",
  className
}) {
  const isInternalChange = reactExports.useRef(false);
  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin],
    value: htmlToPlateValue(value)
  });
  reactExports.useEffect(() => {
    if (editor && value !== void 0) {
      const currentHtml = plateValueToHtml(editor.children);
      if (currentHtml !== value) {
        isInternalChange.current = true;
        const newPlateValue = htmlToPlateValue(value);
        editor.children = newPlateValue;
        requestAnimationFrame(() => {
          isInternalChange.current = false;
        });
      }
    }
  }, [value, editor]);
  const handleChange = (ctx) => {
    if (onChange && !isInternalChange.current) {
      const html = plateValueToHtml(ctx.value);
      onChange(html);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plate, { editor, onChange: handleChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(FixedToolbar, { className: "justify-start rounded-t-lg border border-input bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "bold", tooltip: "Bold (⌘+B)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-sm font-bold", children: "B" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "italic", tooltip: "Italic (⌘+I)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-sm font-serif", children: "I" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "underline", tooltip: "Underline (⌘+U)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm underline", children: "U" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "strikethrough", tooltip: "Strikethrough", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm line-through", children: "S" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "code", tooltip: "Code", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-xs font-mono bg-muted px-1 py-0.5 rounded", children: `</>` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "align-left", tooltip: "Align Left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignStart, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "align-center", tooltip: "Align Center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignCenter, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "align-right", tooltip: "Align Right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignEnd, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "align-justify", tooltip: "Justify", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TextAlignJustify, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarSeparator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "bullet-list", tooltip: "Bullet List", children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MarkToolbarButton, { nodeType: "numbered-list", tooltip: "Numbered List", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditorContainer, { className: "border border-t-0 border-input rounded-b-lg min-h-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Editor, { placeholder, className: "p-3 text-left" }) })
  ] }) }) });
}
export {
  RichTextEditor as R
};
