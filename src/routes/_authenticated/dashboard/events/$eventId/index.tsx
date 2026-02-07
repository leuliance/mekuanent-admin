import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import {
  getEvent,
  getEventDonations,
  updateEventStatus,
  updateEvent,
  deleteEvent,
} from "@/api/events";
import { EventStatusBadge, EventRsvpTable, EventDonationsTable } from "@/components/events";
import { useLocaleStore, getLocalizedText, LOCALES, type Locale } from "@/stores/locale-store";
import { canDelete } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  ArrowLeft,
  AlertCircle,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Church,
  User,
  Loader2,
  Video,
  DollarSign,
  ExternalLink,
  Pencil,
  Save,
  RotateCcw,
  Globe,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type EventStatus = Database["public"]["Enums"]["event_status"];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function getLocalizedHtml(value: unknown, locale: Locale): string {
  const text = getLocalizedText(value, locale);
  return typeof text === "string" ? text : "";
}

export const Route = createFileRoute(
  "/_authenticated/dashboard/events/$eventId/"
)({
  loader: async ({ params }) => {
    const [event, donations] = await Promise.all([
      getEvent({ data: { id: params.eventId } }),
      getEventDonations({ data: { id: params.eventId } }),
    ]);
    return { event, donations };
  },
  pendingComponent: EventDetailSkeleton,
  errorComponent: EventDetailError,
  component: EventDetailPage,
});

// ============ LOADING SKELETON ============
function EventDetailSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function EventDetailError({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Event</h2>
          <p className="text-muted-foreground mb-5">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              render={
                <Link
                  to="/dashboard/events"
                  search={{ page: 1, search: undefined }}
                />
              }
              nativeButton={false}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
function EventDetailPage() {
  const { event: eventData, donations } = Route.useLoaderData();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  // biome-ignore lint/suspicious/noExplicitAny: Dynamic event data
  const item = eventData as any;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState<Record<string, string>>({});
  const [editDescription, setEditDescription] = useState<Record<string, string>>({});
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editIsOnline, setEditIsOnline] = useState(false);
  const [editMeetingUrl, setEditMeetingUrl] = useState("");
  const [editAddress, setEditAddress] = useState<Record<string, string>>({});
  const [editMaxAttendees, setEditMaxAttendees] = useState("");
  const [editRsvpDeadline, setEditRsvpDeadline] = useState("");

  const title = getLocalizedText(item.title, locale);
  const description = getLocalizedHtml(item.description, locale);
  const churchName = item.churches
    ? getLocalizedText(item.churches.name, locale)
    : "";
  const locationText = getLocalizedText(item.location, locale);
  const addressText = getLocalizedText(item.address, locale);
  const displayLocation = locationText || addressText;

  const creatorProfile = item.profiles;
  const creatorName = creatorProfile
    ? `${creatorProfile.first_name || ""} ${creatorProfile.last_name || ""}`.trim()
    : "Unknown";

  const rsvps = item.event_rsvps || [];
  const goingCount = rsvps.filter((r: { status: string }) => r.status === "going").length;
  const now = new Date();
  const startDate = new Date(item.start_time);
  const endDate = new Date(item.end_time);
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;

  // Initialize edit state when entering edit mode
  const startEditing = () => {
    const titleObj: Record<string, string> = {};
    const descObj: Record<string, string> = {};
    const addrObj: Record<string, string> = {};
    for (const loc of LOCALES) {
      titleObj[loc.value] = getLocalizedText(item.title, loc.value);
      descObj[loc.value] = getLocalizedText(item.description, loc.value);
      addrObj[loc.value] = getLocalizedText(item.address, loc.value);
    }
    setEditTitle(titleObj);
    setEditDescription(descObj);
    setEditAddress(addrObj);
    setEditStartTime(formatDateTimeLocal(item.start_time));
    setEditEndTime(formatDateTimeLocal(item.end_time));
    setEditIsOnline(item.is_online || false);
    setEditMeetingUrl(item.meeting_url || "");
    setEditMaxAttendees(item.max_attendees ? String(item.max_attendees) : "");
    setEditRsvpDeadline(item.rsvp_deadline ? formatDateTimeLocal(item.rsvp_deadline) : "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setIsSubmitting(true);
    try {
      await updateEvent({
        data: {
          id: item.id,
          title: editTitle,
          description: editDescription,
          start_time: new Date(editStartTime).toISOString(),
          end_time: new Date(editEndTime).toISOString(),
          is_online: editIsOnline,
          meeting_url: editIsOnline ? editMeetingUrl || null : null,
          address: Object.values(editAddress).some((v) => v.trim()) ? editAddress : null,
          max_attendees: editMaxAttendees ? Number(editMaxAttendees) : null,
          rsvp_deadline: editRsvpDeadline ? new Date(editRsvpDeadline).toISOString() : null,
        },
      });
      toast.success("Event updated successfully");
      setIsEditing(false);
      router.invalidate();
    } catch (error) {
      toast.error(
        `Failed to update: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === item.status) return;

    // Validate based on dates
    if (newStatus === "published" && isPast) {
      toast.error("Cannot publish a past event");
      return;
    }
    if (newStatus === "completed" && isUpcoming) {
      toast.error("Cannot mark as completed — the event hasn't started yet");
      return;
    }

    setStatusChanging(true);
    try {
      await updateEventStatus({
        data: { id: item.id, status: newStatus as EventStatus },
      });
      toast.success(
        `Status changed to ${STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus}`
      );
      router.invalidate();
    } catch (error) {
      toast.error(
        `Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setStatusChanging(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent({ data: { id: item.id } });
      toast.success("Event deleted successfully");
      router.navigate({
        to: "/dashboard/events",
        search: { page: 1, search: undefined },
      });
    } catch (error) {
      toast.error(
        `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link
                to="/dashboard/events"
                search={{ page: 1, search: undefined }}
              />
            }
            nativeButton={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          {/* Hero */}
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Cover Image */}
            {item.cover_image_url ? (
              <div className="h-64 relative">
                <img
                  src={item.cover_image_url}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.is_online && (
                    <span className="px-2.5 py-1 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1.5 font-medium">
                      <Video className="w-3 h-3" />
                      Online
                    </span>
                  )}
                  {isOngoing && (
                    <span className="px-2.5 py-1 bg-green-500 text-white text-xs rounded-full font-medium animate-pulse">
                      Live Now
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center relative">
                <Calendar className="h-16 w-16 text-muted-foreground/30" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {item.is_online && (
                    <span className="px-2.5 py-1 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1.5 font-medium">
                      <Video className="w-3 h-3" />
                      Online
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Title & Actions */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {title || "Untitled Event"}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <EventStatusBadge status={item.status} />
                    {isPast && item.status !== "completed" && item.status !== "cancelled" && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400">
                        Past Event
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5 mr-1.5" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startEditing}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      <Select
                        value={item.status}
                        onValueChange={handleStatusChange}
                        disabled={statusChanging}
                      >
                        <SelectTrigger className="w-[160px] h-9 text-sm">
                          {statusChanging ? (
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-9 w-9"
                          onClick={() => setDeleteDialogOpen(true)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <EditEventForm
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              editStartTime={editStartTime}
              setEditStartTime={setEditStartTime}
              editEndTime={editEndTime}
              setEditEndTime={setEditEndTime}
              editIsOnline={editIsOnline}
              setEditIsOnline={setEditIsOnline}
              editMeetingUrl={editMeetingUrl}
              setEditMeetingUrl={setEditMeetingUrl}
              editAddress={editAddress}
              setEditAddress={setEditAddress}
              editMaxAttendees={editMaxAttendees}
              setEditMaxAttendees={setEditMaxAttendees}
              editRsvpDeadline={editRsvpDeadline}
              setEditRsvpDeadline={setEditRsvpDeadline}
            />
          ) : (
            <>
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Info Card */}
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="text-sm font-semibold mb-3">Event Details</h2>
                  <div className="divide-y divide-border">
                    <InfoRow
                      icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                      label="Date"
                      value={formatDate(item.start_time)}
                    />
                    <InfoRow
                      icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                      label="Time"
                      value={`${formatTime(item.start_time)} - ${formatTime(item.end_time)}`}
                    />
                    {item.is_online ? (
                      item.meeting_url ? (
                        <div className="flex items-start gap-3 py-3">
                          <div className="p-2 rounded-lg bg-muted shrink-0">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Meeting Link</p>
                            <a
                              href={item.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                              Join Meeting
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <InfoRow
                          icon={<Video className="h-4 w-4 text-muted-foreground" />}
                          label="Format"
                          value="Online Event"
                        />
                      )
                    ) : displayLocation ? (
                      <InfoRow
                        icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                        label="Location"
                        value={displayLocation}
                      />
                    ) : null}
                    {churchName && (
                      <InfoRow
                        icon={<Church className="h-4 w-4 text-muted-foreground" />}
                        label="Church"
                        value={churchName}
                      />
                    )}
                    <InfoRow
                      icon={<User className="h-4 w-4 text-muted-foreground" />}
                      label="Created by"
                      value={creatorName}
                    />
                    {item.rsvp_deadline && (
                      <InfoRow
                        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                        label="RSVP Deadline"
                        value={formatDate(item.rsvp_deadline)}
                      />
                    )}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="text-sm font-semibold mb-3">Engagement</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-lg font-bold">{goingCount}</p>
                      <p className="text-xs text-muted-foreground">Attending</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                      <p className="text-lg font-bold">{rsvps.length}</p>
                      <p className="text-xs text-muted-foreground">Total RSVPs</p>
                    </div>
                    {item.max_attendees && (
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Users className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <p className="text-lg font-bold">{item.max_attendees}</p>
                        <p className="text-xs text-muted-foreground">Max Capacity</p>
                      </div>
                    )}
                    {item.has_donation && (
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <p className="text-lg font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: item.donation_currency || "ETB",
                            minimumFractionDigits: 0,
                          }).format(item.donation_current_amount || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.donation_goal_amount
                            ? `of ${new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: item.donation_currency || "ETB",
                                minimumFractionDigits: 0,
                              }).format(item.donation_goal_amount)} goal`
                            : "Raised"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Co-hosts */}
                  {item.event_co_hosts && item.event_co_hosts.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                        Co-hosts
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.event_co_hosts.map(
                          (coHost: { id: string; churches: { name: unknown; logo_url: string | null } | null }) => (
                            <div
                              key={coHost.id}
                              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50 text-sm"
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={coHost.churches?.logo_url || ""} />
                                <AvatarFallback className="text-[8px]">
                                  <Church className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              {coHost.churches
                                ? getLocalizedText(coHost.churches.name, locale)
                                : "Unknown"}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {description && (
                  <div className="rounded-xl border bg-card p-5 md:col-span-2">
                    <h2 className="text-sm font-semibold mb-3">Description</h2>
                    <div
                      className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                      // biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text HTML
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}
              </div>

              {/* Tabs: RSVPs & Donations */}
              <Tabs defaultValue="rsvps" className="rounded-xl border bg-card">
                <div className="border-b px-5 py-3">
                  <TabsList>
                    <TabsTrigger
                      value="rsvps"
                    >
                      <Users className="h-4 w-4 mr-1.5" />
                      RSVPs ({rsvps.length})
                    </TabsTrigger>
                    {item.has_donation && (
                      <TabsTrigger
                        value="donations"
                      >
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        Donations ({(donations as unknown[]).length})
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>
                <TabsContent value="rsvps" className="p-5 mt-0">
                  <EventRsvpTable rsvps={rsvps} />
                </TabsContent>
                {item.has_donation && (
                  <TabsContent value="donations" className="p-5 mt-0">
                    <EventDonationsTable donations={donations as any} />
                  </TabsContent>
                )}
              </Tabs>
            </>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone.
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

// ============ HELPER COMPONENTS ============

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="p-2 rounded-lg bg-muted shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function formatDateTimeLocal(isoString: string) {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ============ EDIT FORM ============
function EditEventForm({
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editStartTime,
  setEditStartTime,
  editEndTime,
  setEditEndTime,
  editIsOnline,
  setEditIsOnline,
  editMeetingUrl,
  setEditMeetingUrl,
  editAddress,
  setEditAddress,
  editMaxAttendees,
  setEditMaxAttendees,
  editRsvpDeadline,
  setEditRsvpDeadline,
}: {
  editTitle: Record<string, string>;
  setEditTitle: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editDescription: Record<string, string>;
  setEditDescription: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editStartTime: string;
  setEditStartTime: React.Dispatch<React.SetStateAction<string>>;
  editEndTime: string;
  setEditEndTime: React.Dispatch<React.SetStateAction<string>>;
  editIsOnline: boolean;
  setEditIsOnline: React.Dispatch<React.SetStateAction<boolean>>;
  editMeetingUrl: string;
  setEditMeetingUrl: React.Dispatch<React.SetStateAction<string>>;
  editAddress: Record<string, string>;
  setEditAddress: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  editMaxAttendees: string;
  setEditMaxAttendees: React.Dispatch<React.SetStateAction<string>>;
  editRsvpDeadline: string;
  setEditRsvpDeadline: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Title</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOCALES.slice(0, 2).map((loc) => (
            <div key={loc.value} className="space-y-1.5">
              <Label className="text-xs">
                {loc.label} {loc.value === "en" || loc.value === "am" ? "*" : ""}
              </Label>
              <Input
                value={editTitle[loc.value] || ""}
                onChange={(e) =>
                  setEditTitle((prev) => ({
                    ...prev,
                    [loc.value]: e.target.value,
                  }))
                }
                placeholder={`Title in ${loc.label}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Description</h2>
        <div className="grid grid-cols-1 gap-3">
          {LOCALES.slice(0, 2).map((loc) => (
            <div key={loc.value} className="space-y-1.5">
              <Label className="text-xs">{loc.label}</Label>
              <textarea
                value={editDescription[loc.value] || ""}
                onChange={(e) =>
                  setEditDescription((prev) => ({
                    ...prev,
                    [loc.value]: e.target.value,
                  }))
                }
                placeholder={`Description in ${loc.label}`}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Date & Time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Start Time *</Label>
            <Input
              type="datetime-local"
              value={editStartTime}
              onChange={(e) => setEditStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">End Time *</Label>
            <Input
              type="datetime-local"
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">RSVP Deadline</Label>
            <Input
              type="datetime-local"
              value={editRsvpDeadline}
              onChange={(e) => setEditRsvpDeadline(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Attendees</Label>
            <Input
              type="number"
              value={editMaxAttendees}
              onChange={(e) => setEditMaxAttendees(e.target.value)}
              placeholder="No limit"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Location</h2>
        <div className="flex items-center gap-2 mb-4">
          <Switch
            checked={editIsOnline}
            onCheckedChange={setEditIsOnline}
          />
          <Label className="text-sm">Online Event</Label>
        </div>
        {editIsOnline ? (
          <div className="space-y-1.5">
            <Label className="text-xs">Meeting URL</Label>
            <Input
              value={editMeetingUrl}
              onChange={(e) => setEditMeetingUrl(e.target.value)}
              placeholder="https://zoom.us/..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCALES.slice(0, 2).map((loc) => (
              <div key={loc.value} className="space-y-1.5">
                <Label className="text-xs">Address ({loc.label})</Label>
                <Input
                  value={editAddress[loc.value] || ""}
                  onChange={(e) =>
                    setEditAddress((prev) => ({
                      ...prev,
                      [loc.value]: e.target.value,
                    }))
                  }
                  placeholder={`Address in ${loc.label}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
