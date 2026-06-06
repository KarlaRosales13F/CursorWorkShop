const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export type ParseFakeDollarResult =
  | { ok: true; cents: number }
  | { ok: false; error: string };

export function formatFakeDollars(cents: number): string {
  return `${moneyFormatter.format(cents / 100)} fake`;
}

export function formatFakeShares(cents: number): string {
  return formatFakeDollars(cents);
}

export function parseFakeDollarInput(input: string): ParseFakeDollarResult {
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return {
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    };
  }

  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const wholeCents = Number.parseInt(wholePart, 10) * 100;
  const fractionCents = Number.parseInt(fractionPart.padEnd(2, "0"), 10);
  const totalCents = wholeCents + fractionCents;

  if (!Number.isSafeInteger(totalCents) || totalCents <= 0) {
    return { ok: false, error: "Amount must be greater than zero." };
  }

  return { ok: true, cents: totalCents };
}
