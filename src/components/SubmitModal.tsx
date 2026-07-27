import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import type { Project, CategoryType } from '../types';
import { getBuilderGradient } from '../types';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newProject: Partial<Project>) => void;
  claimingProject?: Project | null;
  editingProject?: Project | null;
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

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  claimingProject = null,
  editingProject = null,
}) => {
  // Mode checks
  const isClaiming = !!claimingProject;
  const isEditing = !!editingProject;

  // General Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<CategoryType>('SaaS');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Creators / Builders Handles (Tag Pills inside Textbox)
  const [creatorInput, setCreatorInput] = useState('');
  const [creators, setCreators] = useState<string[]>(['ileri']);
  const creatorInputRef = useRef<HTMLInputElement>(null);

  // Cover Image upload
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Links (Stack vertically, with https:// placeholders)
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGitHubUrl] = useState('');

  // AI Stack (Pills inside Textbox)
  const [toolInput, setToolInput] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['claude-code']);
  const toolInputRef = useRef<HTMLInputElement>(null);

  const [modelInput, setModelInput] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>(['Claude 3.7 Sonnet']);
  const modelInputRef = useRef<HTMLInputElement>(null);

  // Showcase Media (YouTube or Upload toggle)
  const [mediaOption, setMediaOption] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build Notes (Markdown Paragraph)
  const [buildNotesText, setBuildNotesText] = useState('');

  // Claim Mode Proof Link
  const [proofLink, setProofLink] = useState('');

  // Status flags
  const [submitted, setSubmitted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Close dropdown on click outside
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

  // Pre-fill fields on mode changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingProject) {
        setName(editingProject.name);
        setTagline(editingProject.tagline);
        setCategory(editingProject.category);
        setCreators(editingProject.claimedBy || ['ileri']);
        setDemoUrl(editingProject.demoUrl || '');
        setGitHubUrl(editingProject.githubUrl || '');
        setYoutubeUrl(editingProject.youtubeUrl || '');
        setSelectedTools(editingProject.aiTools || []);
        setSelectedModels(editingProject.aiModel ? [editingProject.aiModel] : ['Claude 3.7 Sonnet']);
        setBuildNotesText(editingProject.buildNotes?.whyBuilt || '');
        setMediaOption(editingProject.youtubeUrl ? 'youtube' : 'upload');
        setUploadedFile(null);
        setCoverImageFile(null);
      } else if (isClaiming && claimingProject) {
        setName(claimingProject.name);
        setDemoUrl(claimingProject.demoUrl || '');
        setGitHubUrl(claimingProject.githubUrl || '');
        setCreators(['ileri']);
        setProofLink('');
        setUploadedFile(null);
        setCoverImageFile(null);
      } else {
        setName('');
        setTagline('');
        setCategory('SaaS');
        setCreators(['ileri']);
        setDemoUrl('');
        setGitHubUrl('');
        setYoutubeUrl('');
        setSelectedTools(['claude-code']);
        setSelectedModels(['Claude 3.7 Sonnet']);
        setBuildNotesText('');
        setMediaOption('youtube');
        setUploadedFile(null);
        setCoverImageFile(null);
      }
    }
  }, [isOpen, isEditing, isClaiming, editingProject, claimingProject]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Clear fields helper
  const handleClear = () => {
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
    setUploadedFile(null);
    setCoverImageFile(null);
    setProofLink('');
  };

  // Tag Builders Helpers
  const handleAddCreator = () => {
    const trimmed = creatorInput.trim().replace('@', '');
    if (trimmed && !creators.includes(trimmed)) {
      setCreators([...creators, trimmed]);
      setCreatorInput('');
    }
  };

  const handleRemoveCreator = (index: number) => {
    setCreators(creators.filter((_, i) => i !== index));
  };

  // Tag Tools Helpers
  const handleAddTool = () => {
    const trimmed = toolInput.trim().toLowerCase();
    if (trimmed && !selectedTools.includes(trimmed)) {
      setSelectedTools([...selectedTools, trimmed]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setSelectedTools(selectedTools.filter((_, i) => i !== index));
  };

  // Tag Models Helpers
  const handleAddModel = () => {
    const trimmed = modelInput.trim();
    if (trimmed && !selectedModels.includes(trimmed)) {
      setSelectedModels([...selectedModels, trimmed]);
      setModelInput('');
    }
  };

  const handleRemoveModel = (index: number) => {
    setSelectedModels(selectedModels.filter((_, i) => i !== index));
  };

  // Media File Helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveUploadedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      if (isClaiming && claimingProject) {
        onSubmitSuccess({
          id: claimingProject.id,
          isClaimed: true,
          claimedBy: creators,
          demoUrl,
          githubUrl,
          youtubeUrl: mediaOption === 'youtube' ? youtubeUrl : claimingProject.youtubeUrl,
        });
      } else if (isEditing && editingProject) {
        onSubmitSuccess({
          ...editingProject,
          name,
          tagline,
          category,
          claimedBy: creators,
          demoUrl,
          githubUrl,
          youtubeUrl: mediaOption === 'youtube' ? youtubeUrl : '',
          aiTools: selectedTools,
          primaryTool: selectedTools[0] || 'claude-code',
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
          demoUrl,
          githubUrl,
          youtubeUrl: mediaOption === 'youtube' ? youtubeUrl : '',
          aiTools: selectedTools,
          primaryTool: selectedTools[0] || 'claude-code',
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
      onClose();
    }, 600);
  };

  const isMobile = windowWidth < 640;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center font-sans">
        {/* Backdrop Blur matching Drawers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-[4px] z-40"
        />

        {/* Modal / Bottom Sheet Shell Container */}
        <motion.div
          initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
          animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
          exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className={`
            relative bg-[#F2F1F3] text-[#545454] rounded-none shadow-2xl flex flex-col z-50 overflow-visible border-none
            ${isMobile 
              ? 'w-full max-h-[85vh] h-[85vh] self-end mt-auto' 
              : 'w-full max-w-2xl max-h-[90vh]'
            }
          `}
        >
          {/* Big Solid White Floating X Pill Button matching Drawers */}
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="absolute right-5 top-5 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white text-[#101010] rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-[#E9E9E9] z-50"
            title="Close form"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </motion.button>

          {/* Header (No dividers) */}
          <div className="px-6 pt-7 pb-4 bg-[#F2F1F3] shrink-0">
            <h2 className="text-inter-20 text-[#545454] lowercase tracking-normal">
              {isClaiming 
                ? `claim thing: ${name}` 
                : isEditing 
                  ? `edit thing: ${name}`
                  : 'add a new thing'
              }
            </h2>
          </div>

          {/* Body Form */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
            {submitted ? (
              <div className="py-16 text-center space-y-2">
                <h3 className="text-inter-16 font-semibold text-[#101010]">
                  {isClaiming 
                    ? 'claim submitted successfully!' 
                    : isEditing 
                      ? 'project details updated!' 
                      : 'project archived successfully!'
                  }
                </h3>
                <p className="text-mono-10">recorded on idat.xyz</p>
              </div>
            ) : (
              <form id="submit-form" onSubmit={handleSubmit} className="space-y-4 text-inter-14 text-[#545454]">
                
                {/* ----------------- MODE B: CLAIM MODE FORM ----------------- */}
                {isClaiming ? (
                  <>
                    <div className="bg-[#E9E9E9] p-4 border-none space-y-2 text-inter-14 leading-relaxed">
                      <p className="font-semibold text-[#101010] text-[12px]">Claiming Ownership Proof</p>
                      <p className="text-[11px]">Provide link assets or proof files verifying your connection to this build. Once verified, this thing will be attached to your profile and editable.</p>
                    </div>

                    {/* Creators Tag Box */}
                    <div>
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1.5">creators/builders *</label>
                      <div className="w-full min-h-[38px] p-1.5 bg-[#E9E9E9] rounded-full flex flex-wrap items-center gap-1.5 px-3">
                        {creators.map((c, i) => (
                          <div key={i} className="tool-pill rounded-full pr-2 pl-1 inline-flex items-center gap-1.5 bg-white border border-[#D0D0D0] text-[#101010] select-none h-[26px]">
                            <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient(c)} shrink-0`} />
                            <span className="text-mono-10 !text-[#0011FF] font-medium">@{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Links stacked vertically with https:// placeholder */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">live link</label>
                        <input
                          type="url"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          placeholder="https://"
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                        />
                      </div>
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">remix link (github, bolt/lovable share link) *</label>
                        <input
                          type="url"
                          required
                          value={githubUrl}
                          onChange={(e) => setGitHubUrl(e.target.value)}
                          placeholder="https://"
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                        />
                      </div>
                    </div>

                    {/* Proof Link (Required) */}
                    <div>
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">proof link *</label>
                      <input
                        type="url"
                        required
                        value={proofLink}
                        onChange={(e) => setProofLink(e.target.value)}
                        placeholder="https://..."
                        className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                      />
                    </div>

                    {/* Proof Upload (Upload Proof, Not Disabled) */}
                    <div>
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">upload proof file</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div 
                        onClick={handleUploadBoxClick}
                        className="w-full h-24 border border-dashed border-[#C2C2C2] bg-[#E9E9E9]/50 flex flex-col items-center justify-center text-center p-4 select-none cursor-pointer rounded-[8px] hover:bg-[#E9E9E9] transition-colors mt-1"
                      >
                        <Upload className="w-4 h-4 text-[#545454] mb-1" />
                        <span className="text-inter-14 text-[11px]">
                          {uploadedFile 
                            ? `Selected: ${uploadedFile.name}` 
                            : 'Click to upload proof document/screenshot'
                          }
                        </span>
                        {uploadedFile && (
                          <button
                            type="button"
                            onClick={handleRemoveUploadedFile}
                            className="text-red-500 font-bold mt-1 text-[11px] hover:underline"
                          >
                            remove
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  
                  // ----------------- MODE A & C: SUBMIT / EDIT FORM -----------------
                  <>
                    {/* Row 1: Name and Category (inline custom dropdown beside name of thing) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Name of thing */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">name of thing *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. xheight"
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                        />
                      </div>

                      {/* Custom Category Dropdown */}
                      <div className="relative" ref={dropdownRef}>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">category *</label>
                        <button
                          type="button"
                          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] text-left border-none outline-none font-sans rounded-full flex items-center justify-between cursor-pointer"
                        >
                          <span>{category}</span>
                          <svg className="w-4 h-4 text-[#545454]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isCategoryOpen && (
                          <div className="absolute left-0 right-0 mt-1 bg-[#E9E9E9] border border-black/10 rounded-[8px] shadow-lg z-50 max-h-48 overflow-y-auto">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setCategory(cat);
                                  setIsCategoryOpen(false);
                                }}
                                className="w-full px-4 py-2 text-left text-[12px] text-[#101010] hover:bg-[#D9D9D9] transition-colors lowercase first:rounded-t-[8px] last:rounded-b-[8px]"
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
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. turn your handwriting into custom vector fonts"
                        className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                      />
                    </div>

                    {/* Project Actual Cover Image Upload */}
                    <div>
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">project actual cover image</label>
                      <input
                        type="file"
                        ref={coverImageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCoverImageFile(file);
                        }}
                        className="hidden"
                      />
                      <div 
                        onClick={() => coverImageInputRef.current?.click()}
                        className="w-full h-20 border border-dashed border-[#C2C2C2] bg-[#E9E9E9]/50 flex flex-col items-center justify-center text-center p-2 select-none cursor-pointer rounded-[8px] hover:bg-[#E9E9E9] transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#545454] mb-1" />
                        <span className="text-inter-14 text-[11px]">
                          {coverImageFile ? `Selected: ${coverImageFile.name}` : 'Click to select project cover image'}
                        </span>
                        {coverImageFile && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCoverImageFile(null);
                              if (coverImageInputRef.current) coverImageInputRef.current.value = '';
                            }}
                            className="text-red-500 font-bold mt-1 text-[10px] hover:underline"
                          >
                            remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Links stacked vertically with https:// placeholder */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">live link</label>
                        <input
                          type="url"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          placeholder="https://"
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                        />
                      </div>

                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">remix link (github, bolt/lovable share link) *</label>
                        <input
                          type="url"
                          required
                          value={githubUrl}
                          onChange={(e) => setGitHubUrl(e.target.value)}
                          placeholder="https://"
                          className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
                        />
                        <p className="text-[9.5px] text-[#999999] mt-1 pl-3 font-sans lowercase">input link to code repository or shared tool builder editor link</p>
                      </div>
                    </div>

                    {/* Showcase Media Options */}
                    <div className="space-y-3 pt-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase">showcase media</label>
                        
                        {/* Media Option Toggle */}
                        <div className="flex bg-[#E9E9E9] rounded-full p-0.5 text-[10px] font-sans">
                          <button
                            type="button"
                            onClick={() => setMediaOption('youtube')}
                            className={`px-2.5 py-0.5 rounded-full ${mediaOption === 'youtube' ? 'bg-[#101010] text-white' : 'text-[#545454]'}`}
                          >
                            youtube
                          </button>
                          <button
                            type="button"
                            onClick={() => setMediaOption('upload')}
                            className={`px-2.5 py-0.5 rounded-full ${mediaOption === 'upload' ? 'bg-[#101010] text-white' : 'text-[#545454]'}`}
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
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full h-[38px] px-4 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-full"
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
                            onClick={handleUploadBoxClick}
                            className="w-full h-24 border border-dashed border-[#C2C2C2] bg-[#E9E9E9]/50 flex flex-col items-center justify-center text-center p-4 select-none cursor-pointer rounded-[8px] hover:bg-[#E9E9E9] transition-colors"
                          >
                            <Upload className="w-4 h-4 text-[#545454] mb-1" />
                            <span className="text-inter-14 text-[11px]">
                              {uploadedFile 
                                ? `Selected: ${uploadedFile.name}` 
                                : 'Click to select project media/screenshot'
                              }
                            </span>
                            {uploadedFile && (
                              <button
                                type="button"
                                onClick={handleRemoveUploadedFile}
                                className="text-red-500 font-bold mt-1 text-[11px] hover:underline"
                              >
                                remove
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Creators Tag Box */}
                    <div>
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">creators/builders *</label>
                      <div 
                        onClick={() => creatorInputRef.current?.focus()}
                        className="w-full min-h-[38px] p-1.5 bg-[#E9E9E9] rounded-full flex flex-wrap items-center gap-1.5 px-3 border-none outline-none cursor-text"
                      >
                        {creators.map((c, i) => (
                          <div key={i} className="tool-pill rounded-full pr-2 pl-1.5 inline-flex items-center gap-1.5 bg-white border border-[#C2C2C2] text-[#101010] select-none h-[26px]">
                            <div className={`w-3.5 h-3.5 rounded-full ${getBuilderGradient(c)} shrink-0`} />
                            <span className="text-mono-10 !text-[#0011FF] font-medium">@{c}</span>
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
                          </div>
                        ))}
                        <input
                          type="text"
                          ref={creatorInputRef}
                          value={creatorInput}
                          onChange={(e) => setCreatorInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCreator();
                            } else if (e.key === ' ' || e.key === ',') {
                              e.preventDefault();
                              handleAddCreator();
                            }
                          }}
                          placeholder={creators.length === 0 ? "add creator..." : ""}
                          className="flex-1 bg-transparent border-none outline-none text-[12px] font-mono placeholder:text-[#999999] min-w-[80px]"
                        />
                      </div>
                      <p className="text-[9px] text-[#999999] mt-1 pl-3 font-sans lowercase">type username and press enter or space to add creators</p>
                    </div>

                    {/* AI Stack Details (Models & Tools follow Builders pill logic) */}
                    <div className="space-y-4 pt-1.5">
                      {/* AI Models Tagbox */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">primary ai models</label>
                        <div 
                          onClick={() => modelInputRef.current?.focus()}
                          className="w-full min-h-[38px] p-1.5 bg-[#E9E9E9] rounded-full flex flex-wrap items-center gap-1.5 px-3 border-none outline-none cursor-text"
                        >
                          {selectedModels.map((m, i) => (
                            <div key={i} className="tool-pill rounded-full pr-2 pl-1.5 inline-flex items-center gap-1 bg-white border border-[#C2C2C2] text-[#101010] select-none h-[26px]">
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
                            onChange={(e) => setModelInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddModel();
                              }
                            }}
                            placeholder={selectedModels.length === 0 ? "add model (e.g. Claude 3.7)..." : ""}
                            className="flex-1 bg-transparent border-none outline-none text-[12px] font-sans placeholder:text-[#999999] min-w-[80px]"
                          />
                        </div>
                        <p className="text-[9px] text-[#999999] mt-1 pl-3 font-sans lowercase">type model and press enter to add</p>
                      </div>

                      {/* AI Tools Tagbox */}
                      <div>
                        <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">ai tools used</label>
                        <div 
                          onClick={() => toolInputRef.current?.focus()}
                          className="w-full min-h-[38px] p-1.5 bg-[#E9E9E9] rounded-full flex flex-wrap items-center gap-1.5 px-3 border-none outline-none cursor-text"
                        >
                          {selectedTools.map((t, i) => (
                            <div key={i} className="tool-pill rounded-full pr-2 pl-1.5 inline-flex items-center gap-1 bg-white border border-[#C2C2C2] text-[#101010] select-none h-[26px]">
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
                            onChange={(e) => setToolInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTool();
                              }
                            }}
                            placeholder={selectedTools.length === 0 ? "add tool (e.g. cursor)..." : ""}
                            className="flex-1 bg-transparent border-none outline-none text-[12px] font-sans placeholder:text-[#999999] min-w-[80px]"
                          />
                        </div>
                        <p className="text-[9px] text-[#999999] mt-1 pl-3 font-sans lowercase">type tool and press enter to add</p>
                      </div>
                    </div>

                    {/* Build Notes Section (Square rounded) */}
                    <div className="pt-1.5">
                      <label className="block text-inter-14 text-[#101010] font-medium lowercase mb-1">build notes.md * (markdown supported)</label>
                      <textarea
                        rows={5}
                        required
                        value={buildNotesText}
                        onChange={(e) => setBuildNotesText(e.target.value)}
                        placeholder="## Why I built this&#10;Describe your motivation...&#10;&#10;## AI Role & Prompts&#10;Explain prompts or code generators used...&#10;&#10;## Obstacles & Challenges&#10;Detail what failed and how it was refactored..."
                        className="w-full p-3 bg-[#E9E9E9] text-[#101010] text-[12px] placeholder:text-[#999999] border-none outline-none font-sans rounded-[8px] resize-none mt-1 leading-relaxed"
                      />
                    </div>
                  </>
                )}

              </form>
            )}
          </div>

          {/* Footer (No border lines, fixed submit button hugging content + clear button on the right) */}
          {!submitted && (
            <div className="px-6 py-4 bg-[#F2F1F3] shrink-0 w-full flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary !h-[30px] font-sans text-[11px] font-medium px-4 rounded-full cursor-pointer hover:bg-[#D9D9D9] transition-colors"
              >
                clear
              </button>
              
              <button
                type="submit"
                form="submit-form"
                className="btn-main !h-[30px] relative overflow-hidden flex items-center justify-center gap-1 group font-sans text-[11px] font-medium cursor-pointer px-4 rounded-full"
              >
                {/* Shimmer Effect */}
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
                  {isClaiming 
                    ? 'claim thing' 
                    : isEditing 
                      ? 'save changes' 
                      : 'add thing'
                  }
                </span>
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
