export const PATHS = {
  root: "/",
  login: "/login",
  chat: "/chat",
  profile: "/profile",
} as const;

export type PathKey = keyof typeof PATHS;
