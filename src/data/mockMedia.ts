import type { MediaShot, MockupSettings } from '../components/mockup/types';
import { GRADIENT_BACKGROUNDS, MESH_BACKGROUNDS, SOLID_BACKGROUNDS, DEFAULT_SETTINGS } from '../components/mockup/presets';
import { detectFrame } from '../components/mockup/layout';

// Mock-only media: Dribbble shots hotlinked from their CDN, for previewing the feed. `source` credits each shot.
// Replace with real uploads before launch.
interface MockAsset {
  kind: MediaShot['kind'];
  src: string;
  width: number;
  height: number;
  poster?: string;
  previewSrc?: string;
  source: string;
}

const MOCK_ASSETS: Record<string, MockAsset[]> = {
  'mcp-fs-inspector': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48726869/file/f957e0001e91bdeb790a0de84b4e8c25.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27651286-MCP-server-API-key' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47963471/file/1f02370b5cd1bdf2462f29e5126f0438.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27442777-OneSignal-MCP-Server' },
  ],
  'prompt-to-landing': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/49030133/file/still-9d57afb52140f36ea8ef8d9fa4cae177.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27733315-Agentix-AI-Agents-Landing-Page' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48971811/file/bdad7e8c23a3cce13ad4601db41f44b9.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27717850-Insura-Insurance-Claims-Landing-Page' },
  ],
  'multimodal-video-cli': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/49067633/file/ed4438692db1138edd85cc2ca60d8c59.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27743686-AI-Video-Creation-Platform-Dashboard' },
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/43831249/file/large-5137609bd50f6266417d1f75f317b7a0.mp4', poster: 'https://cdn.dribbble.com/userupload/43831248/file/still-dd611341941b578a0c261a709d8ad988.png?format=webp&resize=1200x900&vertical=center', width: 1440, height: 1080, source: 'https://dribbble.com/shots/26190441-AI-powered-Video-Editor-App' },
  ],
  'tab-organizer-ai': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/45271267/file/ed5fee169c3ef5803699c13f20029598.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26638310-BeyondTen-Chrome-Extension-Design-for-Productivity' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/15598516/file/original-1464a90777956dab906f3d8e925330db.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/24521280-Bridge-Chrome-Extension' },
  ],
  'synthwave-retro-runner': [
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/48332661/file/large-c3f1af509f3fcbeca7c0cf3138022b9b.mp4', poster: 'https://cdn.dribbble.com/userupload/48332660/file/still-c0cb3827e9d9138b35fc8472b19739ff.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/48332661/file/small-90e14d541439f29c621ce286d7e7d7e7.mp4', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27544441-Animated-Adventure-Game-UI-for-Mobile-Tablet' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47241986/file/d218e9b42d346182eb28c46f31a17d3f.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27236969-Mobile-Idle-Game-UI-Void-Conqueror' },
  ],
  'whisper-code-assistant': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47593598/file/6449876c51a5b56886f3e13e27b1f83b.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27338117-AI-Code-Editor' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/46803319/file/ff704b4567e6acd44c6578a693fc2907.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27106223-Orin-AI-AI-Dev-Assistant-Dashboard' },
  ],
  'schema-weaver-ai': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/17735247/file/original-e0fde2683615c6d0c8633cf7e5378265.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/25243201-API-Documentation-Website-Design' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48879785/file/still-5173a5e6227965dd1b9ea99760531b83.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27692676-API-reference-website-webflow' },
  ],
  'git-scribe-agent': [
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/43814029/file/large-5cea398596fa14286d6a87b7c097e8fd.mp4', poster: 'https://cdn.dribbble.com/userupload/43814028/file/still-04364e0d7091beab64e6f196aff96c4d.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/43814029/file/small-cddfff04ec7a561fd1c102d1680b969d.mp4', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26184861-GitHub-dashboard' },
  ],
  'terminal-rhythm-racer': [
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/45960409/file/large-26524158364b32e3edba796d98d1e4fe.mp4', poster: 'https://cdn.dribbble.com/userupload/45960408/file/still-7c819cdc3a9c365eea8782fe0a9cd590.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/45960409/file/small-48a221a4ea1401debebb0c9b6a16597a.mp4', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26852209-Hex-Strategy-Tactical-RPG-Game-UI-Dark-Fantasy-Aesthetic' },
  ],
  'pocket-ledger': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/44842189/file/8124c3609f73795fa8710499ce24a068.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26504445-Finance-Mobile-App' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48866482/file/edf2254e1ef72ec7ae722d10b185f640.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27689111-Koin-Finance-Mobile-App' },
  ],
  'moodboard-muse': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48381132/file/341800a6b4fde11d06c48a37929653b7.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27557641-SPace-Creative-Agency-Landing-Page' },
  ],
  'standup-bot': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/44629565/file/cda6d27f5bf1303ac2091763e33d63cb.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26439303-AI-Chat-App-Conversation-Response-Flow' },
  ],
  'kanbanana': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/6837655/file/original-aa5cc72adc824cf431189829fe033b90.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/21398356-Kanban-Board-View' },
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/13374451/file/large-b9a069a6f0c1b6ee91bb9ceafb647b1d.mp4', poster: 'https://cdn.dribbble.com/userupload/13374450/file/still-fc59ab46bc5306b2f6c0f075bafa1a29.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/13374451/file/small-49c4143f2b56c8ca39a814870e07df7d.mp4', width: 1600, height: 1080, source: 'https://dribbble.com/shots/23753668-Kanban-Board' },
  ],
  'prompt-diff': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47594291/file/6bdaed7ed701d6e1c74982f6ce85a22c.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27338266-PUKU-Editor-Context-Routing-Based-AI-Editor' },
  ],
  'linear-mcp-bridge': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/49175946/file/17d89cb32a76540c684e41dacaa73c79.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27772181-MCP-gateway-composer-flow' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48625342/file/still-0dd1d0fa8c84db43bef4ca048331cb94.gif?format=webp&resize=1200x900&vertical=center', width: 1200, height: 1200, source: 'https://dribbble.com/shots/27623966-Model-Context-Protocol-MCP-Visualization' },
  ],
  'recipe-remix': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/49197701/file/6f4eb22030dcd62be43beda0785e0989.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27778126-AI-Recipe-App-Smart-Cooking-Assistant' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48692274/file/ed441f173d44fab42d15366ece6f19da.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27642084-Recipe-App-UI-Design-Modern-Cooking-Food-Discovery' },
  ],
  'pulse-analytics': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48023808/file/still-84acc37df60e88b77131f975c6d6768b.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27460154-Dashboard-Design-for-a-Shopify-Intelligence-Platform' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/17860641/file/original-949862c2873e46c6397cd3e6af50493d.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/25284960-Integrate-Client-Dashboard-UI-Design-for-SaaS' },
  ],
  'tab-zen': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/44625713/file/a7ff2fea7ebdefe7d2dd0e036f85f589.png?format=webp&resize=1200x900&vertical=center', width: 1280, height: 800, source: 'https://dribbble.com/shots/26438121-Peek-Chrome-Extension-Extract-Color-Text-Style-From-Websites' },
  ],
  'docs-whisperer': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47654879/file/22b3ee68fd0bd0ce5e8154218f0549bc.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27355767-Payment-platforms-docs' },
  ],
  'pixel-garden': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47794961/file/3e576a5d5202c107b95d92295cf3d561.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27395005-Mobile-Game-UI-Design-Adventure-App-for-Kids' },
  ],
  'shiplog-cli': [
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/43182575/file/large-850995716656c37738b58842bcdc942f.mp4', poster: 'https://cdn.dribbble.com/userupload/43182574/file/still-a0ec8b8edb69c2e597b2ab502ff3c7d7.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/43182575/file/small-2756e857b2bd43a432ff43f84adae3d3.mp4', width: 1600, height: 1200, source: 'https://dribbble.com/shots/25982991-SaaS-Landing-Design' },
  ],
  'inbox-zero-ai': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48503588/file/db88ab1962ce4a2a53b154b72596cde1.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27591527-AI-Workflow-Automation-Dashboard' },
  ],
  'fable-story-studio': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47284953/file/still-d8d5830786bed9cf16a819d380a8cdcb.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27249429-KaultAI-Landing-Page-Autonomous-AI-Workflow' },
  ],
  'habit-loop': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/49107337/file/db846249c888635ffccec5865535881a.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27754304-AI-Powered-Habit-Tracker-Mobile-App' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/15061256/file/original-0ae1b7b932ae8b76e9bfb0c5f28769d2.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/24337687-Habitio-Habit-Tracker-App' },
  ],
  'query-copilot': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/18059185/file/original-3896007c258dca0378b8bcf9ea120b78.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/25350823-Database-Visualisation-Web-Dashboard-for-Mongo-DB' },
  ],
  'figma-to-tailwind-mcp': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/45665462/file/1e39639f7095a29d0454a3ede1e219a0.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 977, source: 'https://dribbble.com/shots/26760654-Playing-with-Figma-MCP-Cursor-Sonnet' },
  ],
  'weather-haiku': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/48925728/file/still-720b6f53d8f6184655588890603c6b5c.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27705014-Weather-App-UI-Modern-Weather-Forecast-Mobile-Design' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/45592515/file/ac349065083b9ae4b64410d38f2a888b.png?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26737353-Weather-app-concept' },
  ],
  'focus-timer': [
    { kind: 'video', src: 'https://cdn.dribbble.com/userupload/48600681/file/large-a39fa60a48b9b1665d21215d0e4585c6.mp4', poster: 'https://cdn.dribbble.com/userupload/48600680/file/still-80d42771052d21e67e3d13a41a445c43.png?format=webp&resize=1200x900&vertical=center', previewSrc: 'https://cdn.dribbble.com/userupload/48600681/file/small-935af604f92a478a4e96fdb6e1941526.mp4', width: 1600, height: 1080, source: 'https://dribbble.com/shots/27617429-Time-Zones' },
  ],
  'agent-arena': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/47115792/file/c9c98d88b1dc44b0c05e412a93af7589.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/27199385-AI-Developer-Platform-UI-SaaS-Dashboard-for-Model-Evaluation' },
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/43955276/file/original-5bc5d1f81f7b57a5ca2db13695e4ff14.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/26229332-SaaS-Dashboard' },
  ],
  'commit-poet': [
    { kind: 'image', src: 'https://cdn.dribbble.com/userupload/39054602/file/original-21ae956b4f8cf85bd7dea38df87e23ea.jpg?format=webp&resize=1200x900&vertical=center', width: 1600, height: 1200, source: 'https://dribbble.com/shots/19102424-XStudio-Code-Editor-App-Dark' },
  ],
};

// Small seeded RNG so every project keeps the same "random" mockup style across reloads
const seededRandom = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

const DARK_BACKGROUNDS = new Set(['#101010', '#545454', GRADIENT_BACKGROUNDS[0], GRADIENT_BACKGROUNDS[7], ...MESH_BACKGROUNDS.slice(3)]);

const randomStyle = (seed: string, asset: MockAsset): MockupSettings => {
  const r = seededRandom(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(r() * list.length)];
  const between = (min: number, max: number) => Math.round(min + r() * (max - min));

  const bgRoll = r();
  const background =
    bgRoll < 0.25 ? pick(SOLID_BACKGROUNDS) : bgRoll < 0.6 ? pick(GRADIENT_BACKGROUNDS) : pick(MESH_BACKGROUNDS);
  const autoFrame = detectFrame(asset.width, asset.height);
  const zoomed = r() < 0.15;

  return {
    ...DEFAULT_SETTINGS,
    frame: autoFrame === 'browser' && r() < 0.4 ? 'none' : autoFrame,
    frameTheme: DARK_BACKGROUNDS.has(background) ? 'dark' : 'light',
    background,
    padding: between(6, 14),
    radius: between(6, 16),
    shadow: pick(['soft', 'deep', 'float'] as const),
    shadowStrength: between(40, 80),
    noise: r() < 0.35 ? between(15, 45) : 0,
    texture: r() < 0.2 ? pick(['dots', 'grid', 'lines'] as const) : 'none',
    textureOpacity: between(25, 45),
    zoom: zoomed ? 1.2 + r() * 0.3 : 1,
    focusX: zoomed ? 0.3 + r() * 0.4 : 0.5,
    focusY: zoomed ? 0.3 + r() * 0.4 : 0.5,
  };
};

export const getMockMedia = (slug: string): MediaShot[] =>
  (MOCK_ASSETS[slug] || []).map((asset, i) => ({
    id: `${slug}-shot-${i + 1}`,
    src: asset.src,
    kind: asset.kind,
    name: `${slug}-${i + 1}`,
    width: asset.width,
    height: asset.height,
    poster: asset.poster,
    previewSrc: asset.previewSrc,
    settings: randomStyle(`${slug}:${i}`, asset),
  }));
