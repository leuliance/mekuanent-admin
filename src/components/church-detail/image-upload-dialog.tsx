import { useState, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { addChurchImage } from "@/api/churches";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Save } from "lucide-react";

export function ImageUploadDialog({
  open,
  onOpenChange,
  churchId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  churchId: string;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const upload = useSupabaseUpload({
    bucketName: "mekuanent",
    path: `churches/${churchId}/images`,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    maxFiles: 10,
    upsert: true,
  });

  const handleSaveImages = useCallback(async () => {
    if (upload.successes.length === 0) return;

    setIsSaving(true);
    try {
      for (const fileName of upload.successes) {
        const filePath = `churches/${churchId}/images/${fileName}`;
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { publicUrl },
        } = supabase.storage.from("mekuanent").getPublicUrl(filePath);

        await addChurchImage({
          data: {
            church_id: churchId,
            image_url: publicUrl,
          },
        });
      }

      onOpenChange(false);
      upload.setFiles([]);
      router.invalidate();
    } catch (error) {
      console.error("Failed to save images:", error);
    } finally {
      setIsSaving(false);
    }
  }, [upload.successes, churchId, onOpenChange, router, upload.setFiles]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          upload.setFiles([]);
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Church Images</DialogTitle>
        </DialogHeader>

        <Dropzone {...upload}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>

        {upload.isSuccess && (
          <DialogFooter>
            <Button onClick={handleSaveImages} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Church
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
