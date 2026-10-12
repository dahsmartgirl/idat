import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { X, Bookmark } from './icons';
import { ToolLogo } from './ToolLogos';
import { MockupCanvas } from './mockup/MockupCanvas';

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
  const { favorites, toggleFavorite } = useFavorites();

  // Most recently saved first (favorites are stored in the order they were added)
  const savedProjects = [...favorites]
    .reverse()
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is Project => !!p);

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
              aria-label="Close bookmarks"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </motion.button>

            {/* Drawer Header (matches FilterDrawer: title + count badge, no divider) */}
            <div className="px-5 sm:px-7 pt-6 sm:pt-7 pb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-inter-20 !text-[#545454]">bookmarks</h2>
                {savedProjects.length > 0 && (
                  <span className="badge-unclaimed !bg-[#101010] !text-white tabular-nums">
                    {savedProjects.length}
                  </span>
                )}
              </div>
              <p className="text-mono-10 mt-1">saved on this device</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 pb-6">
              {savedProjects.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 pb-16">
                  <div className="w-10 h-10 rounded-full bg-[#E9E9E9] flex items-center justify-center text-[#101010] mb-1">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <h3 className="text-inter-16 !text-[#101010]">nothing saved yet</h3>
                  <p className="text-inter-14 max-w-[220px] text-pretty">
                    tap the bookmark on any thing to keep it here.
                  </p>
                  <button onClick={onClose} className="btn-main mt-2">
                    browse things
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {savedProjects.map((project) => {
                      const cover = project.media?.[0];
                      const firstTool = project.aiTools?.[0];
                      return (
                        <motion.li
                          key={project.id}
                          layout
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          onClick={() => {
                            onClose();
                            onSelectProject(project);
                          }}
                          className="group relative flex gap-3 -mx-2 p-2 cursor-pointer hover:bg-[#E9E9E9] transition-colors"
                        >
                          {/* Cover thumbnail: the project's mockup, or the plain grey block */}
                          <div className="relative w-[104px] aspect-[4/3] shrink-0 overflow-hidden bg-[#D9D9D9]">
                            {cover && (
                              <div className="absolute inset-0 pointer-events-none">
                                <MockupCanvas shot={cover} fill playback="hover" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 flex flex-col gap-1 pr-6">
                            <h4 className="text-inter-16 truncate">{project.name}</h4>
                            <p className="text-inter-14 line-clamp-2 leading-snug text-pretty">{project.tagline}</p>
                            <div className="flex items-center gap-1 mt-auto pt-0.5 min-w-0">
                              {firstTool && (
                                <span className="tool-pill shrink-0">
                                  <ToolLogo toolId={firstTool} size={10} />
                                  {firstTool}
                                </span>
                              )}
                              <span className="tool-pill truncate">{project.category.toLowerCase()}</span>
                            </div>
                          </div>

                          {/* Remove from bookmarks */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(project.id);
                            }}
                            className="absolute top-2 right-2 p-1 text-[#101010] hover:opacity-70 transition-opacity cursor-pointer"
                            title="Remove bookmark"
                            aria-label={`Remove ${project.name} from bookmarks`}
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
