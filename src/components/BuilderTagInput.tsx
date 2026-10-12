import React, { useRef, useState } from 'react';
import { getBuilderGradient } from '../types';

// Known builders to suggest (mocked until accounts exist)
const KNOWN_BUILDERS = ['ileri', 'josh', 'maya', 'sarah', 'alex'];

interface BuilderTagInputProps {
  builders: string[];
  onChange: (builders: string[]) => void;
  // Handles that can't be removed (e.g. you, on your own project)
  locked?: string[];
  // Handles that can't be added (e.g. you, when adding co-builders)
  exclude?: string[];
  hasError?: boolean;
  placeholder?: string;
  onBlur?: () => void;
}

// @handle pills inside a text box, with suggestions (used by the add/edit page and the claim form)
export const BuilderTagInput: React.FC<BuilderTagInputProps> = ({
  builders,
  onChange,
  locked = [],
  exclude = [],
  hasError = false,
  placeholder = 'add creator...',
  onBlur,
}) => {
  const [input, setInput] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const clean = input.trim().replace('@', '').toLowerCase();
  const suggestions = KNOWN_BUILDERS.filter(
    (b) => (clean === '' || b.includes(clean)) && !builders.includes(b) && !exclude.includes(b)
  );

  const add = (handle: string) => {
    onChange([...builders, handle]);
    setInput('');
    setActive(0);
  };

  const addTyped = () => {
    const match = KNOWN_BUILDERS.find((b) => b === clean);
    if (match && !builders.includes(match) && !exclude.includes(match)) add(match);
  };

  const remove = (index: number) => {
    if (locked.includes(builders[index].toLowerCase())) return;
    onChange(builders.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={`submit-tagbox-container items-center gap-1.5 flex flex-wrap p-2 min-h-[42px] ${hasError ? 'error' : ''}`}
      >
        {builders.map((c, i) => (
          <div key={c} className="input-tool-pill rounded-none border-none select-none">
            <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient(c)} shrink-0`} />
            <span className="text-mono-10 !text-[#0011FF] font-medium">@{c}</span>
            {!locked.includes(c.toLowerCase()) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(i);
                }}
                className="text-[#101010] hover:text-red-500 font-bold ml-0.5 text-[11px]"
                title={`Remove @${c}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (suggestions.length > 0 && active < suggestions.length) add(suggestions[active]);
              else addTyped();
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((prev) => (prev + 1) % Math.max(1, suggestions.length));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((prev) => (prev - 1 + suggestions.length) % Math.max(1, suggestions.length));
            } else if (e.key === 'Escape') {
              setInput('');
            } else if (e.key === ' ' || e.key === ',') {
              e.preventDefault();
              addTyped();
            } else if (e.key === 'Backspace' && input === '' && builders.length > 0) {
              remove(builders.length - 1);
            }
          }}
          onBlur={onBlur}
          placeholder={builders.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono placeholder:text-[#999999] min-w-[80px]"
        />
      </div>
      {input.trim() !== '' && suggestions.length > 0 && (
        <div className="submit-suggestion-menu">
          {suggestions.map((b, idx) => (
            <button
              key={b}
              type="button"
              onClick={() => add(b)}
              className={`submit-suggestion-item ${idx === active ? 'active' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
