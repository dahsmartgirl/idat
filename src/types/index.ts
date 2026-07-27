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
  logoSvg: string;
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
  tagline: string;
  description: string;
  isClaimed: boolean;
  claimedBy: string[];
  primaryTool: string;
  aiTools: string[];
  aiModel?: string;
  category: CategoryType;
  upvotesCount?: number;
  featuredOrder?: number;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  demoUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
  xPostUrl?: string;
  coverImage?: string;
  screenshots?: string[];
  techStack?: string[];
  timeline: TimelineMilestone[];
  buildNotes: BuildNotes;
  perks?: string[];
  tags: string[];
}

export interface Builder {
  id: string;
  username: string;
  displayName: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  isFoundingBuilder: boolean;
  foundingNumber?: number;
  joinedDate: string;
  topTools: string[];
  websiteUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  xUrl?: string;
}

export interface FilterState {
  aiTools: string[];
  categories: CategoryType[];
  aiModels: string[];
  status: 'all' | 'claimed' | 'unclaimed';
}

export const BUILDER_GRADIENTS: Record<string, string> = {
  'ileri': 'bg-gradient-to-br from-[#101010] via-[#2A2A2A] to-[#545454]', // black/grey
  'maya': 'bg-gradient-to-br from-[#E11D48] via-[#F43F5E] to-[#FB7185]',  // pink
  'josh': 'bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',  // blue
};

export const getBuilderGradient = (username?: string) => {
  if (!username) return BUILDER_GRADIENTS['ileri'];
  const clean = username.replace('@', '').toLowerCase();
  return BUILDER_GRADIENTS[clean] || BUILDER_GRADIENTS['ileri'];
};

