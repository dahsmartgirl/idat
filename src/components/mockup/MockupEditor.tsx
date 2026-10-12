import React from 'react';
import { Plus, RotateCcw } from '../icons';
import type { MockupSettings } from './types';
import {
  FRAME_OPTIONS,
  GRADIENT_BACKGROUNDS,
  MESH_BACKGROUNDS,
  RATIO_OPTIONS,
  SHADOW_OPTIONS,
  SOLID_BACKGROUNDS,
  TEXTURE_OPTIONS,
} from './presets';

export type MockupTab = 'frame' | 'background' | 'effects' | 'zoom';

const TABS: MockupTab[] = ['frame', 'background', 'effects', 'zoom'];

interface MockupEditorProps {
  settings: MockupSettings;
  onChange: (patch: Partial<MockupSettings>) => void;
  tab: MockupTab;
  onTabChange: (tab: MockupTab) => void;
  shotCount: number;
  onApplyToAll: () => void;
}

interface SegmentedProps<T extends string> {
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

const Segmented = <T extends string>({ options, value, onChange }: SegmentedProps<T>) => (
  <div className="submit-toggle-container w-fit flex-wrap">
    {options.map((opt) => (
      <button
        key={opt.id}
        type="button"
        onClick={() => onChange(opt.id)}
        className={`submit-toggle-tab ${value === opt.id ? 'active' : 'inactive'}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, format, onChange, disabled }) => (
  <div className={`space-y-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
    <div className="flex items-center justify-between">
      <span className="text-mono-10">{label}</span>
      <span className="text-mono-10 !text-[#101010]">{format ? format(value) : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mockup-range"
      style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
    />
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <span className="block text-mono-10">{label}</span>
    {children}
  </div>
);

const Swatch: React.FC<{ background: string; active: boolean; onClick: () => void; title: string }> = ({
  background,
  active,
  onClick,
  title,
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`mockup-swatch ${active ? 'active' : ''}`}
    style={{ background }}
  />
);

export const MockupEditor: React.FC<MockupEditorProps> = ({
  settings,
  onChange,
  tab,
  onTabChange,
  shotCount,
  onApplyToAll,
}) => {
  const isCustomColor = /^#[0-9a-f]{6}$/i.test(settings.background) && !SOLID_BACKGROUNDS.includes(settings.background.toUpperCase());

  return (
    <div className="space-y-3">
      <Segmented
        options={TABS.map((t) => ({ id: t, label: t }))}
        value={tab}
        onChange={onTabChange}
      />

      <div className="space-y-3.5 pt-0.5">
        {tab === 'frame' && (
          <>
            <Row label="frame">
              <Segmented options={FRAME_OPTIONS} value={settings.frame} onChange={(frame) => onChange({ frame })} />
            </Row>
            <Row label="frame color">
              <Segmented
                options={[
                  { id: 'light', label: 'light' },
                  { id: 'dark', label: 'dark' },
                ]}
                value={settings.frameTheme}
                onChange={(frameTheme) => onChange({ frameTheme })}
              />
            </Row>
            <Row label="canvas size">
              <Segmented options={RATIO_OPTIONS} value={settings.ratio} onChange={(ratio) => onChange({ ratio })} />
            </Row>
            <Slider
              label="padding"
              value={settings.padding}
              min={0}
              max={30}
              format={(v) => `${v}%`}
              onChange={(padding) => onChange({ padding })}
            />
            <Slider
              label={settings.frame === 'phone' ? 'corners (phones keep their own)' : 'corners'}
              value={settings.radius}
              min={0}
              max={40}
              format={(v) => `${v}px`}
              onChange={(radius) => onChange({ radius })}
              disabled={settings.frame === 'phone'}
            />
          </>
        )}

        {tab === 'background' && (
          <>
            <Row label="solid">
              <div className="flex flex-wrap gap-1.5">
                <Swatch
                  title="transparent"
                  background="repeating-conic-gradient(#D9D9D9 0% 25%, #FFFFFF 0% 50%) 50% / 8px 8px"
                  active={settings.background === 'transparent'}
                  onClick={() => onChange({ background: 'transparent' })}
                />
                {SOLID_BACKGROUNDS.map((color) => (
                  <Swatch
                    key={color}
                    title={color.toLowerCase()}
                    background={color}
                    active={settings.background.toUpperCase() === color}
                    onClick={() => onChange({ background: color })}
                  />
                ))}
                <label
                  title="custom color"
                  className={`mockup-swatch relative flex items-center justify-center cursor-pointer ${isCustomColor ? 'active' : ''}`}
                  style={{ background: isCustomColor ? settings.background : '#E9E9E9' }}
                >
                  {!isCustomColor && <Plus className="w-3 h-3 text-[#545454]" />}
                  <input
                    type="color"
                    value={isCustomColor ? settings.background : '#F2F1F3'}
                    onChange={(e) => onChange({ background: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>
            </Row>
            <Row label="gradient">
              <div className="flex flex-wrap gap-1.5">
                {GRADIENT_BACKGROUNDS.map((bg, i) => (
                  <Swatch
                    key={bg}
                    title={`gradient ${i + 1}`}
                    background={bg}
                    active={settings.background === bg}
                    onClick={() => onChange({ background: bg })}
                  />
                ))}
              </div>
            </Row>
            <Row label="mesh">
              <div className="flex flex-wrap gap-1.5">
                {MESH_BACKGROUNDS.map((bg, i) => (
                  <Swatch
                    key={bg}
                    title={`mesh ${i + 1}`}
                    background={bg}
                    active={settings.background === bg}
                    onClick={() => onChange({ background: bg })}
                  />
                ))}
              </div>
            </Row>
          </>
        )}

        {tab === 'effects' && (
          <>
            <Row label="shadow">
              <Segmented options={SHADOW_OPTIONS} value={settings.shadow} onChange={(shadow) => onChange({ shadow })} />
            </Row>
            <Slider
              label="shadow strength"
              value={settings.shadowStrength}
              min={0}
              max={100}
              format={(v) => `${v}%`}
              onChange={(shadowStrength) => onChange({ shadowStrength })}
              disabled={settings.shadow === 'none'}
            />
            <Slider
              label="noise"
              value={settings.noise}
              min={0}
              max={100}
              format={(v) => `${v}%`}
              onChange={(noise) => onChange({ noise })}
            />
            <Row label="texture">
              <Segmented options={TEXTURE_OPTIONS} value={settings.texture} onChange={(texture) => onChange({ texture })} />
            </Row>
            <Slider
              label="texture strength"
              value={settings.textureOpacity}
              min={0}
              max={100}
              format={(v) => `${v}%`}
              onChange={(textureOpacity) => onChange({ textureOpacity })}
              disabled={settings.texture === 'none'}
            />
          </>
        )}

        {tab === 'zoom' && (
          <>
            <Slider
              label="zoom"
              value={settings.zoom}
              min={1}
              max={3}
              step={0.05}
              format={(v) => `${v.toFixed(2)}x`}
              onChange={(zoom) => onChange({ zoom })}
            />
            <p className="text-inter-14 !text-[11px]">
              click anywhere on the mockup to choose the spot to zoom into.
            </p>
            <button
              type="button"
              onClick={() => onChange({ zoom: 1, focusX: 0.5, focusY: 0.5 })}
              className="btn-secondary !h-[26px] !text-[10.5px] !px-3"
            >
              <RotateCcw className="w-3 h-3" />
              reset zoom
            </button>
          </>
        )}
      </div>

      {shotCount > 1 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onApplyToAll}
            className="btn-secondary !h-[26px] !text-[10.5px] !px-3"
            title="Copy background, padding, corners, shadow, noise and texture to every shot"
          >
            apply this style to all {shotCount} shots
          </button>
        </div>
      )}
    </div>
  );
};
