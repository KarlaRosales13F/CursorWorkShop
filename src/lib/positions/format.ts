import { formatFakeShares } from "@/lib/fake-money";

export function computeTotalSharesCents(
  yesSharesCents: number,
  noSharesCents: number,
): number {
  return yesSharesCents + noSharesCents;
}

export function formatPositionShares(cents: number): string {
  return formatFakeShares(cents);
}
