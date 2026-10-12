import React, { useEffect, useRef, useState } from 'react';
import type { MediaShot } from './types';
import { responsiveImage } from './srcset';

// ---------------------------------------------------------------- videos
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface VideoProps {
  shot: MediaShot;
  className: string;
  style: React.CSSProperties;
}

// Drawer / editor: plays while on screen, pauses off screen
export const InViewVideo: React.FC<VideoProps> = ({ shot, className, style }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduceMotion = prefersReducedMotion();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [shot.src]);

  return (
    <video ref={ref} src={shot.src} poster={shot.poster} className={className} style={style} muted loop playsInline preload="metadata" />
  );
};

// Touch screens have no hover, so the feed plays only the one video most in view (like Instagram / TikTok)
let focusedVideo: string | null = null;
const focusListeners = new Set<() => void>();
const setFocusedVideo = (id: string | null) => {
  focusedVideo = id;
  focusListeners.forEach((notify) => notify());
};

// Feed: shows the still frame; the (lighter) preview clip only exists while hovered / in focus,
// so idle cards decode nothing
export const FeedVideo: React.FC<VideoProps & { hovering: boolean }> = ({ shot, className, style, hovering }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceId = useRef(`${shot.id}-${Math.random().toString(36).slice(2)}`).current;
  const [isTouch] = useState(() => window.matchMedia('(hover: none)').matches);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (!isTouch || !ref.current) return;
    const update = () => setInFocus(focusedVideo === instanceId);
    focusListeners.add(update);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) setFocusedVideo(instanceId);
        else if (focusedVideo === instanceId) setFocusedVideo(null);
      },
      { threshold: [0, 0.6] }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      focusListeners.delete(update);
      if (focusedVideo === instanceId) setFocusedVideo(null);
    };
  }, [isTouch, instanceId]);

  const playing = (isTouch ? inFocus : hovering) && !prefersReducedMotion();

  return (
    <div ref={ref} className="absolute inset-0">
      {shot.poster ? (
        <img
          src={shot.poster}
          {...responsiveImage(shot.poster, shot.width, shot.height)}
          alt={shot.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className={`${className} select-none`}
          style={style}
        />
      ) : (
        // No still frame: let the browser show the video's first frame without playing it
        <video src={shot.src} className={className} style={style} muted playsInline preload="metadata" />
      )}
      {playing && (
        <video
          src={shot.previewSrc || shot.src}
          className={className}
          style={style}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
};
