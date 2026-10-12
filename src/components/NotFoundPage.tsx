import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EmptyState } from './EmptyState';

interface NotFoundPageProps {
  // What was missing, for the copy: any page, a project or a profile
  kind?: 'page' | 'project' | 'profile';
  handle?: string;
}

const COPY = {
  page: {
    title: 'this page wandered off',
    text: "the link might be old or mistyped. let's get you back to the good stuff.",
  },
  project: {
    title: "this thing isn't here",
    text: 'it may have been renamed or taken down by its builder.',
  },
  profile: {
    title: '',
    text: 'check the spelling, or find builders through the things they made.',
  },
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ kind = 'page', handle }) => {
  const navigate = useNavigate();
  const { key } = useLocation();
  // Only offer "go back" when there's somewhere in this tab to go back to
  const canGoBack = key !== 'default';
  const copy = COPY[kind];

  return (
    <EmptyState
      art={kind}
      className="min-h-[calc(100svh-180px)] py-12"
      title={kind === 'profile' ? `no one goes by @${handle} yet` : copy.title}
      text={copy.text}
      actions={
        <>
          <Link to="/" className="btn-main">back to all things</Link>
          {canGoBack && (
            <button onClick={() => navigate(-1)} className="btn-secondary">go back</button>
          )}
        </>
      }
    />
  );
};
