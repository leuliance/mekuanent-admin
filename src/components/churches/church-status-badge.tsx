import type { Database } from "@/types/database.types";

type ChurchStatus = Database["public"]["Enums"]["church_status"];

const statusConfig: Record<ChurchStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-400/20",
  },
  approved: {
    label: "Approved",
    className:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/20",
  },
  suspended: {
    label: "Suspended",
    className:
      "bg-slate-50 text-slate-700 ring-slate-600/20 dark:bg-slate-900/20 dark:text-slate-400 dark:ring-slate-400/20",
  },
};

export function ChurchStatusBadge({ status }: { status: ChurchStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
