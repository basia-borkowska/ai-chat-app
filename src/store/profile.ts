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
  bio: `In my current role, I've embraced a very all-hands-on-deck approach. While I'm a developer at heart and enjoy that part the most, I'm also very open and outgoing, which allows me to communicate effectively with clients and my team. I've played a key role in defining business requirements based on customers' needs, contributed to design and user experience decisions, and stayed involved in every stage of product development. I'm proactive, take initiative, and enjoy working collaboratively. My experience has been exclusively with English-speaking clients, which has given me strong communication skills and confidence in international settings. I even had the opportunity to travel to the USA for a week-long workshop, where I provided technical expertise and helped shape new product features. I also enjoy teaching and mentoring. I've had several opportunities to guide less experienced developers and onboard new team members to the product. In addition, I've worked as a technical recruiter, which gave me valuable perspective on building strong teams and recognising potential in others.`,
  skills: ["nextjs", "react", "typescript", "javascript", "ui/ux"],
  avatarUrl: "/avatar.jpg",
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
