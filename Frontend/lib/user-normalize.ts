export type UserStats = {
  heightCm: number;
  weightKg: number;
  age?: number;
  goal: string;
};

export type UserPreferences = {
  dietType: string;
  fitnessLevel: string;
  activityLevel: string;
  mealsPerDay: string;
  planStyle: string;
  targetCalories: number;
  equipment: string;
  sessionMinutes: string;
  workoutFocus: string[];
  profileComplete?: boolean;
  schedule?: string[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  stats?: UserStats;
  preferences?: UserPreferences;
  profileComplete?: boolean;
};

export function normalizeUser(raw: Record<string, unknown> | null | undefined): AuthUser | null {
  if (!raw) return null;
  const id = (raw.id as string) || (raw._id as string)?.toString?.() || "";
  if (!id) return null;
  return {
    id,
    name: String(raw.name || ""),
    email: String(raw.email || ""),
    avatarUrl: raw.avatarUrl ? String(raw.avatarUrl) : undefined,
    stats: raw.stats as UserStats | undefined,
    preferences: raw.preferences as UserPreferences | undefined,
    profileComplete: Boolean(raw.profileComplete),
  };
}
