import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDebouncer } from "@tanstack/react-pacer";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  getDonations,
  getCampaigns,
  getDonationStats,
  updateCampaignStatus,
  deleteCampaign,
} from "@/api/donations";
import { useLocaleStore, getLocalizedText } from "@/stores/locale-store";
import { canDelete } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Filter,
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Calendar,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type DonationStatus = Database["public"]["Enums"]["donation_status"];
type CampaignStatus = Database["public"]["Enums"]["campaign_status"];

// ============ QUERY OPTIONS ============
const donationsQueryOptions = (params: {
  page: number;
  status?: DonationStatus;
}) =>
  queryOptions({
    queryKey: ["donations", params],
    queryFn: () =>
      getDonations({
        data: { page: params.page, limit: 10, status: params.status },
      }),
  });

const campaignsQueryOptions = (params: {
  page: number;
  status?: CampaignStatus;
  search?: string;
}) =>
  queryOptions({
    queryKey: ["campaigns", params],
    queryFn: () =>
      getCampaigns({
        data: {
          page: params.page,
          limit: 10,
          status: params.status,
          search: params.search || "",
        },
      }),
  });

const donationStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["donation-stats"],
    queryFn: () => getDonationStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/donations/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    tab?: string;
    status?: string;
    page: number;
    search?: string;
    campaignPage?: number;
    campaignStatus?: string;
  } => ({
    tab: (search.tab as string) || "donations",
    status: search.status ? String(search.status) : undefined,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : undefined,
    campaignPage: Number(search.campaignPage) || 1,
    campaignStatus: search.campaignStatus ? String(search.campaignStatus) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        donationsQueryOptions({
          page: deps.page,
          status: deps.status as DonationStatus | undefined,
        })
      ),
      context.queryClient.ensureQueryData(
        campaignsQueryOptions({
          page: deps.campaignPage || 1,
          status: deps.campaignStatus as CampaignStatus | undefined,
          search: deps.search,
        })
      ),
      context.queryClient.ensureQueryData(donationStatsQueryOptions()),
    ]);
  },
  pendingComponent: DonationsLoadingSkeleton,
  errorComponent: DonationsErrorState,
  component: DonationsPage,
});

// ============ LOADING SKELETON ============
function DonationsLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function DonationsErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Donations</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
function DonationsPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { locale } = useLocaleStore();
  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  const [campaignSearchInput, setCampaignSearchInput] = useState(
    searchParams.search || ""
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState<string | null>(null);

  const donationsQuery = useSuspenseQuery(
    donationsQueryOptions({
      page: searchParams.page,
      status: searchParams.status as DonationStatus | undefined,
    })
  );
  const campaignsQuery = useSuspenseQuery(
    campaignsQueryOptions({
      page: searchParams.campaignPage || 1,
      status: searchParams.campaignStatus as CampaignStatus | undefined,
      search: searchParams.search,
    })
  );
  const statsQuery = useSuspenseQuery(donationStatsQueryOptions());
  const stats = statsQuery.data;

  // Debounced search for campaigns
  const debouncedSearch = useDebouncer(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value.trim() || undefined,
          campaignPage: 1,
        }),
      });
    },
    { wait: 500 }
  );

  useEffect(() => {
    debouncedSearch.maybeExecute(campaignSearchInput);
  }, [campaignSearchInput]);

  const formatCurrency = (amount: number, currency = "ETB") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);

  const getInitials = (firstName?: string | null, lastName?: string | null) =>
    ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "A";

  const donationStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const campaignStatusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleDonationStatusFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: !value || value === "all" ? undefined : value,
        page: 1,
      }),
    });
  };

  const handleCampaignStatusFilter = (value: string | null) => {
    navigate({
      search: (prev) => ({
        ...prev,
        campaignStatus: !value || value === "all" ? undefined : value,
        campaignPage: 1,
      }),
    });
  };

  const handleCampaignStatusChange = async (
    campaignId: string,
    newStatus: CampaignStatus
  ) => {
    setStatusChanging(campaignId);
    try {
      await updateCampaignStatus({
        data: {
          id: campaignId,
          status: newStatus,
          verified_by: newStatus === "active" ? user?.id : undefined,
        },
      });
      toast.success(`Campaign ${newStatus}`);
      campaignsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setStatusChanging(null);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!deletingCampaignId) return;
    setIsDeleting(true);
    try {
      await deleteCampaign({ data: { id: deletingCampaignId } });
      setDeleteDialogOpen(false);
      setDeletingCampaignId(null);
      toast.success("Campaign deleted successfully");
      campaignsQuery.refetch();
      statsQuery.refetch();
    } catch (error) {
      toast.error(
        `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTabChange = (tab: string) => {
    navigate({
      search: (prev) => ({ ...prev, tab }),
    });
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold">Donations</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all platform donations and campaigns
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />}
              iconBg="bg-green-100 dark:bg-green-900/30"
              label="Total Raised"
              value={formatCurrency(stats.totalRaised)}
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              label="Total Donations"
              value={String(stats.totalDonations)}
            />
            <StatCard
              icon={<CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
              iconBg="bg-cyan-100 dark:bg-cyan-900/30"
              label="Completed"
              value={String(stats.completedDonations)}
            />
            <StatCard
              icon={<Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
              iconBg="bg-purple-100 dark:bg-purple-900/30"
              label="Active Campaigns"
              value={String(stats.activeCampaigns)}
            />
          </div>

          {/* Tabs */}
          <Tabs
            value={searchParams.tab || "donations"}
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="donations">
                <DollarSign className="h-4 w-4 mr-1.5" />
                Donations
              </TabsTrigger>
              <TabsTrigger value="campaigns">
                <Target className="h-4 w-4 mr-1.5" />
                Campaigns
              </TabsTrigger>
            </TabsList>

            {/* Donations Tab */}
            <TabsContent value="donations" className="mt-4 space-y-4">
              {/* Filter */}
              <div className="bg-card rounded-xl border p-4">
                <Select
                  value={searchParams.status || "all"}
                  onValueChange={handleDonationStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="bg-card rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Donor</th>
                        <th className="px-4 py-3 text-left font-medium">Campaign</th>
                        <th className="px-4 py-3 text-left font-medium">Amount</th>
                        <th className="px-4 py-3 text-left font-medium">Payment</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {donationsQuery.data.donations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center">
                            <div className="flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <DollarSign className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <p className="font-medium">No donations found</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Donations will appear here once people contribute.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        (donationsQuery.data.donations as Record<string, unknown>[]).map(
                          (donation) => {
                            const d = donation as any;
                            const isAnon = Boolean(d.is_anonymous);
                            const fromWallet = Boolean(d.from_wallet);
                            const paymentInfo = d.payments;
                            return (
                              <tr
                                key={donation.id as string}
                                className="hover:bg-muted/30"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={d.profiles?.avatar_url || ""} />
                                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {isAnon ? "A" : getInitials(d.profiles?.first_name, d.profiles?.last_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-medium">
                                          {isAnon ? "Anonymous" : `${d.profiles?.first_name || ""} ${d.profiles?.last_name || ""}`.trim() || "Unknown"}
                                        </span>
                                        {isAnon && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            Anon
                                          </span>
                                        )}
                                        {fromWallet && (
                                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                            Wallet
                                          </span>
                                        )}
                                      </div>
                                      {!isAnon && d.profiles?.email && (
                                        <p className="text-[11px] text-muted-foreground">{d.profiles.email}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="line-clamp-1">{getLocalizedText(d.donation_campaigns?.title, locale)}</p>
                                  <p className="text-xs text-muted-foreground">{getLocalizedText(d.donation_campaigns?.churches?.name, locale)}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(donation.amount as number, (donation.currency as string) || "ETB")}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {paymentInfo ? (
                                    <div>
                                      <p className="text-xs font-medium capitalize">{paymentInfo.payment_gateway || paymentInfo.payment_method || "-"}</p>
                                      {paymentInfo.gateway_transaction_id && (
                                        <p className="text-[10px] text-muted-foreground font-mono">{String(paymentInfo.gateway_transaction_id).slice(0, 12)}...</p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${donationStatusColors[donation.status as string] || ""}`}>
                                    {donation.status as string}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {new Date(donation.created_at as string).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          }
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {donationsQuery.data.totalPages > 1 && (
                  <div className="px-4 py-3 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {(donationsQuery.data.page - 1) * 10 + 1} to{" "}
                      {Math.min(
                        donationsQuery.data.page * 10,
                        donationsQuery.data.total
                      )}{" "}
                      of {donationsQuery.data.total}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={donationsQuery.data.page <= 1}
                        onClick={() =>
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              page: donationsQuery.data.page - 1,
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
                          donationsQuery.data.page >=
                          donationsQuery.data.totalPages
                        }
                        onClick={() =>
                          navigate({
                            search: (prev) => ({
                              ...prev,
                              page: donationsQuery.data.page + 1,
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
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="mt-4 space-y-4">
              {/* Filters */}
              <div className="bg-card rounded-xl border p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Search campaigns..."
                    value={campaignSearchInput}
                    onChange={(e) => setCampaignSearchInput(e.target.value)}
                    className="flex-1"
                  />
                  <Select
                    value={searchParams.campaignStatus || "all"}
                    onValueChange={handleCampaignStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Campaigns Grid */}
              {campaignsQuery.data.campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-12 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Target className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No campaigns found</h3>
                  <p className="text-sm text-muted-foreground">
                    Donation campaigns created by churches will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(campaignsQuery.data.campaigns as Record<string, unknown>[]).map(
                    (campaign) => {
                      const campaignTitle = getLocalizedText(campaign.title, locale);
                      const churchName = campaign.churches
                        ? getLocalizedText(
                            (campaign.churches as Record<string, unknown>).name,
                            locale
                          )
                        : "";
                      const donations = campaign.donations as { amount: number; status: string }[] | undefined;
                      const donationCount = donations?.length || 0;
                      const raisedAmount =
                        donations
                          ?.filter((d) => d.status === "completed")
                          .reduce((s, d) => s + d.amount, 0) || 0;
                      const goalAmount = (campaign.goal_amount as number) || 0;
                      const progress = goalAmount
                        ? Math.min(
                            100,
                            Math.round((raisedAmount / goalAmount) * 100)
                          )
                        : 0;

                      return (
                        <div
                          key={campaign.id as string}
                          className="rounded-xl border bg-card overflow-hidden group hover:shadow-md transition-shadow"
                        >
                          {/* Cover */}
                          <div className="aspect-2/1 bg-muted relative">
                            {campaign.cover_image_url ? (
                              <img
                                src={campaign.cover_image_url as string}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Target className="w-8 h-8 text-muted-foreground/40" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium rounded-full ${campaignStatusColors[campaign.status as string] || ""}`}
                              >
                                {campaign.status as string}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-medium text-sm line-clamp-1">
                                {campaignTitle || "Untitled Campaign"}
                              </h3>
                              {churchName && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {churchName}
                                </p>
                              )}
                            </div>

                            {/* Progress */}
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {formatCurrency(
                                    raisedAmount,
                                    (campaign.currency as string) || "ETB"
                                  )}
                                </span>
                                <span className="text-muted-foreground">
                                  {goalAmount
                                    ? `${progress}% of ${formatCurrency(goalAmount, (campaign.currency as string) || "ETB")}`
                                    : `${donationCount} donations`}
                                </span>
                              </div>
                              {goalAmount > 0 && (
                                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-green-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Dates */}
                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                campaign.start_date as string
                              ).toLocaleDateString()}{" "}
                              {campaign.end_date
                                ? `- ${new Date(campaign.end_date as string).toLocaleDateString()}`
                                : ""}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <Select
                                value={campaign.status as string}
                                onValueChange={(v) =>
                                  handleCampaignStatusChange(
                                    campaign.id as string,
                                    v as CampaignStatus
                                  )
                                }
                                disabled={
                                  statusChanging === (campaign.id as string)
                                }
                              >
                                <SelectTrigger className="h-7 w-[110px] text-xs">
                                  {statusChanging ===
                                  (campaign.id as string) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <SelectValue />
                                  )}
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="paused">Paused</SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {showDelete && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => {
                                    setDeletingCampaignId(
                                      campaign.id as string
                                    );
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              {/* Campaign Pagination */}
              {campaignsQuery.data.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    {(campaignsQuery.data.page - 1) * 10 + 1} to{" "}
                    {Math.min(
                      campaignsQuery.data.page * 10,
                      campaignsQuery.data.total
                    )}{" "}
                    of {campaignsQuery.data.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={campaignsQuery.data.page <= 1}
                      onClick={() =>
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            campaignPage: campaignsQuery.data.page - 1,
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
                        campaignsQuery.data.page >=
                        campaignsQuery.data.totalPages
                      }
                      onClick={() =>
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            campaignPage: campaignsQuery.data.page + 1,
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
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Campaign Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot
              be undone.
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
              onClick={handleDeleteCampaign}
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
