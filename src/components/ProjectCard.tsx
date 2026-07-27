import React from 'react';
import type { Project } from '../types';
import { getBuilderGradient } from '../types';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { ToolLogo } from './ToolLogos';

interface ProjectCardProps {
  project: Project;
  heightClass?: string;
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
  onSelectBuilder?: (handle: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  heightClass = 'h-[304px]',
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(project.id);

  return (
    <div 
      className="w-full flex flex-col gap-2 cursor-pointer group text-[#545454]"
      onClick={() => onSelectProject(project)}
    >
      {/* Grey Block (#D9D9D9) */}
      <div className={`w-full ${heightClass} bg-[#D9D9D9] relative p-3 flex flex-col justify-end transition-opacity group-hover:opacity-95`}>
        
        {/* Bookmark Icon Top-Right (Icon Only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(project.id);
          }}
          className="absolute top-2.5 right-2.5 p-1 text-[#545454] hover:opacity-80 transition-transform active:scale-90"
          title={favorited ? 'Remove Bookmark' : 'Bookmark Thing'}
        >
          <Bookmark 
            className={`w-4 h-4 ${favorited ? 'fill-[#545454]' : ''}`} 
            strokeWidth={1.5}
          />
        </button>

      </div>

      {/* Card Info Footer */}
      <div className="flex flex-col gap-1">
        
        {/* Title Row: Title + (Claimed Avatar OR Unclaimed Badge) + ArrowUpRight Link on Right */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-inter-16 truncate">
              {project.name}
            </span>

            {/* If claimed: Avatar near title opens Builder Profile Page */}
            {project.isClaimed ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBuilder) {
                    onSelectBuilder(project.claimedBy[0] || 'ileri');
                  }
                }}
                className={`w-[16px] h-[16px] rounded-full outline-[1.2px] outline-[#F2F1F3] shrink-0 hover:scale-110 transition-transform cursor-pointer ${getBuilderGradient(project.claimedBy[0])}`} 
                title={`Claimed by @${project.claimedBy[0] || 'ileri'} (Click to view profile)`}
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenClaim(project);
                }}
                className="badge-unclaimed shrink-0 hover:bg-[#D9D9D9] transition-colors"
                title="Click to claim"
              >
                unclaimed
              </button>
            )}
          </div>

          {/* External Link on Right with ArrowUpRight Icon */}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#545454]/70 hover:text-black shrink-0 p-0.5"
              title="Visit site"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Description / One-liner */}
        <p className="text-inter-14 line-clamp-2 leading-tight">
          {project.tagline}
        </p>

        {/* Bottom Row: AI Tool Pills with Official Vector Logos */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {project.aiTools && project.aiTools.length > 0 ? (
            project.aiTools.slice(0, 3).map((tool) => (
              <div key={tool} className="tool-pill">
                <ToolLogo toolId={tool} size={11} />
                <span className="text-mono-10">{tool}</span>
              </div>
            ))
          ) : (
            <>
              <div className="tool-pill">
                <ToolLogo toolId="claude-code" size={11} />
                <span className="text-mono-10">Claude code</span>
              </div>
              <div className="tool-pill">
                <ToolLogo toolId="cursor" size={11} />
                <span className="text-mono-10">Cursor</span>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
