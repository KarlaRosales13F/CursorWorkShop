import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMarketById, getMarkets } from "@/lib/markets/queries";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

function createListBuilder(result: { data: unknown; error: unknown }) {
  return {
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        order: vi.fn(async () => result),
      })),
    })),
  };
}

function createSingleBuilder(result: { data: unknown; error: unknown }) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(async () => result),
      })),
    })),
  };
}

describe("market queries", () => {
  beforeEach(() => {
    mockFrom.mockReset();
  });

  it("returns markets from Supabase", async () => {
    const markets = [
      {
        id: "1",
        title: "Market A",
        description: "A",
        status: "open",
        close_date: null,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    ];

    mockFrom.mockReturnValue(
      createListBuilder({
        data: markets,
        error: null,
      }),
    );

    await expect(getMarkets()).resolves.toEqual(markets);
    expect(mockFrom).toHaveBeenCalledWith("markets");
  });

  it("returns a single market by id", async () => {
    const market = {
      id: "1",
      title: "Market A",
      description: "A",
      status: "open",
      close_date: null,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    };

    mockFrom.mockReturnValue(
      createSingleBuilder({
        data: market,
        error: null,
      }),
    );

    await expect(getMarketById("1")).resolves.toEqual(market);
  });

  it("returns null when a market is missing", async () => {
    mockFrom.mockReturnValue(
      createSingleBuilder({
        data: null,
        error: null,
      }),
    );

    await expect(getMarketById("missing")).resolves.toBeNull();
  });
});
