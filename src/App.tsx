import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoritesProvider } from './context/FavoritesContext';
import { Header } from './components/Header';
import { ToolFilterBar } from './components/ToolFilterBar';
import { ProjectMasonry } from './components/ProjectMasonry';
import { ProjectDrawer } from './components/ProjectDrawer';
import { BuilderProfilePage } from './components/BuilderProfilePage';
import { SubmitModal } from './components/SubmitModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { FilterDrawer } from './components/FilterDrawer';
import { MOCK_PROJECTS } from './data/mockData';
import type { Project, FilterState } from './types';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Rich Filter state for home grid
  const [filters, setFilters] = useState<FilterState>({
    aiTools: [],
    categories: [],
    aiModels: [],
    status: 'all',
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Modals & Drawers state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [claimingProject, setClaimingProject] = useState<Project | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Clean up drawer states and scroll to top whenever the URL route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveProject(null);
    setIsFilterDrawerOpen(false);
    setIsFavoritesOpen(false);
  }, [location.pathname]);

  // Filter calculation logic for Home Grid
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
    setActiveProject(null);
    setIsFilterDrawerOpen(false);
    setIsFavoritesOpen(false);
    navigate(`/${cleanHandle}`);
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

  const renderProfilePage = () => (
    <BuilderProfilePage
      searchQuery={searchQuery}
      onSelectProject={(proj) => setActiveProject(proj)}
      onOpenClaim={handleOpenClaim}
      onSelectBuilder={handleSelectBuilder}
      activeProject={activeProject}
    />
  );

  // Exact push offset calculation for both mobile (leaves 64px left gap) & desktop (-540 / -370)
  const pushX = useMemo(() => {
    const isMobile = windowWidth < 640;
    const mobileOffset = -(windowWidth - 64);

    if (activeProject) {
      return isMobile ? mobileOffset : -540;
    }
    if (isFilterDrawerOpen) {
      return isMobile ? mobileOffset : -370;
    }
    if (isFavoritesOpen) {
      return isMobile ? mobileOffset : -370;
    }
    return 0;
  }, [activeProject, isFilterDrawerOpen, isFavoritesOpen, windowWidth]);

  return (
    <div className="min-h-screen bg-[#F2F1F3] text-[#545454] flex flex-col font-sans w-full overflow-x-hidden relative">
      
      {/* Main Page Content Wrapper (Smoothly pushed left for both mobile & desktop drawers) */}
      <motion.div
        animate={{
          x: pushX,
        }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="flex-1 flex flex-col w-full"
      >
        {/* PERSISTENT HEADER across all routes */}
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

        {/* ROUTED CONTENT */}
        <Routes>
          {/* HOME PAGE ROUTE */}
          <Route
            path="/"
            element={
              <main className="flex-1 flex flex-col w-full pb-16 sm:pb-24">
                {/* TOOL FILTER CHIPS BAR WITH INTEGRATED COUNTERS & EXPANDABLE DRAWER TRIGGER */}
                <ToolFilterBar
                  onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                  activeFilterCount={activeFilterCount}
                />

                {/* MASONRY PROJECT GRID */}
                <div className="w-full pt-4">
                  <ProjectMasonry
                    projects={filteredProjects}
                    onSelectProject={(proj) => setActiveProject(proj)}
                    onOpenClaim={handleOpenClaim}
                    onSelectBuilder={handleSelectBuilder}
                  />
                </div>
              </main>
            }
          />

          {/* BUILDER PROFILE DIRECT ROUTE */}
          <Route path="/:builderHandle" element={renderProfilePage()} />
        </Routes>
      </motion.div>

      {/* PROJECT DETAILS SIDE DRAWER */}
      <ProjectDrawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onSelectBuilder={handleSelectBuilder}
        onOpenClaim={handleOpenClaim}
      />

      {/* FILTER EXPANDABLE SIDE DRAWER */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updatedFilters) => setFilters(updatedFilters)}
        totalFilteredCount={filteredProjects.length}
      />

      {/* FAVORITES / BOOKMARKS SIDE DRAWER */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allProjects={projects}
        onSelectProject={(proj) => {
          setIsFavoritesOpen(false);
          setActiveProject(proj);
        }}
      />

      {/* SUBMIT / CLAIM MODAL */}
      <SubmitModal
        isOpen={isSubmitOpen}
        onClose={() => {
          setIsSubmitOpen(false);
          setClaimingProject(null);
        }}
        onSubmitSuccess={handleAddProject}
        claimingProject={claimingProject}
      />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppLayout />
      </FavoritesProvider>
    </BrowserRouter>
  );
}
