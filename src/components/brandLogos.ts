// AI brand logos, bundled as raw SVG strings (only the ones listed here end up in the build).
// Most come from LobeHub Icons (MIT, @lobehub/icons-static-svg); Zed and Firebase from Simple Icons (CC0).
// `mono` is single-colour (currentColor); `color` is the brand's full-colour version when one exists.

import aistudio_mono from '@lobehub/icons-static-svg/icons/aistudio.svg?raw';
import amp_mono from '@lobehub/icons-static-svg/icons/amp.svg?raw';
import amp_color from '@lobehub/icons-static-svg/icons/amp-color.svg?raw';
import antigravity_mono from '@lobehub/icons-static-svg/icons/antigravity.svg?raw';
import antigravity_color from '@lobehub/icons-static-svg/icons/antigravity-color.svg?raw';
import bytedance_mono from '@lobehub/icons-static-svg/icons/bytedance.svg?raw';
import bytedance_color from '@lobehub/icons-static-svg/icons/bytedance-color.svg?raw';
import claude_mono from '@lobehub/icons-static-svg/icons/claude.svg?raw';
import claude_color from '@lobehub/icons-static-svg/icons/claude-color.svg?raw';
import claudecode_mono from '@lobehub/icons-static-svg/icons/claudecode.svg?raw';
import claudecode_color from '@lobehub/icons-static-svg/icons/claudecode-color.svg?raw';
import cline_mono from '@lobehub/icons-static-svg/icons/cline.svg?raw';
import codex_mono from '@lobehub/icons-static-svg/icons/codex.svg?raw';
import codex_color from '@lobehub/icons-static-svg/icons/codex-color.svg?raw';
import cursor_mono from '@lobehub/icons-static-svg/icons/cursor.svg?raw';
import deepseek_mono from '@lobehub/icons-static-svg/icons/deepseek.svg?raw';
import deepseek_color from '@lobehub/icons-static-svg/icons/deepseek-color.svg?raw';
import devin_mono from '@lobehub/icons-static-svg/icons/devin.svg?raw';
import devin_color from '@lobehub/icons-static-svg/icons/devin-color.svg?raw';
import figma_mono from '@lobehub/icons-static-svg/icons/figma.svg?raw';
import figma_color from '@lobehub/icons-static-svg/icons/figma-color.svg?raw';
import gemini_mono from '@lobehub/icons-static-svg/icons/gemini.svg?raw';
import gemini_color from '@lobehub/icons-static-svg/icons/gemini-color.svg?raw';
import geminicli_mono from '@lobehub/icons-static-svg/icons/geminicli.svg?raw';
import geminicli_color from '@lobehub/icons-static-svg/icons/geminicli-color.svg?raw';
import gemma_mono from '@lobehub/icons-static-svg/icons/gemma.svg?raw';
import gemma_color from '@lobehub/icons-static-svg/icons/gemma-color.svg?raw';
import githubcopilot_mono from '@lobehub/icons-static-svg/icons/githubcopilot.svg?raw';
import grok_mono from '@lobehub/icons-static-svg/icons/grok.svg?raw';
import junie_mono from '@lobehub/icons-static-svg/icons/junie.svg?raw';
import junie_color from '@lobehub/icons-static-svg/icons/junie-color.svg?raw';
import kilocode_mono from '@lobehub/icons-static-svg/icons/kilocode.svg?raw';
import kimi_mono from '@lobehub/icons-static-svg/icons/kimi.svg?raw';
import kimi_color from '@lobehub/icons-static-svg/icons/kimi-color.svg?raw';
import kiro_mono from '@lobehub/icons-static-svg/icons/kiro.svg?raw';
import kiro_color from '@lobehub/icons-static-svg/icons/kiro-color.svg?raw';
import lovable_mono from '@lobehub/icons-static-svg/icons/lovable.svg?raw';
import lovable_color from '@lobehub/icons-static-svg/icons/lovable-color.svg?raw';
import meta_mono from '@lobehub/icons-static-svg/icons/meta.svg?raw';
import meta_color from '@lobehub/icons-static-svg/icons/meta-color.svg?raw';
import midjourney_mono from '@lobehub/icons-static-svg/icons/midjourney.svg?raw';
import minimax_mono from '@lobehub/icons-static-svg/icons/minimax.svg?raw';
import minimax_color from '@lobehub/icons-static-svg/icons/minimax-color.svg?raw';
import mistral_mono from '@lobehub/icons-static-svg/icons/mistral.svg?raw';
import mistral_color from '@lobehub/icons-static-svg/icons/mistral-color.svg?raw';
import nvidia_mono from '@lobehub/icons-static-svg/icons/nvidia.svg?raw';
import nvidia_color from '@lobehub/icons-static-svg/icons/nvidia-color.svg?raw';
import openai_mono from '@lobehub/icons-static-svg/icons/openai.svg?raw';
import opencode_mono from '@lobehub/icons-static-svg/icons/opencode.svg?raw';
import qwen_mono from '@lobehub/icons-static-svg/icons/qwen.svg?raw';
import qwen_color from '@lobehub/icons-static-svg/icons/qwen-color.svg?raw';
import replit_mono from '@lobehub/icons-static-svg/icons/replit.svg?raw';
import replit_color from '@lobehub/icons-static-svg/icons/replit-color.svg?raw';
import roocode_mono from '@lobehub/icons-static-svg/icons/roocode.svg?raw';
import trae_mono from '@lobehub/icons-static-svg/icons/trae.svg?raw';
import trae_color from '@lobehub/icons-static-svg/icons/trae-color.svg?raw';
import v0_mono from '@lobehub/icons-static-svg/icons/v0.svg?raw';
import xiaomimimo_mono from '@lobehub/icons-static-svg/icons/xiaomimimo.svg?raw';
import zai_mono from '@lobehub/icons-static-svg/icons/zai.svg?raw';
import zed_simple from 'simple-icons/icons/zedindustries.svg?raw';
import firebase_simple from 'simple-icons/icons/firebase.svg?raw';

export interface LogoSvg {
  mono: string;
  color?: string;
}

// Simple Icons ship without a fill; give them currentColor like the LobeHub mono set
const withCurrentColor = (svg: string) => svg.replace('<svg ', '<svg fill="currentColor" ');

// Bolt isn't in either set; keep the app's existing mark
const BOLT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>';

const LOGO_DATA = {
  aistudio: { mono: aistudio_mono },
  amp: { mono: amp_mono, color: amp_color },
  antigravity: { mono: antigravity_mono, color: antigravity_color },
  bytedance: { mono: bytedance_mono, color: bytedance_color },
  claude: { mono: claude_mono, color: claude_color },
  claudecode: { mono: claudecode_mono, color: claudecode_color },
  cline: { mono: cline_mono },
  codex: { mono: codex_mono, color: codex_color },
  cursor: { mono: cursor_mono },
  deepseek: { mono: deepseek_mono, color: deepseek_color },
  devin: { mono: devin_mono, color: devin_color },
  figma: { mono: figma_mono, color: figma_color },
  gemini: { mono: gemini_mono, color: gemini_color },
  geminicli: { mono: geminicli_mono, color: geminicli_color },
  gemma: { mono: gemma_mono, color: gemma_color },
  githubcopilot: { mono: githubcopilot_mono },
  grok: { mono: grok_mono },
  junie: { mono: junie_mono, color: junie_color },
  kilocode: { mono: kilocode_mono },
  kimi: { mono: kimi_mono, color: kimi_color },
  kiro: { mono: kiro_mono, color: kiro_color },
  lovable: { mono: lovable_mono, color: lovable_color },
  meta: { mono: meta_mono, color: meta_color },
  midjourney: { mono: midjourney_mono },
  minimax: { mono: minimax_mono, color: minimax_color },
  mistral: { mono: mistral_mono, color: mistral_color },
  nvidia: { mono: nvidia_mono, color: nvidia_color },
  openai: { mono: openai_mono },
  opencode: { mono: opencode_mono },
  qwen: { mono: qwen_mono, color: qwen_color },
  replit: { mono: replit_mono, color: replit_color },
  roocode: { mono: roocode_mono },
  trae: { mono: trae_mono, color: trae_color },
  v0: { mono: v0_mono },
  xiaomimimo: { mono: xiaomimimo_mono },
  zai: { mono: zai_mono },
  zed: { mono: withCurrentColor(zed_simple) },
  firebase: { mono: withCurrentColor(firebase_simple) },
  bolt: { mono: BOLT },
} satisfies Record<string, LogoSvg>;

export type LogoKey = keyof typeof LOGO_DATA;
export const LOGOS: Record<LogoKey, LogoSvg> = LOGO_DATA;
