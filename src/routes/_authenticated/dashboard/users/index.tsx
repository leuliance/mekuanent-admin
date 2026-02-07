import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useDebouncer } from "@tanstack/react-pacer";
import { getUsers, getUserStats, updateUserStatus, type UserAccountStatus } from "@/api/users";
import { isSuperAdmin } from "@/lib/roles";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Eye, Mail, Phone, AlertCircle, Users as UsersIcon, Ban, ShieldCheck, Loader2, UserX, Pause } from "lucide-react";
import type { Database } from "@/types/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

// ============ QUERY OPTIONS ============
const usersQueryOptions = (params: {
  page: number;
  role?: UserRole;
  search?: string;
}) =>
  queryOptions({
    queryKey: ["users", params],
    queryFn: () =>
      getUsers({
        data: {
          page: params.page,
          limit: 10,
          role: params.role,
          search: params.search || "",
        },
      }),
  });

const userStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["user-stats"],
    queryFn: () => getUserStats(),
  });

export const Route = createFileRoute("/_authenticated/dashboard/users/")({
  validateSearch: (
    search: Record<string, unknown>
  ): { role?: UserRole; page: number; search?: string } => ({
    role: search.role ? (search.role as UserRole) : undefined,
    page: Number(search.page) || 1,
    search: search.search ? String(search.search) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        usersQueryOptions({
          page: deps.page,
          role: deps.role,
          search: deps.search,
        })
      ),
      context.queryClient.ensureQueryData(userStatsQueryOptions()),
    ]);
  },
  pendingComponent: UsersLoadingSkeleton,
  errorComponent: UsersErrorState,
  component: UsersPage,
});

// ============ LOADING SKELETON ============
function UsersLoadingSkeleton() {
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
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-12 w-full max-w-lg" />
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
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
    </>
  );
}

// ============ ERROR STATE ============
function UsersErrorState({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Users</h2>
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
function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [searchInput, setSearchInput] = useState(searchParams.search || "");
  const [hasSearched, setHasSearched] = useState(false);

  const { user: currentUser } = Route.useRouteContext();
  const isCurrentSuperAdmin = !!currentUser && isSuperAdmin(currentUser.role);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusTargetUser, setStatusTargetUser] = useState<Record<string, unknown> | null>(null);
  const [newStatus, setNewStatus] = useState<UserAccountStatus>("active");
  const [statusReason, setStatusReason] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const usersQuery = useSuspenseQuery(
    usersQueryOptions({
      page: searchParams.page,
      role: searchParams.role,
      search: searchParams.search,
    })
  );
  const statsQuery = useSuspenseQuery(userStatsQueryOptions());

  const { users, total, page, totalPages } = usersQuery.data;
  const stats = statsQuery.data;
  const isSearching = hasSearched && usersQuery.isRefetching;

  // Debounced search
  const debouncedSearch = useDebouncer(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value.trim() || undefined,
          page: 1,
        }),
      });
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (searchInput || searchParams.search) {
      setHasSearched(true);
    }
    debouncedSearch.maybeExecute(searchInput);
  }, [searchInput, searchParams.search]);

  const handleRoleFilter = (newRole: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        role: newRole === "all" ? undefined : (newRole as UserRole),
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  const handleStatusUpdate = async () => {
    if (!statusTargetUser || !currentUser) return;
    setIsUpdatingStatus(true);
    try {
      await updateUserStatus({
        data: {
          user_id: statusTargetUser.id as string,
          status: newStatus,
          reason: statusReason.trim() || undefined,
          changed_by: currentUser.id,
        },
      });
      toast.success(`User status updated to ${newStatus}`);
      setStatusDialogOpen(false);
      setStatusTargetUser(null);
      setStatusReason("");
      usersQuery.refetch();
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getUserStatusFromData = (user: Record<string, unknown>): UserAccountStatus => {
    return (user.status as UserAccountStatus) || "active";
  };

  const isUserSuperAdmin = (u: Record<string, unknown>) => {
    const roles = u.user_roles as { role: string }[] | undefined;
    return roles?.some((r) => r.role === "super_admin") || false;
  };

  const roleColors: Record<UserRole, string> = {
    super_admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    admin: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    church_admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    content_admin: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    content_creator: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    user: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  const statusConfig: Record<UserAccountStatus, { label: string; color: string; icon: typeof Ban }> = {
    active: { label: "Active", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: ShieldCheck },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: UserX },
    suspended: { label: "Suspended", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Pause },
    banned: { label: "Banned", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: Ban },
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Title & Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-muted-foreground mt-1">
                Manage platform users and their roles
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-400">
                {stats.superAdmins} Super Admins
              </div>
              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-400">
                {stats.churchAdmins} Church Admins
              </div>
              <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
                {stats.total} Total
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                value={searchParams.role || "all"}
                onValueChange={(value) => handleRoleFilter(value || "")}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Role: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Role: All</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="church_admin">Church Admin</SelectItem>
                  <SelectItem value="content_admin">Content Admin</SelectItem>
                  <SelectItem value="content_creator">Content Creator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {isSearching ? (
            <div className="bg-card rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Roles</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-8 w-8" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <UsersIcon className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No users found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Roles</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => {
                      const userStatus = getUserStatusFromData(user as any);
                      const statusInfo = statusConfig[userStatus];
                      return (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar_url || ""} />
                              <AvatarFallback className="bg-linear-to-br from-cyan-500 to-blue-600 text-white">
                                {getInitials(user.first_name, user.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {user.email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            )}
                            {user.phone_number && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {user.phone_number}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.user_roles && user.user_roles.length > 0 ? (
                              user.user_roles.map((ur: { role: UserRole }, idx: number) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[ur.role]}`}
                                >
                                  {ur.role.replace("_", " ")}
                                </span>
                              ))
                            ) : (
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleColors.user}`}>
                                user
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.color}`}>
                            <statusInfo.icon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              render={
                                <Link
                                  to="/dashboard/users/$userId"
                                  params={{ userId: user.id }}
                                />
                              }
                              nativeButton={false}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {isCurrentSuperAdmin && !isUserSuperAdmin(user as any) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className={userStatus !== "active" ? "text-green-600 hover:text-green-700" : "text-destructive hover:text-destructive"}
                                onClick={() => {
                                  setStatusTargetUser(user as any);
                                  setNewStatus(userStatus === "active" ? "banned" : "active");
                                  setStatusReason("");
                                  setStatusDialogOpen(true);
                                }}
                              >
                                {userStatus !== "active" ? <ShieldCheck className="w-4 h-4 mr-1" /> : <Ban className="w-4 h-4 mr-1" />}
                                {userStatus !== "active" ? "Activate" : "Ban"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)}{" "}
                    of {total} users
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
          )}
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change User Status
            </DialogTitle>
            <DialogDescription>
              Update the status for {(statusTargetUser as any)?.first_name || ""} {(statusTargetUser as any)?.last_name || ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as UserAccountStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Active</span>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <span className="flex items-center gap-2"><UserX className="w-3.5 h-3.5 text-gray-600" /> Inactive</span>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <span className="flex items-center gap-2"><Pause className="w-3.5 h-3.5 text-yellow-600" /> Suspended</span>
                  </SelectItem>
                  <SelectItem value="banned">
                    <span className="flex items-center gap-2"><Ban className="w-3.5 h-3.5 text-red-600" /> Banned</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="Why are you changing this user's status?"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)} disabled={isUpdatingStatus}>
              Cancel
            </Button>
            <Button
              variant={newStatus === "banned" ? "destructive" : "default"}
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</>
              ) : (
                <>Update Status</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
