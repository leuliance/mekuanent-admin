import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { aa as Radio, ab as MessageSquare, F as FileText, a9 as Music, a5 as Video } from "../_libs/lucide-react.mjs";
const statusStyles = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  pending_approval: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  archived: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400"
};
const statusLabels = {
  draft: "Draft",
  pending_approval: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived"
};
function ContentStatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.draft}`,
      children: statusLabels[status] || status
    }
  );
}
const typeStyles = {
  video: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  audio: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  article: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  story: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  room: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
};
const typeIcons = {
  video: Video,
  audio: Music,
  article: FileText,
  story: MessageSquare,
  room: Radio
};
const typeLabels = {
  video: "Video",
  audio: "Audio",
  article: "Article",
  story: "Story",
  room: "Room"
};
function ContentTypeBadge({ type }) {
  const Icon = typeIcons[type] || FileText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type] || ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
        typeLabels[type] || type
      ]
    }
  );
}
export {
  ContentTypeBadge as C,
  ContentStatusBadge as a
};
