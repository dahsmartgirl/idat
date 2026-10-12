import React from 'react';
import { fixUrlInput } from '../lib/url';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  placeholder?: string;
  id?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

// Link field: https:// fills in on focus, and pasted or typed links are tidied as you go (see fixUrlInput)
export const UrlInput: React.FC<UrlInputProps> = ({
  value,
  onChange,
  onBlur,
  hasError = false,
  placeholder = 'https://',
  id,
  required,
  ref,
}) => (
  <input
    ref={ref}
    id={id}
    type="url"
    inputMode="url"
    autoComplete="off"
    autoCapitalize="off"
    spellCheck={false}
    required={required}
    value={value}
    onChange={(e) => onChange(fixUrlInput(e.target.value))}
    onFocus={() => {
      if (!value) onChange('https://');
    }}
    onBlur={() => {
      if (value === 'https://') onChange('');
      onBlur?.();
    }}
    placeholder={placeholder}
    className={`submit-input-text placeholder:text-[#999999] ${hasError ? 'error' : ''}`}
  />
);
