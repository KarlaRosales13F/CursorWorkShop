import type { Market } from "@/lib/markets/types";
import type { Tables } from "@/lib/supabase/database.types";

export type UserPosition = Pick<
  Tables<"positions">,
  | "id"
  | "market_id"
  | "yes_shares_cents"
  | "no_shares_cents"
  | "created_at"
  | "updated_at"
>;

export type UserPositionWithMarket = UserPosition & {
  market: Market;
};
