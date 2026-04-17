import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useDebouncer } from "@tanstack/react-pacer";
import {
  getContentItems,
  getContentStats,
  deleteContentItem,
  updateContentStatus,
} from "@/api/content";
import { ContentStatusBadge } from "@/components/content/content-status-badge";
import { ContentTypeBadge } from "@/components/content/content-type-badge";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Filter,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  FileText,
  Video,
  Music,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { canDelete } from "@/lib/roles";
import type { Database } from "@/types/database.types";

type ContentStatus = Database["public"]["Enums"]["content_status"];
type ContentType = Database["public"]["Enums"]["content_type"];

// ============ QUERY OPTIONS ============
const contentQueryOptions = (params: {
  page: number;
  status?: ContentStatus;
  content_type?: ContentType;
  search?: string;
}) =>
  queryOptions({
    queryKey: ["content", params],
    queryFn: () =>
      getContentItems({
        data: {
          page: params.page,
          limit: 10,
          status: params.status,
          content_type: params.content_type,
          search: params.search || "",
        },
      }),
  });

const contentStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["content-stats"],
    queryFn: () => getContentStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/content/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    status?: ContentStatus;
    type?: ContentType;
    page: number;
    search?: string;
  } => ({
    status: search.status ? (search.status as ContentStatus) : undefined,
    type: search.type ? (search.type as ContentType) : undefined,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        contentQueryOptions({
          page: deps.page,
          status: deps.status,
          content_type: deps.type,
          search: deps.search,
        })
      ),
      context.queryClient.ensureQueryData(contentStatsQueryOptions()),
    ]);
  },
  pendingComponent: ContentLoadingSkeleton,
  errorComponent: ContentErrorState,
  component: ContentPage,
});

// ============ LOADING SKELETON ============
function ContentLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-full max-w-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
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
function ContentErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Content</h2>
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
function ContentEmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching content" : "No content yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Get started by adding your first content item."}
      </p>
      {hasFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button
          render={<Link to="/dashboard/content/new" />}
          nativeButton={false}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
function ContentPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { locale } = useLocaleStore();

  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState<string | null>(null);

  const contentQuery = useSuspenseQuery(
    contentQueryOptions({
      page: searchParams.page,
      status: searchParams.status,
      content_type: searchParams.type,
      search: searchParams.search,
    })
  );
  const statsQuery = useSuspenseQuery(contentStatsQueryOptions());

  const { content, total, page, totalPages } = contentQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && contentQuery.isRefetching;

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
        status:
          !value || value === "Status: All" ? undefined : (value as ContentStatus),
        page: 1,
      }),
    });
  };

  const handleTypeFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        type: !value || value === "Type: All" ? undefined : (value as ContentType),
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setHasSearched(false);
    navigate({
      search: {
        page: 1,
        status: undefined,
        type: undefined,
        search: undefined,
      },
    });
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteContentItem({ data: { id: deletingId } });
      setDeleteDialogOpen(false);
      setDeletingId(null);
      toast.success("Content deleted successfully");
      contentQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error(
        `Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          style: {
            background: 'red',
          },
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: ContentStatus
  ) => {
    const row = content.find(
      (c: Record<string, unknown>) => c.id === id,
    ) as { status?: ContentStatus } | undefined;
    if (row?.status === newStatus) return;

    setStatusChanging(id);
    try {
      await updateContentStatus({ data: { id, status: newStatus } });
      toast.success("Content status updated");
      contentQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        `Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          style: {
            background: 'red',
          },
        }
      );
    } finally {
      setStatusChanging(null);
    }
  };

  const hasFilters = !!(
    searchParams.search ||
    searchParams.status ||
    searchParams.type
  );

  const getLocalizedName = (obj: unknown): string => {
    return getLocalizedText(obj, locale);
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title & Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Content</h1>
              <p className="text-muted-foreground mt-1">
                Manage and review all content items
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                render={<Link to="/dashboard/content/new" />}
                nativeButton={false}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2 flex-wrap">
            <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-sm font-medium text-yellow-700 dark:text-yellow-400">
              {stats.pending} Pending
            </div>
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-400">
              {stats.approved} Approved
            </div>
            <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-medium text-red-700 dark:text-red-400">
              {stats.rejected} Rejected
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400">
              <Video className="inline h-3 w-3 mr-1" />
              {stats.byType.video} Videos
            </div>
            <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-400">
              <Music className="inline h-3 w-3 mr-1" />
              {stats.byType.audio} Audio
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Search content by title..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={searchParams.status || "Status: All"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Status: All">Status: All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={searchParams.type || "Type: All"}
                onValueChange={handleTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Type: All">Type: All</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="room">Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Cards / Skeleton / Empty */}
          {isSearching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card overflow-hidden animate-pulse"
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : content.length === 0 ? (
            <ContentEmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.map((item: Record<string, unknown>) => {
                  const title = getLocalizedName(item.title);
                  const churchName = item.churches
                    ? getLocalizedName(
                      (item.churches as Record<string, unknown>).name
                    )
                    : "";
                  const creator = item.profiles as Record<string, unknown> | null;
                  const creatorName = creator
                    ? `${creator.first_name || ""} ${creator.last_name || ""}`.trim()
                    : "Unknown";

                  return (
                    <div
                      key={item.id as string}
                      className="rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-40 bg-muted">
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url as string}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            {item.content_type === "video" ? (
                              <Video className="h-10 w-10 text-muted-foreground/40" />
                            ) : item.content_type === "audio" ? (
                              <Music className="h-10 w-10 text-muted-foreground/40" />
                            ) : (
                              <FileText className="h-10 w-10 text-muted-foreground/40" />
                            )}
                          </div>
                        )}
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8"
                            render={
                              <Link
                                to="/dashboard/content/$contentId"
                                params={{
                                  contentId: item.id as string,
                                }}
                              />
                            }
                            nativeButton={false}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          {showDelete && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                setDeletingId(item.id as string);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">
                            {title || "Untitled"}
                          </h3>
                          {churchName && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {churchName}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <ContentTypeBadge
                            type={item.content_type as ContentType}
                          />
                          <ContentStatusBadge
                            status={item.status as ContentStatus}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Status
                          </Label>
                          <Select
                            value={item.status as string}
                            disabled={statusChanging === (item.id as string)}
                            onValueChange={(value) =>
                              handleStatusChange(
                                item.id as string,
                                value as ContentStatus,
                              )
                            }
                          >
                            <SelectTrigger className="h-9 w-full text-xs">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending_approval">
                                Pending approval
                              </SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between border-t pt-2">
                          <div className="text-xs text-muted-foreground">
                            <span>{creatorName}</span>
                            <span className="mx-1">&middot;</span>
                            <span>
                              {new Date(
                                item.created_at as string
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* View counts */}
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span>{(item.view_count as number) || 0} views</span>
                          <span>{(item.like_count as number) || 0} likes</span>
                          <span>
                            {(item.share_count as number) || 0} shares
                          </span>
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
                    {Math.min(page * 10, total)} of {total} items
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content item? This action
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
