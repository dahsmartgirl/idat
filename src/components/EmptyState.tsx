import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Small looping illustrations for empty and not-found screens. Slow, gentle loops (and none at all for
// people who've asked their device to reduce motion)
type Art = 'page' | 'project' | 'profile' | 'search' | 'saved' | 'empty';

const CARD = '#E4E3E6';
const LINE = '#D3D2D6';
const INK = '#101010';
const ACCENT = '#0011FF';

// Endless back-and-forth, eased at both ends
const loop = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: 'easeInOut' as const,
});

// A project card: grey cover, title bar and a tagline bar
const MiniCard: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 56, h = 64 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx="3" fill={CARD} stroke={INK} strokeOpacity="0.06" />
    <rect x="6" y="6" width={w - 12} height={h * 0.5} rx="2" fill={LINE} />
    <rect x="6" y={h * 0.5 + 12} width={w * 0.55} height="4" rx="2" fill={INK} opacity="0.75" />
    <rect x="6" y={h * 0.5 + 20} width={w * 0.75} height="3" rx="1.5" fill={LINE} />
  </g>
);

const Illustration: React.FC<{ art: Art }> = ({ art }) => {
  const still = useReducedMotion();
  // Animate only when motion is welcome
  const a = <T,>(values: T) => (still ? undefined : values);

  if (art === 'page') {
    // A broken link: two chain links gently pulling apart and back, with sparks where they snapped
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
        <g transform="rotate(-28 80 60)">
          <motion.rect
            x="34" y="49" width="46" height="22" rx="11" fill="none" stroke={INK} strokeWidth="5"
            animate={a({ x: [0, -7] })} transition={loop(2.8)}
          />
          <motion.rect
            x="80" y="49" width="46" height="22" rx="11" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="5"
            animate={a({ x: [0, 7] })} transition={loop(2.8)}
          />
          {[[-9, -6], [0, -10], [9, -6]].map(([dx, dy], i) => (
            <motion.line
              key={i}
              x1={80 + dx * 0.4} y1={60 + dy * 0.4} x2={80 + dx} y2={60 + dy}
              stroke={ACCENT} strokeWidth="2" strokeLinecap="round"
              animate={a({ opacity: [0, 1] })} transition={loop(2.8)}
              initial={{ opacity: still ? 1 : 0 }}
            />
          ))}
        </g>
      </svg>
    );
  }

  if (art === 'profile') {
    // An empty avatar: a dashed circle where someone's picture would be, the silhouette fading in and out
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
        <circle cx="80" cy="48" r="30" fill={CARD} />
        <circle cx="80" cy="48" r="30.5" fill="none" stroke={INK} strokeOpacity="0.2" strokeDasharray="4 4" />
        <motion.g animate={a({ opacity: [0.25, 0.9] })} transition={loop(2.6)}>
          <circle cx="80" cy="41" r="9" fill={LINE} />
          <path d="M62 68 a18 14 0 0 1 36 0 z" fill={LINE} />
        </motion.g>
        <rect x="58" y="88" width="44" height="5" rx="2.5" fill={INK} opacity="0.7" />
        <rect x="64" y="98" width="32" height="4" rx="2" fill={LINE} />
        <motion.text
          x="118" y="30" fontFamily="Cascadia Mono, ui-monospace, monospace" fontSize="16" fill={ACCENT}
          animate={a({ y: [0, -6], opacity: [0.5, 1] })} transition={loop(2.2)}
        >@</motion.text>
      </svg>
    );
  }

  if (art === 'project') {
    // A fanned stack of cards with the top one drifting, and a little cursor wandering around looking for it
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
        <g transform="rotate(-9 80 64)" opacity="0.7"><MiniCard x={52} y={30} /></g>
        <g transform="rotate(8 80 64)" opacity="0.9"><MiniCard x={52} y={30} /></g>
        <motion.g animate={a({ y: [-3, 3], rotate: [-1.5, 1.5] })} transition={loop(3.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x="52" y="28" width="56" height="64" rx="3" fill="#FBFBFC" />
          <rect x="52.5" y="28.5" width="55" height="63" rx="2.5" fill="none" stroke={INK} strokeOpacity="0.18" strokeDasharray="3 3" />
          <text x="80" y="68" textAnchor="middle" fontFamily="Cascadia Mono, ui-monospace, monospace" fontSize="22" fill={INK}>?</text>
        </motion.g>
        <motion.g
          animate={a({ x: [0, 22, 30, 4, 0], y: [0, -10, 12, 18, 0] })}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M118 30 l0 13 l3.5 -3.2 l2.6 5.6 l2.2 -1 l-2.6 -5.5 l4.8 -0.3 z" fill={INK} stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
        </motion.g>
        <motion.circle cx="34" cy="34" r="2.5" fill={ACCENT} animate={a({ opacity: [0.25, 1] })} transition={loop(1.8)} />
      </svg>
    );
  }

  if (art === 'search') {
    // A magnifier slowly sweeping across a grid of cards, finding nothing
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
        {[[34, 14], [84, 14], [34, 66], [84, 66]].map(([x, y], i) => (
          <motion.g key={i} animate={a({ opacity: [0.45, 0.8] })} transition={loop(2.4, i * 0.5)}>
            <rect x={x} y={y} width="42" height="40" rx="3" fill={CARD} />
            <rect x={x + 5} y={y + 5} width="32" height="18" rx="2" fill={LINE} />
            <rect x={x + 5} y={y + 28} width="20" height="3.5" rx="1.75" fill={LINE} />
          </motion.g>
        ))}
        <motion.g
          animate={a({ x: [0, 46, 40, 0, 0], y: [0, 0, 44, 40, 0] })}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="54" cy="40" r="15" fill="#F7F7F8" fillOpacity="0.7" stroke={INK} strokeWidth="3" />
          <line x1="65" y1="51" x2="75" y2="61" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <motion.circle cx="54" cy="40" r="2.5" fill={ACCENT} animate={a({ scale: [0.6, 1.2] })} transition={loop(1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        </motion.g>
      </svg>
    );
  }

  if (art === 'saved') {
    // An empty dashed slot and a card floating above it, its bookmark softly filling in and out
    return (
      <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
        <rect x="46.5" y="34.5" width="67" height="70" rx="3.5" fill="none" stroke={INK} strokeOpacity="0.2" strokeDasharray="4 4" />
        <motion.g animate={a({ y: [-6, 2] })} transition={loop(3.2)}>
          <MiniCard x={52} y={18} w={56} h={66} />
          <motion.path
            d="M96 18 h8 v14 l-4 -3.2 l-4 3.2 z"
            stroke={INK}
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={{ fill: '#FFFFFF' }}
            animate={a({ fill: ['#FFFFFF', INK] })}
            transition={loop(2.6, 0.6)}
          />
        </motion.g>
        <motion.ellipse cx="80" cy="110" rx="26" ry="3" fill={INK} animate={a({ opacity: [0.06, 0.12], rx: [28, 22] })} transition={loop(3.2)} />
      </svg>
    );
  }

  // 'empty': a blank slot inviting the first card, with a softly pulsing plus
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <rect x="20.5" y="26.5" width="35" height="62" rx="3" fill={CARD} opacity="0.6" />
      <rect x="104.5" y="26.5" width="35" height="62" rx="3" fill={CARD} opacity="0.6" />
      <rect x="56.5" y="16.5" width="47" height="82" rx="3.5" fill="#F7F7F8" stroke={INK} strokeOpacity="0.22" strokeDasharray="4 4" />
      <motion.circle
        cx="80" cy="57" r="13" fill="none" stroke={ACCENT} strokeWidth="1.5"
        animate={a({ scale: [1, 1.6], opacity: [0.5, 0] })}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle cx="80" cy="57" r="13" fill={INK} />
      <path d="M80 51 v12 M74 57 h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

interface EmptyStateProps {
  art: Art;
  title: React.ReactNode;
  text: React.ReactNode;
  // The way out: one or two buttons
  actions?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ art, title, text, actions, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
    className={`w-full flex flex-col items-center justify-center text-center px-4 ${className}`}
  >
    <div className="w-[176px] h-[132px] mb-3">
      <Illustration art={art} />
    </div>
    <h2 className="text-inter-16 !text-[#101010] font-medium tracking-tight">{title}</h2>
    <p className="text-inter-14 text-subtext max-w-[300px] mt-0.5 leading-snug">{text}</p>
    {actions && <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">{actions}</div>}
  </motion.div>
);
