import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { getBuilderGradient } from '../types';
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

const getModelColor = (modelName: string) => {
  const lowercaseName = modelName.toLowerCase();
  if (lowercaseName.includes('claude 3.7')) return '#D97757';
  if (lowercaseName.includes('claude 3.5')) return '#D97757';
  if (lowercaseName.includes('gpt-4o')) return '#10B981';
  if (lowercaseName.includes('gemini 2.0')) return '#0284C7';
  if (lowercaseName.includes('deepseek')) return '#3B82F6';
  if (lowercaseName.includes('o3-mini')) return '#10B981';
  return '#999999';
};

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onSelectBuilder?: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

const renderMarkdown = (text: string) => {
  if (!text) return '';
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/^##\s+(.*?)$/gm, '<h4 class="font-semibold text-[#101010] mt-3 mb-1 text-[13px] lowercase">$1</h4>');
  escaped = escaped.replace(/^#\s+(.*?)$/gm, '<h3 class="font-bold text-[#101010] mt-4 mb-2 text-[14px] lowercase">$1</h3>');
  escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-[#0011FF] hover:underline font-medium">$1</a>');
  escaped = escaped.replace(/^\*\s+(.*?)$/gm, '<li class="ml-4 list-disc text-[12px] my-0.5">$1</li>');
  escaped = escaped.replace(/^-\s+(.*?)$/gm, '<li class="ml-4 list-disc text-[12px] my-0.5">$1</li>');
  escaped = escaped.replace(/\n\n/g, '</div><div class="mt-2.5">');
  escaped = escaped.replace(/\n/g, '<br />');
  return `<div class="markdown-body">${escaped}</div>`;
};

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
  onEditProject,
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
  ].filter(Boolean).join('\n\n');

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

                    {/* Edit Project (Only if claimed by active user 'ileri') */}
                    {project.isClaimed && project.claimedBy.some(h => h.toLowerCase() === 'ileri') && onEditProject && (
                      <button
                        onClick={() => onEditProject(project)}
                        className="p-1 text-[#545454] hover:text-[#0011FF] transition-colors cursor-pointer"
                        title="Edit project details"
                      >
                        <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
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
                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  {project.isClaimed ? (
                    project.claimedBy && project.claimedBy.length > 0 ? (
                      project.claimedBy.map((builder) => (
                        <button
                          key={builder}
                          onClick={() => {
                            onClose();
                            if (onSelectBuilder) {
                              onSelectBuilder(builder);
                            }
                          }}
                          className="tool-pill cursor-pointer hover:!bg-[#D9D9D9] transition-colors inline-flex items-center gap-1.5"
                          title={`View @${builder} profile`}
                        >
                          {/* Gradient Avatar Circle */}
                          <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient(builder)} shrink-0`} />
                          <span className="text-mono-10 !text-[#0011FF] font-medium">@{builder}</span>
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          if (onSelectBuilder) {
                            onSelectBuilder('ileri');
                          }
                        }}
                        className="tool-pill cursor-pointer hover:!bg-[#D9D9D9] transition-colors inline-flex items-center gap-1.5"
                        title="View @ileri profile"
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient('ileri')} shrink-0`} />
                        <span className="text-mono-10 !text-[#0011FF] font-medium">@ileri</span>
                      </button>
                    )
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
                  {/* First render AI Tools */}
                  {project.aiTools && project.aiTools.map((toolId) => (
                    <div key={toolId} className="tool-pill">
                      <ToolLogo toolId={toolId} size={11} />
                      <span className="text-mono-10 capitalize">{toolId.replace('-', ' ')}</span>
                    </div>
                  ))}
                  
                  {/* Next render AI Models */}
                  {project.aiModel && project.aiModel.split(',').map(m => m.trim()).filter(Boolean).map((modelName) => (
                    <div key={modelName} className="tool-pill">
                      <div
                        className="w-1.5 h-1.5 shrink-0"
                        style={{ backgroundColor: getModelColor(modelName) }}
                      />
                      <span className="text-mono-10">{modelName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: build notes (Plain Paragraph, NO BG, NO Border, Expandable "see more") */}
              <div className="space-y-1.5">
                <span className="block text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal mb-1.5">
                  build notes
                </span>
                <div className="text-inter-14 text-[#545454] leading-relaxed text-[13px] space-y-1">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: renderMarkdown(isBuildNotesExpanded ? fullNotesText : shortNotesText) 
                    }} 
                  />
                  {fullNotesText.length > 180 && (
                    <button
                      onClick={() => setIsBuildNotesExpanded(!isBuildNotesExpanded)}
                      className="text-[#101010] font-semibold hover:underline cursor-pointer inline-block mt-1"
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
