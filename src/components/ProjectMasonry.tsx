import React from 'react';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectMasonryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
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
}) => {
  if (projects.length === 0) {
    return (
      <div className="w-full py-12 text-center border border-dashed border-[#545454]/20 my-4">
        <h3 className="text-inter-16">No things found</h3>
        <p className="text-inter-14 text-[#545454]/70 mt-1">
          Try adjusting your search query or filters.
        </p>
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
