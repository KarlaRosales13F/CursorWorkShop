import type {
  ChartPoint,
  ChartSeriesResult,
  LedgerRow,
  Market,
  PositionRow,
  YesChanceResult,
} from "@/lib/markets/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const NEUTRAL_YES_CHANCE = 0.5;

export function computeYesChanceFromPositions(
  rows: PositionRow[],
): YesChanceResult | null {
  const yesTotal = rows.reduce((sum, row) => sum + row.yes_shares_cents, 0);
  const noTotal = rows.reduce((sum, row) => sum + row.no_shares_cents, 0);
  const total = yesTotal + noTotal;

  if (total <= 0) {
    return null;
  }

  const yesChance = yesTotal / total;

  return {
    yesChance,
    yesPercent: yesChance * 100,
    noPercent: 100 - yesChance * 100,
    source: "positions",
  };
}

export function getNeutralYesChance(): YesChanceResult {
  return {
    yesChance: NEUTRAL_YES_CHANCE,
    yesPercent: NEUTRAL_YES_CHANCE * 100,
    noPercent: NEUTRAL_YES_CHANCE * 100,
    source: "neutral_baseline",
  };
}

export async function computeYesChance(
  marketId: string,
): Promise<YesChanceResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("positions")
      .select("yes_shares_cents, no_shares_cents")
      .eq("market_id", marketId);

    if (error || !data || data.length === 0) {
      return getNeutralYesChance();
    }

    return computeYesChanceFromPositions(data) ?? getNeutralYesChance();
  } catch {
    return getNeutralYesChance();
  }
}

export function inferLedgerSide(description: string): "yes" | "no" | null {
  const normalized = description.toLowerCase();

  if (/\byes\b/.test(normalized)) {
    return "yes";
  }

  if (/\bno\b/.test(normalized)) {
    return "no";
  }

  return null;
}

export function buildHistoricalSeriesFromLedger(
  entries: LedgerRow[],
): ChartPoint[] {
  let yesTotal = 0;
  let noTotal = 0;
  const points: ChartPoint[] = [];

  for (const entry of entries) {
    if (entry.entry_type !== "trade") {
      continue;
    }

    const side = inferLedgerSide(entry.description);
    const amount = Math.abs(entry.amount_cents);

    if (side === "yes") {
      yesTotal += amount;
    } else if (side === "no") {
      noTotal += amount;
    } else {
      continue;
    }

    const total = yesTotal + noTotal;
    if (total <= 0) {
      continue;
    }

    points.push({
      timestamp: entry.created_at,
      yesPercent: (yesTotal / total) * 100,
    });
  }

  return points;
}

export function buildFlatSeries(
  market: Pick<Market, "created_at">,
  yesPercent: number,
  now: Date = new Date(),
): ChartPoint[] {
  return [
    { timestamp: market.created_at, yesPercent },
    { timestamp: now.toISOString(), yesPercent },
  ];
}

export function buildProbabilitySeries(
  market: Market,
  yesChance: YesChanceResult,
  ledgerEntries: LedgerRow[] = [],
  now: Date = new Date(),
): ChartSeriesResult {
  const historicalPoints = buildHistoricalSeriesFromLedger(ledgerEntries);

  if (historicalPoints.length >= 2) {
    const lastPoint = historicalPoints.at(-1);
    const currentYesPercent = lastPoint?.yesPercent ?? yesChance.yesPercent;

    return {
      points: historicalPoints,
      mode: "historical",
      currentYesPercent,
      isFlatFallback: false,
      label: "Yes probability over time from recorded trades.",
    };
  }

  const flatPoints = buildFlatSeries(market, yesChance.yesPercent, now);

  return {
    points: flatPoints,
    mode: "current_balance",
    currentYesPercent: yesChance.yesPercent,
    isFlatFallback: true,
    label:
      yesChance.source === "neutral_baseline"
        ? "Current market balance at a neutral 50% baseline — no Yes/No activity is available yet."
        : "Current market balance — not historical price movement.",
  };
}

export async function getMarketProbabilityData(market: Market): Promise<{
  yesChance: YesChanceResult;
  series: ChartSeriesResult;
}> {
  const yesChance = await computeYesChance(market.id);
  let ledgerEntries: LedgerRow[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("ledger_entries")
      .select("amount_cents, entry_type, description, created_at")
      .eq("market_id", market.id)
      .eq("entry_type", "trade")
      .order("created_at", { ascending: true });

    if (!error && data) {
      ledgerEntries = data;
    }
  } catch {
    ledgerEntries = [];
  }

  const series = buildProbabilitySeries(market, yesChance, ledgerEntries);

  return { yesChance, series };
}
