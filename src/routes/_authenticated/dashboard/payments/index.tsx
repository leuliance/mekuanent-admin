import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useDebouncer } from "@tanstack/react-pacer";
import { getPayments, getPaymentStats } from "@/api/payments";
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
} from "@/components/ui/dialog";
import {
  CreditCard,
  Filter,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type PaymentStatus = Database["public"]["Enums"]["donation_status"];

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const paymentsQueryOptions = (params: { page: number; status?: PaymentStatus; search?: string }) =>
  queryOptions({
    queryKey: ["payments", params],
    queryFn: () => getPayments({ data: { page: params.page, limit: 20, status: params.status, search: params.search } }),
  });

const paymentStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["payment-stats"],
    queryFn: () => getPaymentStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/payments/")({
  validateSearch: (search: Record<string, unknown>): { page: number; status?: string; search?: string } => ({
    page: Number(search.page) || 1,
    status: search.status ? String(search.status) : undefined,
    search: search.search ? String(search.search) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(paymentsQueryOptions({ page: deps.page, status: deps.status as PaymentStatus | undefined, search: deps.search })),
      context.queryClient.ensureQueryData(paymentStatsQueryOptions()),
    ]);
  },
  pendingComponent: PaymentsLoadingSkeleton,
  errorComponent: PaymentsErrorState,
  component: PaymentsPage,
});

function PaymentsLoadingSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    </>
  );
}

function PaymentsErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4"><AlertCircle className="w-8 h-8 text-destructive" /></div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Payments</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    </>
  );
}

function PaymentsPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [detailPayment, setDetailPayment] = useState<Record<string, unknown> | null>(null);

  const paymentsQuery = useSuspenseQuery(paymentsQueryOptions({ page: searchParams.page, status: searchParams.status as PaymentStatus | undefined, search: searchParams.search }));
  const statsQuery = useSuspenseQuery(paymentStatsQueryOptions());
  const stats = statsQuery.data;

  const debouncedSearch = useDebouncer(
    (value: string) => {
      navigate({ search: (prev) => ({ ...prev, search: value.trim() || undefined, page: 1 }) });
    },
    { wait: 500 }
  );

  useEffect(() => {
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput]);

  const formatCurrency = (amount: number, currency = "ETB") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);

  const getInitials = (fn?: string | null, ln?: string | null) =>
    ((fn?.[0] || "") + (ln?.[0] || "")).toUpperCase() || "U";

  const handleStatusFilter = (value: string | null) => {
    navigate({ search: (prev) => ({ ...prev, status: !value || value === "all" ? undefined : value, page: 1 }) });
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-muted-foreground mt-1">All payment transactions made by users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />} iconBg="bg-blue-100 dark:bg-blue-900/30" label="Total Payments" value={String(stats.total)} />
            <StatCard icon={<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />} iconBg="bg-green-100 dark:bg-green-900/30" label="Completed" value={String(stats.completed)} />
            <StatCard icon={<XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />} iconBg="bg-red-100 dark:bg-red-900/30" label="Failed" value={String(stats.failed)} />
            <StatCard icon={<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />} iconBg="bg-emerald-100 dark:bg-emerald-900/30" label="Total Volume" value={formatCurrency(stats.totalAmount)} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Search by reference or transaction ID..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="flex-1" />
              <Select value={searchParams.status || "all"} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="All Status" />
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
          </div>

          {/* Table */}
          {paymentsQuery.data.payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-16 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4"><CreditCard className="h-8 w-8 text-muted-foreground" /></div>
              <h3 className="text-lg font-semibold mb-1">No payments found</h3>
              <p className="text-sm text-muted-foreground">Payments will appear here once users make transactions.</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">User</th>
                      <th className="px-4 py-3 text-left font-medium">Amount</th>
                      <th className="px-4 py-3 text-left font-medium">Method</th>
                      <th className="px-4 py-3 text-left font-medium">Gateway</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(paymentsQuery.data.payments as Record<string, unknown>[]).map((payment) => {
                      const profile = payment.profiles as Record<string, unknown> | null;
                      return (
                        <tr key={payment.id as string} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={(profile?.avatar_url as string) || ""} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {getInitials(profile?.first_name as string, profile?.last_name as string)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {`${(profile?.first_name as string) || ""} ${(profile?.last_name as string) || ""}`.trim() || "Unknown"}
                                </p>
                                <p className="text-[11px] text-muted-foreground">{(profile?.email as string) || (profile?.phone_number as string) || ""}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(payment.amount as number, (payment.currency as string) || "ETB")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground capitalize">{(payment.payment_method as string) || "-"}</td>
                          <td className="px-4 py-3 text-muted-foreground capitalize">{(payment.payment_gateway as string) || "-"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${paymentStatusColors[payment.status as string] || ""}`}>
                              {payment.status as string}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{new Date(payment.created_at as string).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailPayment(payment)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {paymentsQuery.data.totalPages > 1 && (
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(paymentsQuery.data.page - 1) * 20 + 1} to {Math.min(paymentsQuery.data.page * 20, paymentsQuery.data.total)} of {paymentsQuery.data.total}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={paymentsQuery.data.page <= 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: paymentsQuery.data.page - 1 }) })}>
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={paymentsQuery.data.page >= paymentsQuery.data.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: paymentsQuery.data.page + 1 }) })}>
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Dialog */}
      <Dialog open={!!detailPayment} onOpenChange={(open) => !open && setDetailPayment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {detailPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Amount" value={formatCurrency(detailPayment.amount as number, (detailPayment.currency as string) || "ETB")} />
                <InfoRow label="Currency" value={(detailPayment.currency as string) || "ETB"} />
                <InfoRow label="Status" value={(detailPayment.status as string) || "-"} />
                <InfoRow label="Method" value={(detailPayment.payment_method as string) || "-"} />
                <InfoRow label="Gateway" value={(detailPayment.payment_gateway as string) || "-"} />
                <InfoRow label="Gateway Ref" value={(detailPayment.gateway_reference as string) || "-"} />
                <InfoRow label="Transaction ID" value={(detailPayment.gateway_transaction_id as string) || "-"} />
                <InfoRow label="Created" value={new Date(detailPayment.created_at as string).toLocaleString()} />
                {!!detailPayment.completed_at && <InfoRow label="Completed" value={new Date(String(detailPayment.completed_at)).toLocaleString()} />}
                {!!detailPayment.failed_at && <InfoRow label="Failed At" value={new Date(String(detailPayment.failed_at)).toLocaleString()} />}
              </div>
              {!!detailPayment.error_message && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <strong>Error:</strong> {String(detailPayment.error_message)}
                </div>
              )}
              {!!detailPayment.payment_details && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Payment Details</p>
                  <pre className="p-3 rounded-lg bg-muted text-xs font-mono overflow-auto max-h-40">
                    {JSON.stringify(detailPayment.payment_details, null, 2)}
                  </pre>
                </div>
              )}
              {!!detailPayment.gateway_response && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Gateway Response</p>
                  <pre className="p-3 rounded-lg bg-muted text-xs font-mono overflow-auto max-h-40">
                    {JSON.stringify(detailPayment.gateway_response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value}</p>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value }: { icon: React.ReactNode; iconBg: string; label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl p-4 border">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
      </div>
    </div>
  );
}
