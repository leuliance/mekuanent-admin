import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Check, HelpCircle, X } from "lucide-react";

interface RsvpUser {
  id: string;
  status: string;
  guest_count: number;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

const rsvpStatusConfig: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
  going: {
    icon: <Check className="h-3 w-3" />,
    label: "Going",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  maybe: {
    icon: <HelpCircle className="h-3 w-3" />,
    label: "Maybe",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  not_going: {
    icon: <X className="h-3 w-3" />,
    label: "Not Going",
    className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
};

function getInitials(firstName?: string | null, lastName?: string | null) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

export function EventRsvpTable({ rsvps }: { rsvps: RsvpUser[] }) {
  if (!rsvps || rsvps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No RSVPs yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Attendees will appear here once they RSVP.
        </p>
      </div>
    );
  }

  const going = rsvps.filter((r) => r.status === "going");
  const maybe = rsvps.filter((r) => r.status === "maybe");
  const notGoing = rsvps.filter((r) => r.status === "not_going");
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          {going.length} Going
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          {maybe.length} Maybe
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          {notGoing.length} Not Going
        </div>
        {totalGuests > rsvps.length && (
          <div className="text-sm text-muted-foreground">
            ({totalGuests} total guests)
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Attendee</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Guests</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rsvps.map((rsvp) => {
              const config = rsvpStatusConfig[rsvp.status] || rsvpStatusConfig.going;
              return (
                <tr key={rsvp.id} className="hover:bg-muted/30">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={rsvp.profiles?.avatar_url || ""} />
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {getInitials(rsvp.profiles?.first_name, rsvp.profiles?.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {rsvp.profiles
                          ? `${rsvp.profiles.first_name || ""} ${rsvp.profiles.last_name || ""}`.trim() || "Unknown"
                          : "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {rsvp.guest_count || 1}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
