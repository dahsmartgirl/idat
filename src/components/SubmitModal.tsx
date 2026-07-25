import React, { useState } from 'react';
import type { Project, CategoryType } from '../types';
import { X } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newProject: Partial<Project>) => void;
  claimingProject?: Project | null;
}

const CATEGORIES: CategoryType[] = [
  'SaaS',
  'Chrome Extensions',
  'MCP Servers',
  'CLI Tools',
  'Games',
  'VS Code Extensions',
  'Mobile Apps',
  'Experiments'
];

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  claimingProject,
}) => {
  const [name, setName] = useState(claimingProject ? claimingProject.name : '');
  const [tagline, setTagline] = useState(claimingProject ? claimingProject.tagline : '');
  const [demoUrl, setDemoUrl] = useState(claimingProject?.demoUrl || '');
  const [githubUrl, setGithubUrl] = useState(claimingProject?.githubUrl || '');
  const [category, setCategory] = useState<CategoryType>('SaaS');
  const [builderHandle, setBuilderHandle] = useState('ileri');
  const [whyBuilt, setWhyBuilt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      onSubmitSuccess({
        id: claimingProject ? claimingProject.id : `proj-${Date.now()}`,
        name,
        tagline: tagline || 'An experimental AI project archived on idat.xyz',
        description: tagline || 'AI-built project archived on idat.xyz',
        demoUrl,
        githubUrl,
        category,
        aiTools: ['claude-code'],
        primaryTool: 'claude-code',
        isClaimed: true,
        claimedBy: [builderHandle.startsWith('@') ? builderHandle.slice(1) : builderHandle],
        coverImage: '',
        screenshots: [],
        tags: ['AI-built', category.toLowerCase().replace(/\s+/g, '-')],
        techStack: ['TypeScript', 'React'],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        buildNotes: {
          whyBuilt: whyBuilt || 'Documenting what was built with AI.',
          aiRoleAndPrompts: 'Built with AI tools.',
          challengesAndFailures: 'Standard build iterations.',
          lessonsLearned: 'Iterative prompting yields superior UX.'
        },
        timeline: [
          { date: 'Today', title: 'Archived on idat.xyz', type: 'launch' }
        ]
      });
      setSubmitted(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#F2F1F3] text-[#545454] border border-black/10 rounded-none shadow-xl">
        
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-inter-16 font-bold">
            {claimingProject ? `claim: ${claimingProject.name}` : 'i did a thing (archive submission)'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
            <X className="w-4 h-4 text-[#545454]" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 text-center space-y-2">
            <h3 className="text-inter-16 font-bold text-[#545454]">
              {claimingProject ? 'ownership claimed!' : 'thing archived!'}
            </h3>
            <p className="text-mono-10">
              recorded on idat.xyz
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-mono-10 mb-1">thing name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. xheight"
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none"
              />
            </div>

            <div>
              <label className="block text-mono-10 mb-1">one-liner *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. turn your handwriting into fonts"
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none"
              />
            </div>

            <div>
              <label className="block text-mono-10 mb-1">your handle *</label>
              <input
                type="text"
                required
                value={builderHandle}
                onChange={(e) => setBuilderHandle(e.target.value)}
                placeholder="ileri"
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-mono-10 mb-1">category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-mono-10 mb-1">live link</label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none"
                />
              </div>
              <div>
                <label className="block text-mono-10 mb-1">github link</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-mono-10 mb-1">build note (why I built it)</label>
              <textarea
                rows={3}
                value={whyBuilt}
                onChange={(e) => setWhyBuilt(e.target.value)}
                placeholder="why did you build this with AI?"
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-mono-10 hover:bg-black/5"
              >
                cancel
              </button>
              <button
                type="submit"
                className="pill-action"
              >
                {claimingProject ? 'claim thing' : 'archive thing'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
