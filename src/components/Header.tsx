import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bookmark, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSubmit: () => void;
  onOpenFavorites: () => void;
  onOpenProfile: () => void;
}

const TYPEWRITER_PHRASES = [
  'cli tools',
  'mcp servers',
  'chrome extensions',
  'saas apps',
  'vs code extensions',
  'mobile apps',
  'ai agents',
  'experimental web',
];

interface DynamicSearchInputProps {
  value: string;
  onChange: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
  onCloseMobile?: () => void;
}

const DynamicSearchInput: React.FC<DynamicSearchInputProps> = ({
  value,
  onChange,
  className = '',
  autoFocus = false,
  onCloseMobile,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value !== '' || isFocused) return;

    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    let typingSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end of completed phrase
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
      typingSpeed = 300;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [value, isFocused, charIndex, isDeleting, phraseIndex]);

  const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
  const displayedText = currentPhrase.substring(0, charIndex);

  return (
    <div className="relative w-full flex items-center">
      {/* Search Icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#545454]/70 z-10">
        <Search className="w-3.5 h-3.5" />
      </div>

      {/* Actual Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        placeholder=""
        className={`${className} relative z-0`}
      />

      {/* Typewriter Effect Placeholder (No Blur, No search "" wrapper text, types out category names letter by letter with blinking cursor) */}
      {value === '' && !isFocused && (
        <div className="absolute left-9 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center select-none">
          <span className="text-[#545454]/75 font-sans text-[13px] font-normal">
            {displayedText}
          </span>
          <span className="w-[1.5px] h-3.5 bg-[#545454]/70 ml-[2px] animate-pulse inline-block" />
        </div>
      )}

      {/* Mobile Close Button */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#545454] hover:text-black transition-colors z-20"
          title="Close search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenSubmit,
  onOpenFavorites,
  onOpenProfile,
}) => {
  const { favorites } = useFavorites();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full px-4 sm:px-8 h-[56px] flex items-center justify-between bg-[#F2F1F3] relative z-20 overflow-hidden shrink-0 mt-2 sm:mt-3">
      
      {/* 1. Left Section: Logo -> Links back to mainpage (/) */}
      <motion.div
        animate={{ 
          opacity: mobileSearchOpen ? 0 : 1, 
          x: mobileSearchOpen ? -60 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className={`flex-1 flex items-center justify-start shrink-0 ${mobileSearchOpen ? 'pointer-events-none sm:pointer-events-auto' : ''}`}
      >
        <Link to="/" className="flex items-center gap-2 group cursor-pointer" title="Go to main archive">
          <img 
            src="/idat logo color.svg" 
            alt="idat." 
            className="h-[13.5px] w-auto block opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>
      </motion.div>

      {/* 2. Desktop Search Bar with Typewriter Effect */}
      <div className="hidden sm:flex items-center justify-center flex-1 max-w-[338px] px-2 h-full">
        <DynamicSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          className="pill-search w-full"
        />
      </div>

      {/* 3. Mobile Expanding Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute left-4 right-4 z-30 flex items-center justify-center w-[calc(100%-32px)] sm:hidden h-full"
          >
            <DynamicSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              autoFocus
              className="pill-search !max-w-none w-full"
              onCloseMobile={() => {
                setMobileSearchOpen(false);
                setSearchQuery('');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Right Section: Controls */}
      <motion.div
        animate={{ 
          opacity: mobileSearchOpen ? 0 : 1, 
          x: mobileSearchOpen ? 60 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className={`flex-1 flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 ${mobileSearchOpen ? 'pointer-events-none sm:pointer-events-auto' : ''}`}
      >
        {/* Mobile Search Icon Button */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="sm:hidden text-[#545454] hover:opacity-80 transition-opacity p-1"
          title="Open Search"
        >
          <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </button>

        {/* Bookmark Icon */}
        <button
          onClick={onOpenFavorites}
          className="relative text-[#545454] hover:opacity-80 transition-opacity p-1"
          title="Bookmarked Favorites"
        >
          <Bookmark className={`w-[18px] h-[18px] ${favorites.length > 0 ? 'fill-[#545454]' : ''}`} strokeWidth={1.5} />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#545454] text-[#F2F1F3] text-[8px] font-mono font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>

        {/* +new Button */}
        <button
          onClick={onOpenSubmit}
          className="btn-main relative overflow-hidden flex items-center gap-1 group"
          title="Submit new thing"
        >
          <motion.div
            className="absolute -inset-y-4 w-full h-[200%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] pointer-events-none blur-[0.5px]"
            initial={{ x: '-150%', y: '-40%' }}
            animate={{ x: ['-150%', '160%'], y: ['-40%', '40%'] }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4.2,
              duration: 1.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          />
          
          <Plus className="w-3 h-3 stroke-[2.2] relative z-10 text-white/90" />
          <span className="relative z-10 text-white/90">new</span>
        </button>

        {/* Pure Gradient Avatar Circle (27px, No Initials) */}
        <button
          onClick={onOpenProfile}
          className="w-[27px] h-[27px] rounded-full bg-gradient-to-br from-[#101010] via-[#2A2A2A] to-[#545454] shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-xs border border-white/10"
          title="View @ileri profile"
        />
      </motion.div>

    </header>
  );
};
