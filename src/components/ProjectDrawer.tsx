import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { X } from './icons';
import { ProjectDetails, UnclaimedBanner } from './ProjectDetails';

// Matches the full project page's column (ProjectPage)
const PAGE_COLUMN_WIDTH = 860;
// Smooth ease-out (quint): quick to respond, long gentle settle
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onSelectBuilder?: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  // Opens the project as a full page (called once the expand motion has finished)
  onExpand?: (project: Project) => void;
  // Called as the expand motion starts, so the page behind can slide back into place under the header
  onExpandStart?: () => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  project,
  onClose,
  onSelectBuilder,
  onOpenClaim,
  onEditProject,
  onExpand,
  onExpandStart,
}) => {
  // Lock page scroll while the drawer is open. Locked on <html> so its reserved scrollbar gutter stays and the
  // page width doesn't change (the expand motion lines up with the page using that width)
  useEffect(() => {
    if (project) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [project]);

  // Expand, animated only with transform / opacity / blur so it stays on the GPU (no per-frame layout):
  // the drawer's background scales out to fill the area under the header, the drawer's content dissolves,
  // and the project, laid out once at its final place, comes into focus. Then the real page swaps in underneath
  // while nothing is moving
  const panelRef = useRef<HTMLDivElement>(null);
  const [expandState, setExpandState] = useState<{
    id: string;
    startScale: number; // drawer width / full width, for the background's starting scaleX
    panelLeft: number;
    pageWidth: number;
    columnX: number;
    top: number;
  } | null>(null);
  // Only counts for the project it was started on, so a newly opened drawer never starts expanded
  const expand = project && expandState?.id === project.id ? expandState : null;

  // Forget it once the drawer is gone (the exiting drawer already rendered with it, so its fade still runs)
  const projectId = project?.id;
  useEffect(() => {
    if (!projectId) setExpandState(null);
  }, [projectId]);

  const startExpand = () => {
    if (!panelRef.current || !project || expand) return;
    // The page sits under the header and is centered in the page's content width (measured on <main>: the
    // viewport minus the reserved scrollbar gutter)
    const pageWidth = document.querySelector('main')?.clientWidth ?? document.documentElement.clientWidth;
    const columnWidth = Math.min(PAGE_COLUMN_WIDTH, pageWidth);
    const panel = panelRef.current.getBoundingClientRect();
    const fullWidth = panelRef.current.parentElement?.clientWidth ?? window.innerWidth;
    const top = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
    setExpandState({
      id: project.id,
      startScale: panel.width / fullWidth,
      panelLeft: panel.left,
      pageWidth,
      columnX: (pageWidth - columnWidth) / 2,
      top,
    });
    onExpandStart?.();
  };

  return (
    <AnimatePresence>
      {project && (
        // Closing is instant, as before; after expanding, the page has swapped in pixel-identical underneath
        <motion.div
          key="project-drawer"
          className={`fixed inset-0 z-50 overflow-hidden flex justify-end ${expand ? 'pointer-events-none' : ''}`}
        >
          
          {/* Backdrop Blur matching FilterDrawer */}
          {/* Fades away while expanding, uncovering the header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: expand ? 0 : 1 }}
            transition={{ duration: expand ? 0.45 : 0.25, ease: [0.25, 1, 0.5, 1] }}
            onClick={expand ? undefined : onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[4px]"
          />

          {expand && (
            <>
              {/* The drawer's background growing to fill the area under the header (scaled: plain colour, so
                  it looks like a resize but costs nothing) */}
              <motion.div
                initial={{ scaleX: expand.startScale, y: 0 }}
                animate={{ scaleX: 1, y: expand.top }}
                transition={{ duration: 0.6, ease: EXPAND_EASE }}
                style={{ originX: 1, originY: 0, willChange: 'transform' }}
                className="absolute inset-0 bg-page"
              />

              {/* The project in its final layout (same structure as ProjectPage), coming into focus */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(12px)', x: (expand.panelLeft - expand.columnX) * 0.2 }}
                animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
                transition={{ duration: 0.65, delay: 0.12, ease: EXPAND_EASE }}
                onAnimationComplete={() => onExpand?.(project)}
                style={{ top: expand.top, width: expand.pageWidth, willChange: 'transform, opacity, filter' }}
                className="absolute left-0"
              >
                {!project.isClaimed && <UnclaimedBanner project={project} onOpenClaim={onOpenClaim} />}
                <div className="w-full max-w-[860px] mx-auto p-6 sm:p-8 space-y-5">
                  <ProjectDetails
                    project={project}
                    onSelectBuilder={onSelectBuilder}
                    onOpenClaim={onOpenClaim}
                    onEditProject={onEditProject}
                    onCollapse={() => {}}
                  />
                </div>
              </motion.div>
            </>
          )}

          {/* Side Drawer Body (540px desktop, zero rounded corners on media, zero footer).
              When expanding, it dissolves (fades and blurs out, drifting toward the page) without changing size */}
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={
              expand
                ? { x: (expand.columnX - expand.panelLeft) * 0.3, y: expand.top * 0.5, opacity: 0, filter: 'blur(8px)' }
                : { x: 0 }
            }
            transition={expand ? { duration: 0.4, ease: EXPAND_EASE } : { duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            style={expand ? { willChange: 'transform, opacity, filter' } : undefined}
            drag={expand ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80 || info.velocity.x > 400) {
                onClose();
              }
            }}
            className="relative h-full bg-page flex flex-col z-50 overflow-visible touch-pan-y w-[calc(100vw-64px)] sm:w-[540px] max-w-[540px] shadow-2xl"
          >
            
            {/* Big Solid White Floating X Pill Button matching FilterDrawer 1:1 */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={expand ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.12 }}
              onClick={onClose}
              className="absolute -left-13 top-5 sm:-left-16 sm:top-6 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#101010] rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-[#E9E9E9] z-50"
              title="Close project view"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </motion.button>

            {!project.isClaimed && <UnclaimedBanner project={project} onOpenClaim={onOpenClaim} />}

            {/* Single Scrollable Content Body (Only drawer content scrolls below sticky banner) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">

              <ProjectDetails
                key={project.id}
                project={project}
                onSelectBuilder={onSelectBuilder}
                onOpenClaim={onOpenClaim}
                onEditProject={onEditProject}
                onExpand={onExpand ? startExpand : undefined}
                onLeave={onClose}
              />

            </div>

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
