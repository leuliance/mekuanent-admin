import { createFileRoute, Link } from "@tanstack/react-router";
import {
  getDashboardStats,
  getRecentActivities,
} from "@/api/dashboard";
import {
  Church,
  Users,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  loader: async () => {
    const [stats, activities] = await Promise.all([
      getDashboardStats(),
      getRecentActivities({ data: { limit: 5 } }),
    ]);
    return { stats, activities };
  },
  component: DashboardPage,
});

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-xl ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { stats, activities } = Route.useLoaderData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getLocalizedName = (name: unknown): string => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name as { en?: string; am?: string };
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };

  return (
    <>
      {/* Content */}   
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Churches"
              value={stats.churches.total}
              subtitle={`${stats.churches.pending} pending approval`}
              icon={Church}
              color="bg-gradient-to-br from-cyan-500 to-blue-600"
            />
            <StatCard
              title="Total Users"
              value={stats.users.total}
              subtitle={`${stats.users.newThisMonth} new this month`}
              icon={Users}
              color="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <StatCard
              title="Content Items"
              value={stats.content.total}
              subtitle={`${stats.content.pending} pending review`}
              icon={FileText}
              color="bg-gradient-to-br from-orange-500 to-red-600"
            />
            <StatCard
              title="Total Donations"
              value={formatCurrency(stats.donations.totalAmount)}
              subtitle={`${stats.donations.activeCampaigns} active campaigns`}
              icon={DollarSign}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="Upcoming Events"
              value={stats.events.upcoming}
              subtitle={`${stats.events.total} total events`}
              icon={Calendar}
              color="bg-gradient-to-br from-indigo-500 to-violet-600"
            />
            <StatCard
              title="Approved Churches"
              value={stats.churches.approved}
              subtitle={`${((stats.churches.approved / stats.churches.total) * 100).toFixed(0)}% approval rate`}
              icon={Church}
              color="bg-gradient-to-br from-teal-500 to-cyan-600"
            />
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Churches */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Recent Churches
                </h2>
                <Link
                  to="/dashboard/churches"
                  search={{ status: undefined, category: undefined, page: 1, search: "" }}
                  className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {activities.recentChurches.map((church: { id: string; name: unknown; status: string; created_at: string }) => (
                  <div
                    key={church.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {getLocalizedName(church.name)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(church.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        church.status === "approved"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : church.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {church.status}
                    </span>
                  </div>
                ))}
                {activities.recentChurches.length === 0 && (
                  <p className="p-4 text-slate-500 dark:text-slate-400 text-center">
                    No recent churches
                  </p>
                )}
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  Recent Donations
                </h2>
                <Link
                  to="/dashboard/donations"
                  search={{ status: undefined, page: 1 }}
                  className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {activities.recentDonations.map((donation: { id: string; amount: number; profiles?: { first_name?: string; last_name?: string }; donation_campaigns?: { title?: unknown } }) => (
                  <div
                    key={donation.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {donation.profiles?.first_name}{" "}
                        {donation.profiles?.last_name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getLocalizedName(donation.donation_campaigns?.title)}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(donation.amount)}
                    </span>
                  </div>
                ))}
                {activities.recentDonations.length === 0 && (
                  <p className="p-4 text-slate-500 dark:text-slate-400 text-center">
                    No recent donations
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
