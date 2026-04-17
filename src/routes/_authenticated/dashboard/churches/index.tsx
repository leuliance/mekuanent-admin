import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useDebouncer } from "@tanstack/react-pacer";
import {
  getChurches,
  getChurchStats,
  type Church,
  type ChurchCategory,
} from "@/api/churches";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Filter,
  Plus,
  Eye,
  MapPin,
  Phone,
  AlertCircle,
  Church as ChurchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Database } from "@/types/database.types";
import { ChurchStatusBadge } from "@/components/churches/church-status-badge";

type ChurchStatus = Database["public"]["Enums"]["church_status"];

// ============ QUERY OPTIONS ============
const churchesQueryOptions = (params: {
  page: number;
  status?: ChurchStatus;
  category?: ChurchCategory;
  search?: string;
}) =>
  queryOptions({
    queryKey: ["churches", params],
    queryFn: () =>
      getChurches({
        data: {
          page: params.page,
          limit: 10,
          status: params.status,
          category: params.category,
          search: params.search || "",
        },
      }),
  });

const churchStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["church-stats"],
    queryFn: () => getChurchStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/churches/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    status?: ChurchStatus;
    category?: ChurchCategory;
    page: number;
    search?: string;
  } => ({
    status: search.status ? (search.status as ChurchStatus) : undefined,
    category: search.category
      ? (search.category as ChurchCategory)
      : undefined,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    // Kick off both queries in parallel
    await Promise.all([
      context.queryClient.ensureQueryData(
        churchesQueryOptions({
          page: deps.page,
          status: deps.status,
          category: deps.category,
          search: deps.search,
        })
      ),
      context.queryClient.ensureQueryData(churchStatsQueryOptions()),
    ]);
  },
  pendingComponent: ChurchesLoadingSkeleton,
  errorComponent: ChurchesErrorState,
  component: ChurchesPage,
});

// ============ LOADING SKELETON ============
function ChurchesLoadingSkeleton() {
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
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-full max-w-lg" />
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function ChurchesErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Churches</h2>
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
function ChurchesEmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <ChurchIcon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching churches" : "No churches yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Get started by adding your first church to the platform."}
      </p>
      {hasFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button
          render={<Link to="/dashboard/churches/new" />}
          nativeButton={false}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Church
        </Button>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
function ChurchesPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { locale } = useLocaleStore();

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch data using suspense queries
  const churchesQuery = useSuspenseQuery(
    churchesQueryOptions({
      page: searchParams.page,
      status: searchParams.status,
      category: searchParams.category,
      search: searchParams.search,
    })
  );
  const statsQuery = useSuspenseQuery(churchStatsQueryOptions());

  const { churches, total, page, totalPages } = churchesQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && churchesQuery.isRefetching;

  // Debounced search handler
  const debouncedSearch = useDebouncer(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value.trim() || undefined, // Only set if non-empty
          page: 1,
        }),
      });
    },
    { wait: 500 }
  );

  // Update search on input change
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
        status: !value || value === "all" ? undefined : (value as ChurchStatus),
        page: 1,
      }),
    });
  };

  const handleCategoryFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: !value || value === "all" ? undefined : (value as ChurchCategory),
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
        category: undefined,
        search: undefined,
      },
    });
  };

  const hasFilters = !!(searchParams.search || searchParams.status || searchParams.category);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="mx-auto max-w-7xl min-w-0 space-y-6">
          {/* Page Title & Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Churches</h1>
              <p className="text-muted-foreground mt-1">
                Manage and review church registrations
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button render={<Link to="/dashboard/churches/new" />} nativeButton={false}>
                <Plus className="h-4 w-4 mr-2" />
                Add Church
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
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by name or phone..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={searchParams.status || "Status: All"}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={searchParams.category || "Category: All"}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Category: All</SelectItem>
                  <SelectItem value="church">Church</SelectItem>
                  <SelectItem value="monastery">Monastery</SelectItem>
                  <SelectItem value="female-monastery">Female Monastery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table / Empty State */}
          {isSearching ? (
            <div className="bg-card rounded-xl border">
              <div className="touch-pan-x overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Church
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-28" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-8 w-8" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : churches.length === 0 ? (
            <ChurchesEmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              <div className="bg-card rounded-xl border">
                <div className="touch-pan-x overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Church
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {churches.map((church: Church) => (
                        <tr
                          key={church.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          {/* Church Name & Logo */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                                {church.logo_url ? (
                                  <img
                                    src={church.logo_url}
                                    alt=""
                                    className="h-full w-full rounded-lg object-cover"
                                  />
                                ) : (
                                  <ChurchIcon className="h-4 w-4 text-primary/40" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {getLocalizedText(church.name, locale)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {church.email || "No email"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3">
                            <span className="capitalize text-sm">
                              {church.category.replace("-", " ")}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate max-w-[120px]">
                                {getLocalizedText(church.city, locale) || "Unknown"}
                              </span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-sm">{church.phone_number}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <ChurchStatusBadge status={church.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              render={
                                <Link
                                  to="/dashboard/churches/$churchId"
                                  params={{ churchId: church.id }}
                                />
                              }
                              nativeButton={false}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)}{" "}
                      of {total} churches
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
