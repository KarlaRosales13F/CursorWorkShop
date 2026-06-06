import { describe, expect, it } from "vitest";

import {
  buildFlatSeries,
  buildHistoricalSeriesFromLedger,
  buildProbabilitySeries,
  computeYesChanceFromPositions,
  getNeutralYesChance,
  inferLedgerSide,
} from "@/lib/markets/probability";
import type { Market } from "@/lib/markets/types";

const market: Market = {
  id: "market-1",
  title: "Test market",
  description: "Description",
  status: "open",
  close_date: "2026-12-31T00:00:00.000Z",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("computeYesChanceFromPositions", () => {
  it("calculates yes chance from aggregate positions", () => {
    const result = computeYesChanceFromPositions([
      { yes_shares_cents: 7000, no_shares_cents: 3000 },
      { yes_shares_cents: 1000, no_shares_cents: 1000 },
    ]);

    expect(result?.yesChance).toBeCloseTo(2 / 3, 5);
    expect(result?.yesPercent).toBeCloseTo(66.666, 2);
    expect(result?.noPercent).toBeCloseTo(33.333, 2);
    expect(result?.source).toBe("positions");
  });

  it("returns null when there is no activity", () => {
    expect(
      computeYesChanceFromPositions([
        { yes_shares_cents: 0, no_shares_cents: 0 },
      ]),
    ).toBeNull();
  });
});

describe("getNeutralYesChance", () => {
  it("returns a documented 50% baseline", () => {
    expect(getNeutralYesChance()).toEqual({
      yesChance: 0.5,
      yesPercent: 50,
      noPercent: 50,
      source: "neutral_baseline",
    });
  });
});

describe("inferLedgerSide", () => {
  it("detects yes and no descriptions", () => {
    expect(inferLedgerSide("Buy Yes shares")).toBe("yes");
    expect(inferLedgerSide("Buy NO shares")).toBe("no");
    expect(inferLedgerSide("Adjustment")).toBeNull();
  });
});

describe("buildHistoricalSeriesFromLedger", () => {
  it("builds historical points when ledger sides are available", () => {
    const points = buildHistoricalSeriesFromLedger([
      {
        amount_cents: -1000,
        entry_type: "trade",
        description: "Buy Yes",
        created_at: "2026-01-02T00:00:00.000Z",
      },
      {
        amount_cents: -500,
        entry_type: "trade",
        description: "Buy No",
        created_at: "2026-01-03T00:00:00.000Z",
      },
    ]);

    expect(points).toHaveLength(2);
    expect(points[0]?.yesPercent).toBe(100);
    expect(points[1]?.yesPercent).toBeCloseTo(66.666, 2);
  });
});

describe("buildProbabilitySeries", () => {
  it("returns a flat current-balance line when ledger history is unavailable", () => {
    const yesChance = getNeutralYesChance();
    const now = new Date("2026-06-01T00:00:00.000Z");
    const series = buildProbabilitySeries(market, yesChance, [], now);

    expect(series.isFlatFallback).toBe(true);
    expect(series.mode).toBe("current_balance");
    expect(series.points).toHaveLength(2);
    expect(series.points[0]?.yesPercent).toBe(50);
    expect(series.points[1]?.yesPercent).toBe(50);
    expect(series.currentYesPercent).toBe(50);
    expect(series.label).toContain("neutral 50% baseline");
  });

  it("returns historical points when enough ledger activity exists", () => {
    const yesChance = computeYesChanceFromPositions([
      { yes_shares_cents: 7500, no_shares_cents: 2500 },
    ]);

    expect(yesChance).not.toBeNull();
    if (!yesChance) {
      return;
    }
    const series = buildProbabilitySeries(market, yesChance, [
      {
        amount_cents: -1000,
        entry_type: "trade",
        description: "Buy Yes",
        created_at: "2026-01-02T00:00:00.000Z",
      },
      {
        amount_cents: -1000,
        entry_type: "trade",
        description: "Buy No",
        created_at: "2026-01-03T00:00:00.000Z",
      },
    ]);

    expect(series.isFlatFallback).toBe(false);
    expect(series.mode).toBe("historical");
    expect(series.points.length).toBeGreaterThanOrEqual(2);
  });
});

describe("buildFlatSeries", () => {
  it("creates a stable flat line between created_at and now", () => {
    const now = new Date("2026-06-01T00:00:00.000Z");
    const points = buildFlatSeries(market, 62.5, now);

    expect(points).toEqual([
      { timestamp: market.created_at, yesPercent: 62.5 },
      { timestamp: now.toISOString(), yesPercent: 62.5 },
    ]);
  });
});
