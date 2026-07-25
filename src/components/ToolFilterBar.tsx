import React, { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface ToolFilterBarProps {
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
}

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

export const ToolFilterBar: React.FC<ToolFilterBarProps> = ({
  onOpenFilterDrawer,
  activeFilterCount,
}) => {
  // Always display "300 things." as requested
  const numberVal = 300;

  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-8 py-4 bg-[#F2F1F3]">
      {/* 300 (Cascadia Mono 16px) + things. (Inter 16px) */}
      <div className="flex items-baseline gap-1">
        <span className="text-mono-20 cursor-pointer" title="300 things">
          <ScrambleNumber value={numberVal} />
        </span>
        <span className="text-inter-20">
          things.
        </span>
      </div>

      {/* Redesigned Filter Button: Right-aligned, Filter Icon + filter text */}
      <button
        onClick={onOpenFilterDrawer}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E9E9E9] text-[#101010] hover:bg-[#E0E0E0] transition-all font-sans text-xs font-medium cursor-pointer"
        title="Open filters"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
        <span>filter</span>
        {activeFilterCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#101010] text-white text-[9px] font-mono">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};
