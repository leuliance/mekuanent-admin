import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  getChurch,
  updateChurch,
  deleteChurchImage,
  type ChurchCategory,
} from "@/api/churches";
import { ChurchStatusBadge } from "@/components/churches/church-status-badge";
import { ChurchStatusDialog } from "@/components/churches/church-status-dialog";
import { ChurchDeleteDialog } from "@/components/churches/church-delete-dialog";
import {
  useLocaleStore,
  getLocalizedText,
} from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  AlertCircle,
  Church as ChurchIcon,
  Check,
  X,
  Shield,
  Pencil,
  Trash2,
  CreditCard,
  Save,
  Loader2,
  RotateCcw,
  Plus,
  ImagePlus,
  Star,
} from "lucide-react";
import { canDelete } from "@/lib/roles";
import type { Database } from "@/types/database.types";

// Import extracted components
import {
  churchEditSchema,
  type TypedChurch,
  type BankAccount,
  categoryLabels,
  SectionCard,
  ViewContent,
  EditForm,
  BankAccountDialog,
  ImageUploadDialog,
} from "@/components/church-detail";

type ChurchStatus = Database["public"]["Enums"]["church_status"];

// ============ ROUTE ============
export const Route = createFileRoute(
  "/_authenticated/dashboard/churches/$churchId/"
)({
  loader: async ({ params }) => {
    const church = await getChurch({ data: { id: params.churchId } });
    return { church };
  },
  pendingComponent: ChurchDetailSkeleton,
  errorComponent: ChurchDetailError,
  component: ChurchDetailPage,
});

// ============ LOADING SKELETON ============
function ChurchDetailSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="rounded-xl border p-6">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-xl" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={`skel-${i}`} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function ChurchDetailError({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Church</h2>
          <p className="text-muted-foreground mb-5">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              render={
                <Link
                  to="/dashboard/churches"
                  search={{
                    status: undefined,
                    category: undefined,
                    page: 1,
                    search: undefined,
                  }}
                />
              }
              nativeButton={false}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Churches
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
function ChurchDetailPage() {
  const { church } = Route.useLoaderData();
  const { locale } = useLocaleStore();
  const router = useRouter();

  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<ChurchStatus | "">("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Bank account dialog state
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [editingBankAccount, setEditingBankAccount] =
    useState<BankAccount | null>(null);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);

  // Image upload dialog state
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const typedChurch = church as TypedChurch;
  const churchName = getLocalizedText(typedChurch.name, locale);

  const form = useForm({
    defaultValues: {
      name_en: getLocalizedText(typedChurch.name, "en"),
      name_am: getLocalizedText(typedChurch.name, "am"),
      name_or: getLocalizedText(typedChurch.name, "or"),
      name_so: getLocalizedText(typedChurch.name, "so"),
      name_ti: getLocalizedText(typedChurch.name, "ti"),
      description_en: getLocalizedText(typedChurch.description, "en"),
      description_am: getLocalizedText(typedChurch.description, "am"),
      description_or: getLocalizedText(typedChurch.description, "or"),
      description_so: getLocalizedText(typedChurch.description, "so"),
      description_ti: getLocalizedText(typedChurch.description, "ti"),
      category: typedChurch.category as ChurchCategory,
      phone_number: typedChurch.phone_number || "",
      email: typedChurch.email || "",
      website: typedChurch.website || "",
      city_en: getLocalizedText(typedChurch.city, "en"),
      city_am: getLocalizedText(typedChurch.city, "am"),
      city_or: getLocalizedText(typedChurch.city, "or"),
      city_so: getLocalizedText(typedChurch.city, "so"),
      city_ti: getLocalizedText(typedChurch.city, "ti"),
      address_en: getLocalizedText(typedChurch.address, "en"),
      address_am: getLocalizedText(typedChurch.address, "am"),
      address_or: getLocalizedText(typedChurch.address, "or"),
      address_so: getLocalizedText(typedChurch.address, "so"),
      address_ti: getLocalizedText(typedChurch.address, "ti"),
      country_en: getLocalizedText(typedChurch.country, "en"),
      country_am: getLocalizedText(typedChurch.country, "am"),
      country_or: getLocalizedText(typedChurch.country, "or"),
      country_so: getLocalizedText(typedChurch.country, "so"),
      country_ti: getLocalizedText(typedChurch.country, "ti"),
      founded_year: typedChurch.founded_year
        ? String(typedChurch.founded_year)
        : "",
    },
    validators: { onChange: churchEditSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await updateChurch({
          data: {
            id: typedChurch.id,
            name_en: value.name_en,
            name_am: value.name_am,
            name_or: value.name_or || undefined,
            name_so: value.name_so || undefined,
            name_ti: value.name_ti || undefined,
            description_en: value.description_en,
            description_am: value.description_am,
            description_or: value.description_or || undefined,
            description_so: value.description_so || undefined,
            description_ti: value.description_ti || undefined,
            category: value.category,
            phone_number: value.phone_number,
            email: value.email || undefined,
            website: value.website || undefined,
            city_en: value.city_en || undefined,
            city_am: value.city_am || undefined,
            city_or: value.city_or || undefined,
            city_so: value.city_so || undefined,
            city_ti: value.city_ti || undefined,
            address_en: value.address_en || undefined,
            address_am: value.address_am || undefined,
            address_or: value.address_or || undefined,
            address_so: value.address_so || undefined,
            address_ti: value.address_ti || undefined,
            country_en: value.country_en || undefined,
            country_am: value.country_am || undefined,
            country_or: value.country_or || undefined,
            country_so: value.country_so || undefined,
            country_ti: value.country_ti || undefined,
            founded_year: value.founded_year
              ? Number(value.founded_year)
              : undefined,
          },
        });
        setIsEditing(false);
        router.invalidate();
      } catch (error) {
        console.error("Failed to update church:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const isDirty = form.state.isDirty;

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const openStatusDialog = (s: ChurchStatus) => {
    setTargetStatus(s);
    setStatusDialogOpen(true);
  };

  const handleDeleteBankAccount = async (id: string) => {
    setDeletingBankId(id);
    try {
      const { deleteBankAccount } = await import("@/api/churches");
      await deleteBankAccount({ data: { id } });
      router.invalidate();
    } catch (error) {
      console.error("Failed to delete bank account:", error);
    } finally {
      setDeletingBankId(null);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteChurchImage({ data: { id } });
      router.invalidate();
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link
                to="/dashboard/churches"
                search={{
                  status: undefined,
                  category: undefined,
                  page: 1,
                  search: undefined,
                }}
              />
            }
            nativeButton={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Churches
          </Button>

          {/* Hero Card */}
          <div className="rounded-xl border bg-card overflow-hidden">
            {typedChurch.cover_image_url ? (
              <div className="h-40 relative">
                <img
                  src={typedChurch.cover_image_url}
                  alt={`${churchName} cover`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card/80 to-transparent" />
              </div>
            ) : (
              <div className="h-24 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />
            )}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="h-20 w-20 rounded-xl bg-card border-4 border-card flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {typedChurch.logo_url ? (
                    <img
                      src={typedChurch.logo_url}
                      alt={churchName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ChurchIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">
                        {churchName}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {categoryLabels[typedChurch.category] ||
                          typedChurch.category}
                        {typedChurch.founded_year &&
                          ` \u00B7 Founded ${typedChurch.founded_year}`}
                      </p>
                      <div className="mt-2">
                        <ChurchStatusBadge status={typedChurch.status} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={!isDirty || isSubmitting}
                            onClick={() => form.handleSubmit()}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-3.5 w-3.5 mr-1.5" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </Button>
                          {typedChurch.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => openStatusDialog("approved")}
                              >
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openStatusDialog("rejected")}
                              >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Reject
                              </Button>
                            </>
                          )}
                          {typedChurch.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openStatusDialog("suspended")}
                            >
                              <Shield className="h-3.5 w-3.5 mr-1.5" />
                              Suspend
                            </Button>
                          )}
                          {typedChurch.status === "suspended" && (
                            <Button
                              size="sm"
                              onClick={() => openStatusDialog("approved")}
                            >
                              <Check className="h-3.5 w-3.5 mr-1.5" />
                              Reactivate
                            </Button>
                          )}
                          {showDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteDialogOpen(true)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content: View or Edit */}
          {isEditing ? (
            <EditForm form={form} />
          ) : (
            <ViewContent typedChurch={typedChurch} locale={locale} />
          )}

          {/* Bank Accounts Section */}
          <SectionCard
            title="Bank Accounts"
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingBankAccount(null);
                  setBankDialogOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Account
              </Button>
            }
          >
            {typedChurch.bank_accounts &&
            typedChurch.bank_accounts.length > 0 ? (
              <div className="space-y-3">
                {typedChurch.bank_accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {getLocalizedText(account.bank_name, locale)}
                        </p>
                        {account.is_primary && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                            <Star className="h-2.5 w-2.5" />
                            Primary
                          </span>
                        )}
                        {!account.is_active && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {account.account_number} &middot;{" "}
                        {account.account_holder_name}
                      </p>
                      {account.branch_name && (
                        <p className="text-xs text-muted-foreground">
                          Branch: {account.branch_name}
                        </p>
                      )}
                      {account.swift_code && (
                        <p className="text-xs text-muted-foreground">
                          SWIFT: {account.swift_code}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setEditingBankAccount(account);
                          setBankDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {showDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          disabled={deletingBankId === account.id}
                          onClick={() => handleDeleteBankAccount(account.id)}
                        >
                          {deletingBankId === account.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No bank accounts registered.
              </p>
            )}
          </SectionCard>

          {/* Church Images Section */}
          <SectionCard
            title="Church Images"
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImageDialogOpen(true)}
              >
                <ImagePlus className="h-3.5 w-3.5 mr-1.5" />
                Upload Images
              </Button>
            }
          >
            {(() => {
              const hasGalleryImages =
                typedChurch.church_images &&
                typedChurch.church_images.length > 0;
              const hasCoverImage = !!typedChurch.cover_image_url;

              if (!hasGalleryImages && !hasCoverImage) {
                return (
                  <p className="text-sm text-muted-foreground">
                    No images uploaded yet.
                  </p>
                );
              }

              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hasCoverImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                      <img
                        src={typedChurch.cover_image_url!}
                        alt="Cover image"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    </div>
                  )}
                  {typedChurch.church_images?.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-video rounded-lg overflow-hidden bg-muted border"
                    >
                      <img
                        src={img.image_url}
                        alt={`Church image ${img.display_order}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        {showDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
                            onClick={() => handleDeleteImage(img.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </SectionCard>
        </div>
      </div>

      {/* Dialogs */}
      <ChurchStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        church={typedChurch}
        targetStatus={targetStatus}
      />
      <ChurchDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        church={typedChurch}
      />
      <BankAccountDialog
        open={bankDialogOpen}
        onOpenChange={setBankDialogOpen}
        churchId={typedChurch.id}
        editAccount={editingBankAccount}
      />
      <ImageUploadDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        churchId={typedChurch.id}
      />
    </>
  );
}
