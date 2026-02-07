import type { Database } from "@/types/database.types";

type ContentStatus = Database["public"]["Enums"]["content_status"];

const statusStyles: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  pending_approval:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  archived: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

const statusLabels: Record<ContentStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  archived: "Archived",
};

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.draft}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
