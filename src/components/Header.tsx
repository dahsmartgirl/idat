import React, { useState } from 'react';
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
    <header className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between bg-[#F2F1F3] relative z-20">
      
      {/* 1. Left Section: Logo */}
      <div className="flex-1 flex items-center justify-start">
        <a href="#" className="flex items-center gap-2 group">
          <img 
            src="/idat logo color.svg" 
            alt="idat." 
            className="h-[13.5px] w-auto block opacity-90 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>

      {/* 2. Center Section: Desktop Search Pill (hidden on mobile, centered on sm+) */}
      <div className="hidden sm:flex justify-center flex-1 max-w-[338px] px-2">
        <div className="relative w-full">
          <div className="absolute left-3 top-2.5 pointer-events-none text-[#545454]/70">
            <Search className="w-3.5 h-3.5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search..."
            className="pill-search"
          />
        </div>
      </div>

      {/* 3. Right Section: Controls (Search Icon on Mobile -> Bookmark Icon -> +new Button -> Avatar Circle) */}
      <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2">
        
        {/* Mobile Search Icon Button (turns into icon only on mobile aligned with bookmark icon) */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="sm:hidden text-[#545454] hover:opacity-80 transition-opacity p-1"
          title="Search"
        >
          {mobileSearchOpen ? <X className="w-[18px] h-[18px]" /> : <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />}
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

        {/* +new Button with Diagonal Luxury Light Sheen Animation (h-[27px]) */}
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

        {/* Avatar Circle (matches 27px height of +new button) */}
        <button
          onClick={onOpenProfile}
          className="avatar-circle"
          title="View @ileri profile"
        >
          <span className="font-mono text-[9px]">@i</span>
        </button>
      </div>

      {/* Mobile Expandable Search Bar Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 p-3 bg-[#F2F1F3] border-b border-black/10 sm:hidden z-30 shadow-md"
          >
            <div className="relative w-full">
              <div className="absolute left-3 top-2.5 pointer-events-none text-[#545454]/70">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="search..."
                autoFocus
                className="pill-search w-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};
