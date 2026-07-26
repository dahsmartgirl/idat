import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { X, Bookmark } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allProjects: Project[];
  onSelectProject: (project: Project) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  allProjects,
  onSelectProject,
}) => {
  const { favorites } = useFavorites();
  const savedProjects = allProjects.filter((p) => favorites.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop Blur matching Project & Filter Drawers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[4px]"
          />

          {/* Side Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80 || info.velocity.x > 400) {
                onClose();
              }
            }}
            className="relative w-[calc(100vw-64px)] sm:w-[370px] max-w-[370px] h-full bg-[#F2F1F3] shadow-2xl flex flex-col z-50 overflow-visible touch-pan-y"
          >
            
            {/* Big Solid White Floating X Pill Button matching FilterDrawer 1:1 */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.12 }}
              onClick={onClose}
              className="absolute -left-13 top-5 sm:-left-16 sm:top-6 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#101010] rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-[#E9E9E9] z-50"
              title="Close bookmarks drawer"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </motion.button>

            {/* Header */}
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 fill-[#101010] text-[#101010]" />
                <h2 className="text-inter-16 font-semibold text-[#101010]">bookmarked ({savedProjects.length})</h2>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {savedProjects.length === 0 ? (
                <div className="py-12 text-center text-[#545454] space-y-2">
                  <Bookmark className="w-6 h-6 mx-auto stroke-1" />
                  <p className="text-mono-10">no bookmarked things yet.</p>
                </div>
              ) : (
                savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onClose();
                      onSelectProject(proj);
                    }}
                    className="flex items-center gap-3 p-3 bg-[#E9E9E9] border border-black/5 hover:bg-[#D9D9D9] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-[#C2C2C2] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-inter-16 font-medium text-[#101010] truncate">{proj.name}</h4>
                      <p className="text-inter-14 text-[#545454] text-[11px] truncate">{proj.tagline}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
