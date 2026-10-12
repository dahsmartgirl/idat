import React from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Project } from '../types';
import { ProjectDetails, UnclaimedBanner } from './ProjectDetails';
import { handleFromPath, projectPath } from '../lib/paths';

interface ProjectPageProps {
  projects: Project[];
  onSelectBuilder: (handle: string) => void;
  onOpenClaim: (project: Project) => void;
  onEditProject: (project: Project) => void;
}

// Full-page project view (/@username/slug, or /p/slug while unclaimed), in a centered column.
// Its layout matches the fully expanded drawer (banner right under the header, drawer padding, 860px column)
// so expanding hands over without a jump
export const ProjectPage: React.FC<ProjectPageProps> = ({ projects, onSelectBuilder, onOpenClaim, onEditProject }) => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname, key, state } = useLocation();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);
  // Opened by expanding the drawer (the drawer already did the motion) vs a direct visit
  const fromExpand = !!(state as { backgroundLocation?: unknown } | null)?.backgroundLocation;

  if (!project) {
    return (
      <div className="w-full max-w-[860px] mx-auto px-4 sm:px-8 py-20 text-center space-y-2">
        <h1 className="text-inter-16 !text-[#101010]">this thing doesn't exist</h1>
        <Link to="/" className="text-inter-14 hover:underline">back to all things</Link>
      </div>
    );
  }

  // Each builder has their own address for the project; claimed /p/ links and non-builder usernames forward
  const canonical = projectPath(project, handleFromPath(pathname));
  if (decodeURIComponent(pathname).toLowerCase() !== canonical.toLowerCase()) {
    return <Navigate to={canonical} state={state} replace />;
  }

  // Back to where you came from; straight visits (no history here) go home
  const close = () => (key === 'default' ? navigate('/') : navigate(-1));

  return (
    // -mt-2 cancels main's top padding so the page starts right under the header, like the expanded drawer
    <motion.div
      initial={fromExpand ? false : { opacity: 0.4, filter: 'blur(12px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="w-full -mt-2"
    >
      {!project.isClaimed && <UnclaimedBanner project={project} onOpenClaim={onOpenClaim} />}
      <div className="w-full max-w-[860px] mx-auto px-6 sm:px-8 pt-6 sm:pt-8 pb-16 space-y-5">
        <ProjectDetails
          key={project.id}
          project={project}
          onSelectBuilder={onSelectBuilder}
          onOpenClaim={onOpenClaim}
          onEditProject={onEditProject}
          onCollapse={close}
        />
      </div>
    </motion.div>
  );
};
