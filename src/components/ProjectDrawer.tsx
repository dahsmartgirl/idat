import React, { useState } from 'react';
import type { Project } from '../types';
import { ToolLogo } from './ToolLogos';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  GitCommit, 
  Layers, 
  Share2, 
  Check 
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onSelectBuilder: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
}

export const ProjectDrawer: React.FC<ProjectDrawerProps> = ({
  project,
  onClose,
  onOpenClaim,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'timeline'>('overview');
  const [copied, setCopied] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!project) return null;

  const favorited = isFavorite(project.id);

  const handleShare = () => {
    navigator.clipboard.writeText(`https://idat.xyz/p/${project.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl h-full bg-[#F2F1F3] text-[#545454] shadow-2xl flex flex-col border-l border-black/10 z-10">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-black/10 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-unclaimed">
                {project.category}
              </span>
              {!project.isClaimed && (
                <button
                  onClick={() => onOpenClaim(project)}
                  className="text-mono-10 font-bold text-[#545454] hover:underline"
                >
                  unclaimed (claim)
                </button>
              )}
            </div>
            <h2 className="text-inter-20 font-bold mt-1">
              {project.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(project.id)}
              className={`p-2 rounded-full border border-black/10 transition-colors ${
                favorited ? 'bg-[#545454] text-white' : 'hover:bg-black/5'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-black/10 hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-black/10 px-6 gap-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-[#545454] text-[#545454]'
                : 'border-transparent text-[#545454]/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-[#545454] text-[#545454]'
                : 'border-transparent text-[#545454]/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Build Notes
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-[#545454] text-[#545454]'
                : 'border-transparent text-[#545454]/60'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Timeline
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Media Block (#D9D9D9 grey placeholder block as requested) */}
              <div className="w-full aspect-video bg-[#D9D9D9]" />

              <div>
                <p className="text-inter-16 font-medium">
                  {project.tagline}
                </p>
                <p className="text-inter-14 mt-2">
                  {project.description}
                </p>
              </div>

              {/* Primary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-action"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Live Demo
                  </a>
                )}
              </div>

              {/* AI Tools Used */}
              <div className="p-4 bg-[#E9E9E9] space-y-3">
                <h4 className="text-mono-10 uppercase">
                  AI Tools Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.aiTools.map((toolId) => (
                    <div key={toolId} className="tool-pill">
                      <ToolLogo toolId={toolId} size={14} />
                      <span className="capitalize">{toolId.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUILD NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#E9E9E9]">
                <h4 className="text-mono-10 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Why I Built It
                </h4>
                <p className="text-inter-14 mt-2">
                  {project.buildNotes.whyBuilt}
                </p>
              </div>

              <div className="p-4 bg-[#E9E9E9]">
                <h4 className="text-mono-10 uppercase font-bold">
                  AI Role & Prompts Used
                </h4>
                <p className="text-inter-14 mt-2">
                  {project.buildNotes.aiRoleAndPrompts}
                </p>
              </div>

              <div className="p-4 bg-[#E9E9E9]">
                <h4 className="text-mono-10 uppercase font-bold">
                  What Went Wrong & Failures
                </h4>
                <p className="text-inter-14 mt-2">
                  {project.buildNotes.challengesAndFailures}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="relative pl-6 border-l border-[#545454]/20 space-y-6">
                {project.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-[#545454]" />
                    <div className="text-mono-10">{item.date}</div>
                    <h4 className="text-inter-16 font-bold mt-0.5">{item.title}</h4>
                    {item.description && (
                      <p className="text-inter-14 mt-1">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-black/10 text-center text-mono-10">
          idat.xyz — i did a thing
        </div>
      </div>
    </div>
  );
};
