import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import type { CategoryType, FilterState } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  totalFilteredCount: number;
}

const AI_TOOLS = [
  { id: 'claude-code', name: 'Claude Code', dotColor: '#D97706' },
  { id: 'cursor', name: 'Cursor', dotColor: '#0284C7' },
  { id: 'windsurf', name: 'Windsurf', dotColor: '#6366F1' },
  { id: 'v0', name: 'v0', dotColor: '#101010' },
  { id: 'bolt', name: 'Bolt', dotColor: '#F59E0B' },
  { id: 'lovable', name: 'Lovable', dotColor: '#EC4899' },
  { id: 'replit-agent', name: 'Replit Agent', dotColor: '#F97316' },
  { id: 'gemini-cli', name: 'Gemini CLI', dotColor: '#10B981' },
  { id: 'midjourney', name: 'Midjourney', dotColor: '#8B5CF6' },
  { id: 'fable-5', name: 'Fable 5', dotColor: '#64748B' },
];

const CATEGORIES: CategoryType[] = [
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

const AI_MODELS = [
  { name: 'Claude 3.7 Sonnet', dotColor: '#D97706' },
  { name: 'Claude 3.5 Sonnet', dotColor: '#D97706' },
  { name: 'GPT-4o', dotColor: '#10B981' },
  { name: 'Gemini 2.0 Flash', dotColor: '#0284C7' },
  { name: 'DeepSeek R1', dotColor: '#3B82F6' },
  { name: 'o3-mini', dotColor: '#10B981' },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalFilteredCount,
}) => {
  const [draftFilters, setDraftFilters] = React.useState<FilterState>(filters);

  React.useEffect(() => {
    setDraftFilters(filters);
  }, [filters, isOpen]);

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
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onClose();
  };

  const activeCount =
    draftFilters.aiTools.length +
    draftFilters.categories.length +
    draftFilters.aiModels.length +
    (draftFilters.status !== 'all' ? 1 : 0);

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

          {/* Drawer Body - Seamless with fast-fading X button on exit */}
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
            
            {/* BIG Floating White X Button: Fades out instantly (0.12s) on exit so it NEVER lingers */}
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

              {/* Right Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                
                {/* reset all button */}
                <button
                  onClick={handleReset}
                  className="h-[27px] px-3 rounded-full bg-[#E9E9E9] text-[#101010] hover:bg-[#E0E0E0] transition-colors flex items-center gap-1 font-sans text-[11.5px] font-medium cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>reset all</span>
                </button>

                {/* apply filters button */}
                <button
                  onClick={handleApply}
                  className="btn-main relative overflow-hidden flex items-center justify-center gap-1 !h-[27px] !px-3 font-sans text-[11.5px] font-medium"
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
              <div>
                <div className="mb-1.5">
                  <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                    ai tools
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {AI_TOOLS.map((t) => {
                    const active = draftFilters.aiTools.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTool(t.id)}
                        className={`tool-pill cursor-pointer transition-colors ${
                          active ? '!bg-[#101010] !text-white' : 'hover:!bg-[#D9D9D9]'
                        }`}
                      >
                        <div
                          className="w-1.5 h-1.5 shrink-0"
                          style={{ backgroundColor: active ? '#FFFFFF' : t.dotColor }}
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

              {/* Section 2: categories */}
              <div>
                <div className="mb-1.5">
                  <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                    categories
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
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

              {/* Section 3: ai models */}
              <div>
                <div className="mb-1.5">
                  <span className="text-[#101010] font-sans text-[11px] font-medium lowercase tracking-normal">
                    ai models
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {AI_MODELS.map((m) => {
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

              {/* Section 4: status */}
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

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
