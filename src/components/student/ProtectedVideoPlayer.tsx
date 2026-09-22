"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isDirectVideoUrl, youtubeEmbedUrl } from "@/lib/lesson-video";

export type VideoQualityOption = {
  id: string;
  label: string;
  url: string;
  height?: number | null;
};

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function uniqueVideoQualities(url: string, incoming: VideoQualityOption[] = []): VideoQualityOption[] {
  const source = incoming.filter((item) => item.url);
  const list = source.length > 0
    ? source
    : url
      ? [{ id: "auto", label: "Auto", url, height: null }]
      : [];

  const seen = new Set<string>();
  const unique: VideoQualityOption[] = [];
  for (const item of list) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    unique.push(item);
  }
  return unique;
}

function speedLabel(value: number) {
  return value === 1 ? "Normal" : `${value}x`;
}

export function ProtectedVideoPlayer({
  url,
  qualities = [],
  autoPlay = false,
  title = "Course video",
}: {
  url: string;
  qualities?: VideoQualityOption[];
  autoPlay?: boolean;
  title?: string;
}) {
  const options = useMemo(() => uniqueVideoQualities(url, qualities), [qualities, url]);

  const [activeId, setActiveId] = useState(() => options[0]?.id ?? "auto");
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wasPlayingRef = useRef(false);
  const resumeAtRef = useRef(0);

  const active = options.find((item) => item.id === activeId) ?? options[0];
  const playbackUrl = active?.url || url;
  const embedUrl = youtubeEmbedUrl(playbackUrl);

  useEffect(() => {
    if (!options.some((item) => item.id === activeId)) {
      setActiveId(options[0]?.id ?? "auto");
    }
  }, [activeId, options]);

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

    if (resumeAtRef.current > 0) {
      const restore = () => {
        video.currentTime = resumeAtRef.current;
        applySpeed();
      };
      video.addEventListener("loadedmetadata", restore, { once: true });
    }

    return () => {
      video.removeEventListener("contextmenu", onContextMenu);
      video.removeEventListener("loadedmetadata", applySpeed);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playbackUrl, speed]);

  const playerControls = (
    <div className="absolute right-3 top-3 z-20 flex flex-wrap items-center justify-end gap-2">
      <label className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
        Speed
        <select
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
          className="bg-transparent text-[11px] font-extrabold text-white outline-none"
        >
          {SPEED_OPTIONS.map((option) => (
            <option key={option} value={option} className="text-[#111827]">
              {speedLabel(option)}
            </option>
          ))}
        </select>
      </label>
      <label className="inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur">
        Quality
        <select
          value={active?.id ?? "auto"}
          onChange={(event) => {
            const video = videoRef.current;
            resumeAtRef.current = video?.currentTime ?? 0;
            wasPlayingRef.current = video ? !video.paused : autoPlay;
            setActiveId(event.target.value);
          }}
          className="bg-transparent text-[11px] font-extrabold text-white outline-none"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id} className="text-[#111827]">
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  if (embedUrl) {
    return (
      <div className="relative h-full w-full bg-black" onContextMenu={(event) => event.preventDefault()}>
        {playerControls}
        <iframe
          src={`${embedUrl}&modestbranding=1&rel=0`}
          title={title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (isDirectVideoUrl(playbackUrl)) {
    return (
      <div className="relative h-full w-full bg-black" onContextMenu={(event) => event.preventDefault()}>
        {playerControls}
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
    );
  }

  return (
    <div className="relative h-full w-full bg-black" onContextMenu={(event) => event.preventDefault()}>
      {playerControls}
      <iframe src={playbackUrl} title={title} className="h-full w-full border-0" />
    </div>
  );
}
