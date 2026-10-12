import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Projects you've sent a claim for that aren't confirmed yet. Kept on this device until there's a backend
// (which will know this per account), so the claim buttons can say "claim pending" instead of asking again
interface ClaimsContextType {
  addPendingClaim: (projectId: string) => void;
  isClaimPending: (projectId: string) => boolean;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

const STORAGE_KEY = 'idat_pending_claims';

export const ClaimsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {
      // Storage unavailable (private mode): pending claims just last for this visit
    }
  }, [pending]);

  const addPendingClaim = useCallback((projectId: string) => {
    setPending((prev) => (prev.includes(projectId) ? prev : [...prev, projectId]));
  }, []);

  const value = useMemo(
    () => ({ addPendingClaim, isClaimPending: (projectId: string) => pending.includes(projectId) }),
    [addPendingClaim, pending]
  );

  return <ClaimsContext.Provider value={value}>{children}</ClaimsContext.Provider>;
};

export const useClaims = () => {
  const context = useContext(ClaimsContext);
  if (!context) throw new Error('useClaims must be used within a ClaimsProvider');
  return context;
};
