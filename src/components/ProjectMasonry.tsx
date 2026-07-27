import React from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } 
  }
};

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

  // Distribute projects into columns programmatically to preserve left-to-right chronological ordering
  const getColumns = (numCols: number) => {
    const cols: Project[][] = Array.from({ length: numCols }, () => []);
    projects.forEach((project, idx) => {
      cols[idx % numCols].push(project);
    });
    return cols;
  };

  const cols2 = getColumns(2);
  const cols3 = getColumns(3);

  return (
    <div className="w-full px-4 sm:px-8 py-2">
      {/* Mobile Layout: 1 Column (Sequential chronological order) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-5 md:hidden"
      >
        {projects.map((project, index) => (
          <motion.div key={project.id} variants={cardVariants}>
            <ProjectCard
              project={project}
              heightClass={SCALED_HEIGHTS[index % SCALED_HEIGHTS.length]}
              onSelectProject={onSelectProject}
              onOpenClaim={onOpenClaim}
              onSelectBuilder={onSelectBuilder}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Tablet Layout: 2 Columns */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:flex lg:hidden gap-3.5"
      >
        {cols2.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col space-y-5">
            {col.map((project) => {
              const originalIndex = projects.findIndex(p => p.id === project.id);
              return (
                <motion.div key={project.id} variants={cardVariants}>
                  <ProjectCard
                    project={project}
                    heightClass={SCALED_HEIGHTS[originalIndex % SCALED_HEIGHTS.length]}
                    onSelectProject={onSelectProject}
                    onOpenClaim={onOpenClaim}
                    onSelectBuilder={onSelectBuilder}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/* Desktop Layout: 3 Columns */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden lg:flex gap-3.5"
      >
        {cols3.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col space-y-5">
            {col.map((project) => {
              const originalIndex = projects.findIndex(p => p.id === project.id);
              return (
                <motion.div key={project.id} variants={cardVariants}>
                  <ProjectCard
                    project={project}
                    heightClass={SCALED_HEIGHTS[originalIndex % SCALED_HEIGHTS.length]}
                    onSelectProject={onSelectProject}
                    onOpenClaim={onOpenClaim}
                    onSelectBuilder={onSelectBuilder}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
