import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Project, FilterState } from '../types';
import { getBuilderGradient } from '../types';
import { MOCK_BUILDERS, MOCK_PROJECTS } from '../data/mockData';
import { SlidersHorizontal, Github, XLogo } from './icons';
import { ProjectMasonry } from './ProjectMasonry';
import { FilterDrawer } from './FilterDrawer';
import { ToolLogo } from './ToolLogos';

interface BuilderProfilePageProps {
  username: string;
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
  username,
  onSelectProject,
  onOpenClaim,
  onSelectBuilder,
  searchQuery = '',
  activeProject = null,
}) => {
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

  // Track window width for pixel-exact mobile & desktop push content calculations
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close filter drawer if project drawer is opened to prevent double-drawer overlap
  useEffect(() => {
    if (activeProject) {
      setIsFilterDrawerOpen(false);
    }
  }, [activeProject]);

  const profilePushX = useMemo(() => {
    if (activeProject) {
      // Since App.tsx's wrapper is already shifting by pushX when activeProject is open,
      // the BuilderProfilePage content does NOT need to shift relative to its parent.
      return 0;
    }

    const isMobile = windowWidth < 640;
    const mobileOffset = -(windowWidth - 64);

    if (isFilterDrawerOpen) {
      return isMobile ? mobileOffset : -370;
    }
    return 0;
  }, [activeProject, isFilterDrawerOpen, windowWidth]);

  return (
    <div className="w-full relative">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          x: profilePushX,
          opacity: 1,
          y: 0,
        }}
        transition={{
          x: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
          opacity: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
          y: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
        }}
        className="w-full flex flex-col space-y-6"
      >
        
        {/* Top Profile Header Block */}
        {/* Centered column on tablet/desktop (same layout as mobile, just not stretched full width) */}
        <div className="w-full sm:max-w-[860px] sm:mx-auto px-4 sm:px-8 pt-6 sm:pt-10 space-y-4">
          
          {/* Row 1: Pure Gradient Avatar + User Info Column */}
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            
            {/* Pure Gradient Avatar Circle */}
            <div className={`w-20 h-20 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-full ${getBuilderGradient(builder.username)} shrink-0 shadow-sm border border-[#E0E0E0]/50`} />

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
              <div className="text-inter-14 !text-secondary flex items-baseline">
                <span className="text-secondary">builder #</span>
                <ScrambleNumber value={builder.foundingNumber || 42} color="#0011FF" />
              </div>

              {/* Social Icons • Personal Link alone (e.g. "ileri.dev") */}
              <div className="flex items-center gap-2 pt-0.5 sm:pt-1 text-inter-14 flex-wrap">
                
                {/* GitHub icon */}
                <a
                  href={`https://github.com/${builder.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:text-[#101010] transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>

                {/* Twitter icon */}
                <a
                  href={`https://x.com/${builder.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:text-[#101010] transition-colors"
                  title="Twitter / X Profile"
                >
                  <XLogo className="w-3.5 h-3.5" />
                </a>

                {/* Personal Domain Link alone (e.g. "ileri.dev") matching bio font size text-inter-14 */}
                {builder.websiteUrl && (
                  <>
                    <span className="text-secondary">•</span>
                    <a
                      href={builder.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="!text-secondary font-normal text-inter-14 hover:underline transition-colors"
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
              <p className="text-inter-14 text-secondary max-w-2xl leading-relaxed">
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
              <span className="text-mono-20 text-secondary">
                <ScrambleNumber value={filteredBuilderProjects.length} color="var(--color-secondary)" />
              </span>
              <span className="text-inter-20 text-secondary">
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
