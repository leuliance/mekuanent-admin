import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDebouncer } from "@tanstack/react-pacer";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getEvents, getEventStats } from "@/api/events";
import { EventStatusBadge } from "@/components/events";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Eye,
  Calendar,
  MapPin,
  Users,
  Clock,
  Video,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type EventStatus = Database["public"]["Enums"]["event_status"];

// ============ QUERY OPTIONS ============
const eventsQueryOptions = (params: {
  page: number;
  status?: EventStatus;
  search?: string;
}) =>
  queryOptions({
    queryKey: ["events", params],
    queryFn: () =>
      getEvents({
        data: {
          page: params.page,
          limit: 10,
          status: params.status,
          search: params.search || "",
        },
      }),
  });

const eventStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["event-stats"],
    queryFn: () => getEventStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/events/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    status?: EventStatus;
    page: number;
    search?: string;
  } => ({
    status: search.status ? (search.status as EventStatus) : undefined,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        eventsQueryOptions({
          page: deps.page,
          status: deps.status,
          search: deps.search,
        })
      ),
      context.queryClient.ensureQueryData(eventStatsQueryOptions()),
    ]);
  },
  pendingComponent: EventsLoadingSkeleton,
  errorComponent: EventsErrorState,
  component: EventsPage,
});

// ============ LOADING SKELETON ============
function EventsLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function EventsErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Events</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    </>
  );
}

// ============ EMPTY STATE ============
function EventsEmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching events" : "No events yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Events created by churches will appear here."}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
function EventsPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { locale } = useLocaleStore();

  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = useState(false);

  const eventsQuery = useSuspenseQuery(
    eventsQueryOptions({
      page: searchParams.page,
      status: searchParams.status,
      search: searchParams.search,
    })
  );
  const statsQuery = useSuspenseQuery(eventStatsQueryOptions());

  const { events, total, page, totalPages } = eventsQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && eventsQuery.isRefetching;

  // Debounced search
  const debouncedSearch = useDebouncer(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value.trim() || undefined,
          page: 1,
        }),
      });
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (searchInput || searchParams.search) {
      setHasSearched(true);
    }
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput, searchParams.search]);

  const handleStatusFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: !value || value === "all" ? undefined : (value as EventStatus),
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setHasSearched(false);
    navigate({
      search: { page: 1, status: undefined, search: undefined },
    });
  };

  const hasFilters = !!(searchParams.search || searchParams.status);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title & Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Events</h1>
              <p className="text-muted-foreground mt-1">
                Manage church events and gatherings
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400">
                {stats.upcoming} Upcoming
              </div>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400">
                {stats.totalRsvps} RSVPs
              </div>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900/30 rounded-full text-sm font-medium text-slate-700 dark:text-slate-400">
                {stats.total} Total
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search events by title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Select
                value={searchParams.status || "all"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Cards */}
          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card overflow-hidden animate-pulse"
                >
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <EventsEmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(events as Record<string, unknown>[]).map((event) => {
                  const title = getLocalizedText(event.title, locale);
                  const churchName = event.churches
                    ? getLocalizedText(
                        (event.churches as Record<string, unknown>).name,
                        locale
                      )
                    : "";
                  const rsvpCount =
                    (
                      event.event_rsvps as { status: string }[] | undefined
                    )?.filter((r) => r.status === "going").length || 0;

                  // Location: use address as fallback when location is null/empty
                  const locationText = getLocalizedText(event.location, locale);
                  const addressText = getLocalizedText(event.address, locale);
                  const displayLocation = locationText || addressText;

                  return (
                    <div
                      key={event.id as string}
                      className="rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      {/* Cover Image */}
                      <div className="aspect-video bg-muted relative">
                        {event.cover_image_url ? (
                          <img
                            src={event.cover_image_url as string}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          {Boolean(event.is_online) && (
                            <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Online
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <EventStatusBadge
                            status={event.status as EventStatus}
                          />
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8"
                            render={
                              <Link
                                to="/dashboard/events/$eventId"
                                params={{ eventId: event.id as string }}
                              />
                            }
                            nativeButton={false}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">
                            {title || "Untitled Event"}
                          </h3>
                          {churchName && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {churchName}
                            </p>
                          )}
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {formatDate(event.start_time as string)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            {formatTime(event.start_time as string)} -{" "}
                            {formatTime(event.end_time as string)}
                          </div>
                          {event.is_online && event.meeting_url ? (
                            <a
                              href={event.meeting_url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-primary hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">Join Meeting</span>
                            </a>
                          ) : displayLocation ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{displayLocation}</span>
                            </div>
                          ) : null}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            {rsvpCount} attending
                            {event.max_attendees
                              ? ` / ${String(event.max_attendees)} max`
                              : null}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            render={
                              <Link
                                to="/dashboard/events/$eventId"
                                params={{ eventId: event.id as string }}
                              />
                            }
                            nativeButton={false}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1} to{" "}
                    {Math.min(page * 10, total)} of {total} events
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
