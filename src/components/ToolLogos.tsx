import React from 'react';

export interface ToolLogoProps {
  toolId: string;
  className?: string;
  size?: number;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({ toolId, className = "w-4 h-4", size = 16 }) => {
  const normalizedId = toolId.toLowerCase().replace(/\s+/g, '-');

  switch (normalizedId) {
    case 'claude-code':
    case 'claude':
      // Anthropic / Claude Spark logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-purple-400 ${className}`}>
          <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          <path d="M18 3L19.4 6.6L23 8L19.4 9.4L18 13L16.6 9.4L13 8L16.6 6.6L18 3Z" opacity="0.6" />
        </svg>
      );

    case 'cursor':
      // Cursor geometric logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-cyan-400 ${className}`}>
          <path d="M5.5 3.5L18.5 10.5L12.5 13.5L9.5 19.5L5.5 3.5Z" />
          <path d="M12.5 13.5L18.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'gemini-cli':
    case 'gemini':
      // Google Gemini Star logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-emerald-400 ${className}`}>
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      );

    case 'lovable':
      // Lovable heart logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-rose-400 ${className}`}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'bolt':
      // Bolt lightning logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-amber-400 ${className}`}>
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </svg>
      );

    case 'replit':
      // Replit logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-orange-400 ${className}`}>
          <path d="M2 4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V10H4C2.89543 10 2 9.10457 2 8V4Z" />
          <path d="M12 10H20C21.1046 10 22 10.8954 22 12V16C22 17.1046 21.1046 18 20 18H14V20C14 21.1046 13.1046 22 12 22H4C2.89543 22 2 21.1046 2 20V14C2 12.8954 2.89543 12 4 12H12V10Z" opacity="0.8" />
        </svg>
      );

    case 'v0':
    case 'vercel':
      // Vercel / v0 triangle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-slate-300 dark:text-slate-100 ${className}`}>
          <path d="M12 2L24 22H0L12 2Z" />
        </svg>
      );

    case 'codex':
    case 'gpt-5.5':
    case 'openai':
      // OpenAI logo
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-teal-400 ${className}`}>
          <path d="M22.2819 9.82116C22.6845 8.50224 22.569 7.07005 21.9602 5.83446C21.1578 4.20573 19.6465 3.09062 17.8687 2.81226C16.8929 1.83151 15.5414 1.25883 14.1166 1.22271C12.1895 1.17386 10.3707 2.08316 9.27367 3.63341C7.94074 3.23832 6.50567 3.36437 5.27783 3.98402 C3.6491 4.78643 2.53399 6.2977 2.25563 8.07549C1.27488 9.05129 0.7022 10.4028 0.666083 11.8276C0.617234 13.7547 1.52653 15.5735 3.07678 16.6705C2.68169 18.0035 2.80774 19.4385 3.42739 20.6664C4.2298 22.2951 5.74107 23.4102 7.51886 23.6886C8.49466 24.6693 9.84617 25.242 11.271 25.2781C13.1981 25.327 15.0169 24.4177 16.1139 22.8674C17.4468 23.2625 18.8819 23.1365 20.1097 22.5168C21.7385 21.7144 22.8536 20.2031 23.1319 18.4253C24.1127 17.4495 24.6854 16.098 24.7215 14.6732C24.7703 12.7461 23.861 10.9273 22.3108 9.83031L22.2819 9.82116Z" />
        </svg>
      );

    case 'windsurf':
      // Windsurf wave
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-indigo-400 ${className}`}>
          <path d="M2 6C6 2 10 10 14 6C18 2 22 10 22 6" />
          <path d="M2 18C6 14 10 22 14 18C18 14 22 22 22 18" />
        </svg>
      );

    default:
      // Generic AI Tool Sparkle
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`text-indigo-400 ${className}`}>
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      );
  }
};

export const AI_TOOLS_LIST = [
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'gemini-cli', name: 'Gemini CLI' },
  { id: 'lovable', name: 'Lovable' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'replit', name: 'Replit' },
  { id: 'codex', name: 'Codex / GPT' },
  { id: 'v0', name: 'v0' },
  { id: 'windsurf', name: 'Windsurf' },
];
