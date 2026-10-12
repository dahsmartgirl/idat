import React, { useState } from 'react';
import type { MediaShot, TexturePreset } from './types';
import { REFERENCE_WIDTH, SHADOW_LAYERS } from './presets';
import { BROWSER_BAR, PHONE_BEZEL, PHONE_RADIUS, getCanvasAspect, getFrameAspect } from './layout';
import { FeedVideo, InViewVideo } from './media';
import { responsiveImage } from './srcset';

interface MockupCanvasProps {
  shot: MediaShot;
  // Fill the parent instead of sizing the canvas from the shot's ratio (used by cards)
  fill?: boolean;
  // Editor only: clicking the media sets the zoom focus point
  onPickFocus?: (x: number, y: number) => void;
  showFocus?: boolean;
  // Show a checkerboard behind transparent backgrounds
  checker?: boolean;
  // Videos: 'auto' plays whenever on screen (drawer, editor); 'hover' shows the still frame and
  // only plays on hover, or when most in view on touch screens (feed cards)
  playback?: 'auto' | 'hover';
  className?: string;
}

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const NOISE_IMAGE = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
);

const PAPER_IMAGE = svgUrl(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='5' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#p)'/></svg>"
);

const CHECKER =
  'repeating-conic-gradient(#E9E9E9 0% 25%, #F2F1F3 0% 50%) 50% / 16px 16px';

// Everything is sized in container query units, so the browser rescales the mockup on its own
// (no measuring, no re-renders on resize or zoom). `cw(px)` turns a px value designed at the
// 640px reference canvas into canvas-width units; inside the frame, plain `cqw` means frame width.
const cw = (px: number) => `${((px / REFERENCE_WIDTH) * 100).toFixed(4)}cqw`;

const textureStyle = (texture: TexturePreset): React.CSSProperties => {
  const ink = 'rgba(128, 128, 128, 0.9)';
  switch (texture) {
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${ink} ${cw(1.4)}, transparent ${cw(1.8)})`,
        backgroundSize: `${cw(14)} ${cw(14)}`,
      };
    case 'grid':
      return {
        backgroundImage: `linear-gradient(${ink} ${cw(1)}, transparent ${cw(1)}), linear-gradient(90deg, ${ink} ${cw(1)}, transparent ${cw(1)})`,
        backgroundSize: `${cw(24)} ${cw(24)}`,
      };
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0 ${cw(1)}, transparent ${cw(1)} ${cw(10)})`,
      };
    case 'paper':
      return { backgroundImage: PAPER_IMAGE, backgroundSize: `${cw(300)} ${cw(300)}`, mixBlendMode: 'multiply' };
    default:
      return {};
  }
};

export const MockupCanvas: React.FC<MockupCanvasProps> = React.memo(({
  shot,
  fill = false,
  onPickFocus,
  showFocus = false,
  checker = false,
  playback = 'auto',
  className = '',
}) => {
  const [hovering, setHovering] = useState(false);
  const s = shot.settings;
  const mediaAspect = shot.width / shot.height || 1;
  const frameAspect = getFrameAspect(s.frame, mediaAspect);
  const isDark = s.frameTheme === 'dark';
  const isPhone = s.frame === 'phone';

  const strength = s.shadowStrength / 100;
  const boxShadow = SHADOW_LAYERS[s.shadow].length
    ? SHADOW_LAYERS[s.shadow]
        .map(([y, blur, spread, alpha]) => `0 ${cw(y)} ${cw(blur)} ${cw(spread)} rgba(0, 0, 0, ${(alpha * strength * 1.6).toFixed(3)})`)
        .join(', ')
    : 'none';

  // Largest frame that fits once padding (a % of the canvas's shorter side) is taken off
  const pad = `(${s.padding / 100} * min(100cqw, 100cqh))`;
  const frameWidth = `min(calc(100cqw - 2 * ${pad}), calc((100cqh - 2 * ${pad}) * ${frameAspect.toFixed(5)}))`;

  // Inside the frame (its own container), cqw = 1% of the frame's width
  const bar = BROWSER_BAR * 100;
  const bezel = PHONE_BEZEL * 100;
  const phoneRadius = PHONE_RADIUS * 100;

  const handleMediaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onPickFocus) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const qx = (e.clientX - rect.left) / rect.width;
    const qy = (e.clientY - rect.top) / rect.height;
    // Undo the current zoom so the click maps to a point on the original media
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    onPickFocus(
      clamp(s.focusX + (qx - s.focusX) / s.zoom),
      clamp(s.focusY + (qy - s.focusY) / s.zoom)
    );
  };

  const mediaStyle: React.CSSProperties = {
    transform: `scale(${s.zoom})`,
    transformOrigin: `${s.focusX * 100}% ${s.focusY * 100}%`,
    transition: 'transform 0.3s ease',
  };

  const media = (
    <div
      className={`relative flex-1 overflow-hidden ${onPickFocus ? 'cursor-crosshair' : ''}`}
      style={{
        background: isDark ? '#101010' : '#E9E9E9',
        ...(isPhone && { position: 'absolute', inset: `${bezel}cqw`, borderRadius: `${phoneRadius - bezel}cqw` }),
      }}
      onClick={handleMediaClick}
    >
      {shot.kind === 'video' ? (
        playback === 'hover' ? (
          <FeedVideo shot={shot} hovering={hovering} className="absolute inset-0 w-full h-full object-cover" style={mediaStyle} />
        ) : (
          <InViewVideo shot={shot} className="absolute inset-0 w-full h-full object-cover" style={mediaStyle} />
        )
      ) : (
        <img
          src={shot.src}
          {...responsiveImage(shot.src, shot.width, shot.height)}
          alt={shot.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={mediaStyle}
        />
      )}

      {isPhone && (
        <span
          className="absolute left-1/2 rounded-full bg-black pointer-events-none"
          style={{ top: '2.5cqw', width: '30%', height: '6.5cqw', transform: 'translateX(-50%)' }}
        />
      )}

      {showFocus && (
        <span
          className="absolute w-4 h-4 rounded-full border-2 border-white pointer-events-none"
          style={{
            left: `${s.focusX * 100}%`,
            top: `${s.focusY * 100}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.4)',
          }}
        />
      )}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden w-full ${fill ? 'h-full' : ''} ${className}`}
      onPointerEnter={playback === 'hover' && shot.kind === 'video' ? (e) => e.pointerType === 'mouse' && setHovering(true) : undefined}
      onPointerLeave={playback === 'hover' && shot.kind === 'video' ? () => setHovering(false) : undefined}
      style={{
        containerType: 'size',
        ...(!fill && { aspectRatio: String(getCanvasAspect(s, mediaAspect)) }),
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: s.background === 'transparent' ? (checker ? CHECKER : 'transparent') : s.background }}
      />

      {/* Texture */}
      {s.texture !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ ...textureStyle(s.texture), opacity: s.textureOpacity / 100 }}
        />
      )}

      {/* Noise */}
      {s.noise > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: NOISE_IMAGE,
            backgroundSize: `${cw(160)} ${cw(160)}`,
            opacity: (s.noise / 100) * 0.7,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Frame */}
      <div
        className="absolute left-1/2 top-1/2 flex flex-col overflow-hidden"
        style={{
          containerType: 'inline-size',
          width: frameWidth,
          aspectRatio: String(frameAspect),
          transform: 'translate(-50%, -50%)',
          // Phones keep realistic corners: 12% of the frame's width on both axes
          borderRadius: isPhone ? `${phoneRadius}% / ${(phoneRadius * frameAspect).toFixed(3)}%` : cw(s.radius),
          boxShadow,
          background: isPhone ? (isDark ? '#101010' : '#D9D9D9') : isDark ? '#1F1F1F' : '#FFFFFF',
        }}
      >
        {s.frame === 'browser' && (
          <div
            className="relative flex items-center shrink-0"
            style={{
              height: `${bar}cqw`,
              paddingLeft: `${bar * 0.45}cqw`,
              gap: `${bar * 0.2}cqw`,
              background: isDark ? '#1F1F1F' : '#FFFFFF',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="rounded-full shrink-0"
                style={{ width: `${bar * 0.26}cqw`, height: `${bar * 0.26}cqw`, background: isDark ? '#3A3A3A' : '#D9D9D9' }}
              />
            ))}
            <span
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: '38%',
                height: `${bar * 0.52}cqw`,
                transform: 'translate(-50%, -50%)',
                background: isDark ? '#2A2A2A' : '#F2F1F3',
              }}
            />
          </div>
        )}

        {media}
      </div>
    </div>
  );
});
MockupCanvas.displayName = 'MockupCanvas';
