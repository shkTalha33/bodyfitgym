import api from "@/lib/api";
import { normalizeUser, type AuthUser } from "@/lib/user-normalize";

export async function fetchProfileFresh(): Promise<AuthUser> {
  const { data } = await api.get("/users/me");
  const u = normalizeUser(data as Record<string, unknown>);
  if (!u) throw new Error("Not authenticated");
  return u;
}
