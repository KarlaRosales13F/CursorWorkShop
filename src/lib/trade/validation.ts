import { parseFakeDollarInput } from "@/lib/fake-money";
import type { BuySide } from "@/lib/trade/types";

export function isValidBuySide(value: string): value is BuySide {
  return value === "yes" || value === "no";
}

export function parseBuyAmountCents(
  amount: string,
): { ok: true; cents: number } | { ok: false; error: string } {
  return parseFakeDollarInput(amount);
}

export function mapBuyRpcError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("not authenticated")) {
    return "Sign in to buy shares with fake money.";
  }

  if (normalized.includes("insufficient fake balance")) {
    return "You do not have enough fake balance for this purchase.";
  }

  if (
    normalized.includes("not open") ||
    normalized.includes("close date") ||
    normalized.includes("market not found")
  ) {
    return "This market is not available for buying.";
  }

  if (normalized.includes("side must be")) {
    return "Choose Yes or No before buying.";
  }

  if (normalized.includes("amount must be")) {
    return "Enter a valid fake dollar amount.";
  }

  if (
    normalized.includes("could not find the function") ||
    normalized.includes("function public.buy_market_shares")
  ) {
    return "Buying is not set up yet. Run task db:push to apply the latest database migration.";
  }

  return "Could not complete the purchase. Please try again.";
}
