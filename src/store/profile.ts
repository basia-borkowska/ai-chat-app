import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserProfile } from "@/types/profile";

type ProfileState = {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  reset: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Basia Borkowska",
  email: "bborkowska1881@gmail.com",
  avatarUrl: null,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      reset: () => set({ profile: DEFAULT_PROFILE }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "user-profile",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(true);
        if (error) console.error("An error occurred during hydration:", error);
      },
    }
  )
);
