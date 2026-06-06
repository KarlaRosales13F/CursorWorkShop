import type { Tables } from "@/lib/supabase/database.types";

export type Market = Tables<"markets">;

export type MarketStatus = "open" | "closed" | "resolved";

export type YesChanceSource = "positions" | "neutral_baseline";

export type YesChanceResult = {
  yesChance: number;
  yesPercent: number;
  noPercent: number;
  source: YesChanceSource;
};

export type ChartPoint = {
  timestamp: string;
  yesPercent: number;
};

export type ChartSeriesMode = "historical" | "current_balance";

export type ChartSeriesResult = {
  points: ChartPoint[];
  mode: ChartSeriesMode;
  currentYesPercent: number;
  isFlatFallback: boolean;
  label: string;
};

export type PositionRow = Pick<
  Tables<"positions">,
  "yes_shares_cents" | "no_shares_cents"
>;

export type LedgerRow = Pick<
  Tables<"ledger_entries">,
  "amount_cents" | "entry_type" | "description" | "created_at"
>;
