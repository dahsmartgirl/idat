import { DEFAULT_SETTINGS } from './presets';
import type { CanvasRatio, FrameType, MediaShot, MockupSettings } from './types';

// Frame chrome sizes, as fractions of the frame's width
export const BROWSER_BAR = 0.055;
export const PHONE_BEZEL = 0.03;
export const PHONE_RADIUS = 0.12;

// Wide media goes in a browser window, tall media in a phone, the rest stays plain
export const detectFrame = (width: number, height: number): FrameType => {
  const aspect = width / height;
  if (aspect >= 1.3) return 'browser';
  if (aspect <= 0.8) return 'phone';
  return 'none';
};

// Width / height of the whole frame (chrome included) for the given media
export const getFrameAspect = (frame: FrameType, mediaAspect: number) => {
  if (frame === 'browser') return 1 / (1 / mediaAspect + BROWSER_BAR);
  if (frame === 'phone') return 1 / ((1 - 2 * PHONE_BEZEL) / mediaAspect + 2 * PHONE_BEZEL);
  return mediaAspect;
};

const FIXED_RATIOS: Record<Exclude<CanvasRatio, 'auto'>, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '4:5': 4 / 5,
};

export const getCanvasAspect = (settings: MockupSettings, mediaAspect: number) => {
  if (settings.ratio !== 'auto') return FIXED_RATIOS[settings.ratio];
  const frameAspect = getFrameAspect(settings.frame, mediaAspect);
  return Math.min(16 / 9, Math.max(4 / 5, frameAspect));
};

const readDimensions = (src: string, kind: MediaShot['kind']) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (kind === 'image') {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = src;
    } else {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
      video.onerror = reject;
      video.src = src;
    }
  });

// Grabs an early frame of a video as a still image, used as the poster in feeds (best effort)
const captureVideoPoster = (src: string) =>
  new Promise<string | undefined>((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration || 0);
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : undefined), 'image/webp', 0.85);
    };
    video.onerror = () => resolve(undefined);
    video.src = src;
  });

// Turns an uploaded file into a shot whose frame already suits its shape
export const createShotFromFile = async (file: File, base?: MockupSettings): Promise<MediaShot> => {
  const kind: MediaShot['kind'] = file.type.startsWith('video/') ? 'video' : 'image';
  const src = URL.createObjectURL(file);
  try {
    const { width, height } = await readDimensions(src, kind);
    const poster = kind === 'video' ? await captureVideoPoster(src) : undefined;
    return {
      id: `shot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      src,
      kind,
      name: file.name,
      width,
      height,
      poster,
      settings: {
        ...DEFAULT_SETTINGS,
        ...base,
        frame: detectFrame(width, height),
        ratio: 'auto',
        zoom: 1,
        focusX: 0.5,
        focusY: 0.5,
      },
    };
  } catch (err) {
    URL.revokeObjectURL(src);
    throw err;
  }
};

// Whether a mockup background (solid, gradient or mesh CSS) reads as dark, by averaging the luminance of
// its colours. Used to pick a legible colour for icons drawn on top of a mockup (e.g. the card bookmark).
export const isDarkBackground = (background: string) => {
  const hexes = background.match(/#[0-9a-f]{6}\b/gi);
  if (!hexes) return false; // 'transparent' sits on the light grey card block
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const average = hexes.reduce((sum, hex) => sum + luminance(hex), 0) / hexes.length;
  // Prefer white whenever it reaches WCAG's 3:1 for icons: (1 + 0.05) / (L + 0.05) >= 3  =>  L <= 0.3
  return average <= 0.3;
};
