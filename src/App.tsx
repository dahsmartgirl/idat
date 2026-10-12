import { useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useNavigationType, useParams, type Location } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoritesProvider } from './context/FavoritesContext';
import { ClaimsProvider, useClaims } from './context/ClaimsContext';
import { Header } from './components/Header';
import { ToolFilterBar } from './components/ToolFilterBar';
import { ProjectMasonry } from './components/ProjectMasonry';
import { ProjectDrawer } from './components/ProjectDrawer';
import { BuilderProfilePage } from './components/BuilderProfilePage';
import { ClaimModal, type ClaimRequest } from './components/ClaimModal';
import { NotFoundPage } from './components/NotFoundPage';
import { SubmitPage } from './components/SubmitPage';
import { ProjectPage } from './components/ProjectPage';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { FilterDrawer } from './components/FilterDrawer';
import { MOCK_PROJECTS } from './data/mockData';
import type { Project, FilterState } from './types';
import { EMPTY_FILTERS } from './types';
import { handleFromPath, profilePath, projectPath } from './lib/paths';

// Old profile links (/josh, /b/josh, /builder/josh) forward to /@josh
function LegacyProfileRedirect() {
  const { username = '' } = useParams<{ username: string }>();
  return <Navigate to={profilePath(username)} replace />;
}

function AppLayout() {
  const navigate = useNavigate();
  // React Router hands out a new navigate on every URL change; handlers passed to the feed use this stable
  // one, so the memoized grid and its cards don't all re-render on each page change
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const location = useLocation();
  // An expanded project remembers the page it came from (history state backgroundLocation). That page stays
  // mounted but hidden while the project shows, so closing brings it straight back: no rebuild, same scroll
  const backgroundLocation = (location.state as { backgroundLocation?: Location } | null)?.backgroundLocation;
  const pageLocation = backgroundLocation ?? location;
  
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
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Modals & Drawers state
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  // The page the drawer was opened on: it only shows there, so it's gone in the same render a navigation lands
  const [activeProjectPath, setActiveProjectPath] = useState('');
  const openProject = activeProject && activeProjectPath === location.pathname ? activeProject : null;
  const [claimingProject, setClaimingProject] = useState<Project | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  // While the drawer expands into the full page, the page behind slides back under the header
  const [isExpanding, setIsExpanding] = useState(false);

  // Remember each page's scroll position, so going back to it lands where you were. The browser's own
  // restoration is off: it fires before our pages have laid out and fights this
  const navigationType = useNavigationType();
  const navigationTypeRef = useRef(navigationType);
  navigationTypeRef.current = navigationType;
  const scrollPositions = useRef(new Map<string, number>());
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);
  // Swapped before paint and before the restore below, so scrolls caused by changing page are recorded
  // against the new entry and never overwrite the old one's position
  useLayoutEffect(() => {
    const key = location.key;
    const onScroll = () => scrollPositions.current.set(key, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.key]);

  // New pages start at the top; back/forward restores once the page is tall enough. Runs before paint, so a
  // new page never shows a frame at the old scroll position
  useLayoutEffect(() => {
    const y = navigationTypeRef.current === 'POP' ? scrollPositions.current.get(location.key) ?? 0 : 0;
    let frame = 0;
    let tries = 0;
    const restore = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= y || ++tries > 30) window.scrollTo(0, y);
      else frame = requestAnimationFrame(restore);
    };
    restore();
    return () => cancelAnimationFrame(frame);
  }, [location.key]);

  // Once an expanded project's page is showing, the drawer it grew from is done: closing the page returns to
  // the feed, not the drawer. (Cleared after the page commits; until then the drawer hides itself by path.)
  useEffect(() => {
    if (!backgroundLocation) return;
    setActiveProject(null);
    setIsExpanding(false);
  }, [backgroundLocation, location.key]);

  // Close the drawers whenever the page changes (expanding a project and closing it again doesn't count)
  useEffect(() => {
    setActiveProject(null);
    setIsFilterDrawerOpen(false);
    setIsFavoritesOpen(false);
  }, [pageLocation.key]);


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
        // aiModel can list several models ("A, B"); match if any of them is selected
        const projectModels = (project.aiModel ?? '').split(',').map((m) => m.trim());
        if (!projectModels.some((m) => filters.aiModels.includes(m))) {
          return false;
        }
      }

      // 5. Status Filter
      if (filters.status === 'claimed' && !project.isClaimed) return false;
      if (filters.status === 'unclaimed' && project.isClaimed) return false;

      return true;
    });
  }, [projects, searchQuery, filters]);

  // Filter options: only tools, models and categories that at least one project uses
  const filterOptions = useMemo(() => ({
    tools: [...new Set(projects.flatMap((p) => p.aiTools))],
    models: [...new Set(projects.flatMap((p) => (p.aiModel ?? '').split(',').map((m) => m.trim()).filter(Boolean)))],
    categories: [...new Set(projects.map((p) => p.category))],
  }), [projects]);

  const activeFilterCount =
    filters.aiTools.length +
    filters.categories.length +
    filters.aiModels.length +
    (filters.status !== 'all' ? 1 : 0);

  // Stable handlers so the memoized grid and cards don't re-render when drawers open or the window resizes
  const handleSelectBuilder = useCallback((builderHandle: string) => {
    const cleanHandle = builderHandle.replace('@', '');
    setActiveProject(null);
    setIsFilterDrawerOpen(false);
    setIsFavoritesOpen(false);
    navigateRef.current(profilePath(cleanHandle));
  }, []);

  const handleOpenClaim = useCallback((project: Project) => {
    setClaimingProject(project);
  }, []);

  // A claim only changes the project once it's confirmed (automatically, by the backend), and the claimer and
  // co-builders are told by email. Until then the project just shows "claim pending" to you
  const { addPendingClaim } = useClaims();
  const handleClaim = useCallback((request: ClaimRequest) => {
    addPendingClaim(request.project.id);
  }, [addPendingClaim]);

  const closeClaim = useCallback(() => setClaimingProject(null), []);

  const handleEditProject = useCallback((project: Project) => {
    setActiveProject(null);
    navigateRef.current(`/edit/${project.slug}`);
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setIsFilterDrawerOpen(false);
    setIsFavoritesOpen(false);
    setActiveProject(project);
    setActiveProjectPath(window.location.pathname);
  }, []);

  const handleAddProject = (newProjectData: Partial<Project>) => {
    // Edits from /edit/:slug come back as the full project, with its id
    if (projects.some((p) => p.id === newProjectData.id)) {
      const editedId = newProjectData.id;
      setProjects((prev) =>
        prev.map((p) => (p.id === editedId ? { ...p, ...newProjectData } as Project : p))
      );
      if (activeProject && activeProject.id === editedId) {
        setActiveProject((prev) => prev ? { ...prev, ...newProjectData } as Project : null);
      }
    } else {
      setProjects((prev) => [newProjectData as Project, ...prev]);
    }
  };

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const renderProfilePage = (username: string) => (
    <BuilderProfilePage
      key={username}
      username={username}
      projects={projects}
      searchQuery={searchQuery}
      onClearSearch={clearSearch}
      onSelectProject={handleSelectProject}
      onOpenClaim={handleOpenClaim}
      onSelectBuilder={handleSelectBuilder}
      activeProject={openProject}
    />
  );

  const renderProjectPage = () => (
    <ProjectPage
      projects={projects}
      onSelectBuilder={handleSelectBuilder}
      onOpenClaim={handleOpenClaim}
      onEditProject={handleEditProject}
    />
  );

  // A new page snaps the pushed content back into place; only drawers opening/closing on a page slide it
  const lastPathname = useRef(pageLocation.pathname);
  const routeJustChanged = lastPathname.current !== pageLocation.pathname;
  useEffect(() => {
    lastPathname.current = pageLocation.pathname;
  });

  // Exact push offset calculation for both mobile (leaves 64px left gap) & desktop (-540 / -370)
  const pushX = useMemo(() => {
    const isMobile = windowWidth < 640;
    const mobileOffset = -(windowWidth - 64);

    if (isExpanding || backgroundLocation) return 0;
    if (openProject) {
      return isMobile ? mobileOffset : -540;
    }
    if (isFilterDrawerOpen) {
      return isMobile ? mobileOffset : -370;
    }
    if (isFavoritesOpen) {
      return isMobile ? mobileOffset : -370;
    }
    return 0;
  }, [isExpanding, backgroundLocation, openProject, isFilterDrawerOpen, isFavoritesOpen, windowWidth]);

  return (
    <div className="min-h-screen bg-page text-secondary flex flex-col font-sans w-full overflow-x-clip relative">
      
      {/* Main Page Content Wrapper (Smoothly pushed left for both mobile & desktop drawers) */}
      <motion.div
        animate={{
          x: pushX,
        }}
        transition={
          routeJustChanged
            ? { duration: 0 }
            : isExpanding
              ? { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
        }
        className="flex-1 flex flex-col w-full"
      >
        {/* PERSISTENT HEADER across all routes */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSubmit={() => {
            navigate('/new');
          }}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenProfile={() => handleSelectBuilder('ileri')}
        />

        {/* Dynamic Main Body Content via Router */}
        <main className="flex-1 w-full py-2">
          {/* The page an expanded project came from: kept mounted (same width, zero height, invisible) under it */}
          <div className={backgroundLocation ? 'h-0 overflow-hidden invisible' : undefined} aria-hidden={!!backgroundLocation}>
          <Routes location={pageLocation}>
            {/* HOME PAGE ROUTE */}
            <Route
              path="/"
              element={
                <>
                  {/* TOOL FILTER CHIPS BAR WITH INTEGRATED COUNTERS & EXPANDABLE DRAWER TRIGGER */}
                  <ToolFilterBar
                    onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                    activeFilterCount={activeFilterCount}
                    onClearFilters={() => setFilters(EMPTY_FILTERS)}
                  />

                  {/* MASONRY PROJECT GRID */}
                  <ProjectMasonry
                    projects={filteredProjects}
                    searchQuery={searchQuery}
                    onClearSearch={() => {
                      clearSearch();
                      setFilters(EMPTY_FILTERS);
                    }}
                    onSelectProject={handleSelectProject}
                    onOpenClaim={handleOpenClaim}
                    onSelectBuilder={handleSelectBuilder}
                  />
                </>
              }
            />

            {/* New Project Page */}
            <Route path="/new" element={<SubmitPage onSubmitSuccess={handleAddProject} projects={projects} />} />

            {/* Edit Project Page */}
            <Route path="/edit/:slug" element={<SubmitPage onSubmitSuccess={handleAddProject} projects={projects} />} />

            {/* Unclaimed projects (forwards to /@username/slug once claimed) */}
            <Route path="/p/:slug" element={renderProjectPage()} />

            {/* Profiles (/@username) and projects (/@username/slug) */}
            <Route path="/:handle" element={<HandleRoute render={renderProfilePage} />} />
            <Route path="/:handle/:slug" element={<HandleRoute render={() => renderProjectPage()} />} />

            {/* Old profile links */}
            <Route path="/b/:username" element={<LegacyProfileRedirect />} />
            <Route path="/builder/:username" element={<LegacyProfileRedirect />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </div>

          {/* EXPANDED PROJECT, shown in place of the page it came from */}
          {backgroundLocation && (
            <Routes location={location}>
              <Route path="/p/:slug" element={renderProjectPage()} />
              <Route path="/:handle/:slug" element={<HandleRoute render={() => renderProjectPage()} />} />
            </Routes>
          )}
        </main>
      </motion.div>

      {/* PROJECT DETAILS SIDE DRAWER */}
      <ProjectDrawer
        project={openProject}
        onClose={() => setActiveProject(null)}
        onSelectBuilder={handleSelectBuilder}
        onOpenClaim={handleOpenClaim}
        onEditProject={handleEditProject}
        onExpandStart={() => setIsExpanding(true)}
        onExpand={(project) =>
          // Hand over to the page. The drawer disappears in the same render the page appears (it only shows
          // on the path it was opened on), so there's no gap between them
          navigate(projectPath(project, handleFromPath(location.pathname)), { state: { backgroundLocation: location } })
        }
      />

      {/* FILTER EXPANDABLE SIDE DRAWER */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updatedFilters) => setFilters(updatedFilters)}
        availableTools={filterOptions.tools}
        availableModels={filterOptions.models}
        availableCategories={filterOptions.categories}
      />

      {/* FAVORITES / BOOKMARKS SIDE DRAWER */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allProjects={projects}
        onSelectProject={handleSelectProject}
      />

      {/* CLAIM MODAL */}
      <ClaimModal project={claimingProject} onClose={closeClaim} onClaim={handleClaim} />

    </div>
  );
}

// Paths whose first segment starts with @ belong to a builder; any other single word is an old profile link,
// and anything else isn't a page
function HandleRoute({ render }: { render: (username: string) => ReactNode }) {
  const { handle = '', slug } = useParams<{ handle: string; slug?: string }>();
  if (!handle.startsWith('@')) {
    return slug ? <NotFoundPage /> : <Navigate to={profilePath(handle)} replace />;
  }
  return <>{render(handle.slice(1).toLowerCase())}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ClaimsProvider>
          <AppLayout />
        </ClaimsProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
