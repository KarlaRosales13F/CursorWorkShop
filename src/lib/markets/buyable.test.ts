import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/buyable";

describe("isMarketBuyable", () => {
  it("returns true for open markets without a close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: null,
      }),
    ).toBe(true);
  });

  it("returns true for open markets with a future close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: new Date(Date.now() + 86_400_000).toISOString(),
      }),
    ).toBe(true);
  });

  it("returns false for open markets with a past close date", () => {
    expect(
      isMarketBuyable({
        status: "open",
        close_date: new Date(Date.now() - 86_400_000).toISOString(),
      }),
    ).toBe(false);
  });

  it("returns false for closed markets", () => {
    expect(
      isMarketBuyable({
        status: "closed",
        close_date: null,
      }),
    ).toBe(false);
  });

  it("returns false for resolved markets", () => {
    expect(
      isMarketBuyable({
        status: "resolved",
        close_date: null,
      }),
    ).toBe(false);
  });
});
