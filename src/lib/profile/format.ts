import { formatFakeDollars } from "@/lib/fake-money";

export function formatFakeBalance(balanceCents: number): string {
  return formatFakeDollars(balanceCents);
}
