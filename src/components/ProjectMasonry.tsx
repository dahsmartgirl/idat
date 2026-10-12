import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';

interface ProjectMasonryProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
  onSelectBuilder?: (handle: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

// Placeholder cover shapes (width / height), from the old 399/265/503/265/360/304px heights at a 450px column
const COVER_ASPECTS = [450 / 399, 450 / 265, 450 / 503, 450 / 265, 450 / 360, 450 / 304];

// Pinterest-style columns, sized against the screen rather than fixed px: a full-width window at 100%
// browser zoom always fits 3, zooming out (more CSS px of width) adds columns, zooming in removes them.
// screen.width stays constant under browser zoom, so it marks what "100%" looks like on this device.
const BASE_COLUMNS = 3;
const MIN_COLUMN_WIDTH = 300;
const PAGE_GUTTERS = 64;
const COLUMN_GAP = 14;
const ROW_GAP = 20;
const MAX_COLUMNS = 7;

const columnsForWidth = (width: number) => {
  const screenWidth = typeof window !== 'undefined' ? window.screen.width : 1440;
  const baseColumnWidth = (screenWidth - PAGE_GUTTERS + COLUMN_GAP) / BASE_COLUMNS - COLUMN_GAP;
  // Small screens (phones, tablets) are limited by the minimum column width instead
  const columnWidth = Math.max(MIN_COLUMN_WIDTH, baseColumnWidth);
  // Slight upward bias so 67% zoom (4.47 columns) lands on 5
  const fit = Math.round((width + COLUMN_GAP) / (columnWidth + COLUMN_GAP) + 0.05);
  const maxThatFit = Math.floor((width + COLUMN_GAP) / (MIN_COLUMN_WIDTH + COLUMN_GAP));
  return Math.min(MAX_COLUMNS, Math.max(1, Math.min(fit, maxThatFit)));
};

export const ProjectMasonry = React.memo<ProjectMasonryProps>(function ProjectMasonry({
  projects,
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
  searchQuery = '',
  onClearSearch,
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth - 64 : 1200));

  // The grid (and its ref) only exists when there are projects to show
  const isEmpty = projects.length === 0;

  // Recount columns whenever the grid's width changes (window resize, browser zoom, drawers)
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const style = getComputedStyle(el);
      setGridWidth(el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isEmpty]);

  const numCols = columnsForWidth(gridWidth);
  // Deal cards round-robin into columns (keeps left-to-right chronological order). Each column is a
  // plain flex stack, so the browser spaces cards itself: the gap is exactly ROW_GAP whatever the
  // card heights are, with no JS measuring (measured heights went stale on iOS Safari)
  const columns = useMemo(() => {
    const cols: { project: Project; index: number }[][] = Array.from({ length: numCols }, () => []);
    projects.forEach((project, index) => cols[index % numCols].push({ project, index }));
    return cols;
  }, [projects, numCols]);

  // Nothing matches the search or filters: say so, and offer the way out
  if (isEmpty) {
    return (
      <EmptyState
        art="search"
        className="py-16"
        title={searchQuery ? `nothing matches “${searchQuery}”` : 'nothing matches these filters'}
        text={searchQuery ? 'try a different word, or fewer filters.' : 'try removing a filter or two.'}
        actions={
          onClearSearch && (
            <button onClick={onClearSearch} className="btn-main">
              {searchQuery ? 'clear search and filters' : 'clear filters'}
            </button>
          )
        }
      />
    );
  }

  return (
    <div ref={containerRef} className="w-full px-4 sm:px-8 py-2">
      <div className="flex items-start w-full" style={{ gap: COLUMN_GAP }}>
        {columns.map((column, col) => (
          <div key={col} className="flex flex-col flex-1 min-w-0" style={{ gap: ROW_GAP }}>
            {column.map(({ project, index }) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(index, 12) * 0.04 }}
              >
                <ProjectCard
                  project={project}
                  coverAspect={COVER_ASPECTS[index % COVER_ASPECTS.length]}
                  onSelectProject={onSelectProject}
                  onOpenClaim={onOpenClaim}
                  onSelectBuilder={onSelectBuilder}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
