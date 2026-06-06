import type { Market } from "@/lib/markets/types";
import type {
  UserPosition,
  UserPositionWithMarket,
} from "@/lib/positions/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function normalizeJoinedMarket(
  market: Market | Market[] | null,
): Market | null {
  if (!market) {
    return null;
  }

  return Array.isArray(market) ? (market[0] ?? null) : market;
}

export async function getUserPositionForMarket(
  marketId: string,
): Promise<UserPosition | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("positions")
    .select(
      "id, market_id, yes_shares_cents, no_shares_cents, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .eq("market_id", marketId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch position: ${error.message}`);
  }

  return data;
}

export async function getUserPositionsWithMarkets(): Promise<
  UserPositionWithMarket[]
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("positions")
    .select(
      `
      id,
      market_id,
      yes_shares_cents,
      no_shares_cents,
      created_at,
      updated_at,
      market:markets (
        id,
        title,
        description,
        status,
        close_date,
        created_at,
        updated_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch positions: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.flatMap((row) => {
    const market = normalizeJoinedMarket(
      row.market as Market | Market[] | null,
    );

    if (!market) {
      return [];
    }

    return [
      {
        id: row.id,
        market_id: row.market_id,
        yes_shares_cents: row.yes_shares_cents,
        no_shares_cents: row.no_shares_cents,
        created_at: row.created_at,
        updated_at: row.updated_at,
        market,
      },
    ];
  });
}
