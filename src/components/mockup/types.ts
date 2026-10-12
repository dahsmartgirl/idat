export type FrameType = 'none' | 'browser' | 'phone';
export type FrameTheme = 'light' | 'dark';
export type CanvasRatio = 'auto' | '16:9' | '4:3' | '1:1' | '4:5';
export type ShadowPreset = 'none' | 'soft' | 'deep' | 'float';
export type TexturePreset = 'none' | 'dots' | 'grid' | 'lines' | 'paper';

export interface MockupSettings {
  frame: FrameType;
  frameTheme: FrameTheme;
  ratio: CanvasRatio;
  // Any CSS background value (solid hex, gradient, or 'transparent')
  background: string;
  // Space around the frame, as a % of the canvas (0-30)
  padding: number;
  // Corner radius in px at the 640px reference canvas width
  radius: number;
  shadow: ShadowPreset;
  // 0-100
  shadowStrength: number;
  // 0-100
  noise: number;
  texture: TexturePreset;
  // 0-100
  textureOpacity: number;
  // 1-3
  zoom: number;
  // Zoom focus point, 0-1 on each axis of the media
  focusX: number;
  focusY: number;
}

export interface MediaShot {
  id: string;
  src: string;
  kind: 'image' | 'video';
  name: string;
  width: number;
  height: number;
  // Videos: still frame shown in feeds, and a lighter clip to play on hover
  poster?: string;
  previewSrc?: string;
  settings: MockupSettings;
}
