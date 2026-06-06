"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BuyActionState } from "@/lib/trade/types";
import {
  isValidBuySide,
  mapBuyRpcError,
  parseBuyAmountCents,
} from "@/lib/trade/validation";

function readField(formData: FormData, name: string): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function buySharesAction(
  _prevState: BuyActionState,
  formData: FormData,
): Promise<BuyActionState> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to buy shares with fake money." };
  }

  const marketId = readField(formData, "market_id");
  const side = readField(formData, "side");
  const amount = readField(formData, "amount");

  if (!marketId) {
    return { error: "Market not found." };
  }

  if (!side || !isValidBuySide(side)) {
    return { error: "Choose Yes or No before buying." };
  }

  if (!amount) {
    return { error: "Enter a fake dollar amount." };
  }

  const parsedAmount = parseBuyAmountCents(amount);

  if (!parsedAmount.ok) {
    return { error: parsedAmount.error };
  }

  const { error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: parsedAmount.cents,
  });

  if (error) {
    return { error: mapBuyRpcError(error.message) };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/positions");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: `Purchased ${side === "yes" ? "Yes" : "No"} shares with fake money.`,
  };
}
