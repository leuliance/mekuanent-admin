import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getCampaigns, updateCampaignStatus, type DonationCampaign } from "@/api/donations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Eye, Check, Target, Building } from "lucide-react";
import type { Database } from "@/types/database.types";

type CampaignStatus = Database["public"]["Enums"]["campaign_status"];

export const Route = createFileRoute(
  "/_authenticated/dashboard/campaigns/"
)({
  validateSearch: (search: Record<string, unknown>): { status: CampaignStatus | undefined; page: number } => ({
    status: search.status ? (search.status as CampaignStatus) : undefined,
    page: Number(search.page) || 1,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const campaignsData = await getCampaigns({
      data: {
        page: deps.page,
        limit: 10,
        status: deps.status,
      },
    });
    return campaignsData;
  },
  component: CampaignsPage,
});

function CampaignsPage() {
  const { campaigns, total, page, totalPages } = Route.useLoaderData();
  const { status } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const getLocalizedName = (name: unknown): string => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name as { en?: string; am?: string };
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };

  const handleStatusFilter = (newStatus: string) => {
    navigate({
      search: {
        status:
          newStatus === "all" ? undefined : (newStatus as CampaignStatus),
        page: 1,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const handleStatusUpdate = async (
    campaignId: string,
    newStatus: CampaignStatus
  ) => {
    try {
      await updateCampaignStatus({
        data: { id: campaignId, status: newStatus },
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update campaign status:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statusColors: Record<CampaignStatus, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    paused:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Donation Campaigns
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage and review donation campaigns
            </p>
          </div>

          {/* Filter */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-4">
              <Select
                value={status || "all"}
                onValueChange={(value) => handleStatusFilter(value || "")}
              >
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(campaigns as DonationCampaign[]).map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Cover Image */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 relative">
                  {campaign.cover_image_url ? (
                    <img
                      src={campaign.cover_image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[campaign.status as CampaignStatus]}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>

                {/* Campaign Info */}
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white line-clamp-1">
                    {getLocalizedName(campaign.title)}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <Building className="w-3 h-3" />
                    {getLocalizedName((campaign as any).churches?.name)}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        Progress
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {calculateProgress(
                          campaign.current_amount,
                          campaign.goal_amount
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-cyan-500 to-blue-600 rounded-full"
                        style={{
                          width: `${calculateProgress(campaign.current_amount, campaign.goal_amount)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatCurrency(campaign.current_amount)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatCurrency(campaign.goal_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                    {new Date(campaign.start_date).toLocaleDateString()} -{" "}
                    {campaign.end_date
                      ? new Date(campaign.end_date).toLocaleDateString()
                      : "Ongoing"}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </a>
                    {campaign.status === "draft" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() =>
                          handleStatusUpdate(campaign.id, "active")
                        }
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {campaign.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700"
                        onClick={() =>
                          handleStatusUpdate(campaign.id, "paused")
                        }
                      >
                        Pause
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No campaigns found
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of{" "}
                {total} campaigns
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
