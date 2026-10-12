import type { LogoKey } from '../components/brandLogos';

// Single source of truth for the tools, models and categories idat knows about (as of October 2026).
// Add new entries here; the submit form, filters, cards and drawers all read from this file.

export type ToolGroup = 'ide' | 'agent' | 'extension' | 'builder' | 'creative';

export interface Tool {
  id: string;
  name: string;
  group: ToolGroup;
  logo?: LogoKey;
  // Used to tint single-colour logos and the letter mark when there's no logo
  color: string;
}

export const TOOLS: Tool[] = [
  // AI IDEs
  { id: 'cursor', name: 'Cursor', group: 'ide', logo: 'cursor', color: '#101010' },
  { id: 'devin-desktop', name: 'Devin Desktop', group: 'ide', logo: 'devin', color: '#101010' },
  { id: 'antigravity', name: 'Antigravity', group: 'ide', logo: 'antigravity', color: '#3186FF' },
  { id: 'kiro', name: 'Kiro', group: 'ide', logo: 'kiro', color: '#9046FF' },
  { id: 'trae', name: 'Trae', group: 'ide', logo: 'trae', color: '#FF4D4D' },
  { id: 'zed', name: 'Zed', group: 'ide', logo: 'zed', color: '#084CCF' },
  { id: 'junie', name: 'Junie', group: 'ide', logo: 'junie', color: '#101010' },
  // Coding agents
  { id: 'claude-code', name: 'Claude Code', group: 'agent', logo: 'claudecode', color: '#D97757' },
  { id: 'codex', name: 'Codex', group: 'agent', logo: 'codex', color: '#101010' },
  { id: 'gemini-cli', name: 'Gemini CLI', group: 'agent', logo: 'geminicli', color: '#3186FF' },
  { id: 'github-copilot', name: 'GitHub Copilot', group: 'agent', logo: 'githubcopilot', color: '#101010' },
  { id: 'devin', name: 'Devin', group: 'agent', logo: 'devin', color: '#101010' },
  { id: 'amp', name: 'Amp', group: 'agent', logo: 'amp', color: '#F34E3F' },
  { id: 'opencode', name: 'OpenCode', group: 'agent', logo: 'opencode', color: '#101010' },
  { id: 'aider', name: 'Aider', group: 'agent', color: '#14B014' },
  { id: 'jules', name: 'Jules', group: 'agent', color: '#715CD7' },
  // Editor extensions
  { id: 'cline', name: 'Cline', group: 'extension', logo: 'cline', color: '#101010' },
  { id: 'roo-code', name: 'Roo Code', group: 'extension', logo: 'roocode', color: '#101010' },
  { id: 'kilo-code', name: 'Kilo Code', group: 'extension', logo: 'kilocode', color: '#101010' },
  // App builders
  { id: 'lovable', name: 'Lovable', group: 'builder', logo: 'lovable', color: '#FF4F8B' },
  { id: 'bolt', name: 'Bolt', group: 'builder', logo: 'bolt', color: '#F59E0B' },
  { id: 'v0', name: 'v0', group: 'builder', logo: 'v0', color: '#101010' },
  { id: 'replit-agent', name: 'Replit Agent', group: 'builder', logo: 'replit', color: '#F26207' },
  { id: 'base44', name: 'Base44', group: 'builder', color: '#FF6B35' },
  { id: 'emergent', name: 'Emergent', group: 'builder', color: '#101010' },
  { id: 'mocha', name: 'Mocha', group: 'builder', color: '#8B5E3C' },
  { id: 'google-ai-studio', name: 'Google AI Studio', group: 'builder', logo: 'aistudio', color: '#3186FF' },
  { id: 'firebase-studio', name: 'Firebase Studio', group: 'builder', logo: 'firebase', color: '#DD2C00' },
  { id: 'figma-make', name: 'Figma Make', group: 'builder', logo: 'figma', color: '#F24E1E' },
  { id: 'rork', name: 'Rork', group: 'builder', color: '#101010' },
  { id: 'vibecode', name: 'Vibecode', group: 'builder', color: '#6D4AFF' },
  // Creative
  { id: 'midjourney', name: 'Midjourney', group: 'creative', logo: 'midjourney', color: '#101010' },
];

// Old ids still found in saved data, mapped to their current tool
const TOOL_ALIASES: Record<string, string> = {
  windsurf: 'devin-desktop',
  claude: 'claude-code',
  gemini: 'gemini-cli',
  replit: 'replit-agent',
  vercel: 'v0',
  copilot: 'github-copilot',
};

export const getTool = (id: string): Tool | undefined => {
  const normalized = id.toLowerCase().replace(/\s+/g, '-');
  const resolved = TOOL_ALIASES[normalized] ?? normalized;
  return TOOLS.find((t) => t.id === resolved);
};

// ---------------------------------------------------------------- models

export interface ModelCompany {
  id: string;
  name: string;
  logo?: LogoKey;
  // Use the single-colour logo even if a full-colour one exists (e.g. Kimi's is white on light pills)
  monoLogo?: boolean;
  // Brand colour: tints single-colour logos and is the model's accent everywhere
  color: string;
}

export const MODEL_COMPANIES: ModelCompany[] = [
  { id: 'anthropic', name: 'Anthropic', logo: 'claude', color: '#D97757' },
  { id: 'openai', name: 'OpenAI', logo: 'openai', color: '#101010' },
  { id: 'google', name: 'Google', logo: 'gemini', color: '#3186FF' },
  { id: 'xai', name: 'xAI', logo: 'grok', color: '#101010' },
  { id: 'meta', name: 'Meta', logo: 'meta', color: '#0081FB' },
  { id: 'deepseek', name: 'DeepSeek', logo: 'deepseek', color: '#4D6BFE' },
  { id: 'qwen', name: 'Qwen', logo: 'qwen', color: '#615CED' },
  { id: 'mistral', name: 'Mistral', logo: 'mistral', color: '#FA520F' },
  { id: 'moonshot', name: 'Moonshot', logo: 'kimi', monoLogo: true, color: '#101010' },
  { id: 'zai', name: 'Z.ai', logo: 'zai', color: '#101010' },
  { id: 'minimax', name: 'MiniMax', logo: 'minimax', color: '#F23F5D' },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'xiaomimimo', color: '#FF6900' },
  { id: 'nvidia', name: 'NVIDIA', logo: 'nvidia', color: '#76B900' },
  { id: 'bytedance', name: 'ByteDance', logo: 'bytedance', color: '#325AB4' },
  { id: 'thinkingmachines', name: 'Thinking Machines', color: '#101010' },
];

export interface Model {
  name: string;
  company: string;
  // Gemma is Google's but has its own mark
  logo?: LogoKey;
}

export const MODELS: Model[] = [
  { name: 'Claude Fable 5.1', company: 'anthropic' },
  { name: 'Claude Opus 5.5', company: 'anthropic' },
  { name: 'Claude Sonnet 5.5', company: 'anthropic' },
  { name: 'Claude Haiku 5.5', company: 'anthropic' },
  { name: 'Claude Opus 5', company: 'anthropic' },
  { name: 'Claude Sonnet 5', company: 'anthropic' },
  { name: 'Claude Opus 4.8', company: 'anthropic' },
  { name: 'GPT-6.1 Sol', company: 'openai' },
  { name: 'GPT-6 Sol', company: 'openai' },
  { name: 'GPT-6 Luna', company: 'openai' },
  { name: 'GPT-6 Astra', company: 'openai' },
  { name: 'GPT-5.6 Sol', company: 'openai' },
  { name: 'GPT-5.5', company: 'openai' },
  { name: 'GPT-5.5 Pro', company: 'openai' },
  { name: 'GPT-5.3-Codex', company: 'openai' },
  { name: 'GPT Image 2', company: 'openai' },
  { name: 'Gemini 4 Argon', company: 'google' },
  { name: 'Gemini 3.8 Flash', company: 'google' },
  { name: 'Gemini 3.5 Flash-Lite', company: 'google' },
  { name: 'Gemini 3.1 Pro', company: 'google' },
  { name: 'Gemini 3 Deep Think', company: 'google' },
  { name: 'Nano Banana 2.1', company: 'google' },
  { name: 'Gemma 4', company: 'google', logo: 'gemma' },
  { name: 'Grok 4.7', company: 'xai' },
  { name: 'Grok Build 0.1', company: 'xai' },
  { name: 'Muse Spark 1.3', company: 'meta' },
  { name: 'DeepSeek V4.1 Flash', company: 'deepseek' },
  { name: 'DeepSeek V4 Pro', company: 'deepseek' },
  { name: 'Qwen3.8 Max', company: 'qwen' },
  { name: 'Qwen3.8 Flash', company: 'qwen' },
  { name: 'Qwen3 Coder Next', company: 'qwen' },
  { name: 'Mistral Large 4', company: 'mistral' },
  { name: 'Mistral Medium 3.5', company: 'mistral' },
  { name: 'Kimi K3', company: 'moonshot' },
  { name: 'Kimi K2.7 Code', company: 'moonshot' },
  { name: 'GLM-5.3', company: 'zai' },
  { name: 'GLM 5.3 Fast', company: 'zai' },
  { name: 'MiniMax M3', company: 'minimax' },
  { name: 'MiMo V2.6 Pro', company: 'xiaomi' },
  { name: 'Nemotron 3 Ultra', company: 'nvidia' },
  { name: 'Seed 2.1 Turbo', company: 'bytedance' },
  { name: 'Inkling', company: 'thinkingmachines' },
];

export const MODEL_NAMES = MODELS.map((m) => m.name);

// Works for older or free-typed model names too, by matching the family prefix
const COMPANY_PREFIXES: [RegExp, string][] = [
  [/^claude/i, 'anthropic'],
  [/^(gpt|o\d|chatgpt)/i, 'openai'],
  [/^(gemini|gemma|nano banana)/i, 'google'],
  [/^grok/i, 'xai'],
  [/^(muse|llama)/i, 'meta'],
  [/^deepseek/i, 'deepseek'],
  [/^qwen/i, 'qwen'],
  [/^(mistral|codestral|devstral)/i, 'mistral'],
  [/^kimi/i, 'moonshot'],
  [/^glm/i, 'zai'],
  [/^minimax/i, 'minimax'],
  [/^mimo/i, 'xiaomi'],
  [/^nemotron/i, 'nvidia'],
  [/^seed/i, 'bytedance'],
];

export const getModelBrand = (modelName: string): { company?: ModelCompany; logo?: LogoKey } => {
  const exact = MODELS.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
  const companyId = exact?.company ?? COMPANY_PREFIXES.find(([re]) => re.test(modelName.trim()))?.[1];
  const company = MODEL_COMPANIES.find((c) => c.id === companyId);
  return { company, logo: exact?.logo ?? company?.logo };
};

// ---------------------------------------------------------------- categories

export const CATEGORIES = [
  'SaaS',
  'Web Apps',
  'Mobile Apps',
  'Desktop Apps',
  'AI Agents',
  'MCP Servers',
  'CLI Tools',
  'Browser Extensions',
  'IDE Extensions',
  'APIs & SDKs',
  'Bots',
  'Automations',
  'Games',
  'Design Tools',
  'Data & Analytics',
  'Open Source',
  'Templates',
  'Experiments',
] as const;
