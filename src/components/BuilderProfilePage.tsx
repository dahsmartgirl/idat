import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Project, FilterState } from '../types';
import { MOCK_BUILDERS, MOCK_PROJECTS } from '../data/mockData';
import { SlidersHorizontal } from 'lucide-react';
import { ProjectMasonry } from './ProjectMasonry';
import { FilterDrawer } from './FilterDrawer';
import { ToolLogo } from './ToolLogos';

interface BuilderProfilePageProps {
  onSelectProject: (project: Project) => void;
  onOpenClaim: (project: Project) => void;
  onSelectBuilder: (handle: string) => void;
  searchQuery?: string;
  activeProject?: Project | null;
}

const SCRAMBLE_CHARS = '0123456789!@#$%^&*~?:;';

// Component for scramble character animation resolving to number
const ScrambleNumber: React.FC<{ value: number; color?: string }> = ({ value, color = '#0011FF' }) => {
  const [displayText, setDisplayText] = useState(value.toString());

  useEffect(() => {
    const targetStr = value.toString();
    
    const runScramble = () => {
      let iteration = 0;
      const maxIterations = 14;
      
      const timer = setInterval(() => {
        iteration++;
        if (iteration >= maxIterations) {
          setDisplayText(targetStr);
          clearInterval(timer);
        } else {
          const scrambled = targetStr
            .split('')
            .map(() => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)])
            .join('');
          setDisplayText(scrambled);
        }
      }, 45);
    };

    runScramble();
    const periodicTimer = setInterval(runScramble, 6500);

    return () => {
      clearInterval(periodicTimer);
    };
  }, [value]);

  return (
    <span className="inline-block font-mono font-normal tracking-normal" style={{ color }}>
      {displayText}
    </span>
  );
};

export const BuilderProfilePage: React.FC<BuilderProfilePageProps> = ({
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
  searchQuery = '',
  activeProject = null,
}) => {
  const { username } = useParams<{ username: string }>();
  const cleanHandle = (username || 'ileri').replace('@', '').toLowerCase();

  const [filters, setFilters] = useState<FilterState>({
    aiTools: [],
    categories: [],
    aiModels: [],
    status: 'all',
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const builder = MOCK_BUILDERS[cleanHandle] || {
    id: `b-${cleanHandle}`,
    username: cleanHandle,
    displayName: cleanHandle,
    role: 'Product Designer & AI Builder',
    bio: 'Building experimental software with Claude Code & Cursor. Passionate about natural language developer interfaces.',
    isFoundingBuilder: true,
    foundingNumber: 42,
    joinedDate: 'July 2026',
    topTools: ['claude-code', 'cursor'],
    websiteUrl: `https://${cleanHandle}.dev`,
  };

  // Raw builder projects (falls back to showcase projects so direct URL visits always render smoothly!)
  const allBuilderProjects = useMemo(() => {
    const found = MOCK_PROJECTS.filter((p) =>
      p.claimedBy.some((handle) => handle.toLowerCase() === cleanHandle)
    );
    if (found.length > 0) return found;
    return MOCK_PROJECTS.slice(0, 3);
  }, [cleanHandle]);

  // Extract builder-specific filter options
  const availableTools = useMemo(() => {
    return Array.from(new Set(allBuilderProjects.flatMap((p) => p.aiTools || [])));
  }, [allBuilderProjects]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(allBuilderProjects.map((p) => p.category)));
  }, [allBuilderProjects]);

  const availableModels = useMemo(() => {
    return Array.from(
      new Set(allBuilderProjects.map((p) => p.aiModel).filter(Boolean) as string[])
    );
  }, [allBuilderProjects]);

  // Filtered builder projects
  const filteredBuilderProjects = useMemo(() => {
    return allBuilderProjects.filter((project) => {
      // 1. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = project.name.toLowerCase().includes(query);
        const matchesTagline = project.tagline.toLowerCase().includes(query);
        const matchesTools = project.aiTools.some((t) => t.toLowerCase().includes(query));
        const matchesTags = project.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesTagline && !matchesTools && !matchesTags) {
          return false;
        }
      }

      // 2. AI Tools Filter
      if (filters.aiTools.length > 0) {
        const hasTool = filters.aiTools.some(
          (toolId) =>
            project.primaryTool === toolId || project.aiTools.includes(toolId)
        );
        if (!hasTool) return false;
      }

      // 3. Categories Filter
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(project.category)) {
          return false;
        }
      }

      // 4. AI Models Filter
      if (filters.aiModels.length > 0) {
        if (!project.aiModel || !filters.aiModels.includes(project.aiModel)) {
          return false;
        }
      }

      return true;
    });
  }, [allBuilderProjects, searchQuery, filters]);

  const activeFilterCount =
    filters.aiTools.length +
    filters.categories.length +
    filters.aiModels.length;

  const profilePushX = activeProject ? -540 : (isFilterDrawerOpen ? -370 : 0);

  return (
    <div className="w-full relative">
      
      {/* Sliding Content Container (Pushed out to the left when Filter Side Drawer or Project Drawer is Open) */}
      <motion.div
        animate={{
          x: profilePushX,
        }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="w-full flex flex-col space-y-6"
      >
        
        {/* Top Profile Header Block */}
        <div className="w-full px-4 sm:px-8 pt-6 sm:pt-10 space-y-4">
          
          {/* Row 1: Pure Gradient Avatar + User Info Column */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            
            {/* Pure Gradient Avatar Circle */}
            <div className="w-20 h-20 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#101010] via-[#2A2A2A] to-[#545454] shrink-0 shadow-sm border border-[#E0E0E0]/50" />

            {/* User Info Column */}
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              
              {/* @username: Blue shade #0011FF + Micro Founding Badge SVG */}
              <div className="flex items-center gap-1 flex-wrap min-w-0">
                <h1 className="font-mono text-[15px] sm:text-[16px] !text-[#0011FF] font-medium tracking-normal truncate">
                  @{builder.username}
                </h1>

                {/* Ultra Micro Founding Badge SVG beside username */}
                {(builder.isFoundingBuilder || (builder.foundingNumber && builder.foundingNumber <= 500)) && (
                  <img
                    src="/founding badge.svg"
                    alt="Founding Builder Badge"
                    className="w-[10px] h-[10px] sm:w-[11.5px] sm:h-[11.5px] shrink-0 inline-block align-middle"
                    title={`Founding Builder #${builder.foundingNumber || 42}`}
                  />
                )}
              </div>

              {/* builder #42: Number touches # directly (gap removed), number in #0011FF */}
              <div className="text-inter-14 !text-[#545454] flex items-baseline">
                <span className="text-[#545454]">builder #</span>
                <ScrambleNumber value={builder.foundingNumber || 42} color="#0011FF" />
              </div>

              {/* Social Icons • Personal Link alone (e.g. "ileri.dev") */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-1 text-inter-14 flex-wrap">
                
                {/* GitHub icon */}
                <a
                  href={`https://github.com/${builder.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#545454] hover:text-[#101010] transition-colors"
                  title="GitHub Profile"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>

                {/* Twitter icon */}
                <a
                  href={`https://x.com/${builder.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#545454] hover:text-[#101010] transition-colors"
                  title="Twitter / X Profile"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* Personal Domain Link alone (e.g. "ileri.dev") matching bio font size text-inter-14 */}
                {builder.websiteUrl && (
                  <>
                    <span className="text-[#545454]">•</span>
                    <a
                      href={builder.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="!text-[#545454] font-normal text-inter-14 hover:underline transition-colors"
                    >
                      {cleanHandle === 'ileri' ? 'ileri.dev' : builder.websiteUrl.replace('https://', '').replace('http://', '')}
                    </a>
                  </>
                )}

              </div>

            </div>

          </div>

          {/* Bio & AI Stack Tags (Grouped Tight, Solid #545454 grey text matching project description text-inter-14) */}
          <div className="space-y-2 pt-1">
            {/* Bio (text-inter-14) */}
            {builder.bio && (
              <p className="text-inter-14 text-[#545454] max-w-2xl leading-relaxed">
                {builder.bio}
              </p>
            )}

            {/* AI Stack Tags alone */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {availableTools.map((tool) => (
                <div key={tool} className="tool-pill">
                  <ToolLogo toolId={tool} size={11} />
                  <span className="text-mono-10">{tool}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tabs Header: "3 things." + Filter Button */}
        <div className="w-full pt-2">
          
          {/* Row: "3 things." (Solid #545454 grey text) + Filter Button */}
          <div className="px-4 sm:px-8 py-2 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-mono-20 text-[#545454]">
                <ScrambleNumber value={filteredBuilderProjects.length} color="#545454" />
              </span>
              <span className="text-inter-20 text-[#545454]">
                {filteredBuilderProjects.length === 1 ? 'thing.' : 'things.'}
              </span>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="btn-secondary flex items-center gap-1 group"
              title="Open filters"
            >
              <SlidersHorizontal className="w-3 h-3 stroke-[2] text-[#101010]" />
              <span>filter</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#101010] text-white text-[9px] font-mono font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Projects Showcase Masonry Grid */}
          <div className="pt-2">
            <ProjectMasonry
              projects={filteredBuilderProjects}
              searchQuery={searchQuery}
              onClearSearch={() => {
                setFilters({
                  aiTools: [],
                  categories: [],
                  aiModels: [],
                  status: 'all',
                });
              }}
              onSelectProject={onSelectProject}
              onOpenClaim={onOpenClaim}
              onSelectBuilder={onSelectBuilder}
            />
          </div>

        </div>

      </motion.div>

      {/* Filter Side Drawer for Builder Profile */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        totalFilteredCount={filteredBuilderProjects.length}
        availableTools={availableTools}
        availableCategories={availableCategories}
        availableModels={availableModels}
        showStatus={false}
      />

    </div>
  );
};
