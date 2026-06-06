import type { User } from "@supabase/supabase-js";

import type { Profile } from "@/lib/profile/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SessionContext = {
  user: User;
  profile: Profile | null;
};

export async function getAuthUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, balance_cents, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return data;
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, balance_cents, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return { user, profile };
}
