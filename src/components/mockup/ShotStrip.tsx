import React, { useRef, useState } from 'react';
import { Reorder } from 'framer-motion';
import { Plus, Upload, X } from '../icons';
import type { MediaShot } from './types';
import { MockupCanvas } from './MockupCanvas';

export const MAX_SHOTS = 6;
const ACCEPT = 'image/*,video/*';

interface ShotStripProps {
  shots: MediaShot[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onReorder: (shots: MediaShot[]) => void;
  onRemove: (id: string) => void;
  onAddFiles: (files: File[]) => void;
  isLoading?: boolean;
}

const mediaFiles = (list: FileList | null) =>
  Array.from(list ?? []).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));

export const ShotStrip: React.FC<ShotStripProps> = ({
  shots,
  activeId,
  onSelect,
  onReorder,
  onRemove,
  onAddFiles,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (list: FileList | null) => {
    const files = mediaFiles(list).slice(0, MAX_SHOTS - shots.length);
    if (files.length) onAddFiles(files);
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: () => setIsDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      multiple
      className="hidden"
      onChange={(e) => {
        handleFiles(e.target.files);
        e.target.value = '';
      }}
    />
  );

  if (shots.length === 0) {
    return (
      <div>
        {fileInput}
        <div
          onClick={() => inputRef.current?.click()}
          {...dropHandlers}
          className={`submit-dropzone !h-[132px] select-none ${isDragOver ? '!bg-[#E9E9E9] !border-[#545454]' : ''}`}
        >
          <Upload className="w-4 h-4 text-[#545454] mb-1.5" />
          <span className="text-inter-14 !text-[11px]">
            {isLoading ? 'framing your media...' : 'drop images or videos here, or click to browse'}
          </span>
          <span className="text-mono-10 mt-1">we frame them automatically · up to {MAX_SHOTS}</span>
        </div>
      </div>
    );
  }

  return (
    <div {...dropHandlers} className={isDragOver ? 'outline-1 outline-dashed outline-[#545454] outline-offset-4' : ''}>
      {fileInput}
      <div className="flex items-start gap-2 flex-wrap">
        <Reorder.Group axis="x" values={shots} onReorder={onReorder} className="flex items-start gap-2 flex-wrap">
          {shots.map((shot, index) => (
            <Reorder.Item key={shot.id} value={shot} className="relative group cursor-grab active:cursor-grabbing">
              <button
                type="button"
                onClick={() => onSelect(shot.id)}
                title={`${shot.name} (drag to reorder)`}
                aria-label={`Edit ${shot.name}`}
                className={`block w-[56px] h-[56px] bg-[#D9D9D9] overflow-hidden cursor-pointer transition-[outline-color] outline-[1.5px] outline-offset-2 ${
                  activeId === shot.id ? 'outline-solid outline-[#101010]' : 'outline-solid outline-transparent hover:outline-[#C2C2C2]'
                }`}
              >
                <div className="w-full h-full pointer-events-none">
                  <MockupCanvas shot={shot} fill playback="hover" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => onRemove(shot.id)}
                title="Remove shot"
                aria-label={`Remove ${shot.name}`}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#101010] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <span className="block text-mono-10 text-center mt-1 select-none">
                {index === 0 ? 'cover' : `#${index + 1}`}
              </span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {shots.length < MAX_SHOTS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            title="Add images or videos"
            aria-label="Add images or videos"
            className="w-[56px] h-[56px] border border-dashed border-[#C2C2C2] bg-[#E9E9E9]/50 hover:bg-[#E9E9E9] flex items-center justify-center cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#545454]" />
          </button>
        )}
      </div>
    </div>
  );
};
