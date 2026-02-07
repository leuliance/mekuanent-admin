import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  getContentItem,
  approveContent,
  rejectContent,
  deleteContentItem,
  updateContentStatus,
} from "@/api/content";
import { ContentStatusBadge } from "@/components/content/content-status-badge";
import { ContentTypeBadge } from "@/components/content/content-type-badge";
import { useLocaleStore, getLocalizedText, type Locale } from "@/stores/locale-store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerPlayButton,
  VideoPlayerTimeRange,
  VideoPlayerTimeDisplay,
  VideoPlayerMuteButton,
  VideoPlayerVolumeRange,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
} from "@/components/ui/video-player";
import {
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
  useAudioPlayer,
} from "@/components/ui/audio-player";
import { canDelete } from "@/lib/roles";
import {
  ArrowLeft,
  AlertCircle,
  Trash2,
  Calendar,
  Eye,
  Heart,
  Share2,
  Church,
  User,
  Loader2,
  Music,
  FileText,
  Video,
} from "lucide-react";

// Status options for the status changer
const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
] as const;

/**
 * Safely extract an HTML string from a localized Json field.
 * If the extracted value is not a string (e.g. Plate.js JSON), return "".
 */
function getLocalizedHtml(value: unknown, locale: Locale): string {
  const text = getLocalizedText(value, locale);
  return typeof text === "string" ? text : "";
}

// ============ AUDIO BAR VISUALIZER ============
function AudioBarVisualizer({ barCount = 32 }: { barCount?: number }) {
  const player = useAudioPlayer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const setupAnalyser = useCallback(() => {
    const audio = player.ref.current;
    if (!audio || sourceRef.current) return;

    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      source.connect(analyser);
      analyser.connect(ctx.destination);
    } catch {
      // Already connected or CORS issue – silently ignore
    }
  }, [player.ref]);

  useEffect(() => {
    if (player.isPlaying && !sourceRef.current) {
      setupAnalyser();
    }
    if (player.isPlaying && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, [player.isPlaying, setupAnalyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!analyser || !player.isPlaying) {
        // Idle bars
        const barWidth = width / barCount;
        const gap = 2;
        for (let i = 0; i < barCount; i++) {
          const h = 4 + Math.sin(i * 0.5) * 3;
          const x = i * barWidth;
          ctx.fillStyle = "hsl(270 60% 60% / 0.3)";
          ctx.beginPath();
          ctx.roundRect(x + gap / 2, height / 2 - h / 2, barWidth - gap, h, 2);
          ctx.fill();
        }
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(data);

      const barWidth = width / barCount;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = data[dataIndex] / 255;
        const barHeight = Math.max(4, value * height * 0.9);
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;

        // Gradient from purple to primary
        const hue = 270 - value * 30;
        const lightness = 50 + value * 15;
        ctx.fillStyle = `hsl(${hue} 70% ${lightness}%)`;
        ctx.beginPath();
        ctx.roundRect(x + gap / 2, y, barWidth - gap, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [player.isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className="w-full h-20"
    />
  );
}

// ============ AUTO LOADER (preloads audio without playing) ============
function AudioAutoLoader({ audioUrl, title }: { audioUrl: string; title: string }) {
  const player = useAudioPlayer();
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current && audioUrl) {
      loaded.current = true;
      player.setActiveItem({ id: "audio-track", src: audioUrl, data: { title } });
    }
  }, [audioUrl, title, player]);

  return null;
}

// ============ AUDIO PLAYER SECTION ============
function AudioSection({
  audioUrl,
  title,
  artistName,
}: {
  audioUrl: string;
  title: string;
  artistName?: string;
}) {
  const track = { id: "audio-track", src: audioUrl, data: { title } };

  return (
    <AudioPlayerProvider>
      <AudioAutoLoader audioUrl={audioUrl} title={title} />
      <div className="bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent px-4 py-5 sm:px-6 sm:py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Title / Artist */}
          {artistName && (
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-purple-500 shrink-0" />
              <p className="text-sm text-muted-foreground">{artistName}</p>
            </div>
          )}

          {/* Bar Visualizer */}
          <AudioBarVisualizer barCount={48} />

          {/* Controls */}
          <div className="space-y-2">
            <AudioPlayerProgress className="w-full" />
            <div className="flex items-center justify-between">
              <AudioPlayerTime className="text-xs" />
              <div className="flex items-center gap-2">
                <AudioPlayerButton
                  item={track}
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <AudioPlayerDuration className="text-xs" />
            </div>
            <div className="flex justify-center">
              <AudioPlayerSpeed variant="ghost" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </AudioPlayerProvider>
  );
}

export const Route = createFileRoute(
  "/_authenticated/dashboard/content/$contentId/"
)({
  loader: async ({ params }) => {
    const content = await getContentItem({ data: { id: params.contentId } });
    return { content };
  },
  pendingComponent: ContentDetailSkeleton,
  errorComponent: ContentDetailError,
  component: ContentDetailPage,
});

// ============ LOADING SKELETON ============
function ContentDetailSkeleton() {
  return (
    <>
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
}

// ============ ERROR STATE ============
function ContentDetailError({ error }: { error: Error }) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Failed to Load Content
          </h2>
          <p className="text-muted-foreground mb-5">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              render={<Link to="/dashboard/content" search={{ page: 1, search: undefined }} />}
              nativeButton={false}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
function ContentDetailPage() {
  const { content } = Route.useLoaderData();
  const { locale } = useLocaleStore();
  const router = useRouter();

  const { user } = Route.useRouteContext();
  const showDelete = !!user && canDelete(user.role);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: Dynamic content data
  const item = content as any;
  const title = getLocalizedText(item.title, locale);
  const description = getLocalizedHtml(item.description, locale);
  const churchName = item.churches
    ? getLocalizedText(item.churches.name, locale)
    : "";

  // Get creator name from the aliased "creator" relation
  const creatorProfile = item.creator;
  const creatorName = creatorProfile
    ? `${creatorProfile.first_name || ""} ${creatorProfile.last_name || ""}`.trim()
    : "Unknown";

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === item.status) return;

    // If changing to "rejected", open the reject dialog instead
    if (newStatus === "rejected") {
      setRejectDialogOpen(true);
      return;
    }

    setStatusChanging(true);
    try {
      if (newStatus === "approved") {
        await approveContent({
          data: { id: item.id, approved_by: item.created_by },
        });
      } else {
        await updateContentStatus({
          data: { id: item.id, status: newStatus as typeof item.status },
        });
      }
      toast.success(`Status changed to ${STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus}`);
      router.invalidate();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(
        `Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setStatusChanging(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await rejectContent({
        data: { id: item.id, rejected_reason: rejectReason },
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      toast.success("Content rejected");
      router.invalidate();
    } catch (error) {
      console.error("Failed to reject content:", error);
      toast.error(
        `Failed to reject content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteContentItem({ data: { id: item.id } });
      toast.success("Content deleted successfully");
      router.navigate({ to: "/dashboard/content", search: { page: 1, search: undefined } });
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error(
        `Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsDeleting(false);
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
            render={<Link to="/dashboard/content" search={{ page: 1, search: undefined }} />}
            nativeButton={false}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>

          {/* Hero section */}
          <div className="rounded-xl border bg-card overflow-hidden">
            {/* Thumbnail Cover */}
            {item.thumbnail_url ? (
              <div className="h-64 relative">
                <img
                  src={item.thumbnail_url}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center">
                {item.content_type === "video" ? (
                  <Video className="h-16 w-16 text-muted-foreground/30" />
                ) : item.content_type === "audio" ? (
                  <Music className="h-16 w-16 text-muted-foreground/30" />
                ) : (
                  <FileText className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
            )}

            {/* Video Player */}
            {item.content_type === "video" && item.video_content?.video_url && (
              <VideoPlayer className="w-full aspect-video">
                <VideoPlayerContent
                  slot="media"
                  src={item.video_content.video_url}
                />
                <VideoPlayerControlBar>
                  <VideoPlayerPlayButton />
                  <VideoPlayerSeekBackwardButton />
                  <VideoPlayerSeekForwardButton />
                  <VideoPlayerTimeRange />
                  <VideoPlayerTimeDisplay showDuration />
                  <VideoPlayerMuteButton />
                  <VideoPlayerVolumeRange />
                </VideoPlayerControlBar>
              </VideoPlayer>
            )}

            {/* Audio Player */}
            {item.content_type === "audio" && (
              <AudioSection
                audioUrl={item.audio_content?.audio_url || ""}
                title={title || "Audio"}
                artistName={
                  item.audio_content?.artist_name
                    ? getLocalizedText(item.audio_content.artist_name, locale)
                    : undefined
                }
              />
            )}

            {/* Title & Actions */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    {title || "Untitled Content"}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ContentTypeBadge type={item.content_type} />
                    <ContentStatusBadge status={item.status} />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    value={item.status}
                    onValueChange={handleStatusChange}
                    disabled={statusChanging}
                  >
                    <SelectTrigger className="w-[180px] h-9 text-sm">
                      {statusChanging ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-9 w-9"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Info Card */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-3">Information</h2>
              <div className="divide-y divide-border space-y-0">
                {churchName && (
                  <div className="flex items-start gap-3 py-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Church className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Church</p>
                      <p className="text-sm font-medium">{churchName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 py-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created by</p>
                    <p className="text-sm font-medium">{creatorName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {item.published_at && (
                  <div className="flex items-start gap-3 py-3">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Published</p>
                      <p className="text-sm font-medium">
                        {new Date(item.published_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-3">Engagement</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Eye className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-lg font-bold">
                    {item.view_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                  <p className="text-lg font-bold">
                    {item.like_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Share2 className="h-5 w-5 mx-auto mb-1 text-green-500" />
                  <p className="text-lg font-bold">
                    {item.share_count || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
              </div>

              {/* Type-specific details */}
              {item.content_type === "video" && item.video_content && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                    Video Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    {item.video_content.duration_seconds && (
                      <p>
                        Duration:{" "}
                        {Math.floor(
                          item.video_content.duration_seconds / 60
                        )}
                        m {item.video_content.duration_seconds % 60}s
                      </p>
                    )}
                    {item.video_content.resolution && (
                      <p>Resolution: {item.video_content.resolution}</p>
                    )}
                  </div>
                </div>
              )}

              {item.content_type === "audio" && item.audio_content && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                    Audio Details
                  </h3>
                  <div className="space-y-1 text-sm">
                    {item.audio_content.duration_seconds && (
                      <p>
                        Duration:{" "}
                        {Math.floor(
                          item.audio_content.duration_seconds / 60
                        )}
                        m {item.audio_content.duration_seconds % 60}s
                      </p>
                    )}
                    {item.audio_content.genre && (
                      <p>Genre: {item.audio_content.genre}</p>
                    )}
                    {item.audio_content.artist_name && (
                      <p>
                        Artist:{" "}
                        {getLocalizedText(
                          item.audio_content.artist_name,
                          locale
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {item.content_type === "article" &&
                item.article_content && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                      Article Details
                    </h3>
                    <div className="space-y-1 text-sm">
                      {item.article_content.read_time_minutes && (
                        <p>
                          Read time: {item.article_content.read_time_minutes}{" "}
                          min
                        </p>
                      )}
                      {item.article_content.author_name && (
                        <p>
                          Author:{" "}
                          {getLocalizedText(
                            item.article_content.author_name,
                            locale
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Description */}
            {description && (
              <div className="rounded-xl border bg-card p-5 md:col-span-2">
                <h2 className="text-sm font-semibold mb-3">Description</h2>
                <div
                  className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text HTML
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}

            {/* Article Body */}
            {item.content_type === "article" &&
              item.article_content?.body &&
              getLocalizedHtml(item.article_content.body, locale) && (
                <div className="rounded-xl border bg-card p-5 md:col-span-2">
                  <h2 className="text-sm font-semibold mb-3">Article Body</h2>
                  <div
                    className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Rich text HTML
                    dangerouslySetInnerHTML={{
                      __html: getLocalizedHtml(
                        item.article_content.body,
                        locale
                      ),
                    }}
                  />
                </div>
              )}

            {/* Rejection Reason */}
            {item.rejected_reason && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:col-span-2">
                <h2 className="text-sm font-semibold text-destructive mb-2">
                  Rejection Reason
                </h2>
                <p className="text-sm text-muted-foreground">
                  {item.rejected_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
