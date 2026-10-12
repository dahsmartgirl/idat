import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Project } from '../types';
import { getBuilderGradient } from '../types';
import { ModelLogo, ToolLogo } from './ToolLogos';
import { getTool } from '../data/catalog';
import { MockupCanvas } from './mockup/MockupCanvas';
import {
  ArrowUpRight,
  ArrowRight,
  Bookmark,
  GitFork,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Edit,
  X
} from './icons';
import { useFavorites } from '../context/FavoritesContext';
import { useClaims } from '../context/ClaimsContext';
import { SITE_URL, handleFromPath, projectPath } from '../lib/paths';

// Everything shown for a project, shared by the side drawer and the full project page

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

// "Is this your thing? claim" bar shown above unclaimed projects
export const UnclaimedBanner: React.FC<{ project: Project; onOpenClaim: (project: Project) => void }> = ({ project, onOpenClaim }) => {
  const pending = useClaims().isClaimPending(project.id);
  // Claim sent: say it's being checked, nothing to click
  if (pending) {
    return (
      <div className="w-full bg-[#101010] py-2.5 px-6 sm:px-8 flex items-center justify-between rounded-none shrink-0 z-40">
        <span className="font-sans text-[11.5px] font-normal text-white/90 leading-none">Your claim is being checked</span>
        <span className="font-sans text-[11.5px] font-normal text-white/60 leading-none">we’ll email you</span>
      </div>
    );
  }
  return (
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
  );
};

interface ProjectDetailsProps {
  project: Project;
  onSelectBuilder?: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  // Shows the expand button (drawer only)
  onExpand?: () => void;
  // Shows a close button in its place (full page only)
  onCollapse?: () => void;
  // Called before leaving for a builder profile (the drawer closes itself)
  onLeave?: () => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onSelectBuilder,
  onOpenClaim,
  onEditProject,
  onExpand,
  onCollapse,
  onLeave,
}) => {
  const [copied, setCopied] = useState(false);
  const [demoMediaIndex, setDemoMediaIndex] = useState(0);
  const [isBuildNotesExpanded, setIsBuildNotesExpanded] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isClaimPending } = useClaims();
  const favorited = isFavorite(project.id);

  const { pathname } = useLocation();

  // Link under the builder whose profile we're on, so co-builders share their own URL
  const handleShare = () => {
    navigator.clipboard.writeText(`${SITE_URL}${projectPath(project, handleFromPath(pathname))}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(project.youtubeUrl || project.demoUrl);
  // Shots after the cover fill the demo carousel; with no shots and no video the section is hidden
  const extraShots = project.media?.slice(1) ?? [];
  const totalDemoSlides = Math.max(1, extraShots.length);
  const currentSlide = demoMediaIndex % totalDemoSlides;
  const hasDemoShowcase = !!youtubeEmbedUrl || extraShots.length > 0;

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
    <>
    {/* Grouped Top Block: Expand Icon on LEFT, Action Icons on RIGHT, then Title, Description, and Owner Tag */}
    <div className="space-y-1.5">
      
      {/* Top Row: Expand Icon on the LEFT, other icons on the RIGHT */}
      <div className="flex items-center justify-between pb-1">
        
        {/* Left: Expand View Icon (drawer; opens the full project page) or Close (full page; goes back) */}
        {onCollapse ? (
          <button
            onClick={onCollapse}
            className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer -ml-1"
            title="Close full view"
          >
            <X className="w-4 h-4" />
          </button>
        ) : onExpand ? (
          <button
            onClick={onExpand}
            className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer -ml-1"
            title="Expand view"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        ) : (
          <span />
        )}

        {/* Right: Bookmark, Copy Link, Remix, Live Link */}
        <div className="flex items-center gap-1">
          {/* Bookmark */}
          <button
            onClick={() => toggleFavorite(project.id)}
            className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer"
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current text-[#101010]' : ''}`} />
          </button>

          {/* Copy Link */}
          <button
            onClick={handleShare}
            className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer"
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
              className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer"
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
              className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer"
              title="Visit live link"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}

          {/* Edit Project (Only if claimed by active user 'ileri') */}
          {project.isClaimed && project.claimedBy.some(h => h.toLowerCase() === 'ileri') && onEditProject && (
            <button
              onClick={() => onEditProject(project)}
              className="p-1 text-secondary hover:text-[#101010] transition-colors cursor-pointer"
              title="Edit project details"
            >
              <Edit className="w-4 h-4" />
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
        <p className="text-inter-14 text-subtext text-[13px] leading-snug">
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
                  onLeave?.();
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
                onLeave?.();
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
        ) : isClaimPending(project.id) ? (
          <span className="tool-pill inline-flex items-center gap-1" title="Your claim is being checked">
            <span className="text-mono-10 !text-secondary">claim pending</span>
          </span>
        ) : (
          <button
            onClick={() => onOpenClaim(project)}
            className="tool-pill cursor-pointer hover:!bg-[#D9D9D9] transition-colors inline-flex items-center gap-1"
            title="Claim this project"
          >
            <span className="text-mono-10 !text-secondary">unclaimed</span>
          </button>
        )}
      </div>

    </div>

    {/* Main Screenshot: the cover mockup (nothing shown when there's no media) */}
    {project.media?.[0] && (
      <div className="w-full shadow-xs">
        <MockupCanvas shot={project.media[0]} />
      </div>
    )}

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
            <span className="text-mono-10">{getTool(toolId)?.name ?? toolId}</span>
          </div>
        ))}
        
        {/* Next render AI Models */}
        {project.aiModel && project.aiModel.split(',').map(m => m.trim()).filter(Boolean).map((modelName) => (
          <div key={modelName} className="tool-pill">
            <ModelLogo model={modelName} size={11} />
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
      <div className="text-inter-14 text-subtext leading-relaxed text-[13px] space-y-1">
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

    {/* Section 3: demo showcase / video (only when there's a video or extra shots to show) */}
    {hasDemoShowcase && (
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
          <MockupCanvas shot={extraShots[currentSlide]} fill />

          {totalDemoSlides > 1 && (
          <>
          {/* Carousel Left/Right Navigation */}
          <button
            onClick={prevDemoMedia}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-[#101010] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer rounded-none"
            title="Previous slide"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextDemoMedia}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 text-[#101010] flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer rounded-none"
            title="Next slide"
            aria-label="Next slide"
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
                  idx === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          </>
          )}
        </div>
      )}
    </div>
    )}
    </>
  );
};
