import React from 'react';
import type { Project } from '../types';
import { getBuilderGradient } from '../types';
import { Bookmark, ArrowUpRight } from './icons';
import { useFavorites } from '../context/FavoritesContext';
import { useClaims } from '../context/ClaimsContext';
import { ModelLogo, ToolLogo } from './ToolLogos';
import { motion } from 'framer-motion';
import { MockupCanvas } from './mockup/MockupCanvas';
import { getCanvasAspect, isDarkBackground } from './mockup/layout';


interface ProjectCardProps {
  project: Project;
  // Width / height of the cover when there's no mockup to size it
  coverAspect?: number;
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
  onSelectBuilder?: (handle: string) => void;
}

export const ProjectCard = React.memo<ProjectCardProps>(function ProjectCard({
  project,
  coverAspect = 450 / 304,
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isClaimPending } = useClaims();
  const [localFavorite, setLocalFavorite] = React.useState(false);
  const favorited = project.id === 'temp-preview-id' ? localFavorite : isFavorite(project.id);

  const firstTool = project.aiTools && project.aiTools.length > 0 ? project.aiTools[0] : null;
  const modelsArray = project.aiModel ? project.aiModel.split(',').map(m => m.trim()).filter(Boolean) : [];
  const firstModel = modelsArray.length > 0 ? modelsArray[0] : null;
  // A mockup keeps the canvas shape it was designed at, so it looks the same at any card width or zoom level
  const coverShot = project.media?.[0];
  const aspect = coverShot ? getCanvasAspect(coverShot.settings, coverShot.width / coverShot.height || 1) : coverAspect;

  // Bookmark sits on the mockup's background: white on dark backgrounds, near-black on light ones,
  // and the usual grey on the plain grey block
  const bookmarkColor = !coverShot
    ? 'text-secondary'
    : isDarkBackground(coverShot.settings.background)
      ? 'text-white drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]'
      : 'text-[#101010]';

  const remainingCount = Math.max(0, (project.aiTools ? project.aiTools.length : 0) - 1) + Math.max(0, modelsArray.length - 1);

  return (
    <div 
      className="w-full flex flex-col gap-2 cursor-pointer group text-secondary"
      onClick={() => onSelectProject(project)}
    >
      {/* Grey Block (#D9D9D9) */}
      <div
        className="w-full bg-[#D9D9D9] relative overflow-hidden p-3 flex flex-col justify-end transition-opacity group-hover:opacity-95"
        style={{ aspectRatio: String(aspect) }}
      >

        {/* Cover: the first shot's mockup, or a plain cover image */}
        {coverShot ? (
          <div className="absolute inset-0">
            <MockupCanvas shot={coverShot} fill playback="hover" />
          </div>
        ) : project.coverImage ? (
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        
        {/* Bookmark Icon Top-Right (Icon Only) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (project.id === 'temp-preview-id') {
              setLocalFavorite(!localFavorite);
            } else {
              toggleFavorite(project.id);
            }
          }}
          className={`absolute z-10 top-2.5 right-2.5 p-1 ${bookmarkColor} hover:opacity-80 transition-transform active:scale-90`}
          title={favorited ? 'Remove Bookmark' : 'Bookmark Thing'}
          aria-label={favorited ? 'Remove bookmark' : 'Bookmark this thing'}
        >
          <Bookmark 
            className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} 
            strokeWidth={1.5}
          />
        </button>

      </div>

      {/* Card Info Footer */}
      <div className="flex flex-col gap-1">
        
        {/* Title Row: Title + (Claimed Avatar OR Unclaimed Badge) + ArrowUpRight Link on Right */}
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-inter-16 truncate max-w-full">
              {project.name ? (
                project.name
              ) : (
                <span className="inline-block relative overflow-hidden bg-[#E9E9E9] h-4 w-32 rounded-none align-middle">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </span>
              )}
            </span>

            {/* If claimed: Avatars stack near title */}
            {project.isClaimed ? (
              project.claimedBy && project.claimedBy.length > 0 ? (
                <div className="flex -space-x-1 items-center shrink-0">
                  {project.claimedBy.length <= 3 ? (
                    project.claimedBy.map((builder, idx) => (
                      <button 
                        key={builder}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectBuilder) {
                            onSelectBuilder(builder);
                          }
                        }}
                        style={{ zIndex: idx + 1 }}
                        className={`w-[16px] h-[16px] rounded-full outline-2 outline-page hover:scale-110 transition-transform cursor-pointer ${getBuilderGradient(builder)}`} 
                        title={`Claimed by @${builder} (Click to view profile)`}
                      />
                    ))
                  ) : (
                    <>
                      {project.claimedBy.slice(0, 2).map((builder, idx) => (
                        <button 
                          key={builder}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectBuilder) {
                              onSelectBuilder(builder);
                            }
                          }}
                          style={{ zIndex: idx + 1 }}
                          className={`w-[16px] h-[16px] rounded-full outline-2 outline-page hover:scale-110 transition-transform cursor-pointer ${getBuilderGradient(builder)}`} 
                          title={`Claimed by @${builder} (Click to view profile)`}
                        />
                      ))}
                      <div
                        style={{ zIndex: 3 }}
                        className="w-[16px] h-[16px] rounded-full outline-2 outline-page bg-[#D9D9D9] flex items-center justify-center text-[7.5px] font-sans font-bold text-secondary select-none shrink-0"
                        title={`${project.claimedBy.length - 2} more builders`}
                      >
                        +{project.claimedBy.length - 2}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden w-[16px] h-[16px] rounded-full bg-[#C2C2C2] shrink-0">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </div>
              )
            ) : isClaimPending(project.id) ? (
              // You've sent a claim; it's being checked
              <span className="badge-unclaimed shrink-0" title="Your claim is being checked">
                claim pending
              </span>
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
              className="text-secondary/70 hover:text-black shrink-0 p-0.5"
              title="Visit site"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Description / One-liner */}
        <p className="text-inter-14 text-subtext line-clamp-2 leading-tight min-h-[14px]">
          {project.tagline ? (
            project.tagline
          ) : (
            <span className="block relative overflow-hidden bg-[#E9E9E9] h-3.5 w-48 rounded-none">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            </span>
          )}
        </p>

        {/* Bottom Row: AI Tool & Model Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {project.id === 'temp-preview-id' && !firstTool && !firstModel ? (
            /* Blank preview card skeleton placeholder with sweep effect */
            <>
              <div className="relative overflow-hidden bg-[#E9E9E9] h-[18px] w-12 rounded-none">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              </div>
              <div className="relative overflow-hidden bg-[#E9E9E9] h-[18px] w-14 rounded-none">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              </div>
            </>
          ) : (
            <>
              {firstTool && (
                <div className="tool-pill">
                  <ToolLogo toolId={firstTool} size={11} />
                  <span className="text-mono-10">{firstTool}</span>
                </div>
              )}
              {firstModel && (
                <div className="tool-pill">
                  <ModelLogo model={firstModel} size={10} />
                  <span className="text-mono-10">{firstModel}</span>
                </div>
              )}
              {remainingCount > 0 && (
                <div className="tool-pill">
                  <span className="text-mono-10 font-bold">+{remainingCount}</span>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
});
