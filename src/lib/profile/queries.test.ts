import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAuthUser,
  getCurrentUserProfile,
  getSessionContext,
} from "@/lib/profile/queries";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

function createProfileBuilder(result: { data: unknown; error: unknown }) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(async () => result),
      })),
    })),
  };
}

describe("profile queries", () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockFrom.mockReset();
  });

  it("returns null when no user is authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(getAuthUser()).resolves.toBeNull();
    await expect(getCurrentUserProfile()).resolves.toBeNull();
    await expect(getSessionContext()).resolves.toBeNull();
  });

  it("returns the current user profile", async () => {
    const user = { id: "user-1" };
    const profile = {
      id: "user-1",
      balance_cents: 10_000,
      first_name: "Ada",
      last_name: "Lovelace",
    };

    mockGetUser.mockResolvedValue({ data: { user } });
    mockFrom.mockReturnValue(
      createProfileBuilder({
        data: profile,
        error: null,
      }),
    );

    await expect(getCurrentUserProfile()).resolves.toEqual(profile);
    await expect(getSessionContext()).resolves.toEqual({ user, profile });
    expect(mockFrom).toHaveBeenCalledWith("profiles");
  });
});
