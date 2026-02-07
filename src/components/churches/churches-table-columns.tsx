import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import type { Church, ChurchCategory } from "@/api/churches";
import { getLocalizedText, type Locale } from "@/stores/locale-store";
import { ChurchStatusBadge } from "./church-status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  Shield,
  Church as ChurchIcon,
} from "lucide-react";
import type { Database } from "@/types/database.types";

type ChurchStatus = Database["public"]["Enums"]["church_status"];

const categoryLabels: Record<ChurchCategory, string> = {
  church: "Church",
  monastery: "Monastery",
  "female-monastery": "Female Monastery",
};

interface ColumnActions {
  locale: Locale;
  onEdit: (church: Church) => void;
  onDelete: (church: Church) => void;
  onStatusChange: (church: Church, status: ChurchStatus) => void;
}

export function getChurchColumns({
  locale,
  onEdit,
  onDelete,
  onStatusChange,
}: ColumnActions): ColumnDef<Church>[] {
  return [
    {
      accessorKey: "name",
      header: "Church",
      cell: ({ row }) => {
        const church = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
              {church.logo_url ? (
                <img
                  src={church.logo_url}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <ChurchIcon className="h-4 w-4 text-primary/60" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">
                {getLocalizedText(church.name, locale)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {church.email || church.phone_number}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm capitalize">
          {categoryLabels[row.original.category] || row.original.category}
        </span>
      ),
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => {
        const city = getLocalizedText(row.original.city, locale);
        const country = getLocalizedText(row.original.country, locale);
        return (
          <span className="text-sm text-muted-foreground truncate max-w-[140px] block">
            {city || country || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ChurchStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Registered",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const church = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" render={<Link to="/dashboard/churches/$churchId" params={{ churchId: church.id }} />}>
              <Link
                to="/dashboard/churches/$churchId"
                params={{ churchId: church.id }}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(church)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                {church.status === "pending" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(church, "approved")}
                    >
                      <Check className="mr-2 h-4 w-4 text-emerald-600" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(church, "rejected")}
                    >
                      <X className="mr-2 h-4 w-4 text-red-600" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                {church.status === "approved" && (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(church, "suspended")}
                  >
                    <Shield className="mr-2 h-4 w-4 text-amber-600" />
                    Suspend
                  </DropdownMenuItem>
                )}
                {church.status === "suspended" && (
                  <DropdownMenuItem
                    onClick={() => onStatusChange(church, "approved")}
                  >
                    <Check className="mr-2 h-4 w-4 text-emerald-600" />
                    Reactivate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(church)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
