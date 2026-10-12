import React from 'react';
import { LOGOS, type LogoKey } from './brandLogos';
import { getModelBrand, getTool } from '../data/catalog';

interface MarkProps {
  logo?: LogoKey;
  color: string;
  label: string;
  size: number;
  // Single colour in the current text colour (e.g. white on a selected pill)
  mono?: boolean;
  // Single-colour logo, but still tinted in the brand colour
  preferMono?: boolean;
  className?: string;
}

// A brand logo at `size` px: full-colour when the brand has one, otherwise its mark tinted in the brand
// colour. Brands without a logo get a small letter mark in their colour.
const BrandMark: React.FC<MarkProps> = ({ logo, color, label, size, mono = false, preferMono = false, className = '' }) => {
  const svg = logo ? (!mono && !preferMono && LOGOS[logo].color) || LOGOS[logo].mono : null;

  if (svg) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 [&>svg]:w-full [&>svg]:h-full ${className}`}
        style={{ width: size, height: size, color: mono ? undefined : color }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-sans font-semibold leading-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: mono ? 'currentColor' : color,
        fontSize: size * 0.62,
      }}
    >
      <span style={{ color: mono ? '#101010' : '#FFFFFF' }}>{label.charAt(0).toUpperCase()}</span>
    </span>
  );
};

export interface ToolLogoProps {
  toolId: string;
  className?: string;
  size?: number;
  mono?: boolean;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({ toolId, className = '', size = 12, mono }) => {
  const tool = getTool(toolId);
  return (
    <BrandMark
      logo={tool?.logo}
      color={tool?.color ?? '#545454'}
      label={tool?.name ?? toolId}
      size={size}
      mono={mono}
      className={className}
    />
  );
};

export interface ModelLogoProps {
  model: string;
  className?: string;
  size?: number;
  mono?: boolean;
}

// The model's company logo, in that company's colours
export const ModelLogo: React.FC<ModelLogoProps> = ({ model, className = '', size = 11, mono }) => {
  const { company, logo } = getModelBrand(model);
  return (
    <BrandMark
      logo={logo}
      color={company?.color ?? '#999999'}
      label={company?.name ?? model}
      size={size}
      mono={mono}
      preferMono={company?.monoLogo}
      className={className}
    />
  );
};
