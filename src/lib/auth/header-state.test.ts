import type { User } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import {
  getHeaderAuthState,
  shouldShowSignedInActions,
  shouldShowSignedOutActions,
} from "@/lib/auth/header-state";
import type { Profile } from "@/lib/profile/types";

const user = { id: "user-1" } as User;

const profile: Profile = {
  id: "user-1",
  balance_cents: 10_000,
  first_name: "Ada",
  last_name: "Lovelace",
};

describe("header auth state", () => {
  it("shows signed-out actions when there is no user", () => {
    const state = getHeaderAuthState(null, null);

    expect(state).toEqual({ status: "signed-out" });
    expect(shouldShowSignedOutActions(state)).toBe(true);
    expect(shouldShowSignedInActions(state)).toBe(false);
  });

  it("shows signed-in balance and sign-out affordances", () => {
    const state = getHeaderAuthState(user, profile);

    expect(state).toEqual({
      status: "signed-in",
      balanceCents: 10_000,
      balanceLabel: "$100.00 fake",
      showSignOut: true,
    });
    expect(shouldShowSignedOutActions(state)).toBe(false);
    expect(shouldShowSignedInActions(state)).toBe(true);
  });

  it("handles a missing profile without exposing editable balance UI", () => {
    const state = getHeaderAuthState(user, null);

    expect(state).toEqual({
      status: "signed-in",
      balanceCents: null,
      balanceLabel: "Balance unavailable",
      showSignOut: true,
    });
  });
});
