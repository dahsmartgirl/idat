import type { CanvasRatio, FrameType, MockupSettings, ShadowPreset, TexturePreset } from './types';

// Canvas width every px-based setting (radius, shadow, bars) is designed against
export const REFERENCE_WIDTH = 640;

export const SOLID_BACKGROUNDS = [
  '#F2F1F3',
  '#E9E9E9',
  '#D9D9D9',
  '#FFFFFF',
  '#101010',
  '#545454',
  '#D97757',
  '#F43F5E',
  '#3B82F6',
  '#10B981',
  '#8B5CF6',
  '#F5C451',
];

export const GRADIENT_BACKGROUNDS = [
  'linear-gradient(135deg, #101010 0%, #2A2A2A 50%, #545454 100%)',
  'linear-gradient(135deg, #F2F1F3 0%, #D9D9D9 100%)',
  'linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #FB7185 100%)',
  'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
  'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
  'linear-gradient(135deg, #D97757 0%, #F5C451 100%)',
  'linear-gradient(180deg, #0F172A 0%, #1E3A8A 100%)',
];

export const MESH_BACKGROUNDS = [
  'radial-gradient(at 20% 20%, #FB7185 0px, transparent 55%), radial-gradient(at 80% 10%, #A78BFA 0px, transparent 50%), radial-gradient(at 70% 90%, #60A5FA 0px, transparent 55%), #E9D5FF',
  'radial-gradient(at 10% 90%, #34D399 0px, transparent 50%), radial-gradient(at 90% 20%, #60A5FA 0px, transparent 55%), radial-gradient(at 50% 50%, #E9E9E9 0px, transparent 70%), #D9D9D9',
  'radial-gradient(at 0% 0%, #D97757 0px, transparent 50%), radial-gradient(at 100% 100%, #F5C451 0px, transparent 55%), #F8DCC4',
  'radial-gradient(at 15% 15%, #3B82F6 0px, transparent 50%), radial-gradient(at 85% 85%, #8B5CF6 0px, transparent 50%), #101010',
  'radial-gradient(at 80% 0%, #545454 0px, transparent 55%), radial-gradient(at 0% 100%, #2A2A2A 0px, transparent 55%), #101010',
  'radial-gradient(at 30% 70%, #F43F5E 0px, transparent 50%), radial-gradient(at 70% 30%, #F5C451 0px, transparent 50%), #2A2A2A',
];

export const FRAME_OPTIONS: { id: FrameType; label: string }[] = [
  { id: 'browser', label: 'browser' },
  { id: 'phone', label: 'phone' },
  { id: 'none', label: 'plain' },
];

export const RATIO_OPTIONS: { id: CanvasRatio; label: string }[] = [
  { id: 'auto', label: 'auto' },
  { id: '16:9', label: '16:9' },
  { id: '4:3', label: '4:3' },
  { id: '1:1', label: '1:1' },
  { id: '4:5', label: '4:5' },
];

export const SHADOW_OPTIONS: { id: ShadowPreset; label: string }[] = [
  { id: 'none', label: 'none' },
  { id: 'soft', label: 'soft' },
  { id: 'deep', label: 'deep' },
  { id: 'float', label: 'float' },
];

export const TEXTURE_OPTIONS: { id: TexturePreset; label: string }[] = [
  { id: 'none', label: 'none' },
  { id: 'dots', label: 'dots' },
  { id: 'grid', label: 'grid' },
  { id: 'lines', label: 'lines' },
  { id: 'paper', label: 'paper' },
];

// Box-shadow layers as [offsetY, blur, spread, alpha] at full strength, in reference px
export const SHADOW_LAYERS: Record<ShadowPreset, [number, number, number, number][]> = {
  none: [],
  soft: [[4, 12, 0, 0.08], [12, 32, -4, 0.12]],
  deep: [[8, 20, -2, 0.2], [24, 56, -8, 0.32]],
  float: [[2, 4, 0, 0.06], [30, 60, -12, 0.25], [60, 100, -24, 0.2]],
};

export const DEFAULT_SETTINGS: MockupSettings = {
  frame: 'browser',
  frameTheme: 'light',
  ratio: 'auto',
  background: MESH_BACKGROUNDS[0],
  padding: 10,
  radius: 10,
  shadow: 'soft',
  shadowStrength: 60,
  noise: 0,
  texture: 'none',
  textureOpacity: 50,
  zoom: 1,
  focusX: 0.5,
  focusY: 0.5,
};
