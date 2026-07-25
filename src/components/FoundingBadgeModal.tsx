import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FoundingBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoundingBadgeModal: React.FC<FoundingBadgeModalProps> = ({ isOpen, onClose }) => {
  const [handle, setHandle] = useState('ileri');
  const [reserved, setReserved] = useState(false);

  if (!isOpen) return null;

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setReserved(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#F2F1F3] text-[#545454] border border-black/10 rounded-none shadow-xl">
        
        <div className="p-5 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-inter-16 font-bold">founding builder</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
            <X className="w-4 h-4 text-[#545454]" />
          </button>
        </div>

        {reserved ? (
          <div className="p-8 text-center space-y-3">
            <h3 className="text-inter-16 font-bold">
              handle @{handle} reserved
            </h3>
            
            <div className="badge-unclaimed py-2 px-4">
              Founding Builder #42
            </div>

            <div>
              <button
                onClick={onClose}
                className="pill-action mt-4"
              >
                done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReserve} className="p-5 space-y-4">
            <div>
              <label className="block text-mono-10 mb-1">desired handle *</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="ileri"
                className="w-full px-3 py-2 bg-[#E9E9E9] text-[#545454] text-inter-14 border-none outline-none font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="pill-action w-full"
              >
                reserve handle
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
