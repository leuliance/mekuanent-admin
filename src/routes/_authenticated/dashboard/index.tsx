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
import type { LucideIcon } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

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
  accentClass,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accentClass: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm sm:normal-case sm:tracking-normal">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="size-3.5 shrink-0 text-emerald-500 sm:size-4" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:text-sm">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-inner sm:size-12 ${accentClass}`}
        >
          <Icon className="size-5 text-white sm:size-6" />
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

  const churchApprovalPct =
    stats.churches.total > 0
      ? ((stats.churches.approved / stats.churches.total) * 100).toFixed(0)
      : "0";

  const platformBarData = [
    { key: "churches", label: "Churches", value: stats.churches.total },
    { key: "users", label: "Users", value: stats.users.total },
    { key: "content", label: "Content", value: stats.content.total },
    { key: "donations", label: "Donations", value: stats.donations.totalCount },
    { key: "events", label: "Events", value: stats.events.total },
  ] as const;

  const platformBarConfig = {
    value: { label: "Count" },
    churches: { label: "Churches", color: "var(--color-chart-1)" },
    users: { label: "Users", color: "var(--color-chart-2)" },
    content: { label: "Content", color: "var(--color-chart-3)" },
    donations: { label: "Donations", color: "var(--color-chart-4)" },
    events: { label: "Events", color: "var(--color-chart-5)" },
  } satisfies ChartConfig;

  const churchMixData = [
    {
      name: "approved",
      value: stats.churches.approved,
      fill: "var(--color-approved)",
    },
    {
      name: "pending",
      value: stats.churches.pending,
      fill: "var(--color-pending)",
    },
    {
      name: "other",
      value: Math.max(
        0,
        stats.churches.total - stats.churches.approved - stats.churches.pending,
      ),
      fill: "var(--color-other)",
    },
  ].filter((d) => d.value > 0);

  const churchMixConfig = {
    value: { label: "Churches" },
    approved: { label: "Approved", color: "hsl(142 76% 36%)" },
    pending: { label: "Pending", color: "hsl(38 92% 50%)" },
    other: { label: "Other", color: "oklch(0.55 0.02 286 / 0.45)" },
  } satisfies ChartConfig;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Platform snapshot: churches, people, content, giving, and what
                changed recently.
              </p>
            </div>
          </div>

          <section aria-label="Key metrics">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total churches"
                value={stats.churches.total}
                subtitle={`${stats.churches.pending} pending approval`}
                icon={Church}
                accentClass="bg-linear-to-br from-cyan-500 to-blue-600"
              />
              <StatCard
                title="Total users"
                value={stats.users.total}
                subtitle={`${stats.users.newThisMonth} new this month`}
                icon={Users}
                accentClass="bg-linear-to-br from-violet-500 to-fuchsia-600"
              />
              <StatCard
                title="Content items"
                value={stats.content.total}
                subtitle={`${stats.content.pending} pending review`}
                icon={FileText}
                accentClass="bg-linear-to-br from-orange-500 to-rose-600"
              />
              <StatCard
                title="Donations (total)"
                value={formatCurrency(stats.donations.totalAmount)}
                subtitle={`${stats.donations.activeCampaigns} active campaigns`}
                icon={DollarSign}
                accentClass="bg-linear-to-br from-emerald-500 to-teal-600"
              />
              <StatCard
                title="Upcoming events"
                value={stats.events.upcoming}
                subtitle={`${stats.events.total} total scheduled`}
                icon={Calendar}
                accentClass="bg-linear-to-br from-indigo-500 to-violet-600"
              />
              <StatCard
                title="Approved churches"
                value={stats.churches.approved}
                subtitle={`${churchApprovalPct}% of all churches`}
                icon={Church}
                accentClass="bg-linear-to-br from-sky-500 to-cyan-600"
              />
            </div>
          </section>

          <section aria-label="Charts" className="grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm lg:col-span-3">
              <h2 className="mb-1 font-semibold text-foreground">
                Platform volume
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Counts across churches, users, content, completed donations, and
                events.
              </p>
              <ChartContainer
                config={platformBarConfig}
                className="aspect-auto h-[min(22rem,55vw)] w-full max-h-80 min-h-[220px]"
              >
                <BarChart
                  data={[...platformBarData]}
                  layout="vertical"
                  margin={{ left: 4, right: 16, top: 8, bottom: 8 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    className="stroke-border/60"
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    width={88}
                    tick={{ fontSize: 12 }}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {platformBarData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={`var(--color-${entry.key})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm lg:col-span-2">
              <h2 className="mb-1 font-semibold text-foreground">
                Church pipeline
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Approved vs pending vs other statuses.
              </p>
              {churchMixData.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  No church data yet
                </p>
              ) : (
                <ChartContainer
                  config={churchMixConfig}
                  className="mx-auto aspect-square w-full max-w-xs min-h-[220px]"
                >
                  <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel nameKey="name" />}
                    />
                    <Pie
                      data={churchMixData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={88}
                      strokeWidth={2}
                      className="stroke-background"
                    >
                      {churchMixData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </section>

          <section
            aria-label="Recent activity"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
                <h2 className="font-semibold text-foreground">Recent churches</h2>
                <Link
                  to="/dashboard/churches"
                  search={{
                    status: undefined,
                    category: undefined,
                    page: 1,
                    search: "",
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {activities.recentChurches.map(
                  (church: {
                    id: string;
                    name: unknown;
                    status: string;
                    created_at: string;
                  }) => (
                    <div
                      key={church.id}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {getLocalizedName(church.name)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                          <Clock className="size-3 shrink-0" />
                          {new Date(church.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          church.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : church.status === "pending"
                              ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                              : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {church.status}
                      </span>
                    </div>
                  ),
                )}
                {activities.recentChurches.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground sm:px-5">
                    No recent churches
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
                <h2 className="font-semibold text-foreground">Recent donations</h2>
                <Link
                  to="/dashboard/donations"
                  search={{ status: undefined, page: 1 }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {activities.recentDonations.map(
                  (donation: {
                    id: string;
                    amount: number;
                    profiles?: { first_name?: string; last_name?: string };
                    donation_campaigns?: { title?: unknown };
                  }) => (
                    <div
                      key={donation.id}
                      className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {donation.profiles?.first_name}{" "}
                          {donation.profiles?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {getLocalizedName(donation.donation_campaigns?.title)}
                        </p>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(donation.amount)}
                      </span>
                    </div>
                  ),
                )}
                {activities.recentDonations.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground sm:px-5">
                    No recent donations
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
