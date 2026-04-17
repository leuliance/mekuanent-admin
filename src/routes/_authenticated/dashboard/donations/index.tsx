import { useDebouncer } from "@tanstack/react-pacer";
import {
	queryOptions,
	useSuspenseInfiniteQuery,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	DollarSign,
	Filter,
	Loader2,
	Target,
	Trash2,
	TrendingUp,
	ExternalLink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	deleteCampaign,
	getCampaigns,
	getDonationStats,
	getDonations,
	updateCampaignStatus,
} from "@/api/donations";
import { ResponsiveTabs } from "@/components/responsive-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { canDelete } from "@/lib/roles";
import {
	getLocalizedText,
	useLocaleStore,
	type Locale,
} from "@/stores/locale-store";
import type { Database } from "@/types/database.types";

type DonationStatus = Database["public"]["Enums"]["donation_status"];
type CampaignStatus = Database["public"]["Enums"]["campaign_status"];

type DonationsListPage = Awaited<ReturnType<typeof getDonations>>;

// ============ QUERY OPTIONS ============
const donationsInfiniteQueryKey = (status?: DonationStatus) =>
	["donations", "infinite", status ?? "all"] as const;

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
		search: Record<string, unknown>,
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
		campaignStatus: search.campaignStatus
			? String(search.campaignStatus)
			: undefined,
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps, context }) => {
		const donationStatus = deps.status as DonationStatus | undefined;
		await Promise.all([
			context.queryClient.prefetchInfiniteQuery({
				queryKey: donationsInfiniteQueryKey(donationStatus),
				queryFn: ({ pageParam }) =>
					getDonations({
						data: {
							page: pageParam as number,
							limit: 10,
							status: donationStatus,
						},
					}),
				initialPageParam: 1,
				getNextPageParam: (lastPage: DonationsListPage) =>
					lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
			}),
			context.queryClient.ensureQueryData(
				campaignsQueryOptions({
					page: deps.campaignPage || 1,
					status: deps.campaignStatus as CampaignStatus | undefined,
					search: deps.search,
				}),
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
					<h2 className="text-xl font-semibold mb-2">
						Failed to Load Donations
					</h2>
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
		searchParams.search || "",
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const [statusChanging, setStatusChanging] = useState<string | null>(null);
	const [detailDonation, setDetailDonation] = useState<Record<
		string,
		unknown
	> | null>(null);

	const donationsInfinite = useSuspenseInfiniteQuery({
		queryKey: donationsInfiniteQueryKey(
			searchParams.status as DonationStatus | undefined,
		),
		queryFn: ({ pageParam }) =>
			getDonations({
				data: {
					page: pageParam,
					limit: 10,
					status: searchParams.status as DonationStatus | undefined,
				},
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page >= lastPage.totalPages ? undefined : lastPage.page + 1,
	});

	const flatDonations = donationsInfinite.data.pages.flatMap(
		(p) => p.donations as Record<string, unknown>[],
	);
	const donationsTotal = donationsInfinite.data.pages[0]?.total ?? 0;

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const node = loadMoreRef.current;
		if (!node) return;
		const obs = new IntersectionObserver(
			(entries) => {
				const first = entries[0];
				if (
					!first?.isIntersecting ||
					!donationsInfinite.hasNextPage ||
					donationsInfinite.isFetchingNextPage
				) {
					return;
				}
				void donationsInfinite.fetchNextPage();
			},
			{ root: null, rootMargin: "200px", threshold: 0 },
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, [
		donationsInfinite.hasNextPage,
		donationsInfinite.isFetchingNextPage,
		donationsInfinite.fetchNextPage,
	]);

	const campaignsQuery = useSuspenseQuery(
		campaignsQueryOptions({
			page: searchParams.campaignPage || 1,
			status: searchParams.campaignStatus as CampaignStatus | undefined,
			search: searchParams.search,
		}),
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
		{ wait: 500 },
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
		pending:
			"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
		completed:
			"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
		failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
		refunded:
			"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
	};

	const campaignStatusColors: Record<string, string> = {
		draft:
			"bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
		active:
			"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
		paused:
			"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
		completed:
			"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
		newStatus: CampaignStatus,
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
				`Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
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
				`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
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
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
				<div className="mx-auto max-w-7xl min-w-0 space-y-8">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
							Donations
						</h1>
						<p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
							Campaigns and contributions across the platform.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
						<StatCard
							icon={
								<DollarSign className="size-5 text-emerald-600 dark:text-emerald-400" />
							}
							iconBg="bg-emerald-500/15"
							label="Total raised"
							value={formatCurrency(stats.totalRaised)}
						/>
						<StatCard
							icon={
								<TrendingUp className="size-5 text-sky-600 dark:text-sky-400" />
							}
							iconBg="bg-sky-500/15"
							label="All donations"
							value={String(stats.totalDonations)}
						/>
						<StatCard
							icon={
								<CheckCircle className="size-5 text-violet-600 dark:text-violet-400" />
							}
							iconBg="bg-violet-500/15"
							label="Completed"
							value={String(stats.completedDonations)}
						/>
						<StatCard
							icon={
								<Target className="size-5 text-amber-600 dark:text-amber-400" />
							}
							iconBg="bg-amber-500/15"
							label="Active campaigns"
							value={String(stats.activeCampaigns)}
						/>
					</div>

					{/* Tabs */}
					<ResponsiveTabs
						value={searchParams.tab || "donations"}
						onValueChange={handleTabChange}
						selectPlaceholder="Section"
						listClassName="flex w-full flex-wrap gap-1"
						items={[
							{
								value: "donations",
								label: "Donations",
								trigger: (
									<>
										<DollarSign className="h-4 w-4 mr-1.5" />
										Donations
									</>
								),
							},
							{
								value: "campaigns",
								label: "Campaigns",
								trigger: (
									<>
										<Target className="h-4 w-4 mr-1.5" />
										Campaigns
									</>
								),
							},
						]}
					>
						{/* Donations Tab */}
						<TabsContent value="donations" className="mt-6 space-y-5">
							<div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
								<Select
									value={searchParams.status || "all"}
									onValueChange={handleDonationStatusFilter}
								>
									<SelectTrigger className="h-10 w-full max-w-xs border-dashed">
										<Filter className="mr-2 size-4 shrink-0" />
										<SelectValue placeholder="All statuses" />
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

							{flatDonations.length === 0 ? (
								<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
									<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
										<DollarSign className="size-7 text-muted-foreground" />
									</div>
									<p className="font-medium text-foreground">No donations yet</p>
									<p className="mt-1 max-w-sm text-sm text-muted-foreground">
										Contributions will show here as they come in.
									</p>
								</div>
							) : (
								<>
									<p className="text-sm text-muted-foreground">
										Showing{" "}
										<span className="font-medium text-foreground">
											{flatDonations.length}
										</span>{" "}
										of{" "}
										<span className="font-medium text-foreground">
											{donationsTotal}
										</span>
									</p>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
										{flatDonations.map((donation) => {
											const d = donation as Record<string, any>;
											const isAnon = Boolean(d.is_anonymous);
											const fromWallet = Boolean(d.from_wallet);
											const paymentInfo = d.payments as
												| Record<string, unknown>
												| undefined;
											const campaignTitle = getLocalizedText(
												d.donation_campaigns?.title,
												locale,
											);
											const churchName = getLocalizedText(
												d.donation_campaigns?.churches?.name,
												locale,
											);
											return (
												<div
													key={donation.id as string}
													role="button"
													tabIndex={0}
													className="flex min-w-0 cursor-pointer flex-col rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
													onClick={() =>
														setDetailDonation(
															donation as Record<string, unknown>,
														)
													}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															setDetailDonation(
																donation as Record<string, unknown>,
															);
														}
													}}
												>
													<div className="flex items-start justify-between gap-3">
														<div className="flex min-w-0 flex-1 items-center gap-3">
															<Avatar className="size-10 shrink-0">
																<AvatarImage
																	src={d.profiles?.avatar_url || ""}
																/>
																<AvatarFallback className="bg-primary/10 text-xs text-primary">
																	{isAnon
																		? "A"
																		: getInitials(
																				d.profiles?.first_name,
																				d.profiles?.last_name,
																			)}
																</AvatarFallback>
															</Avatar>
															<div className="min-w-0 flex-1">
																<div className="flex flex-wrap items-center gap-1.5">
																	<p className="truncate font-medium text-foreground">
																		{isAnon
																			? "Anonymous"
																			: `${d.profiles?.first_name || ""} ${d.profiles?.last_name || ""}`.trim() ||
																				"Unknown"}
																	</p>
																	{isAnon && (
																		<span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
																			Anon
																		</span>
																	)}
																	{fromWallet && (
																		<span className="shrink-0 rounded-full bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
																			Wallet
																		</span>
																	)}
																</div>
																{!isAnon && d.profiles?.email && (
																	<p className="truncate text-xs text-muted-foreground">
																		{d.profiles.email as string}
																	</p>
																)}
															</div>
														</div>
														<span
															className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${donationStatusColors[donation.status as string] || ""}`}
														>
															{donation.status as string}
														</span>
													</div>
													<div className="mt-4 min-w-0 rounded-xl bg-muted/40 px-3 py-2">
														<p className="truncate text-sm font-medium text-foreground">
															{campaignTitle || "Campaign"}
														</p>
														{churchName ? (
															<p className="truncate text-xs text-muted-foreground">
																{churchName}
															</p>
														) : null}
													</div>
													<div className="mt-3 flex flex-wrap items-end justify-between gap-2">
														<p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
															{formatCurrency(
																donation.amount as number,
																(donation.currency as string) || "ETB",
															)}
														</p>
														<p className="text-xs text-muted-foreground">
															{new Date(
																donation.created_at as string,
															).toLocaleString()}
														</p>
													</div>
													<div className="mt-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
														{paymentInfo ? (
															<div className="min-w-0 space-y-0.5">
																<p className="truncate font-medium capitalize text-foreground">
																	{(paymentInfo.payment_gateway ||
																		paymentInfo.payment_method ||
																		"-") as string}
																</p>
																{paymentInfo.gateway_transaction_id ? (
																	<p className="truncate font-mono text-[10px]">
																		{String(
																			paymentInfo.gateway_transaction_id,
																		)}
																	</p>
																) : null}
															</div>
														) : (
															<span>No payment record</span>
														)}
													</div>
												</div>
											);
										})}
									</div>
									{donationsInfinite.hasNextPage ? (
										<div
											ref={loadMoreRef}
											className="flex justify-center py-6 text-sm text-muted-foreground"
										>
											{donationsInfinite.isFetchingNextPage ? (
												<span className="inline-flex items-center gap-2">
													<Loader2 className="size-4 animate-spin" />
													Loading more…
												</span>
											) : (
												<span>Scroll for more</span>
											)}
										</div>
									) : flatDonations.length > 0 ? (
										<p className="py-4 text-center text-xs text-muted-foreground">
											All {donationsTotal} donations loaded
										</p>
									) : null}
								</>
							)}
						</TabsContent>

						{/* Campaigns Tab */}
						<TabsContent value="campaigns" className="mt-6 space-y-5">
							{/* Filters */}
							<div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
								<div className="flex flex-col gap-3 sm:flex-row">
									<Input
										placeholder="Search campaigns..."
										value={campaignSearchInput}
										onChange={(e) => setCampaignSearchInput(e.target.value)}
										className="h-10 min-w-0 flex-1 border-dashed"
									/>
									<Select
										value={searchParams.campaignStatus || "all"}
										onValueChange={handleCampaignStatusFilter}
									>
										<SelectTrigger className="h-10 w-full border-dashed sm:w-[200px]">
											<Filter className="mr-2 size-4 shrink-0" />
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
								<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
									<div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
										<Target className="size-7 text-muted-foreground" />
									</div>
									<h3 className="mb-1 text-lg font-semibold text-foreground">
										No campaigns found
									</h3>
									<p className="max-w-sm text-sm text-muted-foreground">
										Donation campaigns created by churches will appear here.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
									{(
										campaignsQuery.data.campaigns as Record<string, unknown>[]
									).map((campaign) => {
										const campaignTitle = getLocalizedText(
											campaign.title,
											locale,
										);
										const churchName = campaign.churches
											? getLocalizedText(
													(campaign.churches as Record<string, unknown>).name,
													locale,
												)
											: "";
										const donations = campaign.donations as
											| { amount: number; status: string }[]
											| undefined;
										const donationCount = donations?.length || 0;
										const raisedAmount =
											donations
												?.filter((d) => d.status === "completed")
												.reduce((s, d) => s + d.amount, 0) || 0;
										const goalAmount = (campaign.goal_amount as number) || 0;
										const progress = goalAmount
											? Math.min(
													100,
													Math.round((raisedAmount / goalAmount) * 100),
												)
											: 0;

										return (
											<div
												key={campaign.id as string}
												className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
											>
												{/* Cover */}
												<div className="relative aspect-2/1 bg-muted">
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

												<div className="min-w-0 space-y-3 p-4">
													<div className="min-w-0">
														<h3 className="line-clamp-2 text-sm font-medium text-foreground">
															{campaignTitle || "Untitled Campaign"}
														</h3>
														{churchName && (
															<p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
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
																	(campaign.currency as string) || "ETB",
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
															campaign.start_date as string,
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
																	v as CampaignStatus,
																)
															}
															disabled={
																statusChanging === (campaign.id as string)
															}
														>
															<SelectTrigger className="h-7 w-[110px] text-xs">
																{statusChanging === (campaign.id as string) ? (
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
																	setDeletingCampaignId(campaign.id as string);
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
									})}
								</div>
							)}

							{/* Campaign Pagination */}
							{campaignsQuery.data.totalPages > 1 && (
								<div className="flex items-center justify-between">
									<p className="text-sm text-muted-foreground">
										Showing {(campaignsQuery.data.page - 1) * 10 + 1} to{" "}
										{Math.min(
											campaignsQuery.data.page * 10,
											campaignsQuery.data.total,
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
					</ResponsiveTabs>
				</div>
			</div>

			<Sheet
				open={!!detailDonation}
				onOpenChange={(open) => {
					if (!open) setDetailDonation(null);
				}}
			>
				<SheetContent
					side="right"
					className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md"
				>
					{detailDonation ? (
						<DonationDetailPanel
							donation={detailDonation}
							locale={locale}
							formatCurrency={formatCurrency}
							donationStatusColors={donationStatusColors}
							getInitials={getInitials}
						/>
					) : null}
				</SheetContent>
			</Sheet>

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
		</div>
	);
}

function DonationDetailPanel({
	donation,
	locale,
	formatCurrency,
	donationStatusColors,
	getInitials,
}: {
	donation: Record<string, unknown>;
	locale: Locale;
	formatCurrency: (amount: number, currency?: string) => string;
	donationStatusColors: Record<string, string>;
	getInitials: (first?: string | null, last?: string | null) => string;
}) {
	const d = donation as Record<string, any>;
	const isAnon = Boolean(d.is_anonymous);
	const fromWallet = Boolean(d.from_wallet);
	const paymentInfo = d.payments as Record<string, unknown> | undefined;
	const campaignTitle = getLocalizedText(d.donation_campaigns?.title, locale);
	const churchName = getLocalizedText(
		d.donation_campaigns?.churches?.name,
		locale,
	);
	const status = donation.status as string;
	const userId = d.user_id as string | undefined;

	return (
		<>
			<SheetHeader>
				<SheetTitle>Donation details</SheetTitle>
				<SheetDescription className="font-mono text-xs">
					{String(donation.id)}
				</SheetDescription>
			</SheetHeader>
			<div className="flex flex-col gap-4 px-1 pb-6">
				<div className="flex items-start gap-3">
					<Avatar className="size-12 shrink-0">
						<AvatarImage src={d.profiles?.avatar_url || ""} />
						<AvatarFallback className="bg-primary/10 text-sm text-primary">
							{isAnon
								? "A"
								: getInitials(d.profiles?.first_name, d.profiles?.last_name)}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1 space-y-1">
						<p className="font-medium text-foreground">
							{isAnon
								? "Anonymous donor"
								: `${d.profiles?.first_name || ""} ${d.profiles?.last_name || ""}`.trim() ||
									"Unknown"}
						</p>
						{!isAnon && d.profiles?.email ? (
							<p className="break-all text-sm text-muted-foreground">
								{d.profiles.email as string}
							</p>
						) : null}
						<div className="flex flex-wrap gap-2 pt-1">
							<span
								className={`rounded-full px-2 py-0.5 text-xs font-medium ${donationStatusColors[status] || ""}`}
							>
								{status}
							</span>
							{fromWallet ? (
								<span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
									Wallet
								</span>
							) : null}
						</div>
					</div>
				</div>

				<Separator />

				<div>
					<p className="text-xs font-medium text-muted-foreground">Amount</p>
					<p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
						{formatCurrency(
							donation.amount as number,
							(donation.currency as string) || "ETB",
						)}
					</p>
				</div>

				<div className="space-y-2 text-sm">
					<div>
						<p className="text-xs text-muted-foreground">Campaign</p>
						<p className="font-medium">{campaignTitle || "—"}</p>
						{churchName ? (
							<p className="text-muted-foreground">{churchName}</p>
						) : null}
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Created</p>
						<p>
							{new Date(donation.created_at as string).toLocaleString()}
						</p>
					</div>
					{d.updated_at && d.updated_at !== d.created_at ? (
						<div>
							<p className="text-xs text-muted-foreground">Updated</p>
							<p>{new Date(d.updated_at as string).toLocaleString()}</p>
						</div>
					) : null}
				</div>

				<Separator />

				<div className="space-y-2 text-sm">
					<p className="text-xs font-medium text-muted-foreground">Payment</p>
					{paymentInfo ? (
						<dl className="space-y-2">
							<div>
								<dt className="text-xs text-muted-foreground">Method / gateway</dt>
								<dd className="font-medium capitalize">
									{(paymentInfo.payment_gateway ||
										paymentInfo.payment_method ||
										"—") as string}
								</dd>
							</div>
							{paymentInfo.gateway_transaction_id ? (
								<div>
									<dt className="text-xs text-muted-foreground">
										Transaction ID
									</dt>
									<dd className="break-all font-mono text-xs">
										{String(paymentInfo.gateway_transaction_id)}
									</dd>
								</div>
							) : null}
							{paymentInfo.status ? (
								<div>
									<dt className="text-xs text-muted-foreground">
										Payment status
									</dt>
									<dd>{String(paymentInfo.status)}</dd>
								</div>
							) : null}
						</dl>
					) : (
						<p className="text-muted-foreground">No payment record linked.</p>
					)}
				</div>

				{userId && !isAnon ? (
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						render={
							<Link
								to="/dashboard/users/$userId"
								params={{ userId }}
							/>
						}
						nativeButton={false}
					>
						View donor profile
						<ExternalLink className="ml-2 size-4 shrink-0 opacity-70" />
					</Button>
				) : null}
			</div>
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
		<div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md sm:p-5">
			<div className="flex items-center gap-3">
				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
				>
					{icon}
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-xs font-medium text-muted-foreground sm:text-sm">
						{label}
					</p>
					<p className="truncate text-lg font-bold tabular-nums text-foreground sm:text-xl">
						{value}
					</p>
				</div>
			</div>
		</div>
	);
}
