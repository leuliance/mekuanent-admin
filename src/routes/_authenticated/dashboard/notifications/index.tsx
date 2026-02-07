import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  getNotifications,
  sendNotification,
  deleteNotification,
  getNotificationStats,
  searchUsersForNotification,
} from "@/api/notifications";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
import { canDelete } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  BellRing,
  Mail,
  MailOpen,
  Megaphone,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type NotificationType = Database["public"]["Enums"]["notification_type"];

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  verse_of_day: "Verse of the Day",
  new_content: "New Content",
  event_reminder: "Event Reminder",
  event_update: "Event Update",
  donation_received: "Donation Received",
  role_invitation: "Role Invitation",
  content_approved: "Content Approved",
  content_rejected: "Content Rejected",
  room_started: "Room Started",
  donation_campaign_update: "Campaign Update",
  prayer_request: "Prayer Request",
  church_announcement: "Church Announcement",
  system_message: "System Message",
  achievement: "Achievement",
};

const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  verse_of_day: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  new_content: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  event_reminder: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  event_update: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  donation_received: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  role_invitation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  content_approved: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  content_rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  room_started: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  donation_campaign_update: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  prayer_request: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  church_announcement: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  system_message: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  achievement: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

// ============ QUERY OPTIONS ============
const notificationsQueryOptions = (params: { page: number; type?: string }) =>
  queryOptions({
    queryKey: ["notifications", params],
    queryFn: () =>
      getNotifications({
        data: { page: params.page, limit: 20, type: params.type },
      }),
  });

const notificationStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["notification-stats"],
    queryFn: () => getNotificationStats(),
  });

export const Route = createFileRoute(
  "/_authenticated/dashboard/notifications/"
)({
  validateSearch: (
    search: Record<string, unknown>
  ): { page: number; type?: string } => ({
    page: Number(search.page) || 1,
    type: search.type ? String(search.type) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        notificationsQueryOptions({
          page: deps.page,
          type: deps.type,
        })
      ),
      context.queryClient.ensureQueryData(notificationStatsQueryOptions()),
    ]);
  },
  pendingComponent: NotificationsLoadingSkeleton,
  errorComponent: NotificationsErrorState,
  component: NotificationsPage,
});

// ============ LOADING ============
function NotificationsLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </>
  );
}

// ============ ERROR ============
function NotificationsErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Notifications</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
function NotificationsPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { locale } = useLocaleStore();
  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  const notificationsQuery = useSuspenseQuery(
    notificationsQueryOptions({
      page: searchParams.page,
      type: searchParams.type,
    })
  );
  const statsQuery = useSuspenseQuery(notificationStatsQueryOptions());
  const stats = statsQuery.data;

  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Send notification form
  const [sendTitleEn, setSendTitleEn] = useState("");
  const [sendTitleAm, setSendTitleAm] = useState("");
  const [sendBodyEn, setSendBodyEn] = useState("");
  const [sendBodyAm, setSendBodyAm] = useState("");
  const [sendType, setSendType] = useState<NotificationType>("system_message");
  const [isSending, setIsSending] = useState(false);
  const [sendTarget, setSendTarget] = useState<"all" | "single">("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<Record<string, unknown>[]>([]);
  const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const handleTypeFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: !value || value === "all" ? undefined : value,
        page: 1,
      }),
    });
  };

  const handleSearchUsers = async (query: string) => {
    setUserSearchQuery(query);
    if (query.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    try {
      const results = await searchUsersForNotification({ data: { query: query.trim() } });
      setUserSearchResults(results as Record<string, unknown>[]);
    } catch {
      setUserSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleSendNotification = async () => {
    if (!sendTitleEn.trim() || !sendBodyEn.trim()) {
      toast.error("Title and body are required");
      return;
    }
    if (sendTarget === "single" && !selectedUser) {
      toast.error("Please select a user");
      return;
    }
    setIsSending(true);
    try {
      const result = await sendNotification({
        data: {
          title: {
            en: sendTitleEn.trim(),
            am: sendTitleAm.trim() || sendTitleEn.trim(),
          },
          body: {
            en: sendBodyEn.trim(),
            am: sendBodyAm.trim() || sendBodyEn.trim(),
          },
          type: sendType,
          user_ids: sendTarget === "single" && selectedUser ? [selectedUser.id as string] : undefined,
          sent_by: user?.id,
        },
      });
      toast.success(
        result.broadcast
          ? "Broadcast notification sent to all users"
          : `Notification sent to ${result.sent} user${result.sent !== 1 ? "s" : ""}`
      );
      setSendDialogOpen(false);
      resetSendForm();
      notificationsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteNotification({ data: { id: deletingId } });
      toast.success("Notification deleted");
      setDeleteDialogOpen(false);
      setDeletingId(null);
      notificationsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetSendForm = () => {
    setSendTitleEn("");
    setSendTitleAm("");
    setSendBodyEn("");
    setSendBodyAm("");
    setSendType("system_message");
    setSendTarget("all");
    setSelectedUser(null);
    setUserSearchQuery("");
    setUserSearchResults([]);
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground mt-1">
                Send and manage notifications to all users
              </p>
            </div>
            <Button onClick={() => setSendDialogOpen(true)}>
              <Megaphone className="h-4 w-4 mr-1.5" />
              Send Notification
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              label="Total Sent"
              value={String(stats.total)}
            />
            <StatCard
              icon={<BellRing className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
              iconBg="bg-amber-100 dark:bg-amber-900/30"
              label="Unread"
              value={String(stats.unread)}
            />
            <StatCard
              icon={<Megaphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
              iconBg="bg-slate-100 dark:bg-slate-900/30"
              label="System Messages"
              value={String(stats.systemMessages)}
            />
          </div>

          {/* Filter */}
          <div className="bg-card rounded-xl border p-4">
            <Select value={searchParams.type || "all"} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-[220px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          {notificationsQuery.data.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-16 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Send a notification to all users to get started.
              </p>
              <Button onClick={() => setSendDialogOpen(true)}>
                <Megaphone className="h-4 w-4 mr-1.5" />
                Send First Notification
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="divide-y">
                {(notificationsQuery.data.notifications as Record<string, unknown>[]).map((notif) => {
                  const profiles = notif.profiles as Record<string, unknown> | null;
                  const isRead = notif.is_read as boolean;
                  const notifType = notif.type as string;

                  return (
                    <div
                      key={notif.id as string}
                      className={`flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors ${!isRead ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isRead ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-sm truncate">
                            {getLocalizedText(notif.title, locale)}
                          </p>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${NOTIFICATION_TYPE_COLORS[notifType] || "bg-muted text-muted-foreground"}`}
                          >
                            {NOTIFICATION_TYPE_LABELS[notifType] || notifType}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {getLocalizedText(notif.body, locale)}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                          {notif.is_broadcast ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
                              <Megaphone className="h-2.5 w-2.5" />
                              Broadcast
                            </span>
                          ) : profiles ? (
                            <span>
                              To: {(profiles.first_name as string) || ""}{" "}
                              {(profiles.last_name as string) || ""}
                            </span>
                          ) : null}
                          <span>
                            {new Date(notif.created_at as string).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {showDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => {
                            setDeletingId(notif.id as string);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {notificationsQuery.data.totalPages > 1 && (
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(notificationsQuery.data.page - 1) * 20 + 1} to{" "}
                    {Math.min(
                      notificationsQuery.data.page * 20,
                      notificationsQuery.data.total
                    )}{" "}
                    of {notificationsQuery.data.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={notificationsQuery.data.page <= 1}
                      onClick={() =>
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            page: notificationsQuery.data.page - 1,
                          }),
                        })
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        notificationsQuery.data.page >=
                        notificationsQuery.data.totalPages
                      }
                      onClick={() =>
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            page: notificationsQuery.data.page + 1,
                          }),
                        })
                      }
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Send Notification Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogDescription>
              Broadcast sends one notification visible to all users. Targeted sends to a specific user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Target selection */}
            <div className="space-y-1.5">
              <Label className="text-xs">Send To *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sendTarget === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSendTarget("all"); setSelectedUser(null); }}
                >
                  All Users
                </Button>
                <Button
                  type="button"
                  variant={sendTarget === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSendTarget("single")}
                >
                  Single User
                </Button>
              </div>
            </div>

            {/* User search (only for single) */}
            {sendTarget === "single" && (
              <div className="space-y-2">
                {selectedUser ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={(selectedUser.avatar_url as string) || ""} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {((selectedUser.first_name as string)?.[0] || "") + ((selectedUser.last_name as string)?.[0] || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{`${(selectedUser.first_name as string) || ""} ${(selectedUser.last_name as string) || ""}`.trim()}</p>
                      <p className="text-xs text-muted-foreground">{(selectedUser.email as string) || ""}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>Change</Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={userSearchQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                    />
                    {isSearchingUsers && <p className="text-xs text-muted-foreground">Searching...</p>}
                    {userSearchResults.length > 0 && (
                      <div className="rounded-lg border max-h-40 overflow-auto divide-y">
                        {userSearchResults.map((u) => (
                          <button
                            key={u.id as string}
                            type="button"
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-muted/50 text-left transition-colors"
                            onClick={() => { setSelectedUser(u); setUserSearchResults([]); setUserSearchQuery(""); }}
                          >
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={(u.avatar_url as string) || ""} />
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {((u.first_name as string)?.[0] || "") + ((u.last_name as string)?.[0] || "")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{`${(u.first_name as string) || ""} ${(u.last_name as string) || ""}`.trim() || "Unknown"}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{(u.email as string) || ""}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Type *</Label>
              <Select
                value={sendType}
                onValueChange={(v) => {
                  if (v) setSendType(v as NotificationType);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system_message">System Message</SelectItem>
                  <SelectItem value="church_announcement">Church Announcement</SelectItem>
                  <SelectItem value="new_content">New Content</SelectItem>
                  <SelectItem value="event_reminder">Event Reminder</SelectItem>
                  <SelectItem value="prayer_request">Prayer Request</SelectItem>
                  <SelectItem value="verse_of_day">Verse of the Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title (English) *</Label>
                <Input
                  value={sendTitleEn}
                  onChange={(e) => setSendTitleEn(e.target.value)}
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title (Amharic)</Label>
                <Input
                  value={sendTitleAm}
                  onChange={(e) => setSendTitleAm(e.target.value)}
                  placeholder="የማሳወቂያ ርዕስ"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Body (English) *</Label>
              <textarea
                value={sendBodyEn}
                onChange={(e) => setSendBodyEn(e.target.value)}
                placeholder="Write the notification message..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Body (Amharic)</Label>
              <textarea
                value={sendBodyAm}
                onChange={(e) => setSendBodyAm(e.target.value)}
                placeholder="የማሳወቂያ መልእክት ይጻፉ..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSendDialogOpen(false);
                resetSendForm();
              }}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={isSending || !sendTitleEn.trim() || !sendBodyEn.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {sendTarget === "single" ? "Send to User" : "Send to All Users"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogDescription>
              This will permanently remove this notification.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============ STAT CARD ============
function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card rounded-xl p-4 border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
