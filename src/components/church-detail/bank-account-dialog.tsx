import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import {
  createBankAccount,
  updateBankAccount,
} from "@/api/churches";
import { getLocalizedText, LOCALES } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { BankAccount } from "./types";
import { bankAccountSchema } from "./schemas";
import { FieldError } from "./field-error";

export function BankAccountDialog({
  open,
  onOpenChange,
  churchId,
  editAccount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  churchId: string;
  editAccount: BankAccount | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      bank_name_en: editAccount
        ? getLocalizedText(editAccount.bank_name, "en")
        : "",
      bank_name_am: editAccount
        ? getLocalizedText(editAccount.bank_name, "am")
        : "",
      bank_name_or: editAccount
        ? getLocalizedText(editAccount.bank_name, "or")
        : "",
      bank_name_so: editAccount
        ? getLocalizedText(editAccount.bank_name, "so")
        : "",
      bank_name_ti: editAccount
        ? getLocalizedText(editAccount.bank_name, "ti")
        : "",
      account_number: editAccount?.account_number || "",
      account_holder_name: editAccount?.account_holder_name || "",
      branch_name: editAccount?.branch_name || "",
      swift_code: editAccount?.swift_code || "",
      is_primary: editAccount?.is_primary ?? false,
    },
    validators: { onChange: bankAccountSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        if (editAccount) {
          await updateBankAccount({
            data: {
              id: editAccount.id,
              bank_name_en: value.bank_name_en,
              bank_name_am: value.bank_name_am,
              bank_name_or: value.bank_name_or || undefined,
              bank_name_so: value.bank_name_so || undefined,
              bank_name_ti: value.bank_name_ti || undefined,
              account_number: value.account_number,
              account_holder_name: value.account_holder_name,
              branch_name: value.branch_name || undefined,
              swift_code: value.swift_code || undefined,
              is_primary: value.is_primary,
            },
          });
        } else {
          await createBankAccount({
            data: {
              church_id: churchId,
              bank_name_en: value.bank_name_en,
              bank_name_am: value.bank_name_am,
              bank_name_or: value.bank_name_or || undefined,
              bank_name_so: value.bank_name_so || undefined,
              bank_name_ti: value.bank_name_ti || undefined,
              account_number: value.account_number,
              account_holder_name: value.account_holder_name,
              branch_name: value.branch_name || undefined,
              swift_code: value.swift_code || undefined,
              is_primary: value.is_primary,
            },
          });
        }
        onOpenChange(false);
        router.invalidate();
      } catch (error) {
        console.error("Failed to save bank account:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editAccount ? "Edit Bank Account" : "Add Bank Account"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Bank Name - localized */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Bank Name *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOCALES.map((loc) => (
                <form.Field
                  key={loc.value}
                  name={`bank_name_${loc.value}` as "bank_name_en"}
                >
                  {(field) => (
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">
                        {loc.nativeLabel}
                        {(loc.value === "en" || loc.value === "am") && " *"}
                      </Label>
                      <Input
                        placeholder={`Bank name in ${loc.label}`}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                  )}
                </form.Field>
              ))}
            </div>
          </div>

          {/* Account details */}
          <form.Field name="account_number">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Account Number *</Label>
                <Input
                  placeholder="1000XXXXXXXX"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <form.Field name="account_holder_name">
            {(field) => (
              <div className="space-y-1.5">
                <Label className="text-xs">Account Holder Name *</Label>
                <Input
                  placeholder="Full name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-3">
            <form.Field name="branch_name">
              {(field) => (
                <div className="space-y-1.5">
                  <Label className="text-xs">Branch Name</Label>
                  <Input
                    placeholder="Main Branch"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
            <form.Field name="swift_code">
              {(field) => (
                <div className="space-y-1.5">
                  <Label className="text-xs">SWIFT Code</Label>
                  <Input
                    placeholder="ABYSETAA"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="is_primary">
            {(field) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded border-input"
                />
                <span className="text-sm">Set as primary account</span>
              </label>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editAccount ? (
                "Update Account"
              ) : (
                "Add Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
