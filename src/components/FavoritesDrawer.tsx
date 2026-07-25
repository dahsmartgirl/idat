import React from 'react';
import type { Project } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { X, Bookmark, Trash2 } from 'lucide-react';

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

  if (!isOpen) return null;

  const savedProjects = allProjects.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-[#F2F1F3] text-[#545454] border-l border-black/10 shadow-xl flex flex-col z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 fill-[#545454]" />
            <h2 className="text-inter-16 font-bold">bookmarked ({savedProjects.length})</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
            <X className="w-4 h-4 text-[#545454]" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
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
                className="flex gap-3 p-2.5 bg-[#E9E9E9] border border-black/5 hover:bg-[#D9D9D9] transition-colors cursor-pointer"
              >
                {/* Grey block placeholder */}
                <div className="w-14 h-14 bg-[#D9D9D9] shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-inter-14 font-medium truncate">
                    {proj.name}
                  </h4>
                  <p className="text-inter-14 line-clamp-1 opacity-80 mt-0.5">
                    {proj.tagline}
                  </p>
                  <div className="text-mono-10 mt-1">
                    Claude code
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(proj.id);
                  }}
                  className="p-1 text-[#545454] hover:text-black self-center"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10 text-center text-mono-10">
          idat.xyz
        </div>
      </div>
    </div>
  );
};
