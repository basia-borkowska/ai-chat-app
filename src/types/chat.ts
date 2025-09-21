export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

export type SelectedFile = {
  id: string;
  file: File;
  url?: string;
};
