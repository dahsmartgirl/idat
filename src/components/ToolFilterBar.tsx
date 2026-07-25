import React, { useState, useEffect } from 'react';
import type { CategoryType } from '../types';

interface ToolFilterBarProps {
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  activeCount: number;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'SaaS',
  'Chrome Extensions',
  'MCP Servers',
  'CLI Tools',
  'Games',
  'VS Code Extensions',
  'Mobile Apps',
  'Experiments'
];

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
  selectedCategory,
  setSelectedCategory,
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

      {/* Clean text filter control (NOT a button) */}
      <div className="flex items-center gap-1">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
          className="filter-text-select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-[#F2F1F3] text-[#545454]">
              {cat === 'All' ? 'filter things ▾' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
