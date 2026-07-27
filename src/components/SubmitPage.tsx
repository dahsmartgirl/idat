import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import type { Project, CategoryType } from '../types';
import { getBuilderGradient } from '../types';
import { ProjectCard } from './ProjectCard';
import { ToolLogo } from './ToolLogos';

interface SubmitPageProps {
  onSubmitSuccess: (newProject: Partial<Project>) => void;
  projects: Project[];
}

const CATEGORIES: CategoryType[] = [
  'SaaS',
  'Chrome Extensions',
  'MCP Servers',
  'CLI Tools',
  'Games',
  'VS Code Extensions',
  'Mobile Apps',
  'APIs',
  'Experiments'
];

const PREDEFINED_BUILDERS = ['ileri', 'josh', 'maya', 'sarah', 'alex'];
const PREDEFINED_TOOLS = ['claude-code', 'cursor', 'windsurf', 'v0', 'bolt', 'lovable', 'replit-agent', 'gemini-cli', 'midjourney', 'fable-5'];
const PREDEFINED_MODELS = ['Claude 3.7 Sonnet', 'Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 2.0 Flash', 'DeepSeek R1', 'o3-mini'];

const getModelColor = (modelName: string) => {
  const lowercaseName = modelName.toLowerCase();
  if (lowercaseName.includes('claude 3.7')) return '#D97757';
  if (lowercaseName.includes('claude 3.5')) return '#D97757';
  if (lowercaseName.includes('gpt-4o')) return '#10B981';
  if (lowercaseName.includes('gemini 2.0')) return '#0284C7';
  if (lowercaseName.includes('deepseek')) return '#3B82F6';
  if (lowercaseName.includes('o3-mini')) return '#10B981';
  return '#999999';
};

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  isStep1Valid: boolean;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, onStepClick, isStep1Valid }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-3 mb-8 select-none">
      {steps.map((s, idx) => {
        const isCompleted = s < currentStep;
        const isActive = s === currentStep;
        const isClickable = s === 1 || isStep1Valid;

        return (
          <React.Fragment key={s}>
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick(s)}
              className={`flex items-center gap-2 border-none bg-transparent p-0 transition-opacity outline-none ${
                isClickable ? 'cursor-pointer hover:opacity-85' : 'cursor-not-allowed opacity-40'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-sans transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-[#0011FF] text-white font-bold' 
                    : isActive 
                      ? 'border border-[#0011FF] text-[#0011FF] font-semibold bg-transparent' 
                      : 'bg-[#D0D0D0] text-[#545454]'
                }`}
              >
                {isCompleted ? '✓' : s}
              </div>
              <span className={`text-[11.5px] font-sans transition-colors lowercase ${
                isActive || isCompleted ? 'text-[#101010] font-normal' : 'text-[#777777] font-normal'
              }`}>
                {s === 1 ? 'details & notes' : s === 2 ? 'media assets' : 'preview'}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div className={`h-[1px] w-6 transition-colors ${
                isCompleted ? 'bg-[#0011FF]' : 'bg-[#D0D0D0]'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const SubmitPage: React.FC<SubmitPageProps> = ({ onSubmitSuccess, projects }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditing = !!slug;

  // Find project if editing
  const editingProject = isEditing ? (projects.find((p) => p.slug === slug) || null) : null;

  // Stepped flow (Step 1 or 2 on desktop; 1, 2, or 3 on mobile)
  const [step, setStep] = useState(1);

  // Field states
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<CategoryType>('SaaS');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Links
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGitHubUrl] = useState('');

  // Creators Tag Pills & Autocomplete
  const [creatorInput, setCreatorInput] = useState('');
  const [creators, setCreators] = useState<string[]>(['ileri']);
  const [activeBuilderSuggestion, setActiveBuilderSuggestion] = useState(0);
  const creatorInputRef = useRef<HTMLInputElement>(null);

  // AI Stack Tag Pills & Autocomplete
  const [toolInput, setToolInput] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [activeToolSuggestion, setActiveToolSuggestion] = useState(0);
  const toolInputRef = useRef<HTMLInputElement>(null);

  const [modelInput, setModelInput] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [activeModelSuggestion, setActiveModelSuggestion] = useState(0);
  const modelInputRef = useRef<HTMLInputElement>(null);

  // Build Notes
  const [buildNotesText, setBuildNotesText] = useState('');

  // Touched states for form error styling
  const [nameTouched, setNameTouched] = useState(false);
  const [taglineTouched, setTaglineTouched] = useState(false);
  const [demoUrlTouched, setDemoUrlTouched] = useState(false);
  const [creatorsTouched, setCreatorsTouched] = useState(false);
  const [toolsTouched, setToolsTouched] = useState(false);
  const [modelsTouched, setModelsTouched] = useState(false);
  const [buildNotesTouched, setBuildNotesTouched] = useState(false);

  // Media states
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Showcase Media
  const [mediaOption, setMediaOption] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Close suggestion lists on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Synchronize resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pre-fill on editing load
  useEffect(() => {
    if (isEditing && editingProject) {
      setName(editingProject.name);
      setTagline(editingProject.tagline);
      setCategory(editingProject.category);
      setCreators(editingProject.claimedBy || ['ileri']);
      setDemoUrl(editingProject.demoUrl || '');
      setGitHubUrl(editingProject.githubUrl || '');
      setYoutubeUrl(editingProject.youtubeUrl || '');
      setSelectedTools(editingProject.aiTools || []);
      setSelectedModels(editingProject.aiModel ? [editingProject.aiModel] : []);
      setBuildNotesText(editingProject.buildNotes?.whyBuilt || '');
      setMediaOption(editingProject.youtubeUrl ? 'youtube' : 'upload');
      setUploadedFile(null);
      setCoverImagePreview('');
      
      setNameTouched(false);
      setTaglineTouched(false);
      setDemoUrlTouched(false);
      setCreatorsTouched(false);
      setToolsTouched(false);
      setModelsTouched(false);
      setBuildNotesTouched(false);
    } else {
      // Clear all for new project (AI Stack starts empty)
      setName('');
      setTagline('');
      setCategory('SaaS');
      setCreators(['ileri']);
      setDemoUrl('');
      setGitHubUrl('');
      setYoutubeUrl('');
      setSelectedTools([]);
      setSelectedModels([]);
      setBuildNotesText('');
      setMediaOption('youtube');
      setUploadedFile(null);
      setCoverImagePreview('');

      setNameTouched(false);
      setTaglineTouched(false);
      setDemoUrlTouched(false);
      setCreatorsTouched(false);
      setToolsTouched(false);
      setModelsTouched(false);
      setBuildNotesTouched(false);
    }
  }, [isEditing, editingProject]);

  // Clean preview URLs
  useEffect(() => {
    return () => {
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreview);
      }
    };
  }, [coverImagePreview]);

  // Derived Suggestion Lists
  const cleanCreatorInput = creatorInput.trim().replace('@', '');
  const builderSuggestions = PREDEFINED_BUILDERS.filter(b => 
    (cleanCreatorInput === '' || b.toLowerCase().includes(cleanCreatorInput.toLowerCase())) && 
    !creators.includes(b)
  );

  const toolSuggestions = PREDEFINED_TOOLS.filter(t => 
    t.toLowerCase().includes(toolInput.toLowerCase().trim()) && 
    !selectedTools.includes(t)
  );

  const modelSuggestions = PREDEFINED_MODELS.filter(m => 
    m.toLowerCase().includes(modelInput.toLowerCase().trim()) && 
    !selectedModels.includes(m)
  );

  // Handles Clear
  const handleClear = () => {
    if (step === 1) {
      setName('');
      setTagline('');
      setCategory('SaaS');
      setCreators(['ileri']);
      setDemoUrl('');
      setGitHubUrl('');
      setSelectedTools([]);
      setSelectedModels([]);
      setBuildNotesText('');

      setNameTouched(false);
      setTaglineTouched(false);
      setDemoUrlTouched(false);
      setCreatorsTouched(false);
      setToolsTouched(false);
      setModelsTouched(false);
      setBuildNotesTouched(false);
    } else {
      setCoverImagePreview('');
      setYoutubeUrl('');
      setUploadedFile(null);
    }
  };

  // Tag Builders Helpers
  const handleAddCreator = () => {
    const trimmed = creatorInput.trim().toLowerCase().replace('@', '');
    const match = PREDEFINED_BUILDERS.find(b => b.toLowerCase() === trimmed);
    if (match && !creators.includes(match)) {
      setCreators([...creators, match]);
      setCreatorInput('');
      setCreatorsTouched(true);
      setActiveBuilderSuggestion(0);
    }
  };

  const handleRemoveCreator = (index: number) => {
    if (creators[index].toLowerCase() === 'ileri') return;
    const nextCreators = creators.filter((_, i) => i !== index);
    setCreators(nextCreators);
    setCreatorsTouched(true);
  };

  // Tag Tools Helpers
  const handleAddTool = () => {
    const trimmed = toolInput.trim().toLowerCase();
    const match = PREDEFINED_TOOLS.find(t => t.toLowerCase() === trimmed);
    if (match && !selectedTools.includes(match)) {
      setSelectedTools([...selectedTools, match]);
      setToolInput('');
      setToolsTouched(true);
      setActiveToolSuggestion(0);
    }
  };

  const handleRemoveTool = (index: number) => {
    const nextTools = selectedTools.filter((_, i) => i !== index);
    setSelectedTools(nextTools);
    setToolsTouched(true);
  };

  // Tag Models Helpers
  const handleAddModel = () => {
    const trimmed = modelInput.trim().toLowerCase();
    const match = PREDEFINED_MODELS.find(m => m.toLowerCase() === trimmed);
    if (match && !selectedModels.includes(match)) {
      setSelectedModels([...selectedModels, match]);
      setModelInput('');
      setModelsTouched(true);
      setActiveModelSuggestion(0);
    }
  };

  const handleRemoveModel = (index: number) => {
    const nextModels = selectedModels.filter((_, i) => i !== index);
    setSelectedModels(nextModels);
    setModelsTouched(true);
  };

  // Files
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveUploadedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveCoverFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImagePreview('');
    if (coverImageInputRef.current) coverImageInputRef.current.value = '';
  };

  // Helper to validate Step 1 fields
  const isStep1Valid = () => {
    return name.trim().length > 0 &&
           tagline.trim().length > 0 &&
           demoUrl.trim().length > 0 &&
           demoUrl !== 'https://' &&
           creators.length > 0 &&
           selectedTools.length > 0 &&
           selectedModels.length > 0 &&
           buildNotesText.trim().length > 0;
  };

  const handleNextStep = () => {
    setNameTouched(true);
    setTaglineTouched(true);
    setDemoUrlTouched(true);
    setCreatorsTouched(true);
    setToolsTouched(true);
    setModelsTouched(true);
    setBuildNotesTouched(true);
    if (isStep1Valid()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setTaglineTouched(true);
    setDemoUrlTouched(true);
    setCreatorsTouched(true);
    setToolsTouched(true);
    setModelsTouched(true);
    setBuildNotesTouched(true);

    if (!isStep1Valid()) {
      setStep(1);
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      const cleanDemoUrl = demoUrl === 'https://' ? '' : demoUrl;
      const cleanGithubUrl = githubUrl === 'https://' ? '' : githubUrl;
      const cleanYoutubeUrl = youtubeUrl === 'https://' ? '' : youtubeUrl;

      if (isEditing && editingProject) {
        onSubmitSuccess({
          ...editingProject,
          name,
          tagline,
          category,
          claimedBy: creators,
          demoUrl: cleanDemoUrl,
          githubUrl: cleanGithubUrl,
          youtubeUrl: mediaOption === 'youtube' ? cleanYoutubeUrl : '',
          aiTools: selectedTools,
          primaryTool: selectedTools[0] || '',
          aiModel: selectedModels.join(', '),
          buildNotes: {
            ...editingProject.buildNotes,
            whyBuilt: buildNotesText,
          },
        });
      } else {
        onSubmitSuccess({
          id: `proj-${Date.now()}`,
          name,
          tagline,
          description: tagline,
          category,
          isClaimed: true,
          claimedBy: creators,
          demoUrl: cleanDemoUrl,
          githubUrl: cleanGithubUrl,
          youtubeUrl: mediaOption === 'youtube' ? cleanYoutubeUrl : '',
          aiTools: selectedTools,
          primaryTool: selectedTools[0] || '',
          aiModel: selectedModels.join(', '),
          coverImage: '',
          screenshots: [],
          tags: ['AI-built', category.toLowerCase().replace(/\s+/g, '-')],
          techStack: ['React', 'TypeScript'],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          buildNotes: {
            whyBuilt: buildNotesText,
            aiRoleAndPrompts: '',
            challengesAndFailures: '',
            lessonsLearned: '',
          },
          timeline: [],
        });
      }

      setSubmitted(false);
      navigate('/');
    }, 800);
  };

  // Preview Panel: renders the actual ProjectCard directly (no header title)
  const renderPreviewPanel = () => {
    const tempProject: Project = {
      id: 'temp-preview-id',
      slug: 'temp-preview-slug',
      name: name.trim(),
      tagline: tagline.trim(),
      description: tagline.trim(),
      category: category,
      isClaimed: creators.length > 0,
      claimedBy: creators,
      primaryTool: selectedTools[0] || '',
      aiTools: selectedTools,
      aiModel: selectedModels.join(', '),
      coverImage: coverImagePreview || '',
      screenshots: [],
      tags: [],
      techStack: [],
      createdAt: '',
      updatedAt: '',
      buildNotes: {
        whyBuilt: buildNotesText,
        aiRoleAndPrompts: '',
        challengesAndFailures: '',
        lessonsLearned: ''
      },
      timeline: []
    };

    return (
      <div className="w-full flex flex-col justify-center items-center py-6 sm:py-0 select-none">
        <div className="w-full max-w-[340px] sm:max-w-md">
          <div className="w-full bg-transparent border-none">
            <ProjectCard
              project={tempProject}
              onSelectProject={() => {}}
              onOpenClaim={() => {}}
              onSelectBuilder={() => {}}
            />
          </div>
        </div>
      </div>
    );
  };

  const sortedCategories = [category, ...CATEGORIES.filter((cat) => cat !== category)];

  // Error condition indicators
  const nameHasError = nameTouched && !name.trim();
  const taglineHasError = taglineTouched && !tagline.trim();
  const demoUrlHasError = demoUrlTouched && !demoUrl.trim();
  const creatorsHasError = creatorsTouched && creators.length === 0;
  const toolsHasError = toolsTouched && selectedTools.length === 0;
  const modelsHasError = modelsTouched && selectedModels.length === 0;
  const buildNotesHasError = buildNotesTouched && !buildNotesText.trim();

  const isMobile = windowWidth < 640;

  return (
    <div className="submit-page-container lowercase">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <h2 className="text-inter-20 text-[#101010] font-semibold">
            {isEditing ? 'saving changes...' : 'adding a new thing...'}
          </h2>
          <p className="text-mono-10">submitting assets to the idat registry</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          
          {/* Bare Back Button above the title (no background) */}
          <div className="mb-2.5">
            <button
              onClick={() => navigate('/')}
              className="submit-back-btn"
              title="Go back to feed"
            >
               <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Page Title header (spaced out from stepper) */}
          <div className="mb-3">
            <h1 className="submit-page-title">
              {isEditing ? `edit thing: ${name || ''}` : 'add a new thing'}
            </h1>
          </div>

          {/* Custom clickable Stepper under Title */}
          <Stepper 
            currentStep={step} 
            totalSteps={2} 
            onStepClick={(s) => setStep(s)}
            isStep1Valid={isStep1Valid()}
          />

          {/* TWO PANEL EVEN GRID (50/50 Desktop split; No divider lines) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            
            {/* LEFT PANEL: INPUT FIELDS (Edits column - Constrained content width) */}
            <div className="bg-[#F2F1F3] flex flex-col overflow-visible">
              <div className="w-full max-w-full md:max-w-md">
                <form id="submission-page-form" onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* -------------------- STEP 1: LINKS, DETAILS, & NOTES -------------------- */}
                  {step === 1 && (
                    <div className="space-y-4">
                      
                      {/* Row 1: Name and Category dropdown inline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Name of thing */}
                        <div>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">name of thing *</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (nameTouched) setNameTouched(false);
                            }}
                            onBlur={() => setNameTouched(true)}
                            placeholder="e.g. xheight"
                            className={`submit-input-text ${nameHasError ? 'error' : ''}`}
                          />
                          {nameHasError && (
                            <span className="text-[11px] text-red-500 mt-1 block font-sans font-normal lowercase">name is required</span>
                          )}
                        </div>

                        {/* Custom dropdown */}
                        <div className="relative" ref={dropdownRef}>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">category *</label>
                          <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="submit-dropdown-btn"
                          >
                            <span>{category}</span>
                            <svg className="w-4 h-4 text-[#545454]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {isCategoryOpen && (
                            <div className="submit-dropdown-menu">
                              {sortedCategories.map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => {
                                    setCategory(cat);
                                    setIsCategoryOpen(false);
                                  }}
                                  className="submit-dropdown-item lowercase"
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tagline */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-inter-14 text-[#101010] font-medium lowercase">one-liner tagline *</label>
                          <span className="text-mono-10 text-[#999999]">{tagline.length}/120</span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength={120}
                          value={tagline}
                          onChange={(e) => {
                            setTagline(e.target.value);
                            if (taglineTouched) setTaglineTouched(false);
                          }}
                          onBlur={() => setTaglineTouched(true)}
                          placeholder="e.g. turn your handwriting into custom vector fonts"
                          className={`submit-input-text ${taglineHasError ? 'error' : ''}`}
                        />
                        {taglineHasError && (
                          <span className="text-[11px] text-red-500 mt-1 block font-sans font-normal lowercase">one-liner tagline is required</span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">live link *</label>
                          <input
                            type="url"
                            required
                            value={demoUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val.startsWith('https://')) {
                                setDemoUrl('https://');
                              } else {
                                setDemoUrl(val);
                              }
                              if (demoUrlTouched) setDemoUrlTouched(false);
                            }}
                            onFocus={() => {
                              if (!demoUrl) setDemoUrl('https://');
                            }}
                            onBlur={() => {
                              setDemoUrlTouched(true);
                              if (demoUrl === 'https://') setDemoUrl('');
                            }}
                            placeholder="https://"
                            className={`submit-input-text ${demoUrlHasError ? 'error' : ''}`}
                          />
                          {demoUrlHasError && (
                          <span className="text-[11px] text-red-500 mt-1 block font-sans font-normal lowercase">live link is required</span>
                        )}
                        </div>

                        <div>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">remix link</label>
                          <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val.startsWith('https://')) {
                                setGitHubUrl('https://');
                              } else {
                                setGitHubUrl(val);
                              }
                            }}
                            onFocus={() => {
                              if (!githubUrl) setGitHubUrl('https://');
                            }}
                            onBlur={() => {
                              if (githubUrl === 'https://') setGitHubUrl('');
                            }}
                            placeholder="https://"
                            className="submit-input-text"
                          />
                          <p className="text-[11px] text-[#999999] mt-1 font-sans font-normal lowercase">input link to code repository or shared tool builder editor link</p>
                        </div>
                      </div>

                      {/* Builders Tag Box with Autocomplete Suggestions */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">builders *</label>
                        <div className="relative">
                          <div 
                            onClick={() => creatorInputRef.current?.focus()}
                            className={`submit-tagbox-container items-center gap-1.5 flex flex-wrap p-2 min-h-[42px] ${creatorsHasError ? 'error' : ''}`}
                          >
                            {creators.map((c, i) => (
                              <div key={i} className="input-tool-pill rounded-none border-none select-none">
                                <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient(c)} shrink-0`} />
                                <span className="text-mono-10 !text-[#0011FF] font-medium">@{c}</span>
                                {c.toLowerCase() !== 'ileri' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveCreator(i);
                                    }}
                                    className="text-[#101010] hover:text-red-500 font-bold ml-0.5 text-[11px]"
                                    title={`Remove @${c}`}
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                            <input
                              type="text"
                              ref={creatorInputRef}
                              value={creatorInput}
                              onChange={(e) => {
                                setCreatorInput(e.target.value);
                                setActiveBuilderSuggestion(0);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (builderSuggestions.length > 0 && activeBuilderSuggestion < builderSuggestions.length) {
                                    const selected = builderSuggestions[activeBuilderSuggestion];
                                    setCreators([...creators, selected]);
                                    setCreatorInput('');
                                    setCreatorsTouched(true);
                                    setActiveBuilderSuggestion(0);
                                  } else {
                                    handleAddCreator();
                                  }
                                } else if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setActiveBuilderSuggestion(prev => (prev + 1) % Math.max(1, builderSuggestions.length));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setActiveBuilderSuggestion(prev => (prev - 1 + builderSuggestions.length) % Math.max(1, builderSuggestions.length));
                                } else if (e.key === 'Escape') {
                                  setCreatorInput('');
                                } else if (e.key === ' ' || e.key === ',') {
                                  e.preventDefault();
                                  handleAddCreator();
                                } else if (e.key === 'Backspace' && creatorInput === '') {
                                  if (creators.length > 1) {
                                    handleRemoveCreator(creators.length - 1);
                                  }
                                }
                              }}
                              onBlur={() => {
                                setTimeout(() => setCreatorsTouched(true), 200);
                              }}
                              placeholder={creators.length === 0 ? "add creator..." : ""}
                              className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono placeholder:text-[#999999] min-w-[80px]"
                            />
                          </div>
                          {creatorInput.trim() !== '' && builderSuggestions.length > 0 && (
                            <div className="submit-suggestion-menu">
                              {builderSuggestions.map((b, idx) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => {
                                    setCreators([...creators, b]);
                                    setCreatorInput('');
                                    setCreatorsTouched(true);
                                    setActiveBuilderSuggestion(0);
                                  }}
                                  className={`submit-suggestion-item ${idx === activeBuilderSuggestion ? 'active' : ''}`}
                                >
                                  {b}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 font-sans font-normal lowercase ${creatorsHasError ? 'text-red-500' : 'text-[#999999]'}`}>
                          {creatorsHasError ? 'at least one builder is required' : 'type username and press enter or space to add creators'}
                        </p>
                      </div>

                      {/* AI Stack - Visual ordering: AI Tools (built with) first, AI Models second */}
                      <div className="space-y-3.5">
                        {/* AI Tools (built with) with Autocomplete Suggestions */}
                        <div>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">built with *</label>
                          <div className="relative">
                            <div 
                              onClick={() => toolInputRef.current?.focus()}
                              className={`submit-tagbox-container ${toolsHasError ? 'error' : ''}`}
                            >
                              {selectedTools.map((t, i) => (
                                <div key={i} className="input-tool-pill rounded-none border-none select-none">
                                  <ToolLogo toolId={t} size={11} />
                                  <span className="text-mono-10 font-medium capitalize">{t.replace('-', ' ')}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveTool(i);
                                    }}
                                    className="text-[#101010] hover:text-red-500 font-bold ml-0.5 text-[11px]"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <input
                                type="text"
                                ref={toolInputRef}
                                value={toolInput}
                                onChange={(e) => {
                                  setToolInput(e.target.value);
                                  setActiveToolSuggestion(0);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (toolSuggestions.length > 0 && activeToolSuggestion < toolSuggestions.length) {
                                      const selected = toolSuggestions[activeToolSuggestion];
                                      setSelectedTools([...selectedTools, selected]);
                                      setToolInput('');
                                      setToolsTouched(true);
                                      setActiveToolSuggestion(0);
                                    } else {
                                      handleAddTool();
                                    }
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setActiveToolSuggestion(prev => (prev + 1) % Math.max(1, toolSuggestions.length));
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setActiveToolSuggestion(prev => (prev - 1 + toolSuggestions.length) % Math.max(1, toolSuggestions.length));
                                  } else if (e.key === 'Escape') {
                                    setToolInput('');
                                  } else if (e.key === 'Backspace' && toolInput === '') {
                                    if (selectedTools.length > 0) {
                                      handleRemoveTool(selectedTools.length - 1);
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => setToolsTouched(true), 200);
                                }}
                                placeholder={selectedTools.length === 0 ? "e.g. cursor" : ""}
                                className="flex-1 bg-transparent border-none outline-none text-[12px] font-sans placeholder:text-[#999999] min-w-[80px]"
                              />
                            </div>
                            {toolInput.trim() !== '' && toolSuggestions.length > 0 && (
                              <div className="submit-suggestion-menu">
                                {toolSuggestions.map((t, idx) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                      setSelectedTools([...selectedTools, t]);
                                      setToolInput('');
                                      setToolsTouched(true);
                                      setActiveToolSuggestion(0);
                                    }}
                                    className={`submit-suggestion-item ${idx === activeToolSuggestion ? 'active' : ''}`}
                                  >
                                    {t.replace('-', ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className={`text-[11px] mt-1 font-sans font-normal lowercase ${toolsHasError ? 'text-red-500' : 'text-[#999999]'}`}>
                            {toolsHasError ? 'at least one tool is required' : 'type tool and press enter to add'}
                          </p>
                        </div>

                        {/* AI Models with Autocomplete Suggestions */}
                        <div>
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">ai models *</label>
                          <div className="relative">
                            <div 
                              onClick={() => modelInputRef.current?.focus()}
                              className={`submit-tagbox-container ${modelsHasError ? 'error' : ''}`}
                            >
                              {selectedModels.map((m, i) => (
                                <div key={i} className="input-tool-pill rounded-none border-none select-none">
                                  <div
                                    className="w-1.5 h-1.5 shrink-0"
                                    style={{ backgroundColor: getModelColor(m) }}
                                  />
                                  <span className="text-mono-10 font-medium">{m}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveModel(i);
                                    }}
                                    className="text-[#101010] hover:text-red-500 font-bold ml-0.5 text-[11px]"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <input
                                type="text"
                                ref={modelInputRef}
                                value={modelInput}
                                onChange={(e) => {
                                  setModelInput(e.target.value);
                                  setActiveModelSuggestion(0);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (modelSuggestions.length > 0 && activeModelSuggestion < modelSuggestions.length) {
                                      const selected = modelSuggestions[activeModelSuggestion];
                                      setSelectedModels([...selectedModels, selected]);
                                      setModelInput('');
                                      setModelsTouched(true);
                                      setActiveModelSuggestion(0);
                                    } else {
                                      handleAddModel();
                                    }
                                  } else if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setActiveModelSuggestion(prev => (prev + 1) % Math.max(1, modelSuggestions.length));
                                  } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    setActiveModelSuggestion(prev => (prev - 1 + modelSuggestions.length) % Math.max(1, modelSuggestions.length));
                                  } else if (e.key === 'Escape') {
                                    setModelInput('');
                                  } else if (e.key === 'Backspace' && modelInput === '') {
                                    if (selectedModels.length > 0) {
                                      handleRemoveModel(selectedModels.length - 1);
                                    }
                                  }
                                }}
                                onBlur={() => {
                                  setTimeout(() => setModelsTouched(true), 200);
                                }}
                                placeholder={selectedModels.length === 0 ? "e.g. claude 3.7 sonnet" : ""}
                                className="flex-1 bg-transparent border-none outline-none text-[12px] font-sans placeholder:text-[#999999] min-w-[80px]"
                              />
                            </div>
                            {modelInput.trim() !== '' && modelSuggestions.length > 0 && (
                              <div className="submit-suggestion-menu">
                                {modelSuggestions.map((m, idx) => (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => {
                                      setSelectedModels([...selectedModels, m]);
                                      setModelInput('');
                                      setModelsTouched(true);
                                      setActiveModelSuggestion(0);
                                    }}
                                    className={`submit-suggestion-item ${idx === activeModelSuggestion ? 'active' : ''}`}
                                  >
                                    {m}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className={`text-[11px] mt-1 font-sans font-normal lowercase ${modelsHasError ? 'text-red-500' : 'text-[#999999]'}`}>
                            {modelsHasError ? 'at least one model is required' : 'type model and press enter to add'}
                          </p>
                        </div>
                      </div>

                      {/* Build Notes */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">build notes *</label>
                        <textarea
                          rows={6}
                          required
                          value={buildNotesText}
                          onChange={(e) => {
                            setBuildNotesText(e.target.value);
                            if (buildNotesTouched) setBuildNotesTouched(false);
                          }}
                          onBlur={() => setBuildNotesTouched(true)}
                          placeholder="you can explain why you built this, prompts, challenges faced, etc. here"
                          className={`submit-textarea ${buildNotesHasError ? 'error' : ''}`}
                        />
                         {buildNotesHasError && (
                           <span className="text-[11px] text-red-500 mt-1 block font-sans font-normal lowercase">build notes are required</span>
                         )}
                      </div>

                    </div>
                  )}

                  {/* -------------------- STEP 2: MEDIA UPLOADS -------------------- */}
                  {step === 2 && (
                    <div className="space-y-4.5">
                      
                      {/* Cover image upload */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">project actual cover image</label>
                        <input
                          type="file"
                          ref={coverImageInputRef}
                          onChange={handleCoverChange}
                          className="hidden"
                        />
                        <div 
                          onClick={() => coverImageInputRef.current?.click()}
                          className="submit-dropzone select-none overflow-hidden relative"
                        >
                          {coverImagePreview ? (
                            <motion.img 
                              src={coverImagePreview} 
                              alt="Cover preview" 
                              className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-[#545454] mb-1" />
                              <span className="text-inter-14 text-[11px]">Click to select project cover image</span>
                            </>
                          )}
                          {coverImagePreview && (
                            <button
                              type="button"
                              onClick={handleRemoveCoverFile}
                              className="absolute bottom-2 right-2 bg-black/70 text-white rounded px-2 py-0.5 text-[9px] hover:bg-black/90 cursor-pointer font-sans select-none border-none outline-none"
                            >
                              remove
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Showcase Media Options */}
                      <div className="space-y-3 pt-1">
                        <div className="flex justify-between items-center">
                          <label className="block text-inter-14 text-[#101010] font-medium lowercase">showcase media</label>
                          
                          <div className="submit-toggle-container">
                            <button
                              type="button"
                              onClick={() => setMediaOption('youtube')}
                              className={`submit-toggle-tab ${mediaOption === 'youtube' ? 'active' : 'inactive'}`}
                            >
                              youtube
                            </button>
                            <button
                              type="button"
                              onClick={() => setMediaOption('upload')}
                              className={`submit-toggle-tab ${mediaOption === 'upload' ? 'active' : 'inactive'}`}
                            >
                              upload
                            </button>
                          </div>
                        </div>

                        {mediaOption === 'youtube' ? (
                          <div>
                            <input
                              type="url"
                              value={youtubeUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (!val.startsWith('https://')) {
                                  setYoutubeUrl('https://');
                                } else {
                                  setYoutubeUrl(val);
                                }
                              }}
                              onFocus={() => {
                                if (!youtubeUrl) setYoutubeUrl('https://');
                              }}
                              onBlur={() => {
                                if (youtubeUrl === 'https://') setYoutubeUrl('');
                              }}
                              placeholder="https://youtube.com/watch?v=..."
                              className="submit-input-text"
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className="submit-dropzone select-none overflow-hidden relative"
                            >
                              {uploadedFile ? (
                                <div className="text-center">
                                  <span className="text-inter-14 text-[11px] block truncate px-4">
                                    {uploadedFile.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleRemoveUploadedFile}
                                    className="text-red-500 font-bold mt-1 text-[11px] hover:underline cursor-pointer border-none outline-none bg-transparent"
                                  >
                                    remove
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-[#545454] mb-1" />
                                  <span className="text-inter-14 text-[11px]">Click to select project media/screenshot</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Mobile Preview under Step 2 */}
                  {isMobile && step === 2 && (
                    <div className="py-4">
                      {renderPreviewPanel()}
                    </div>
                  )}

                  {/* Page Navigation Footer (fixed/sticky actions, content hugging) */}
                  <div className="py-0.5 mt-1 flex items-center justify-end gap-2 bg-[#F2F1F3] w-full shrink-0">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="btn-secondary !h-[30px] font-sans text-[11px] font-medium px-4 rounded-full cursor-pointer hover:bg-[#D9D9D9] transition-colors"
                    >
                      clear
                    </button>

                    {/* Wizard Step Navigation */}
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="btn-secondary !h-[30px] font-sans text-[11px] font-medium px-4 rounded-full cursor-pointer flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        back
                      </button>
                    )}

                    {/* Stepping controls */}
                    {step === 1 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="btn-main !h-[30px] relative overflow-hidden flex items-center justify-center gap-1 group font-sans text-[11px] font-medium cursor-pointer px-4 rounded-full"
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
                          next step
                        </span>
                        <ArrowRight className="w-3 h-3 relative z-10 text-white/90" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn-main !h-[30px] relative overflow-hidden flex items-center justify-center gap-1 group font-sans text-[11px] font-medium cursor-pointer px-4 rounded-full"
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
                          {isEditing ? 'save changes' : 'add thing'}
                        </span>
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>

            {/* RIGHT PANEL: LIVE PROJECT CARD PREVIEW (Desktop Only; Hidden on Mobile except Step 3) */}
            {!isMobile && (
              <div className="sticky top-24 flex items-center justify-center bg-transparent border-none">
                {renderPreviewPanel()}
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
