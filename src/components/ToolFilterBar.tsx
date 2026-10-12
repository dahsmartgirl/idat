import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X } from './icons';

interface ToolFilterBarProps {
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

interface FilterButtonProps {
  onOpen: () => void;
  activeCount: number;
  onClear: () => void;
  floating?: boolean;
}

// Filter pill: opens the filter drawer; while filters are on, shows the count and an x that clears them all
// (floating: see-through and blurred, while it's stuck under the header)
export const FilterButton: React.FC<FilterButtonProps> = ({ onOpen, activeCount, onClear, floating = false }) => (
  <div className={`btn-secondary filter-btn flex items-center gap-1 !p-0 ${floating ? 'is-floating' : ''}`}>
    <button
      onClick={onOpen}
      className={`flex items-center gap-1 h-full cursor-pointer pl-[13px] ${activeCount > 0 ? 'pr-0.5' : 'pr-[13px]'}`}
      title="Open filters"
    >
      <SlidersHorizontal className="w-3 h-3 stroke-[2] text-[#101010]" />
      <span>filter</span>
      {activeCount > 0 && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#101010] text-white text-[9px] font-mono font-bold">
          {activeCount}
        </span>
      )}
    </button>
    {activeCount > 0 && (
      <button
        onClick={onClear}
        className="flex items-center h-full pl-0.5 pr-[11px] cursor-pointer text-secondary hover:text-[#101010] transition-colors"
        title="Clear all filters"
        aria-label="Clear all filters"
      >
        <X className="w-3 h-3 stroke-[2.5]" />
      </button>
    )}
  </div>
);

const SCRAMBLE_CHARS = '0123456789!@#$%^&*~?:;';

// Component for matrix/scramble character animation resolving back to target number
const ScrambleNumber: React.FC<{ value: number }> = ({ value }) => {
  const [displayText, setDisplayText] = useState(value.toString());

  useEffect(() => {
    const targetStr = value.toString();
    
    const runScramble = () => {
      let iteration = 0;
      const maxIterations = 14;
      
      const timer = setInterval(() => {
        iteration++;
        if (iteration >= maxIterations) {
          setDisplayText(targetStr);
          clearInterval(timer);
        } else {
          const scrambled = targetStr
            .split('')
            .map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
            .join('');
          setDisplayText(scrambled);
        }
      }, 45);
    };

    runScramble();
    const periodicTimer = setInterval(runScramble, 6500);

    return () => {
      clearInterval(periodicTimer);
    };
  }, [value]);

  return <span className="inline-block font-mono tracking-normal">{displayText}</span>;
};

interface FilterRowProps extends FilterButtonProps {
  children: React.ReactNode; // left side ("300 things.")
  className: string; // the row's padding
}

// "N things." + filter button. Only the filter button sticks under the header while scrolling (floating, blurred);
// scrolling back up docks it into its place in the row
export const FilterRow: React.FC<FilterRowProps> = ({ children, className, onOpen, activeCount, onClear }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    // The sticky anchor sits right above the row, so once the row has scrolled past it, the button is floating
    const check = () => {
      if (!anchorRef.current || !rowRef.current) return;
      setFloating(rowRef.current.getBoundingClientRect().top < anchorRef.current.getBoundingClientRect().top - 0.5);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <>
      {/* Zero-height sticky anchor holding the button, laid over the row's right side */}
      <div ref={anchorRef} className="sticky top-[64px] sm:top-[68px] z-20 h-0 pointer-events-none">
        <div className={`flex items-center justify-end ${className}`}>
          <div className="pointer-events-auto">
            <FilterButton onOpen={onOpen} activeCount={activeCount} onClear={onClear} floating={floating} />
          </div>
        </div>
      </div>
      <div ref={rowRef} className={`w-full flex items-center justify-between ${className}`}>
        {children}
        {/* Keeps the row's height; the real button is in the anchor above */}
        <div className="h-[27px]" aria-hidden />
      </div>
    </>
  );
};

export const ToolFilterBar: React.FC<ToolFilterBarProps> = ({
  onOpenFilterDrawer,
  activeFilterCount,
  onClearFilters,
}) => {
  // Always display "300 things." as requested
  const numberVal = 300;

  return (
    <FilterRow className="px-4 sm:px-8 py-4" onOpen={onOpenFilterDrawer} activeCount={activeFilterCount} onClear={onClearFilters}>
      {/* 300 (Cascadia Mono 16px) + things. (Inter 16px) */}
      <div className="flex items-baseline gap-1">
        <span className="text-mono-20 cursor-pointer" title="300 things">
          <ScrambleNumber value={numberVal} />
        </span>
        <span className="text-inter-20">
          things.
        </span>
      </div>
    </FilterRow>
  );
};
