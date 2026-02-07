import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { deleteChurch, type Church } from "@/api/churches";
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
import { Loader2, AlertTriangle } from "lucide-react";

interface ChurchDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  church: Church | null;
}

export function ChurchDeleteDialog({
  open,
  onOpenChange,
  church,
}: ChurchDeleteDialogProps) {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const churchName = church ? getLocalizedText(church.name, locale) : "";

  const handleDelete = async () => {
    if (!church) return;
    setIsDeleting(true);
    try {
      await deleteChurch({ data: { id: church.id } });
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      console.error("Failed to delete church:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Church
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong>"{churchName}"</strong>? This action cannot be undone and
            will remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Church"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
