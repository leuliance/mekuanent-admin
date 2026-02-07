import { Video, Music, FileText, MessageSquare, Radio } from "lucide-react";
import type { Database } from "@/types/database.types";

type ContentType = Database["public"]["Enums"]["content_type"];

const typeStyles: Record<ContentType, string> = {
  video:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  audio:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  article:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  story:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  room: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const typeIcons: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  video: Video,
  audio: Music,
  article: FileText,
  story: MessageSquare,
  room: Radio,
};

const typeLabels: Record<ContentType, string> = {
  video: "Video",
  audio: "Audio",
  article: "Article",
  story: "Story",
  room: "Room",
};

export function ContentTypeBadge({ type }: { type: ContentType }) {
  const Icon = typeIcons[type] || FileText;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles[type] || ""}`}
    >
      <Icon className="h-3 w-3" />
      {typeLabels[type] || type}
    </span>
  );
}
