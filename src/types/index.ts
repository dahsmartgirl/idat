export type CategoryType = 
  | 'All'
  | 'SaaS' 
  | 'Chrome Extensions' 
  | 'MCP Servers' 
  | 'APIs' 
  | 'Mobile Apps' 
  | 'Games' 
  | 'CLI Tools' 
  | 'VS Code Extensions' 
  | 'Experiments';

export interface AiTool {
  id: string;
  name: string;
  slug: string;
  logoSvg: string; // Identifying string for SVG rendering
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description?: string;
  type: 'started' | 'mvp' | 'launch' | 'milestone' | 'open_source';
}

export interface BuildNotes {
  whyBuilt: string;
  aiRoleAndPrompts: string;
  challengesAndFailures: string;
  lessonsLearned: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string; // One-liner
  description: string;
  isClaimed: boolean;
  claimedBy: string[]; // Builder handles e.g. ["@ileri", "@josh"]
  primaryTool: string; // Tool ID e.g. 'claude-code'
  aiTools: string[];   // Array of tool IDs e.g. ['claude-code', 'cursor']
  category: CategoryType;
  tags: string[];
  techStack: string[];
  coverImage: string;
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  remixUrl?: string;
  createdAt: string;
  updatedAt: string;
  buildNotes: BuildNotes;
  timeline: TimelineMilestone[];
  isFavorite?: boolean;
}

export interface Builder {
  id: string;
  username: string; // e.g. "ileri"
  displayName: string;
  role: string;
  avatarUrl: string;
  bio: string;
  isFoundingBuilder: boolean;
  foundingNumber?: number; // e.g. 42
  joinedDate: string;
  websiteUrl?: string;
  githubUrl?: string;
  xUrl?: string;
  topTools: string[];
}
