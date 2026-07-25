import React from 'react';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { SearchX, RotateCcw } from 'lucide-react';

interface ProjectMasonryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
  onSelectBuilder?: (handle: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

// 80% Scaled Heights: 399px, 265px, 503px, 265px, 360px, 304px...
const SCALED_HEIGHTS = [
  'h-[399px]',
  'h-[265px]',
  'h-[503px]',
  'h-[265px]',
  'h-[360px]',
  'h-[304px]',
];

export const ProjectMasonry: React.FC<ProjectMasonryProps> = ({
  projects,
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
  searchQuery = '',
  onClearSearch,
}) => {
  // Ultra-Clean & Minimalist Search Empty State
  if (projects.length === 0) {
    return (
      <div className="w-full px-4 sm:px-8 py-20 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-3">
          
          {/* Minimalist Icon Badge */}
          <div className="w-10 h-10 rounded-full bg-[#E9E9E9] flex items-center justify-center text-[#101010] mb-1">
            <SearchX className="w-4 h-4 stroke-[1.8]" />
          </div>

          {/* Clean Copy */}
          <h3 className="text-inter-16 !text-[#101010] font-medium tracking-tight">
            {searchQuery ? `no things found for "${searchQuery}"` : 'no matching things'}
          </h3>
          <p className="text-inter-14 text-[#545454]/70 max-w-xs leading-relaxed">
            Try clearing your search query or adjusting your filters.
          </p>

          {/* Only Button: clear search */}
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="btn-main flex items-center gap-1 cursor-pointer mt-2"
              title="Clear search and filters"
            >
              <RotateCcw className="w-3 h-3 stroke-[2]" />
              <span>clear search</span>
            </button>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 py-2">
      {/* Reduced column gaps (gap-3.5) and tighter row spacing (space-y-5) */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-3.5 space-y-5">
        {projects.map((project, index) => {
          const heightClass = SCALED_HEIGHTS[index % SCALED_HEIGHTS.length];
          return (
            <div key={project.id} className="break-inside-avoid">
              <ProjectCard
                project={project}
                heightClass={heightClass}
                onSelectProject={onSelectProject}
                onOpenClaim={onOpenClaim}
                onSelectBuilder={onSelectBuilder}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
