import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { getCanvasAspect } from './mockup/layout';
import { SearchX, RotateCcw } from './icons';

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
// Rough height of a card's title/tagline/pills footer, used until the real height is measured
const FOOTER_ESTIMATE = 76;
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

const coverAspectFor = (project: Project, index: number) => {
  const shot = project.media?.[0];
  return shot ? getCanvasAspect(shot.settings, shot.width / shot.height || 1) : COVER_ASPECTS[index % COVER_ASPECTS.length];
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
  const [heights, setHeights] = useState<Record<string, number>>({});

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

  // One observer measures every card, so heights stay right as widths change (resize, zoom, text wrap)
  const cardObserver = useRef<ResizeObserver | null>(null);
  const refCallbacks = useRef(new Map<string, (el: HTMLDivElement | null) => void>());

  useLayoutEffect(() => {
    cardObserver.current = new ResizeObserver((entries) => {
      setHeights((prev) => {
        let next = prev;
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.id!;
          const h = Math.round(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height);
          if (prev[id] !== h) next = next === prev ? { ...prev, [id]: h } : Object.assign(next, { [id]: h });
        }
        return next;
      });
    });
    return () => cardObserver.current?.disconnect();
  }, []);

  // Stable ref callback per card, so React doesn't detach/reattach the observer on every render
  const measureRef = useCallback((id: string) => {
    let cb = refCallbacks.current.get(id);
    if (!cb) {
      let current: HTMLDivElement | null = null;
      cb = (el) => {
        if (current) cardObserver.current?.unobserve(current);
        current = el;
        if (el) cardObserver.current?.observe(el);
      };
      refCallbacks.current.set(id, cb);
    }
    return cb;
  }, []);

  const numCols = columnsForWidth(gridWidth);
  const columnWidth = (gridWidth - COLUMN_GAP * (numCols - 1)) / numCols;

  // Place cards round-robin (keeps left-to-right chronological order) under the previous card in their column
  const layout = useMemo(() => {
    const columnHeights = new Array(numCols).fill(0);
    const positions = projects.map((project, index) => {
      const col = index % numCols;
      const height = heights[project.id] ?? columnWidth / coverAspectFor(project, index) + FOOTER_ESTIMATE;
      const position = { x: col * (columnWidth + COLUMN_GAP), y: columnHeights[col] };
      columnHeights[col] += height + ROW_GAP;
      return position;
    });
    return { positions, height: Math.max(0, ...columnHeights) - ROW_GAP };
  }, [projects, heights, numCols, columnWidth]);

  // Ultra-Clean & Minimalist Search Empty State
  if (isEmpty) {
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
          <p className="text-inter-14 text-secondary/70 max-w-xs leading-relaxed">
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

  // Cards live in one flat list and are only repositioned when columns change, never remounted
  return (
    <div ref={containerRef} className="w-full px-4 sm:px-8 py-2">
      <div className="relative w-full" style={{ height: layout.height }}>
        {projects.map((project, index) => {
          const { x, y } = layout.positions[index];
          return (
            <div
              key={project.id}
              ref={measureRef(project.id)}
              data-id={project.id}
              className="absolute top-0 left-0"
              style={{ width: columnWidth, transform: `translate(${x}px, ${y}px)` }}
            >
              <motion.div
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
            </div>
          );
        })}
      </div>
    </div>
  );
});
