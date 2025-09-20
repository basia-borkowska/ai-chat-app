import { Message } from "@/types/chat";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ChatState = {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, partial: Partial<Message>) => void;
  reset: () => void;
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
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
