import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { ToolLogo } from './ToolLogos';
import { 
  X, 
  ArrowUpRight, 
  ArrowRight,
  Bookmark, 
  GitFork, 
  Copy, 
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onSelectBuilder?: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
}

// Helper to extract clean YouTube embed URL
const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube-nocookie.com/embed/${match[2]}` : null;
};

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  project,
  onClose,
  onSelectBuilder,
  onOpenClaim,
}) => {
  const [copied, setCopied] = useState(false);
  const [demoMediaIndex, setDemoMediaIndex] = useState(0);
  const [isBuildNotesExpanded, setIsBuildNotesExpanded] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = project ? isFavorite(project.id) : false;

  // Lock body scroll when drawer is open to hide main site scrollbar
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  const handleShare = () => {
    if (!project) return;
    navigator.clipboard.writeText(`https://idat.xyz/p/${project.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!project) return null;

  const youtubeEmbedUrl = getYouTubeEmbedUrl(project.youtubeUrl || project.demoUrl);
  const builderHandle = project.claimedBy[0] || 'ileri';
  const totalDemoSlides = 3;

  const nextDemoMedia = () => {
    setDemoMediaIndex((prev) => (prev + 1) % totalDemoSlides);
  };

  const prevDemoMedia = () => {
    setDemoMediaIndex((prev) => (prev - 1 + totalDemoSlides) % totalDemoSlides);
  };

  // Build notes combined plain text
  const fullNotesText = [
    project.buildNotes?.whyBuilt,
    project.buildNotes?.aiRoleAndPrompts,
    project.buildNotes?.challengesAndFailures,
  ].filter(Boolean).join(' ');

  const shortNotesText = fullNotesText.length > 180 
    ? fullNotesText.slice(0, 180) + '...' 
    : fullNotesText;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop Blur matching FilterDrawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[4px]"
          />

          {/* Side Drawer Body (540px desktop, zero rounded corners on media, zero footer) */}
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
            className="relative w-[calc(100vw-64px)] sm:w-[540px] max-w-[540px] h-full bg-[#F2F1F3] shadow-2xl flex flex-col z-50 overflow-visible touch-pan-y"
          >
            
            {/* Big Solid White Floating X Pill Button matching FilterDrawer 1:1 */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.12 }}
              onClick={onClose}
              className="absolute -left-13 top-5 sm:-left-16 sm:top-6 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#101010] rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-[#E9E9E9] z-50"
              title="Close project view"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </motion.button>

            {/* 1. Full Drawer Width Sticky Unclaimed Banner (Lighter font-normal typography) */}
            {!project.isClaimed && (
              <div 
                onClick={() => onOpenClaim(project)}
                className="w-full bg-[#101010] py-2.5 px-6 sm:px-8 flex items-center justify-between cursor-pointer rounded-none group shrink-0 z-40"
              >
                <span className="font-sans text-[11.5px] font-normal text-white/90 leading-none">
                  Is this your thing?
                </span>
                <div className="flex items-center gap-1 font-sans text-[11.5px] font-normal text-white/90 leading-none">
                  <span className="leading-none">claim</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white/90 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            )}

            {/* Single Scrollable Content Body (Only drawer content scrolls below sticky banner) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">

              {/* Grouped Top Block: Expand Icon on LEFT, Action Icons on RIGHT, then Title, Description, and Owner Tag */}
              <div className="space-y-1.5">
                
                {/* Top Row: Expand Icon on the LEFT, other icons on the RIGHT */}
                <div className="flex items-center justify-between pb-1">
                  
                  {/* Left: Expand View Icon */}
                  <button
                    className="p-1 text-[#545454] hover:text-[#101010] transition-colors cursor-pointer -ml-1"
                    title="Expand view"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Right: Bookmark, Copy Link, Remix, Live Link */}
                  <div className="flex items-center gap-1">
                    {/* Bookmark */}
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      className="p-1 text-[#545454] hover:text-[#101010] transition-colors cursor-pointer"
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current text-[#101010]' : ''}`} />
                    </button>

                    {/* Copy Link */}
                    <button
                      onClick={handleShare}
                      className="p-1 text-[#545454] hover:text-[#101010] transition-colors cursor-pointer"
                      title="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Remix (Source code/Fork link) */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#545454] hover:text-[#101010] transition-colors cursor-pointer"
                        title="Remix / Source Code"
                      >
                        <GitFork className="w-4 h-4" />
                      </a>
                    )}

                    {/* Live Link */}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#545454] hover:text-[#101010] transition-colors cursor-pointer"
                        title="Visit live link"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-inter-16 font-semibold text-[#101010] text-[18px] sm:text-[20px] leading-tight">
                  {project.name}
                </h1>

                {/* Description / Tagline */}
                {project.tagline && (
                  <p className="text-inter-14 text-[#545454] text-[13px] leading-snug">
                    {project.tagline}
                  </p>
                )}

                {/* Owner Tag (Pill style: 'unclaimed' when project is not claimed) */}
                <div className="pt-1">
                  {project.isClaimed ? (
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectBuilder) {
                          onSelectBuilder(builderHandle);
                        }
                      }}
                      className="tool-pill cursor-pointer hover:!bg-[#D9D9D9] transition-colors inline-flex items-center gap-1.5"
                      title={`View @${builderHandle} profile`}
                    >
                      {/* Gradient Avatar Circle */}
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#101010] via-[#2A2A2A] to-[#545454] shrink-0" />
                      <span className="text-mono-10 !text-[#0011FF] font-medium">@{builderHandle}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenClaim(project)}
                      className="tool-pill cursor-pointer hover:!bg-[#D9D9D9] transition-colors inline-flex items-center gap-1"
                      title="Claim this project"
                    >
                      <span className="text-mono-10 !text-[#545454]">unclaimed</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Main Screenshot: Blank Grey Square Block (Fully Squared: aspect-square rounded-none) */}
              <div className="w-full aspect-square bg-[#D9D9D9] rounded-none shadow-xs" />

              {/* Section 1: stack */}
              <div className="space-y-1.5">
                <span className="block text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal mb-1.5">
                  stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.aiTools.map((toolId) => (
                    <div key={toolId} className="tool-pill">
                      <ToolLogo toolId={toolId} size={11} />
                      <span className="text-mono-10 capitalize">{toolId.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: build notes (Plain Paragraph, NO BG, NO Border, Expandable "see more") */}
              <div className="space-y-1.5">
                <span className="block text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal mb-1.5">
                  build notes
                </span>
                <div className="text-inter-14 text-[#545454] leading-relaxed text-[13px]">
                  <span>
                    {isBuildNotesExpanded ? fullNotesText : shortNotesText}
                  </span>
                  {fullNotesText.length > 180 && (
                    <button
                      onClick={() => setIsBuildNotesExpanded(!isBuildNotesExpanded)}
                      className="ml-1 text-[#101010] font-medium hover:underline cursor-pointer inline-block"
                    >
                      {isBuildNotesExpanded ? 'see less' : 'see more'}
                    </button>
                  )}
                </div>
              </div>

              {/* Section 3: demo showcase / video (Fully Squared aspect-square rounded-none + Carousel 3 Dots & Arrows) */}
              <div className="space-y-1.5 pb-4">
                <span className="block text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal mb-1.5">
                  demo showcase
                </span>
                
                {youtubeEmbedUrl ? (
                  <div className="w-full aspect-square rounded-none overflow-hidden bg-black shadow-xs">
                    <iframe
                      className="w-full h-full border-0"
                      src={youtubeEmbedUrl}
                      title={`${project.name} Video Demo`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-square bg-[#D9D9D9] rounded-none overflow-hidden group shadow-xs">
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#C2C2C2]/50 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#545454]" />
                      </div>
                      <span className="text-mono-10 text-[#545454]">
                        demo slide {demoMediaIndex + 1} of {totalDemoSlides}
                      </span>
                    </div>

                    {/* Carousel Left/Right Navigation */}
                    <button
                      onClick={prevDemoMedia}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-[#101010] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer rounded-none"
                      title="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={nextDemoMedia}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-[#101010] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer rounded-none"
                      title="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* 3 Pagination Dots */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-2 py-1 backdrop-blur-xs">
                      {Array.from({ length: totalDemoSlides }).map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => setDemoMediaIndex(idx)}
                          className={`w-1.5 h-1.5 transition-colors cursor-pointer ${
                            idx === demoMediaIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
