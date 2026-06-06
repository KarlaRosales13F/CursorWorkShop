import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getUserPositionForMarket,
  getUserPositionsWithMarkets,
} from "@/lib/positions/queries";

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

const userId = "user-123";
const marketId = "market-456";

function mockSignedInUser() {
  mockGetUser.mockResolvedValue({
    data: { user: { id: userId } },
  });
}

function mockSignedOutUser() {
  mockGetUser.mockResolvedValue({
    data: { user: null },
  });
}

describe("getUserPositionForMarket", () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockGetUser.mockReset();
  });

  it("returns null when signed out", async () => {
    mockSignedOutUser();

    await expect(getUserPositionForMarket(marketId)).resolves.toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("fetches position scoped to the authenticated user", async () => {
    mockSignedInUser();

    const maybeSingle = vi.fn(async () => ({
      data: {
        id: "pos-1",
        market_id: marketId,
        yes_shares_cents: 1000,
        no_shares_cents: 0,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
      error: null,
    }));
    const eqMarket = vi.fn(() => ({ maybeSingle }));
    const eqUser = vi.fn(() => ({ eq: eqMarket }));

    mockFrom.mockReturnValue({
      select: vi.fn(() => ({ eq: eqUser })),
    });

    const position = await getUserPositionForMarket(marketId);

    expect(mockFrom).toHaveBeenCalledWith("positions");
    expect(eqUser).toHaveBeenCalledWith("user_id", userId);
    expect(eqMarket).toHaveBeenCalledWith("market_id", marketId);
    expect(position?.yes_shares_cents).toBe(1000);
  });
});

describe("getUserPositionsWithMarkets", () => {
  beforeEach(() => {
    mockFrom.mockReset();
    mockGetUser.mockReset();
  });

  it("returns an empty list when signed out", async () => {
    mockSignedOutUser();

    await expect(getUserPositionsWithMarkets()).resolves.toEqual([]);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("fetches positions for the authenticated user with markets", async () => {
    mockSignedInUser();

    const order = vi.fn(async () => ({
      data: [
        {
          id: "pos-1",
          market_id: marketId,
          yes_shares_cents: 500,
          no_shares_cents: 250,
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-02T00:00:00.000Z",
          market: {
            id: marketId,
            title: "Demo market",
            description: "Fake money only",
            status: "open",
            close_date: null,
            created_at: "2026-01-01T00:00:00.000Z",
            updated_at: "2026-01-01T00:00:00.000Z",
          },
        },
      ],
      error: null,
    }));
    const eqUser = vi.fn(() => ({ order }));

    mockFrom.mockReturnValue({
      select: vi.fn(() => ({ eq: eqUser })),
    });

    const positions = await getUserPositionsWithMarkets();

    expect(eqUser).toHaveBeenCalledWith("user_id", userId);
    expect(positions).toHaveLength(1);
    expect(positions[0]?.market.title).toBe("Demo market");
    expect(positions[0]?.yes_shares_cents).toBe(500);
    expect(positions[0]?.no_shares_cents).toBe(250);
  });
});
