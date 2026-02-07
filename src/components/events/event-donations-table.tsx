import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign } from "lucide-react";

interface EventDonation {
  id: string;
  amount: number;
  currency: string;
  status: string;
  is_anonymous: boolean;
  message: unknown;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

function getInitials(firstName?: string | null, lastName?: string | null) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "A";
}

function formatCurrency(amount: number, currency = "ETB") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

const donationStatusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  refunded: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

export function EventDonationsTable({ donations }: { donations: EventDonation[] }) {
  if (!donations || donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <DollarSign className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No donations yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Donations for this event will appear here.
        </p>
      </div>
    );
  }

  const totalAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(totalAmount)}
        </span>
        <span className="text-muted-foreground">
          raised from {donations.length} donation{donations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Donor</th>
              <th className="px-3 py-2 text-left font-medium">Amount</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map((donation) => (
              <tr key={donation.id} className="hover:bg-muted/30">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={donation.is_anonymous ? "" : (donation.profiles?.avatar_url || "")} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {donation.is_anonymous
                          ? "A"
                          : getInitials(donation.profiles?.first_name, donation.profiles?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {donation.is_anonymous
                        ? "Anonymous"
                        : donation.profiles
                          ? `${donation.profiles.first_name || ""} ${donation.profiles.last_name || ""}`.trim() || "Unknown"
                          : "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(donation.amount, donation.currency)}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${donationStatusColors[donation.status] || ""}`}>
                    {donation.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {new Date(donation.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
