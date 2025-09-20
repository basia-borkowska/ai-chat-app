export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
};

export type SelectedFile = {
  id: string;
  file: File;
  url?: string;
};
