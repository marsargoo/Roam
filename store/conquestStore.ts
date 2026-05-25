import { create } from 'zustand';
import type { Conquest, Challenge, ChallengeType } from '@/types';

interface ConquestState {
  activeConquest: Conquest | null;
  activeChallenges: Challenge[];
  checkedInPOIId: string | null;
  setActiveConquest: (conquest: Conquest | null) => void;
  setActiveChallenges: (challenges: Challenge[]) => void;
  completeChallenge: (type: ChallengeType) => void;
  setCheckedInPOIId: (id: string | null) => void;
  reset: () => void;
}

export const useConquestStore = create<ConquestState>((set) => ({
  activeConquest: null,
  activeChallenges: [],
  checkedInPOIId: null,

  setActiveConquest: (activeConquest) => set({ activeConquest }),
  setActiveChallenges: (activeChallenges) => set({ activeChallenges }),
  setCheckedInPOIId: (checkedInPOIId) => set({ checkedInPOIId }),

  completeChallenge: (type) =>
    set((state) => ({
      activeChallenges: state.activeChallenges.map((c) =>
        c.type === type ? { ...c, completed_at: new Date().toISOString() } : c
      ),
    })),

  reset: () =>
    set({ activeConquest: null, activeChallenges: [], checkedInPOIId: null }),
}));
