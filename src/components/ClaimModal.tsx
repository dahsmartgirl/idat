import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import { X, Upload, Check } from './icons';
import { BuilderTagInput } from './BuilderTagInput';
import { CURRENT_USER } from '../lib/session';
import { INVALID_URL_MESSAGE, isBlankUrl, isValidUrl } from '../lib/url';
import { UrlInput } from './UrlInput';

export type ClaimProof = { type: 'link'; url: string } | { type: 'image'; file: File };

export interface ClaimRequest {
  project: Project;
  proof: ClaimProof;
  // Tagged co-builders; they're only told once the claim is confirmed
  coBuilders: string[];
}

interface ClaimModalProps {
  project: Project | null;
  onClose: () => void;
  onClaim: (request: ClaimRequest) => void;
}

const MAX_IMAGE_MB = 10;
const EASE = [0.25, 1, 0.5, 1] as const;

// Claiming a project someone else archived: one piece of proof (a link, or a screenshot) and any co-builders.
// Nothing changes until the claim is confirmed; the claimer (and co-builders) hear by email.
// A centered modal on every screen size
export const ClaimModal: React.FC<ClaimModalProps> = ({ project, onClose, onClaim }) => (
  <AnimatePresence>
    {project && <ClaimDialog key={project.id} project={project} onClose={onClose} onClaim={onClaim} />}
  </AnimatePresence>
);

const ClaimDialog: React.FC<{ project: Project; onClose: () => void; onClaim: ClaimModalProps['onClaim'] }> = ({
  project,
  onClose,
  onClaim,
}) => {
  const [method, setMethod] = useState<'link' | 'image'>('link');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coBuilders, setCoBuilders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  // The form's height, so the confirmation keeps the modal the same size
  const formRef = useRef<HTMLFormElement>(null);
  const [formHeight, setFormHeight] = useState<number>();

  // Lock page scroll (restoring whatever it was, e.g. when opened over the project drawer); Esc closes
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Ready to type on desktop (on phones the keyboard would cover the modal straight away)
  useEffect(() => {
    if (method === 'link' && window.matchMedia('(pointer: fine)').matches) linkInputRef.current?.focus();
  }, [method]);

  // Screenshot preview, released when replaced or closed
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const pickImage = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('that file isn’t an image. try a png or jpg.');
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`that image is over ${MAX_IMAGE_MB} mb. try a smaller one.`);
    setError('');
    setImage(file);
  };

  const hasProof = method === 'link' ? !isBlankUrl(link) : !!image;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let proof: ClaimProof;
    if (method === 'link') {
      if (!isValidUrl(link)) return setError(INVALID_URL_MESSAGE);
      proof = { type: 'link', url: link.trim() };
    } else {
      if (!image) return setError('add a screenshot first');
      proof = { type: 'image', file: image };
    }
    onClaim({ project, proof, coBuilders });
    setFormHeight(formRef.current?.offsetHeight);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-sans">
      {/* Backdrop (matches the drawers) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[4px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-title"
        initial={{ opacity: 0, scale: 0.96, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.97, y: 6, filter: 'blur(6px)' }}
        transition={{ duration: 0.32, ease: EASE }}
        className="relative w-full max-w-[440px] max-h-[calc(100svh-32px)] overflow-y-auto bg-page text-secondary shadow-2xl px-6 pt-7 pb-6"
      >
        {/* Close: just the icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-5 flex items-center justify-center w-8 h-8 text-secondary hover:text-[#101010] transition-colors cursor-pointer z-10"
          title="Close"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            // Claim sent: nothing changes until it's confirmed
            <motion.div
              key="sent"
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col items-center justify-center text-center lowercase"
              style={{ minHeight: formHeight }}
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.05 }}
                className="w-11 h-11 rounded-full bg-[#101010] text-white flex items-center justify-center mb-3"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </motion.div>
              <h2 className="text-inter-20 !text-[#101010]">claim sent</h2>
              <p className="text-inter-14 text-subtext mt-1 max-w-[300px] leading-relaxed">
                we’ll check your proof and email you once {project.name} is confirmed as yours.
                {coBuilders.length > 0 && ' your co-builders hear from us then too.'}
              </p>
              <button onClick={onClose} className="btn-main mt-4">got it</button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={submit}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.2 }}
              noValidate
              className="lowercase"
            >
              <h2 id="claim-title" className="text-inter-20 !text-[#101010] pr-12">claim {project.name}</h2>
              <p className="text-inter-14 text-subtext mt-1 pr-12 leading-relaxed">
                built this? share proof and it moves to your profile once confirmed.
              </p>

              <div className="space-y-4 mt-5">
                {/* Proof: a link (recommended) or a screenshot */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="claim-link" className="text-inter-14 !text-[#101010] font-medium">proof *</label>
                    <div className="submit-toggle-container" role="tablist">
                      {(['link', 'image'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          role="tab"
                          aria-selected={method === m}
                          onClick={() => {
                            setMethod(m);
                            setError('');
                          }}
                          className={`submit-toggle-tab ${method === m ? 'active' : 'inactive'}`}
                        >
                          {m === 'link' ? 'link' : 'screenshot'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {method === 'link' ? (
                    <>
                      <UrlInput
                        key="link"
                        id="claim-link"
                        ref={linkInputRef}
                        value={link}
                        onChange={(v) => {
                          setLink(v);
                          setError('');
                        }}
                        onBlur={() => {
                          if (!isBlankUrl(link) && !isValidUrl(link)) setError(INVALID_URL_MESSAGE);
                        }}
                        placeholder="https://github.com/you/project"
                        hasError={!!error}
                      />
                      <p className="text-[11px] text-[#999999] mt-1">
                        recommended. your github repo or a remix link from lovable, bolt or v0.
                      </p>
                    </>
                  ) : (
                    <>
                      <input
                        key="file"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => pickImage(e.target.files?.[0])}
                      />
                      {preview ? (
                        <div className="relative h-24 bg-[#E9E9E9] rounded-[8px] flex items-center justify-center overflow-hidden">
                          <img src={preview} alt="Your proof screenshot" className="max-h-full max-w-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute right-2 top-2 btn-secondary"
                          >
                            replace
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                          }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            pickImage(e.dataTransfer.files?.[0]);
                          }}
                          className={`submit-dropzone ${isDragging ? '!bg-[#E9E9E9] !border-[#101010]' : ''}`}
                        >
                          <Upload className="w-4 h-4 text-secondary mb-1" />
                          <span className="text-inter-14 text-[11px]">drop a screenshot, or click to choose</span>
                        </button>
                      )}
                      <p className="text-[11px] text-[#999999] mt-1">
                        something only the builder could show, like your dashboard or deploy settings.
                      </p>
                    </>
                  )}
                  {error && <span className="text-[11px] text-red-500 mt-1 block" role="alert">{error}</span>}
                </div>

                {/* Co-builders (optional); they're told once the claim is confirmed */}
                <div>
                  <label className="block text-inter-14 !text-[#101010] font-medium mb-1">co-builders</label>
                  <BuilderTagInput
                    builders={coBuilders}
                    onChange={setCoBuilders}
                    exclude={[CURRENT_USER]}
                    placeholder="@username, if you built it with others"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3.5 mt-6">
                <button type="button" onClick={onClose} className="btn-secondary !h-[30px] text-[11px] px-4">
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasProof}
                  className={`btn-main !h-[30px] relative overflow-hidden flex items-center justify-center gap-1 text-[11px] px-4 ${
                    hasProof ? '' : '!opacity-40 !cursor-not-allowed'
                  }`}
                >
                  {/* Shimmer (as on the other main buttons) */}
                  {hasProof && (
                    <motion.div
                      className="absolute -inset-y-4 w-full h-[200%] bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] pointer-events-none blur-[0.5px]"
                      initial={{ x: '-150%', y: '-40%' }}
                      animate={{ x: ['-150%', '160%'], y: ['-40%', '40%'] }}
                      transition={{ repeat: Infinity, repeatDelay: 4.2, duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                  <span className="relative z-10 text-white/90">send claim</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
