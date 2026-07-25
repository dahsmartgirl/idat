import React from 'react';
import type { Builder, Project } from '../types';
import { X, Globe } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface BuilderProfileModalProps {
  builder: Builder | null;
  builderProjects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
}

export const BuilderProfileModal: React.FC<BuilderProfileModalProps> = ({
  builder,
  builderProjects,
  onClose,
  onSelectProject,
  onOpenClaim,
}) => {
  if (!builder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#F2F1F3] border border-black/10 rounded-none shadow-2xl text-[#545454]">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-black/10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D9D9D9] flex items-center justify-center text-mono-20 font-bold">
              {builder.displayName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-inter-20 font-bold">{builder.displayName}</h2>
                <span className="text-mono-10 font-medium">@{builder.username}</span>
              </div>
              <p className="text-mono-10 mt-0.5">{builder.role}</p>

              <div className="badge-unclaimed mt-2">
                Founding Builder #{builder.foundingNumber}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-black/10 hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bio & Links */}
        <div className="p-6 border-b border-black/10 space-y-4">
          <p className="text-inter-14 leading-relaxed max-w-2xl">
            {builder.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-mono-10">
            {builder.websiteUrl && (
              <a href={builder.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>
        </div>

        {/* Portfolio Projects Section */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <h3 className="text-mono-10 uppercase font-bold">
            Archived Things by @{builder.username} ({builderProjects.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {builderProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelectProject={(p) => {
                  onClose();
                  onSelectProject(p);
                }}
                onOpenClaim={onOpenClaim}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
