import type { Project } from '../types';

export const SITE_URL = 'https://idat.xyz';

// Profiles live at /@username
export const profilePath = (handle: string) => `/@${handle.replace('@', '').toLowerCase()}`;

// The builder in a /@username path, if any
export const handleFromPath = (pathname: string) => pathname.match(/^\/@([^/]+)/)?.[1]?.toLowerCase();

const isBuilderOf = (project: Project, handle?: string) =>
  !!handle && project.claimedBy.some((h) => h.toLowerCase() === handle.toLowerCase());

// Claimed projects live under each of their builders (/@username/slug): the given builder when they're one
// of them (e.g. the profile it was opened from), otherwise the first. Unclaimed ones sit at /p/slug until claimed
export const projectPath = (project: Project, handle?: string) =>
  project.isClaimed
    ? `${profilePath(isBuilderOf(project, handle) ? handle! : (project.claimedBy[0] ?? 'ileri'))}/${project.slug}`
    : `/p/${project.slug}`;

// URL-safe slug from a project name, made unique against the slugs already taken
export const slugify = (name: string, taken: string[] = []) => {
  const base =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'project';
  let slug = base;
  for (let n = 2; taken.includes(slug); n++) slug = `${base}-${n}`;
  return slug;
};
