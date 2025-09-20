export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type SelectedFile = {
  id: string;
  file: File;
  url?: string;
};
