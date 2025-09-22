import { Message } from "@/types/chat";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ChatState = {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, partial: Partial<Message>) => void;
  reset: () => void;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      updateMessage: (id: string, partial: Partial<Message>) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, ...partial } : m
          ),
        })),
      reset: () => set({ messages: [] }),
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(true);
        if (error) console.error("An error occurred during hydration:", error);
      },
    }
  )
);
