import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FavoritesProvider } from './context/FavoritesContext';
import { Header } from './components/Header';
import { ToolFilterBar } from './components/ToolFilterBar';
import { ProjectMasonry } from './components/ProjectMasonry';
import { ProjectDrawer } from './components/ProjectDrawer';
import { BuilderProfileModal } from './components/BuilderProfileModal';
import { SubmitModal } from './components/SubmitModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { FilterDrawer } from './components/FilterDrawer';
import { MOCK_PROJECTS, MOCK_BUILDERS } from './data/mockData';
import type { Project, Builder, FilterState } from './types';

function ArchiveApp() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Rich Filter state
  const [filters, setFilters] = useState<FilterState>({
    aiTools: [],
    categories: [],
    aiModels: [],
    status: 'all',
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Modals & Drawers state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeBuilder, setActiveBuilder] = useState<Builder | null>(null);
  const [claimingProject, setClaimingProject] = useState<Project | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Filter calculation logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
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

      // 5. Status Filter
      if (filters.status === 'claimed' && !project.isClaimed) return false;
      if (filters.status === 'unclaimed' && project.isClaimed) return false;

      return true;
    });
  }, [projects, searchQuery, filters]);

  const activeFilterCount =
    filters.aiTools.length +
    filters.categories.length +
    filters.aiModels.length +
    (filters.status !== 'all' ? 1 : 0);

  const handleSelectBuilder = (builderHandle: string) => {
    const cleanHandle = builderHandle.replace('@', '');
    const foundBuilder = MOCK_BUILDERS[cleanHandle] || {
      id: `b-${cleanHandle}`,
      username: cleanHandle,
      displayName: `Ilerioluwa`,
      role: 'Product Designer & AI Builder',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      bio: 'Building experimental software with Claude Code & Cursor. Passionate about natural language developer interfaces.',
      isFoundingBuilder: true,
      foundingNumber: 42,
      joinedDate: 'July 2026',
      topTools: ['claude-code', 'cursor']
    };
    setActiveBuilder(foundBuilder);
  };

  const handleOpenClaim = (project: Project) => {
    setClaimingProject(project);
    setIsSubmitOpen(true);
  };

  const handleAddProject = (newProjectData: Partial<Project>) => {
    if (claimingProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === claimingProject.id
            ? { ...p, isClaimed: true, claimedBy: newProjectData.claimedBy || ['ileri'] }
            : p
        )
      );
      setClaimingProject(null);
    } else {
      setProjects((prev) => [newProjectData as Project, ...prev]);
    }
  };

  const builderProjects = useMemo(() => {
    if (!activeBuilder) return [];
    return projects.filter((p) => p.claimedBy.includes(activeBuilder.username));
  }, [projects, activeBuilder]);

  return (
    <div className="min-h-screen bg-[#F2F1F3] text-[#545454] flex flex-col font-sans w-full overflow-x-hidden relative">
      
      {/* Main Page Content Wrapper (Pushed out to the left when Filter Side Drawer is Open) */}
      <motion.div
        animate={{
          x: isFilterDrawerOpen ? -380 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSubmit={() => {
            setClaimingProject(null);
            setIsSubmitOpen(true);
          }}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenProfile={() => handleSelectBuilder('ileri')}
        />

        {/* Main Full-Width Content Container */}
        <main className="flex-1 w-full py-2">
          {/* Tool Filter Bar & 300 things. */}
          <ToolFilterBar
            onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          {/* Masonry Grid */}
          <ProjectMasonry
            projects={filteredProjects}
            onSelectProject={(proj) => setActiveProject(proj)}
            onOpenClaim={handleOpenClaim}
          />
        </main>
      </motion.div>

      {/* Filter Side Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        totalFilteredCount={filteredProjects.length}
      />

      {/* Drawers & Modals */}
      <ProjectDrawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectBuilder={handleSelectBuilder}
        onOpenClaim={handleOpenClaim}
      />

      <BuilderProfileModal
        builder={activeBuilder}
        builderProjects={builderProjects}
        onClose={() => setActiveBuilder(null)}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenClaim={handleOpenClaim}
      />

      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => {
          setIsSubmitOpen(false);
          setClaimingProject(null);
        }}
        onSubmitSuccess={handleAddProject}
        claimingProject={claimingProject}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allProjects={projects}
        onSelectProject={(p) => setActiveProject(p)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <ArchiveApp />
    </FavoritesProvider>
  );
}
