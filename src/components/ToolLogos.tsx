import React from 'react';

export interface ToolLogoProps {
  toolId: string;
  className?: string;
  size?: number;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({ toolId, className = "", size = 12 }) => {
  const normalizedId = toolId.toLowerCase().replace(/\s+/g, '-');

  switch (normalizedId) {
    case 'claude-code':
    case 'claude':
      // Claude's official brand terracotta starburst mark
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#D97757" className={`shrink-0 ${className}`}>
          <path d="M12 1.5L14.2 8.3L21 9.8L14.2 11.3L12 18.1L9.8 11.3L3 9.8L9.8 8.3L12 1.5Z" />
          <path d="M17.5 3.5L18.4 6.8L21.5 7.5L18.4 8.2L17.5 11.5L16.6 8.2L13.5 7.5L16.6 6.8L17.5 3.5Z" opacity="0.75" />
          <path d="M6.5 12.5L7.4 15.8L10.5 16.5L7.4 17.2L6.5 20.5L5.6 17.2L2.5 16.5L5.6 15.8L6.5 12.5Z" opacity="0.75" />
        </svg>
      );

    case 'cursor':
      // Cursor official geometric dark cursor
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#101010" className={`shrink-0 ${className}`}>
          <path d="M4 2L18 10L11.5 13.2L8.2 19.8L4 2Z" />
        </svg>
      );

    case 'gemini-cli':
    case 'gemini':
      // Google Gemini official 4-point star sparkle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1A73E8" className={`shrink-0 ${className}`}>
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      );

    case 'v0':
    case 'vercel':
      // v0 / Vercel triangle in black
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#101010" className={`shrink-0 ${className}`}>
          <path d="M12 2L24 22H0L12 2Z" />
        </svg>
      );

    case 'bolt':
      // Bolt lightning mark in amber
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B" className={`shrink-0 ${className}`}>
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </svg>
      );

    case 'lovable':
      // Lovable heart mark in pink
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#EC4899" className={`shrink-0 ${className}`}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'replit':
    case 'replit-agent':
      // Replit R-blocks in orange
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#F97316" className={`shrink-0 ${className}`}>
          <path d="M2 4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V10H4C2.89543 10 2 9.10457 2 8V4Z" />
          <path d="M12 10H20C21.1046 10 22 10.8954 22 12V16C22 17.1046 21.1046 18 20 18H14V20C14 21.1046 13.1046 22 12 22H4C2.89543 22 2 21.1046 2 20V14C2 12.8954 2.89543 12 4 12H12V10Z" opacity="0.8" />
        </svg>
      );

    case 'windsurf':
      // Windsurf waves in cyan/indigo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
          <path d="M2 6C6 2 10 10 14 6C18 2 22 10 22 6" />
          <path d="M2 18C6 14 10 22 14 18C18 14 22 22 22 18" />
        </svg>
      );

    case 'midjourney':
      // Midjourney boat/sail spark in purple
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#8B5CF6" className={`shrink-0 ${className}`}>
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#545454" className={`shrink-0 ${className}`}>
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      );
  }
};
