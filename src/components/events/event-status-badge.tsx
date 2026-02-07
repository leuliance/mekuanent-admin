import type { Database } from "@/types/database.types";

type EventStatus = Database["public"]["Enums"]["event_status"];

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-900/20 dark:text-slate-400 dark:ring-slate-400/20",
  },
  published: {
    label: "Published",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/20",
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20",
  },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
