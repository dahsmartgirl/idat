import React from 'react';
import type { Project } from '../types';
import { Bookmark, ArrowUpRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface ProjectCardProps {
  project: Project;
  heightClass?: string;
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
}

// Curated vibrant gradients for claimed builder avatars
const AVATAR_GRADIENTS = [
  'bg-gradient-to-br from-[#101010] to-[#434343]',
  'bg-gradient-to-br from-[#D97757] to-[#F8A170]',
  'bg-gradient-to-br from-[#2563EB] to-[#60A5FA]',
  'bg-gradient-to-br from-[#059669] to-[#34D399]',
  'bg-gradient-to-br from-[#7C3AED] to-[#C084FC]',
  'bg-gradient-to-br from-[#E11D48] to-[#FB7185]',
];

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  heightClass = 'h-[304px]',
  onSelectProject,
  onOpenClaim,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(project.id);

  // Hash project id to pick gradient for claimed avatar
  const charSum = project.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const claimedAvatarGrad = AVATAR_GRADIENTS[charSum % AVATAR_GRADIENTS.length];

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

            {/* If claimed: Avatar near title. If unclaimed: badge near title */}
            {project.isClaimed ? (
              <div 
                className={`w-[16px] h-[16px] rounded-full outline-[1.2px] outline-[#F2F1F3] shrink-0 ${claimedAvatarGrad}`} 
                title={`Claimed by @${project.claimedBy[0] || 'ileri'}`}
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

        {/* Bottom Row: Tool Pills Only (Removed bottom-right overlapping avatars) */}
        <div className="flex items-center gap-2 mt-1">
          <div className="tool-pill">
            <div className="w-2.5 h-2.5 bg-[#D97757]" />
            <span className="text-mono-10">Claude code</span>
          </div>

          <div className="tool-pill">
            <div className="w-1 h-1 bg-[#D97757] rounded-full" />
            <span className="text-mono-10">Fable 5</span>
          </div>
        </div>

      </div>

    </div>
  );
};
