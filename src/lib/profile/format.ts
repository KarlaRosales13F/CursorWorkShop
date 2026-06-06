const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatFakeBalance(balanceCents: number): string {
  return `${moneyFormatter.format(balanceCents / 100)} fake`;
}
