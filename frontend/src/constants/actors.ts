export const ACTORS = ["john.doe", "jane.doe", "admin.user"] as const;

export type Actor = (typeof ACTORS)[number];
