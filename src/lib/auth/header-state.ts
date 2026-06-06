import type { User } from "@supabase/supabase-js";

import { formatFakeBalance } from "@/lib/profile/format";
import type { Profile } from "@/lib/profile/types";

export type SignedOutHeaderState = {
  status: "signed-out";
};

export type SignedInHeaderState = {
  status: "signed-in";
  balanceCents: number | null;
  balanceLabel: string;
  showSignOut: true;
};

export type HeaderAuthState = SignedOutHeaderState | SignedInHeaderState;

export function getHeaderAuthState(
  user: User | null,
  profile: Profile | null,
): HeaderAuthState {
  if (!user) {
    return { status: "signed-out" };
  }

  return {
    status: "signed-in",
    balanceCents: profile?.balance_cents ?? null,
    balanceLabel: profile
      ? formatFakeBalance(profile.balance_cents)
      : "Balance unavailable",
    showSignOut: true,
  };
}

export function shouldShowSignedOutActions(state: HeaderAuthState): boolean {
  return state.status === "signed-out";
}

export function shouldShowSignedInActions(state: HeaderAuthState): boolean {
  return state.status === "signed-in";
}
