import type { Project, Builder } from '../types';

export const MOCK_BUILDERS: Record<string, Builder> = {
  'ileri': {
    id: 'b-ileri',
    username: 'ileri',
    displayName: 'Ilerioluwa',
    role: 'Product Designer & AI Builder',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Building experimental software with Claude Code & Cursor. Passionate about natural language developer interfaces.',
    isFoundingBuilder: true,
    foundingNumber: 42,
    joinedDate: 'July 2026',
    websiteUrl: 'https://ileri.dev',
    githubUrl: 'https://github.com/ilerioluwa',
    xUrl: 'https://x.com/ileri',
    topTools: ['claude-code', 'cursor', 'gemini-cli']
  },
  'josh': {
    id: 'b-josh',
    username: 'josh',
    displayName: 'Josh Miller',
    role: 'Full Stack Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Shipping micro-SaaS with Lovable & Bolt. 10x builder powered by LLM subagents.',
    isFoundingBuilder: true,
    foundingNumber: 12,
    joinedDate: 'July 2026',
    githubUrl: 'https://github.com/joshm',
    topTools: ['lovable', 'bolt', 'v0']
  },
  'maya': {
    id: 'b-maya',
    username: 'maya',
    displayName: 'Maya Lin',
    role: 'AI Researcher & Hacker',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Building MCP tools and CLI utilities with Gemini CLI & Claude Code.',
    isFoundingBuilder: true,
    foundingNumber: 88,
    joinedDate: 'July 2026',
    topTools: ['gemini-cli', 'claude-code']
  },
  'sarah': {
    id: 'b-sarah',
    username: 'sarah',
    displayName: 'Sarah Chen',
    role: 'Frontend Architect',
    bio: 'Exploring declarative UI design and design systems with v0, Windsurf and Claude.',
    isFoundingBuilder: true,
    foundingNumber: 104,
    joinedDate: 'July 2026',
    topTools: ['v0', 'windsurf']
  },
  'alex': {
    id: 'b-alex',
    username: 'alex',
    displayName: 'Alex Rivers',
    role: 'Independent Developer',
    bio: 'Solopreneur building AI agents and CLI tools using Cursor & Gemini.',
    isFoundingBuilder: true,
    foundingNumber: 211,
    joinedDate: 'July 2026',
    topTools: ['cursor', 'gemini-cli']
  }
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    slug: 'mcp-fs-inspector',
    name: 'MCP Filesystem Inspector',
    tagline: 'Visual schema inspector and live state viewer for Model Context Protocol servers.',
    description: 'A developer desktop utility that connects directly to local MCP servers, inspecting protocol messages, tool schemas, and file sync locks in real time.',
    isClaimed: true,
    claimedBy: ['ileri'],
    primaryTool: 'claude-code',
    aiTools: ['claude-code', 'cursor'],
    aiModel: 'Claude 3.7 Sonnet',
    category: 'MCP Servers',
    tags: ['MCP Protocol', 'Electron', 'Developer Tools', 'Open Source'],
    techStack: ['TypeScript', 'React', 'Electron', 'TailwindCSS'],
    coverImage: '',
    screenshots: [],
    demoUrl: 'https://mcp-inspector.dev',
    githubUrl: 'https://github.com/ilerioluwa/mcp-fs-inspector',
    createdAt: '2026-07-22',
    updatedAt: '2026-07-24',
    buildNotes: {
      whyBuilt: 'While building custom MCP servers for Claude Code, I needed a fast way to visually inspect JSON-RPC frame traffic and verify tool payload contracts without relying purely on standard output logs.',
      aiRoleAndPrompts: 'Claude Code generated 85% of the protocol parser and IPC bridge architecture. I prompted Claude with the official MCP spec and asked it to build a React state listener for standard stdio streams.',
      challengesAndFailures: 'Electron IPC file handle locks caused silent crashes on Windows during hot-reload. Claude helped isolate the handle leak by refactoring the main process worker thread sync.',
      lessonsLearned: 'Writing clear TypeScript types up front allowed Claude Code to complete full multi-file refactors without introducing type regressions.'
    },
    timeline: [
      { date: 'July 20, 2026', title: 'First Stdio Prototype', type: 'started', description: 'Built initial CLI tool with Claude Code in 2 hours.' },
      { date: 'July 22, 2026', title: 'React Desktop GUI', type: 'mvp', description: 'Wrapped stdio stream listener in Electron GUI.' },
      { date: 'July 24, 2026', title: 'v1.0 Open Source Release', type: 'open_source', description: 'Published repository and binary release on GitHub.' }
    ]
  },
  {
    id: 'proj-2',
    slug: 'prompt-to-landing',
    name: 'Instant AI Landing Engine',
    tagline: 'Generate pixel-perfect dark-mode marketing pages from markdown copy.',
    description: 'An opinionated web application that converts plain text feature lists into animated React landing pages complete with Tailwind CSS glassmorphic components.',
    isClaimed: true,
    claimedBy: ['josh'],
    primaryTool: 'lovable',
    aiTools: ['lovable', 'bolt'],
    aiModel: 'Claude 3.5 Sonnet',
    category: 'SaaS',
    tags: ['Marketing', 'Web App', 'Glassmorphism', 'Design System'],
    techStack: ['React', 'Vite', 'TailwindCSS', 'Framer Motion'],
    coverImage: '',
    screenshots: [],
    demoUrl: 'https://instantlanding.ai',
    githubUrl: 'https://github.com/joshm/instant-landing',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-23',
    buildNotes: {
      whyBuilt: 'I was spending 10+ hours designing landing pages for small side projects. I wanted a zero-config engine that creates modern, high-converting layouts automatically.',
      aiRoleAndPrompts: 'Built 100% using Lovable and Bolt. I iterated on design prompts to tune color contrast, typography scale, and micro-animations.',
      challengesAndFailures: 'Initial generated layouts felt too template-like. I added custom component constraint prompts to enforce dark glassmorphic styling.',
      lessonsLearned: 'Providing explicit design system rules in prompt context improves visual output dramatically.'
    },
    timeline: [
      { date: 'July 18, 2026', title: 'Idea & Prompt Specs', type: 'started' },
      { date: 'July 20, 2026', title: 'Public Beta Launch', type: 'launch' }
    ]
  },
  {
    id: 'proj-3',
    slug: 'multimodal-video-cli',
    name: 'Gemini Video Insight CLI',
    tagline: 'CLI tool to summarize hour-long screen recordings & pinpoint UI bugs.',
    description: 'Feed any mp4 video recording into the terminal to automatically extract key timestamps, bug repro steps, and visual changelogs.',
    isClaimed: true,
    claimedBy: ['maya', 'ileri'],
    primaryTool: 'gemini-cli',
    aiTools: ['gemini-cli', 'claude-code'],
    aiModel: 'Gemini 2.0 Flash',
    category: 'CLI Tools',
    tags: ['Multimodal', 'Video Processing', 'QA Tools', 'Developer Productivity'],
    techStack: ['Node.js', 'Google GenAI SDK', 'FFmpeg', 'Commander.js'],
    coverImage: '',
    screenshots: [],
    githubUrl: 'https://github.com/mayalin/gemini-video-cli',
    createdAt: '2026-07-21',
    updatedAt: '2026-07-24',
    buildNotes: {
      whyBuilt: 'Reviewing 30-minute loom QA recordings was consuming hours. Gemini Pro multimodal window allowed processing full video frames natively.',
      aiRoleAndPrompts: 'Gemini CLI generated the FFmpeg chunking scripts and automated the video frame prompt pipeline.',
      challengesAndFailures: 'Handling large 4K video uploads required streaming chunks to avoid memory spikes. Refactored with Node streams.',
      lessonsLearned: 'Multimodal AI is unmatched for video QA automation.'
    },
    timeline: [
      { date: 'July 21, 2026', title: 'Initial Script', type: 'started' },
      { date: 'July 23, 2026', title: 'CLI NPM Package', type: 'launch' }
    ]
  },
  {
    id: 'proj-4',
    slug: 'tab-organizer-ai',
    name: 'Semantic Tab Cluster',
    tagline: 'Chrome Extension that automatically groups 100+ open browser tabs by intent.',
    description: 'Uses lightweight local embedding and LLM classification to organize scattered browser tabs into smart workspace groups with one click.',
    isClaimed: false,
    claimedBy: [],
    primaryTool: 'cursor',
    aiTools: ['cursor'],
    aiModel: 'GPT-4o',
    category: 'Chrome Extensions',
    tags: ['Browser Extension', 'Productivity', 'Tab Management', 'Local AI'],
    techStack: ['JavaScript', 'Chrome Extension Manifest V3', 'TailwindCSS'],
    coverImage: '',
    screenshots: [],
    githubUrl: 'https://github.com/unclaimed/semantic-tab-cluster',
    createdAt: '2026-07-15',
    updatedAt: '2026-07-15',
    buildNotes: {
      whyBuilt: 'Tab clutter was slowing down work context switching. Wanted semantic clustering based on page content rather than just URL domain.',
      aiRoleAndPrompts: 'Built with Cursor Composer in under 3 hours.',
      challengesAndFailures: 'Chrome storage quotas forced optimizing tab embedding caching.',
      lessonsLearned: 'Manifest V3 service workers require clean async state persistence.'
    },
    timeline: [
      { date: 'July 15, 2026', title: 'Weekend Hackathon', type: 'started' }
    ]
  },
  {
    id: 'proj-5',
    slug: 'synthwave-retro-runner',
    name: 'Synthwave Neon Runner',
    tagline: 'WebGPU 3D browser runner game created in 100% prompt sessions.',
    description: 'An arcade synthwave obstacle runner built using Three.js and WebGPU shaders, featuring procedural synth tracks and dynamic neon reflections.',
    isClaimed: false,
    claimedBy: [],
    primaryTool: 'bolt',
    aiTools: ['bolt', 'v0'],
    aiModel: 'DeepSeek R1',
    category: 'Games',
    tags: ['WebGPU', 'Three.js', 'Shader', 'Browser Game', '3D Graphics'],
    techStack: ['Three.js', 'TypeScript', 'WebGPU', 'Web Audio API'],
    coverImage: '',
    screenshots: [],
    demoUrl: 'https://synthwave-runner.game',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    buildNotes: {
      whyBuilt: 'Wanted to test how far Bolt could go in generating complex WebGL/Three.js shader pipelines without manual physics engine code.',
      aiRoleAndPrompts: 'Prompted custom procedural grid terrain generation and vertex collision detection.',
      challengesAndFailures: 'Frame rate drops on low-end GPUs required optimizing shader loop passes.',
      lessonsLearned: 'LLMs excel at matrix math and 3D vector calculations when given clear physics boundaries.'
    },
    timeline: [
      { date: 'July 19, 2026', title: 'Experiment Published', type: 'launch' }
    ]
  },
  {
    id: 'proj-6',
    slug: 'synthwave-retro-runner-2',
    name: 'Whisper Code Assistant',
    tagline: 'Voice-to-code VS Code extension for hands-free refactoring.',
    description: 'Speak your refactoring instructions aloud and watch your editor execute precise multi-file diffs using localized Whisper model transcription.',
    isClaimed: true,
    claimedBy: ['ileri'],
    primaryTool: 'claude-code',
    aiTools: ['claude-code', 'windsurf'],
    aiModel: 'Claude 3.7 Sonnet',
    category: 'VS Code Extensions',
    tags: ['Voice UI', 'VS Code', 'Refactoring', 'Accessibility'],
    techStack: ['TypeScript', 'VS Code API', 'Whisper.cpp', 'WebAssembly'],
    coverImage: '',
    screenshots: [],
    githubUrl: 'https://github.com/ilerioluwa/voice-code-assistant',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-20',
    buildNotes: {
      whyBuilt: 'Developed RSI and needed a reliable hands-free coding interface for standard refactoring tasks.',
      aiRoleAndPrompts: 'Claude Code helped interface WASM Whisper transcription directly with VS Code language server protocols.',
      challengesAndFailures: 'Sub-500ms audio latency required tuning Web Worker audio buffers.',
      lessonsLearned: 'Voice programming is remarkably fluid when paired with direct AST transformations.'
    },
    timeline: [
      { date: 'July 10, 2026', title: 'Project Initiated', type: 'started' },
      { date: 'July 20, 2026', title: 'VS Code Marketplace Beta', type: 'launch' }
    ]
  },
  {
    id: 'proj-7',
    slug: 'schema-weaver-ai',
    name: 'SchemaWeaver AI',
    tagline: 'Generate semantic database schemas and migrations from chat prompts.',
    description: 'Generate semantic database schemas and migrations from chat prompts.',
    isClaimed: true,
    claimedBy: ['sarah'],
    primaryTool: 'v0',
    aiTools: ['v0', 'windsurf'],
    aiModel: 'Claude 3.5 Sonnet',
    category: 'APIs',
    tags: ['Database', 'Developer Tool', 'API'],
    techStack: ['React', 'PostgreSQL', 'Prisma'],
    coverImage: '',
    screenshots: [],
    buildNotes: {
      whyBuilt: 'Relational databases are tedious to design by hand. I wanted an AI that visually generates schema code alongside interactive charts.',
      aiRoleAndPrompts: 'v0 built the interactive canvas and Prisma code block UI.',
      challengesAndFailures: 'Recursive relationship loops crashed the initial parser; resolved by introducing cycle detection routines.',
      lessonsLearned: 'Visual builders require custom AST parsers rather than general string regexes.'
    },
    timeline: []
  },
  {
    id: 'proj-8',
    slug: 'git-scribe-agent',
    name: 'GitScribe Agent',
    tagline: 'Terminal agent that auto-documents visual pull requests from diff files.',
    description: 'Terminal agent that auto-documents visual pull requests from diff files.',
    isClaimed: true,
    claimedBy: ['alex'],
    primaryTool: 'gemini-cli',
    aiTools: ['gemini-cli', 'cursor'],
    aiModel: 'Gemini 2.0 Flash',
    category: 'CLI Tools',
    tags: ['Git', 'Automation', 'CLI'],
    techStack: ['Node.js', 'Google GenAI SDK'],
    coverImage: '',
    screenshots: [],
    buildNotes: {
      whyBuilt: 'I was spending too much time explaining UI shifts in my PRs. GitScribe captures terminal diffs and analyzes screenshot assets.',
      aiRoleAndPrompts: 'Cursor Composer generated the shell hook scripts.',
      challengesAndFailures: 'Large binary diffs hit LLM token limits; resolved by chunking code changes.',
      lessonsLearned: 'Focusing context only on modified AST functions saves tokens and yields better summary files.'
    },
    timeline: []
  },
  {
    id: 'proj-9',
    slug: 'terminal-rhythm-racer',
    name: 'Terminal Rhythm Racer',
    tagline: 'Console arcade rhythm game based on keyboard typing speed.',
    description: 'Console arcade rhythm game based on keyboard typing speed.',
    isClaimed: false,
    claimedBy: [],
    primaryTool: 'cursor',
    aiTools: ['cursor'],
    aiModel: 'GPT-4o',
    category: 'Games',
    tags: ['Terminal', 'Keyboard', 'Game'],
    techStack: ['Node.js', 'Inquirer'],
    coverImage: '',
    screenshots: [],
    buildNotes: {
      whyBuilt: 'Wanted to check if complex timing games are playable inside basic ANSI terminal buffers.',
      aiRoleAndPrompts: 'Built inside Cursor with minimal prompt tweaks.',
      challengesAndFailures: 'Terminal render stutter on keypresses required disabling prompt buffering.',
      lessonsLearned: 'Terminals are surprisingly fast when using direct stdout write statements.'
    },
    timeline: []
  }
];
