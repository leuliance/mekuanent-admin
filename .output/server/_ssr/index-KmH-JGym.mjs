import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { ad as Route$4, a as cn, ae as approveContent, L as updateContentStatus, M as deleteContentItem, af as rejectContent } from "./router-deJypcsT.mjs";
import { C as ContentTypeBadge, a as ContentStatusBadge } from "./content-type-badge-B63Xn81M.mjs";
import { u as useLocaleStore, g as getLocalizedText } from "./locale-store-Cb3Cdr7y.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MediaController, a as MediaControlBar, b as MediaPlayButton, c as MediaSeekBackwardButton, d as MediaSeekForwardButton, e as MediaTimeRange, f as MediaTimeDisplay, g as MediaMuteButton, h as MediaVolumeRange } from "../_libs/media-chrome.mjs";
import { R as Root, T as Track, a as Range, b as Thumb } from "../_chunks/_libs/@radix-ui/react-slider.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, f as DropdownMenuItem } from "./dropdown-menu-C2-xvfpV.mjs";
import { c as canDelete } from "./roles-B1zM8dwz.mjs";
import { ag as ArrowLeft, a5 as Video, a9 as Music, F as FileText, L as LoaderCircle, N as Trash2, a as Church, x as User, c as Calendar, E as Eye, ai as Heart, ar as Share2, S as Settings, l as Check, t as Pause, as as Play } from "../_libs/lucide-react.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/zustand.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
import "../_libs/ce-la-react.mjs";
import "../_chunks/_libs/@radix-ui/number.mjs";
import "../_chunks/_libs/@radix-ui/primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-use-controllable-state.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-direction.mjs";
import "../_chunks/_libs/@radix-ui/react-use-previous.mjs";
import "../_chunks/_libs/@radix-ui/react-use-size.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-collection.mjs";
const variables = {
  "--media-primary-color": "var(--primary)",
  "--media-secondary-color": "var(--background)",
  "--media-text-color": "var(--foreground)",
  "--media-background-color": "var(--background)",
  "--media-control-hover-background": "var(--accent)",
  "--media-font-family": "var(--font-sans)",
  "--media-live-button-icon-color": "var(--muted-foreground)",
  "--media-live-button-indicator-color": "var(--destructive)",
  "--media-range-track-background": "var(--border)"
};
const VideoPlayer = ({ style, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  MediaController,
  {
    style: {
      ...variables,
      ...style
    },
    ...props
  }
);
const VideoPlayerControlBar = (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaControlBar, { ...props });
const VideoPlayerTimeRange = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaTimeRange, { className: cn("p-2.5", className), ...props });
const VideoPlayerTimeDisplay = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaTimeDisplay, { className: cn("p-2.5", className), ...props });
const VideoPlayerVolumeRange = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaVolumeRange, { className: cn("p-2.5", className), ...props });
const VideoPlayerPlayButton = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaPlayButton, { className: cn("p-2.5", className), ...props });
const VideoPlayerSeekBackwardButton = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaSeekBackwardButton, { className: cn("p-2.5", className), ...props });
const VideoPlayerSeekForwardButton = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaSeekForwardButton, { className: cn("p-2.5", className), ...props });
const VideoPlayerMuteButton = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(MediaMuteButton, { className: cn("p-2.5", className), ...props });
const VideoPlayerContent = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("video", { className: cn("mt-0 mb-0", className), ...props });
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds % 3600 / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;
  return hrs > 0 ? `${hrs}:${formattedMins}:${formattedSecs}` : `${mins}:${formattedSecs}`;
}
const AudioPlayerContext = reactExports.createContext(null);
function useAudioPlayer() {
  const api = reactExports.useContext(AudioPlayerContext);
  if (!api) {
    throw new Error(
      "useAudioPlayer cannot be called outside of AudioPlayerProvider"
    );
  }
  return api;
}
const AudioPlayerTimeContext = reactExports.createContext(null);
const useAudioPlayerTime = () => {
  const time = reactExports.useContext(AudioPlayerTimeContext);
  if (time === null) {
    throw new Error(
      "useAudioPlayerTime cannot be called outside of AudioPlayerProvider"
    );
  }
  return time;
};
function AudioPlayerProvider({
  children
}) {
  const audioRef = reactExports.useRef(null);
  const itemRef = reactExports.useRef(null);
  const playPromiseRef = reactExports.useRef(null);
  const [readyState, setReadyState] = reactExports.useState(0);
  const [networkState, setNetworkState] = reactExports.useState(0);
  const [time, setTime] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(void 0);
  const [error, setError] = reactExports.useState(null);
  const [activeItem, _setActiveItem] = reactExports.useState(
    null
  );
  const [paused, setPaused] = reactExports.useState(true);
  const [playbackRate, setPlaybackRateState] = reactExports.useState(1);
  const setActiveItem = reactExports.useCallback(
    async (item) => {
      if (!audioRef.current) return;
      if (item?.id === itemRef.current?.id) {
        return;
      }
      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
    },
    []
  );
  const play = reactExports.useCallback(
    async (item) => {
      if (!audioRef.current) return;
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (error2) {
          console.error("Play promise error:", error2);
        }
      }
      if (item === void 0) {
        const playPromise2 = audioRef.current.play();
        playPromiseRef.current = playPromise2;
        return playPromise2;
      }
      if (item?.id === activeItem?.id) {
        const playPromise2 = audioRef.current.play();
        playPromiseRef.current = playPromise2;
        return playPromise2;
      }
      itemRef.current = item;
      const currentRate = audioRef.current.playbackRate;
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = 0;
      if (item === null) {
        audioRef.current.removeAttribute("src");
      } else {
        audioRef.current.src = item.src;
      }
      audioRef.current.load();
      audioRef.current.playbackRate = currentRate;
      const playPromise = audioRef.current.play();
      playPromiseRef.current = playPromise;
      return playPromise;
    },
    [activeItem]
  );
  const pause = reactExports.useCallback(async () => {
    if (!audioRef.current) return;
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        console.error(e);
      }
    }
    audioRef.current.pause();
    playPromiseRef.current = null;
  }, []);
  const seek = reactExports.useCallback((time2) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time2;
  }, []);
  const setPlaybackRate = reactExports.useCallback((rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);
  const isItemActive = reactExports.useCallback(
    (id) => {
      return activeItem?.id === id;
    },
    [activeItem]
  );
  useAnimationFrame(() => {
    if (audioRef.current) {
      _setActiveItem(itemRef.current);
      setReadyState(audioRef.current.readyState);
      setNetworkState(audioRef.current.networkState);
      setTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setPaused(audioRef.current.paused);
      setError(audioRef.current.error);
      setPlaybackRateState(audioRef.current.playbackRate);
    }
  });
  const isPlaying = !paused;
  const isBuffering = readyState < 3 && networkState === 2;
  const api = reactExports.useMemo(
    () => ({
      ref: audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate
    }),
    [
      audioRef,
      duration,
      error,
      isPlaying,
      isBuffering,
      activeItem,
      playbackRate,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerContext.Provider, { value: api, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AudioPlayerTimeContext.Provider, { value: time, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef, className: "hidden", crossOrigin: "anonymous" }),
    children
  ] }) });
}
const AudioPlayerProgress = ({
  ...otherProps
}) => {
  const player = useAudioPlayer();
  const time = useAudioPlayerTime();
  const wasPlayingRef = reactExports.useRef(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root,
    {
      ...otherProps,
      value: [time],
      onValueChange: (vals) => {
        player.seek(vals[0]);
        otherProps.onValueChange?.(vals);
      },
      min: 0,
      max: player.duration ?? 0,
      step: otherProps.step || 0.25,
      onPointerDown: (e) => {
        wasPlayingRef.current = player.isPlaying;
        player.pause();
        otherProps.onPointerDown?.(e);
      },
      onPointerUp: (e) => {
        if (wasPlayingRef.current) {
          player.play();
        }
        otherProps.onPointerUp?.(e);
      },
      className: cn(
        "group/player relative flex h-4 touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        otherProps.className
      ),
      onKeyDown: (e) => {
        if (e.key === " ") {
          e.preventDefault();
          if (!player.isPlaying) {
            player.play();
          } else {
            player.pause();
          }
        }
        otherProps.onKeyDown?.(e);
      },
      disabled: player.duration === void 0 || !Number.isFinite(player.duration) || Number.isNaN(player.duration),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "bg-muted relative h-[4px] w-full grow overflow-hidden rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "bg-primary absolute h-full" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Thumb,
          {
            className: "relative flex h-0 w-0 items-center justify-center opacity-0 group-hover/player:opacity-100 focus-visible:opacity-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            "data-slot": "slider-thumb",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-foreground absolute size-3 rounded-full" })
          }
        )
      ]
    }
  );
};
const AudioPlayerTime = ({
  className,
  ...otherProps
}) => {
  const time = useAudioPlayerTime();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      ...otherProps,
      className: cn("text-muted-foreground text-sm tabular-nums", className),
      children: formatTime(time)
    }
  );
};
const AudioPlayerDuration = ({
  className,
  ...otherProps
}) => {
  const player = useAudioPlayer();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      ...otherProps,
      className: cn("text-muted-foreground text-sm tabular-nums", className),
      children: player.duration !== null && player.duration !== void 0 && !Number.isNaN(player.duration) ? formatTime(player.duration) : "--:--"
    }
  );
};
function Spinner({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "border-muted border-t-foreground size-3.5 animate-spin rounded-full border-2",
        className
      ),
      role: "status",
      "aria-label": "Loading",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Loading..." })
    }
  );
}
const PlayButton = ({
  playing,
  onPlayingChange,
  className,
  onClick,
  loading,
  ...otherProps
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      ...otherProps,
      onClick: (e) => {
        onPlayingChange(!playing);
        onClick?.(e);
      },
      className: cn("relative", className),
      "aria-label": playing ? "Pause" : "Play",
      type: "button",
      children: [
        playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pause,
          {
            className: cn("size-4", loading && "opacity-0"),
            "aria-hidden": "true"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Play,
          {
            className: cn("size-4", loading && "opacity-0"),
            "aria-hidden": "true"
          }
        ),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center rounded-[inherit] backdrop-blur-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) })
      ]
    }
  );
};
function AudioPlayerButton({
  item,
  ...otherProps
}) {
  const player = useAudioPlayer();
  if (!item) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlayButton,
      {
        ...otherProps,
        playing: player.isPlaying,
        onPlayingChange: (shouldPlay) => {
          if (shouldPlay) {
            player.play();
          } else {
            player.pause();
          }
        },
        loading: player.isBuffering && player.isPlaying
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    PlayButton,
    {
      ...otherProps,
      playing: player.isItemActive(item.id) && player.isPlaying,
      onPlayingChange: (shouldPlay) => {
        if (shouldPlay) {
          player.play(item);
        } else {
          player.pause();
        }
      },
      loading: player.isItemActive(item.id) && player.isBuffering && player.isPlaying
    }
  );
}
function useAnimationFrame(callback) {
  const requestRef = reactExports.useRef(null);
  const previousTimeRef = reactExports.useRef(null);
  const callbackRef = reactExports.useRef(callback);
  reactExports.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  reactExports.useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== null) {
        const delta = time - previousTimeRef.current;
        callbackRef.current(delta);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    };
  }, []);
}
const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
function AudioPlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) {
  const player = useAudioPlayer();
  const currentSpeed = player.playbackRate;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant, size, className: cn(className), "aria-label": "Playback speed", ...props }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { align: "end", className: "min-w-[120px]", children: speeds.map((speed) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DropdownMenuItem,
      {
        onClick: () => player.setPlaybackRate(speed),
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: speed === 1 ? "" : "font-mono", children: speed === 1 ? "Normal" : `${speed}x` }),
          currentSpeed === speed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" })
        ]
      },
      speed
    )) })
  ] });
}
const STATUS_OPTIONS = [{
  value: "draft",
  label: "Draft"
}, {
  value: "pending_approval",
  label: "Pending Approval"
}, {
  value: "approved",
  label: "Approved"
}, {
  value: "rejected",
  label: "Rejected"
}, {
  value: "archived",
  label: "Archived"
}];
function getLocalizedHtml(value, locale) {
  const text = getLocalizedText(value, locale);
  return typeof text === "string" ? text : "";
}
function AudioBarVisualizer({
  barCount = 32
}) {
  const player = useAudioPlayer();
  const canvasRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const sourceRef = reactExports.useRef(null);
  const audioCtxRef = reactExports.useRef(null);
  const animFrameRef = reactExports.useRef(null);
  const setupAnalyser = reactExports.useCallback(() => {
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
    }
  }, [player.ref]);
  reactExports.useEffect(() => {
    if (player.isPlaying && !sourceRef.current) {
      setupAnalyser();
    }
    if (player.isPlaying && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, [player.isPlaying, setupAnalyser]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      const {
        width,
        height
      } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (!analyser || !player.isPlaying) {
        const barWidth2 = width / barCount;
        const gap2 = 2;
        for (let i = 0; i < barCount; i++) {
          const h = 4 + Math.sin(i * 0.5) * 3;
          const x = i * barWidth2;
          ctx.fillStyle = "hsl(270 60% 60% / 0.3)";
          ctx.beginPath();
          ctx.roundRect(x + gap2 / 2, height / 2 - h / 2, barWidth2 - gap2, h, 2);
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
        const dataIndex = Math.floor(i / barCount * bufferLength);
        const value = data[dataIndex] / 255;
        const barHeight = Math.max(4, value * height * 0.9);
        const x = i * barWidth;
        const y = height / 2 - barHeight / 2;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: 400, height: 80, className: "w-full h-20" });
}
function AudioAutoLoader({
  audioUrl,
  title
}) {
  const player = useAudioPlayer();
  const loaded = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!loaded.current && audioUrl) {
      loaded.current = true;
      player.setActiveItem({
        id: "audio-track",
        src: audioUrl,
        data: {
          title
        }
      });
    }
  }, [audioUrl, title, player]);
  return null;
}
function AudioSection({
  audioUrl,
  title,
  artistName
}) {
  const track = {
    id: "audio-track",
    src: audioUrl,
    data: {
      title
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AudioPlayerProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AudioAutoLoader, { audioUrl, title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-linear-to-br from-purple-500/10 via-purple-500/5 to-transparent px-4 py-5 sm:px-6 sm:py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [
      artistName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-4 w-4 text-purple-500 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: artistName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AudioBarVisualizer, { barCount: 48 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerProgress, { className: "w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerTime, { className: "text-xs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerButton, { item: track, variant: "default", size: "icon", className: "h-10 w-10 rounded-full" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerDuration, { className: "text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayerSpeed, { variant: "ghost", size: "sm" }) })
      ] })
    ] }) })
  ] });
}
function ContentDetailPage() {
  const {
    content
  } = Route$4.useLoaderData();
  const {
    locale
  } = useLocaleStore();
  const router = useRouter();
  const {
    user
  } = Route$4.useRouteContext();
  const showDelete = !!user && canDelete(user.role);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [isRejecting, setIsRejecting] = reactExports.useState(false);
  const [statusChanging, setStatusChanging] = reactExports.useState(false);
  const item = content;
  const title = getLocalizedText(item.title, locale);
  const description = getLocalizedHtml(item.description, locale);
  const churchName = item.churches ? getLocalizedText(item.churches.name, locale) : "";
  const creatorProfile = item.creator;
  const creatorName = creatorProfile ? `${creatorProfile.first_name || ""} ${creatorProfile.last_name || ""}`.trim() : "Unknown";
  const handleStatusChange = async (newStatus) => {
    if (newStatus === item.status) return;
    if (newStatus === "rejected") {
      setRejectDialogOpen(true);
      return;
    }
    setStatusChanging(true);
    try {
      if (newStatus === "approved") {
        await approveContent({
          data: {
            id: item.id,
            approved_by: item.created_by
          }
        });
      } else {
        await updateContentStatus({
          data: {
            id: item.id,
            status: newStatus
          }
        });
      }
      toast.success(`Status changed to ${STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus}`);
      router.invalidate();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(`Failed to update status: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setStatusChanging(false);
    }
  };
  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      await rejectContent({
        data: {
          id: item.id,
          rejected_reason: rejectReason
        }
      });
      setRejectDialogOpen(false);
      setRejectReason("");
      toast.success("Content rejected");
      router.invalidate();
    } catch (error) {
      console.error("Failed to reject content:", error);
      toast.error(`Failed to reject content: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRejecting(false);
    }
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteContentItem({
        data: {
          id: item.id
        }
      });
      toast.success("Content deleted successfully");
      router.navigate({
        to: "/dashboard/content",
        search: {
          page: 1,
          search: void 0
        }
      });
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error(`Failed to delete content: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/content", search: {
        page: 1,
        search: void 0
      } }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
        "Back to Content"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card overflow-hidden", children: [
        item.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.thumbnail_url, alt: title, className: "h-full w-full object-cover" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 bg-muted flex items-center justify-center", children: item.content_type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-16 w-16 text-muted-foreground/30" }) : item.content_type === "audio" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-16 w-16 text-muted-foreground/30" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-16 w-16 text-muted-foreground/30" }) }),
        item.content_type === "video" && item.video_content?.video_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(VideoPlayer, { className: "w-full aspect-video", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerContent, { slot: "media", src: item.video_content.video_url }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(VideoPlayerControlBar, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerPlayButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerSeekBackwardButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerSeekForwardButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerTimeRange, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerTimeDisplay, { showDuration: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerMuteButton, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoPlayerVolumeRange, {})
          ] })
        ] }),
        item.content_type === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx(AudioSection, { audioUrl: item.audio_content?.audio_url || "", title: title || "Audio", artistName: item.audio_content?.artist_name ? getLocalizedText(item.audio_content.artist_name, locale) : void 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: title || "Untitled Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ContentTypeBadge, { type: item.content_type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ContentStatusBadge, { status: item.status })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: item.status, onValueChange: handleStatusChange, disabled: statusChanging, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[180px] h-9 text-sm", children: statusChanging ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                "Updating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: opt.value, children: opt.label }, opt.value)) })
            ] }),
            showDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive h-9 w-9", onClick: () => setDeleteDialogOpen(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border space-y-0", children: [
            churchName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Church, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Church" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: churchName })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Created by" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: creatorName })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Created" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) })
              ] })
            ] }),
            item.published_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Published" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: new Date(item.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Engagement" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5 mx-auto mb-1 text-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: item.view_count || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Views" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5 mx-auto mb-1 text-red-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: item.like_count || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Likes" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 rounded-lg bg-muted/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5 mx-auto mb-1 text-green-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", children: item.share_count || 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Shares" })
            ] })
          ] }),
          item.content_type === "video" && item.video_content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Video Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
              item.video_content.duration_seconds && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Duration:",
                " ",
                Math.floor(item.video_content.duration_seconds / 60),
                "m ",
                item.video_content.duration_seconds % 60,
                "s"
              ] }),
              item.video_content.resolution && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Resolution: ",
                item.video_content.resolution
              ] })
            ] })
          ] }),
          item.content_type === "audio" && item.audio_content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Audio Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
              item.audio_content.duration_seconds && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Duration:",
                " ",
                Math.floor(item.audio_content.duration_seconds / 60),
                "m ",
                item.audio_content.duration_seconds % 60,
                "s"
              ] }),
              item.audio_content.genre && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Genre: ",
                item.audio_content.genre
              ] }),
              item.audio_content.artist_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Artist:",
                " ",
                getLocalizedText(item.audio_content.artist_name, locale)
              ] })
            ] })
          ] }),
          item.content_type === "article" && item.article_content && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Article Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
              item.article_content.read_time_minutes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Read time: ",
                item.article_content.read_time_minutes,
                " ",
                "min"
              ] }),
              item.article_content.author_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Author:",
                " ",
                getLocalizedText(item.article_content.author_name, locale)
              ] })
            ] })
          ] })
        ] }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none",
              dangerouslySetInnerHTML: {
                __html: description
              }
            }
          )
        ] }),
        item.content_type === "article" && item.article_content?.body && getLocalizedHtml(item.article_content.body, locale) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold mb-3", children: "Article Body" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none",
              dangerouslySetInnerHTML: {
                __html: getLocalizedHtml(item.article_content.body, locale)
              }
            }
          )
        ] }),
        item.rejected_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-destructive mb-2", children: "Rejection Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: item.rejected_reason })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          'Are you sure you want to delete "',
          title,
          '"? This action cannot be undone.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reject Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Provide a reason for rejecting this content." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Enter rejection reason...", value: rejectReason, onChange: (e) => setRejectReason(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRejectDialogOpen(false), disabled: isRejecting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleReject, disabled: isRejecting || !rejectReason.trim(), children: isRejecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Rejecting..."
        ] }) : "Reject" })
      ] })
    ] }) })
  ] });
}
export {
  ContentDetailPage as component
};
