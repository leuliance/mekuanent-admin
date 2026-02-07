import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { updateChurchStatus, type Church } from "@/api/churches";
import { getLocalizedText, useLocaleStore } from "@/stores/locale-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { Database } from "@/types/database.types";

type ChurchStatus = Database["public"]["Enums"]["church_status"];

interface ChurchStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: Church | null;
  targetStatus: ChurchStatus | "";
}

const titleMap: Record<string, string> = {
  approved: "Approve Church",
  rejected: "Reject Church",
  suspended: "Suspend Church",
};

export function ChurchStatusDialog({
  open,
  onOpenChange,
  church,
  targetStatus,
}: ChurchStatusDialogProps) {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [rejectedReason, setRejectedReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const churchName = church ? getLocalizedText(church.name, locale) : "";

  const handleSubmit = async () => {
    if (!church || !targetStatus) return;
    setIsUpdating(true);
    try {
      await updateChurchStatus({
        data: {
          id: church.id,
          status: targetStatus,
          rejected_reason: targetStatus === "rejected" ? rejectedReason : undefined,
        },
      });
      onOpenChange(false);
      setRejectedReason("");
      router.invalidate();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleMap[targetStatus] || "Update Status"}</DialogTitle>
          <DialogDescription>
            {targetStatus === "approved" &&
              `Are you sure you want to approve "${churchName}"?`}
            {targetStatus === "rejected" &&
              `Are you sure you want to reject "${churchName}"? Please provide a reason.`}
            {targetStatus === "suspended" &&
              `Are you sure you want to suspend "${churchName}"?`}
          </DialogDescription>
        </DialogHeader>
        {targetStatus === "rejected" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="rejectedReason">Reason for Rejection</label>
            <Input
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant={targetStatus === "approved" ? "default" : "destructive"}
            onClick={handleSubmit}
            disabled={isUpdating || (targetStatus === "rejected" && !rejectedReason)}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              titleMap[targetStatus] || "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
