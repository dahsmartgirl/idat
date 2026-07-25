import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import type { CategoryType, FilterState } from '../types';
import { ToolLogo } from './ToolLogos';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  totalFilteredCount: number;
  availableTools?: string[];
  availableCategories?: string[];
  availableModels?: string[];
  showStatus?: boolean;
}

const ALL_AI_TOOLS = [
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'windsurf', name: 'Windsurf' },
  { id: 'v0', name: 'v0' },
  { id: 'bolt', name: 'Bolt' },
  { id: 'lovable', name: 'Lovable' },
  { id: 'replit-agent', name: 'Replit Agent' },
  { id: 'gemini-cli', name: 'Gemini CLI' },
  { id: 'midjourney', name: 'Midjourney' },
  { id: 'fable-5', name: 'Fable 5' },
];

const ALL_CATEGORIES: CategoryType[] = [
  'SaaS',
  'Chrome Extensions',
  'MCP Servers',
  'APIs',
  'Mobile Apps',
  'Games',
  'CLI Tools',
  'VS Code Extensions',
  'Experiments',
];

const ALL_AI_MODELS = [
  { id: 'claude-3.7', name: 'Claude 3.7 Sonnet', dotColor: '#D97757' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', dotColor: '#D97757' },
  { id: 'gpt-4o', name: 'GPT-4o', dotColor: '#10B981' },
  { id: 'gemini-2.0', name: 'Gemini 2.0 Flash', dotColor: '#0284C7' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', dotColor: '#3B82F6' },
  { id: 'o3-mini', name: 'o3-mini', dotColor: '#10B981' },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalFilteredCount,
  availableTools,
  availableCategories,
  availableModels,
  showStatus = true,
}) => {
  const [draftFilters, setDraftFilters] = React.useState<FilterState>(filters);

  // Filter options based on available props if supplied
  const aiToolsList = React.useMemo(() => {
    if (!availableTools) return ALL_AI_TOOLS;
    return ALL_AI_TOOLS.filter((t) => availableTools.includes(t.id));
  }, [availableTools]);

  const categoriesList = React.useMemo(() => {
    if (!availableCategories) return ALL_CATEGORIES;
    return ALL_CATEGORIES.filter((c) => availableCategories.includes(c));
  }, [availableCategories]);

  const aiModelsList = React.useMemo(() => {
    if (!availableModels) return ALL_AI_MODELS;
    return ALL_AI_MODELS.filter((m) => availableModels.includes(m.name));
  }, [availableModels]);

  // Synchronize draft state when drawer opens
  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters, isOpen]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleTool = (toolId: string) => {
    setDraftFilters((prev) => {
      const exists = prev.aiTools.includes(toolId);
      return {
        ...prev,
        aiTools: exists
          ? prev.aiTools.filter((t) => t !== toolId)
          : [...prev.aiTools, toolId],
      };
    });
  };

  const toggleCategory = (cat: CategoryType) => {
    setDraftFilters((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const toggleModel = (model: string) => {
    setDraftFilters((prev) => {
      const exists = prev.aiModels.includes(model);
      return {
        ...prev,
        aiModels: exists
          ? prev.aiModels.filter((m) => m !== model)
          : [...prev.aiModels, model],
      };
    });
  };

  const setStatus = (status: 'all' | 'claimed' | 'unclaimed') => {
    setDraftFilters((prev) => ({ ...prev, status }));
  };

  const handleReset = () => {
    const emptyFilters: FilterState = {
      aiTools: [],
      categories: [],
      aiModels: [],
      status: 'all',
    };
    setDraftFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const activeCount =
    draftFilters.aiTools.length +
    draftFilters.categories.length +
    draftFilters.aiModels.length +
    (showStatus && draftFilters.status !== 'all' ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[4px]"
          />

          {/* Drawer Body - Accommodates Solid White Floating X button */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80 || info.velocity.x > 400) {
                onClose();
              }
            }}
            className="relative w-[calc(100vw-64px)] sm:w-[370px] max-w-[370px] h-full bg-[#F2F1F3] shadow-2xl flex flex-col z-50 overflow-visible touch-pan-y"
          >
            
            {/* Solid White Floating X Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.12 }}
              onClick={onClose}
              className="absolute -left-13 top-5 sm:-left-16 sm:top-6 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#101010] rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-[#E9E9E9] z-50"
              title="Close filter drawer"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </motion.button>

            {/* Drawer Header */}
            <div className="px-5 sm:px-7 pt-6 sm:pt-7 pb-2 flex items-center justify-between bg-[#F2F1F3]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-inter-20 !text-[#545454] tracking-tight">
                  filter
                </h2>
                {activeCount > 0 && (
                  <span className="badge-unclaimed !bg-[#101010] !text-white">
                    {activeCount}
                  </span>
                )}
              </div>

              {/* Right Controls: reset all (btn-secondary) + apply (btn-main) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                
                {/* reset all button */}
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center gap-1"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3 text-[#101010]" />
                  <span>reset all</span>
                </button>

                {/* apply filters button */}
                <button
                  onClick={handleApply}
                  className="btn-main relative overflow-hidden flex items-center justify-center gap-1"
                  title="Apply filters"
                >
                  <motion.div
                    className="absolute -inset-y-4 w-full h-[200%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] pointer-events-none blur-[0.5px]"
                    initial={{ x: '-150%', y: '-40%' }}
                    animate={{ x: ['-150%', '160%'], y: ['-40%', '40%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 4.2,
                      duration: 1.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  />
                  <span className="relative z-10 text-white/90">
                    apply ({totalFilteredCount})
                  </span>
                </button>

              </div>
            </div>

            {/* Scrollable Filter Options Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 space-y-5">
              
              {/* Section 1: ai tools */}
              {aiToolsList.length > 0 && (
                <div>
                  <div className="mb-1.5">
                    <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                      ai tools
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {aiToolsList.map((t) => {
                      const active = draftFilters.aiTools.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTool(t.id)}
                          className={`tool-pill cursor-pointer transition-colors ${
                            active ? '!bg-[#101010] !text-white' : 'hover:!bg-[#D9D9D9]'
                          }`}
                        >
                          <ToolLogo
                            toolId={t.id}
                            size={11}
                            className={active ? '[&>svg]:!fill-white [&>path]:!fill-white text-white' : ''}
                          />
                          <span className={`text-mono-10 ${active ? '!text-white' : ''}`}>
                            {t.name}
                          </span>
                          {active && <X className="w-2.5 h-2.5 ml-0.5 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: categories */}
              {categoriesList.length > 0 && (
                <div>
                  <div className="mb-1.5">
                    <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                      categories
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {categoriesList.map((cat) => {
                      const active = draftFilters.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`tool-pill cursor-pointer transition-colors ${
                            active ? '!bg-[#101010] !text-white' : 'hover:!bg-[#D9D9D9]'
                          }`}
                        >
                          <span className={`text-mono-10 ${active ? '!text-white' : ''}`}>
                            {cat}
                          </span>
                          {active && <X className="w-2.5 h-2.5 ml-0.5 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: ai models */}
              {aiModelsList.length > 0 && (
                <div>
                  <div className="mb-1.5">
                    <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                      ai models
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {aiModelsList.map((m) => {
                      const active = draftFilters.aiModels.includes(m.name);
                      return (
                        <button
                          key={m.name}
                          onClick={() => toggleModel(m.name)}
                          className={`tool-pill cursor-pointer transition-colors ${
                            active ? '!bg-[#101010] !text-white' : 'hover:!bg-[#D9D9D9]'
                          }`}
                        >
                          <div
                            className="w-1.5 h-1.5 shrink-0"
                            style={{ backgroundColor: active ? '#FFFFFF' : m.dotColor }}
                          />
                          <span className={`text-mono-10 ${active ? '!text-white' : ''}`}>
                            {m.name}
                          </span>
                          {active && <X className="w-2.5 h-2.5 ml-0.5 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 4: status (only rendered when showStatus is true) */}
              {showStatus && (
                <div>
                  <span className="block text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal mb-1.5">
                    status
                  </span>
                  
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'claimed', label: 'Claimed' },
                      { id: 'unclaimed', label: 'Unclaimed' },
                    ].map((st) => {
                      const active = draftFilters.status === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setStatus(st.id as 'all' | 'claimed' | 'unclaimed')}
                          className={`tool-pill flex-1 justify-center cursor-pointer transition-colors ${
                            active ? '!bg-[#101010] !text-white' : 'hover:!bg-[#D9D9D9]'
                          }`}
                        >
                          <span className={`text-mono-10 ${active ? '!text-white' : ''}`}>
                            {st.label}
                          </span>
                          {active && <X className="w-2.5 h-2.5 ml-1 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
