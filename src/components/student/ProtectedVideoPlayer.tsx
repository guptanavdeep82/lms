"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { extractYouTubeId, isDirectVideoUrl, youtubeEmbedUrl } from "@/lib/lesson-video";
import { clearVideoPosition, loadVideoPosition, saveVideoPosition } from "@/lib/video-progress";

export type VideoQualityOption = {
  id: string;
  label: string;
  url: string;
  height?: number | null;
};

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const STANDARD_QUALITIES = [
  { id: "auto", label: "Auto", height: null as number | null },
  { id: "360p", label: "360p", height: 360 },
  { id: "420p", label: "420p", height: 420 },
  { id: "480p", label: "480p", height: 480 },
  { id: "720p", label: "720p", height: 720 },
  { id: "1080p", label: "1080p", height: 1080 },
];
const QUALITY_STORAGE_KEY = "kr-video-quality";

const YOUTUBE_QUALITY_MAP: Record<string, string> = {
  auto: "default",
  "360p": "medium",
  "420p": "large",
  "480p": "large",
  "720p": "hd720",
  "1080p": "hd1080",
};

export function uniqueVideoQualities(url: string, incoming: VideoQualityOption[] = []): VideoQualityOption[] {
  const source = incoming.filter((item) => item.url);
  const list = source.length > 0
    ? source
    : url
      ? [{ id: "auto", label: "Auto", url, height: null }]
      : [];

  const seenIds = new Set<string>();
  const unique: VideoQualityOption[] = [];
  for (const item of list) {
    if (seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    unique.push(item);
  }
  return unique.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
}

function speedLabel(value: number) {
  return value === 1 ? "Normal" : `${value}x`;
}

function storedQualityId() {
  try {
    return window.localStorage.getItem(QUALITY_STORAGE_KEY) || "auto";
  } catch {
    return "auto";
  }
}

function persistQualityId(id: string) {
  try {
    window.localStorage.setItem(QUALITY_STORAGE_KEY, id);
  } catch {
    // Ignore storage failures.
  }
}

function pickQuality(options: VideoQualityOption[], wantedId: string, fallbackUrl: string): VideoQualityOption {
  const exact = options.find((item) => item.id === wantedId);
  if (exact) return exact;

  const wantedHeight = STANDARD_QUALITIES.find((item) => item.id === wantedId)?.height;
  if (wantedHeight) {
    const withHeight = options.filter((item) => item.height);
    if (withHeight.length) {
      return withHeight.reduce((closest, item) => {
        const closestGap = Math.abs((closest.height || 0) - wantedHeight);
        const itemGap = Math.abs((item.height || 0) - wantedHeight);
        return itemGap < closestGap ? item : closest;
      });
    }
  }

  return options[0] ?? { id: "auto", label: "Auto", url: fallbackUrl, height: null };
}

function applyYouTubeQuality(player: YouTubePlayerHandle | null, qualityId: string) {
  if (!player) return;
  const suggested = YOUTUBE_QUALITY_MAP[qualityId] || "default";
  try {
    player.setPlaybackQuality?.(suggested);
    if (suggested === "default") {
      player.setPlaybackQualityRange?.("tiny", "highres");
    } else {
      player.setPlaybackQualityRange?.(suggested, suggested);
    }
  } catch {
    // YouTube may ignore the suggestion on some videos.
  }
}

type YouTubePlayerHandle = {
  setPlaybackRate?: (rate: number) => void;
  setPlaybackQuality?: (quality: string) => void;
  setPlaybackQualityRange?: (min: string, max: string) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy?: () => void;
};

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const win = window as Window & { YT?: { Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayerHandle }; onYouTubeIframeAPIReady?: () => void };
  if (win.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previous = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

function PlayerSettingsBar({
  qualityId,
  qualityOptions,
  speed,
  onQuality,
  onSpeed,
}: {
  qualityId: string;
  qualityOptions: Array<{ id: string; label: string }>;
  speed: number;
  onQuality: (id: string) => void;
  onSpeed: (value: number) => void;
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 bg-[#111827] px-3 py-2">
      <label className="inline-flex items-center gap-2 text-[12px] font-extrabold text-white">
        Speed
        <select
          value={speed}
          onChange={(event) => onSpeed(Number(event.target.value))}
          className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[12px] font-extrabold text-white outline-none"
        >
          {SPEED_OPTIONS.map((option) => (
            <option key={option} value={option} className="text-[#111827]">
              {speedLabel(option)}
            </option>
          ))}
        </select>
      </label>
      <label className="inline-flex items-center gap-2 text-[12px] font-extrabold text-white">
        Quality
        <select
          value={qualityOptions.some((item) => item.id === qualityId) ? qualityId : (qualityOptions[0]?.id ?? "auto")}
          onChange={(event) => onQuality(event.target.value)}
          className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[12px] font-extrabold text-white outline-none"
        >
          {qualityOptions.map((option) => (
            <option key={option.id} value={option.id} className="text-[#111827]">
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function ProtectedVideoPlayer({
  url,
  qualities = [],
  autoPlay = false,
  title = "Course video",
  progressKey,
}: {
  url: string;
  qualities?: VideoQualityOption[];
  autoPlay?: boolean;
  title?: string;
  progressKey?: string;
}) {
  const fileOptions = useMemo(() => uniqueVideoQualities(url, qualities), [qualities, url]);
  const youtubeId = extractYouTubeId(url);
  const isYouTube = Boolean(youtubeId);

  const qualityMenu = useMemo(() => {
    if (isYouTube) return STANDARD_QUALITIES;
    return STANDARD_QUALITIES.map((item) => {
      const picked = pickQuality(fileOptions, item.id, url);
      return { id: item.id, label: item.label, url: picked.url, height: item.height };
    });
  }, [fileOptions, isYouTube, url]);

  const [qualityId, setQualityId] = useState("auto");
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeHostRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayerHandle | null>(null);
  const wasPlayingRef = useRef(false);
  const resumeAtRef = useRef(0);

  const activeFile = pickQuality(fileOptions, qualityId, url);
  const playbackUrl = isYouTube ? url : (activeFile.url || url);
  const embedUrl = youtubeEmbedUrl(playbackUrl);

  useEffect(() => {
    setQualityId(storedQualityId());
    resumeAtRef.current = 0;
  }, [url, progressKey]);

  const changeQuality = (id: string) => {
    const video = videoRef.current;
    resumeAtRef.current = video?.currentTime ?? 0;
    wasPlayingRef.current = video ? !video.paused : autoPlay;
    persistQualityId(id);
    setQualityId(id);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applySpeed = () => {
      video.playbackRate = speed;
    };

    const onContextMenu = (event: Event) => event.preventDefault();
    video.addEventListener("contextmenu", onContextMenu);
    video.addEventListener("loadedmetadata", applySpeed);
    applySpeed();

    const onVisibility = () => {
      if (document.hidden) {
        wasPlayingRef.current = !video.paused;
        video.pause();
      } else if (wasPlayingRef.current) {
        void video.play().catch(() => undefined);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    const saved = progressKey ? loadVideoPosition(progressKey) : 0;
    const startAt = resumeAtRef.current > 0 ? resumeAtRef.current : saved;
    const restore = () => {
      if (startAt > 0 && Number.isFinite(video.duration) && startAt < video.duration - 5) {
        video.currentTime = startAt;
      }
      applySpeed();
      if (resumeAtRef.current > 0 && wasPlayingRef.current) {
        void video.play().catch(() => undefined);
      }
    };
    video.addEventListener("loadedmetadata", restore, { once: true });

    let lastSaved = 0;
    const persist = () => {
      if (!progressKey) return;
      const current = video.currentTime;
      if (Math.abs(current - lastSaved) < 3) return;
      lastSaved = current;
      saveVideoPosition(progressKey, current, video.duration);
    };

    video.addEventListener("timeupdate", persist);
    video.addEventListener("pause", persist);
    const onEnded = () => {
      if (progressKey) clearVideoPosition(progressKey);
    };
    video.addEventListener("ended", onEnded);

    return () => {
      persist();
      video.removeEventListener("contextmenu", onContextMenu);
      video.removeEventListener("loadedmetadata", applySpeed);
      video.removeEventListener("timeupdate", persist);
      video.removeEventListener("pause", persist);
      video.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playbackUrl, progressKey, speed]);

  useEffect(() => {
    if (!youtubeId || !youtubeHostRef.current) return;
    let cancelled = false;

    void loadYouTubeApi().then(() => {
      if (cancelled || !youtubeHostRef.current) return;
      const YT = (window as Window & { YT?: { Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayerHandle } }).YT;
      if (!YT?.Player) return;
      youtubePlayerRef.current?.destroy?.();
      youtubePlayerRef.current = new YT.Player(youtubeHostRef.current, {
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          autoplay: autoPlay ? 1 : 0,
          start: progressKey ? Math.floor(loadVideoPosition(progressKey)) : 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YouTubePlayerHandle }) => {
            event.target.setPlaybackRate?.(speed);
            applyYouTubeQuality(event.target, qualityId);
            const saved = progressKey ? loadVideoPosition(progressKey) : 0;
            if (saved > 0) {
              event.target.seekTo?.(saved, true);
            }
          },
          onStateChange: (event: { data: number; target: YouTubePlayerHandle }) => {
            if (event.data === 1) {
              applyYouTubeQuality(event.target, qualityId);
              event.target.setPlaybackRate?.(speed);
            }
            if (progressKey && (event.data === 2 || event.data === 0)) {
              const current = event.target.getCurrentTime?.() ?? 0;
              const duration = event.target.getDuration?.() ?? 0;
              if (event.data === 0) {
                clearVideoPosition(progressKey);
              } else {
                saveVideoPosition(progressKey, current, duration);
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      youtubePlayerRef.current?.destroy?.();
      youtubePlayerRef.current = null;
    };
    // Recreate only when the video changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  useEffect(() => {
    youtubePlayerRef.current?.setPlaybackRate?.(speed);
    applyYouTubeQuality(youtubePlayerRef.current, qualityId);
  }, [qualityId, speed]);

  const settings = (
    <PlayerSettingsBar
      qualityId={qualityId}
      qualityOptions={qualityMenu}
      speed={speed}
      onQuality={changeQuality}
      onSpeed={setSpeed}
    />
  );

  if (isYouTube) {
    return (
      <div className="flex h-full w-full flex-col bg-black" onContextMenu={(event) => event.preventDefault()}>
        <div className="relative min-h-0 flex-1">
          <div ref={youtubeHostRef} className="h-full w-full" title={title} />
        </div>
        {settings}
      </div>
    );
  }

  if (isDirectVideoUrl(playbackUrl)) {
    return (
      <div className="flex h-full w-full flex-col bg-black" onContextMenu={(event) => event.preventDefault()}>
        <div className="relative min-h-0 flex-1">
          <video
            key={playbackUrl}
            ref={videoRef}
            src={playbackUrl}
            controls
            autoPlay={autoPlay}
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            preload="metadata"
            className="h-full w-full bg-black object-contain [&::-webkit-media-controls-enclosure]:overflow-hidden"
            onContextMenu={(event) => event.preventDefault()}
          >
            <track kind="captions" />
          </video>
        </div>
        {settings}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-black" onContextMenu={(event) => event.preventDefault()}>
      <div className="relative min-h-0 flex-1">
        <iframe src={embedUrl || playbackUrl} title={title} className="h-full w-full border-0" />
      </div>
      {settings}
    </div>
  );
}
