import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/format";
import {
  computeTotalSharesCents,
  formatPositionShares,
} from "@/lib/positions/format";
import type { UserPositionWithMarket } from "@/lib/positions/types";

type PositionsListProps = {
  positions: UserPositionWithMarket[];
};

export function PositionsList({ positions }: PositionsListProps) {
  return (
    <div className="space-y-4">
      {positions.map((position) => {
        const totalSharesCents = computeTotalSharesCents(
          position.yes_shares_cents,
          position.no_shares_cents,
        );

        return (
          <article
            key={position.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-card-foreground">
                  <Link
                    href={`/markets/${position.market.id}`}
                    className="transition-colors hover:text-primary"
                  >
                    {position.market.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fake-money position in a fictional Yes/No market.
                </p>
              </div>
              <MarketStatusBadge status={position.market.status} />
            </div>

            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {position.market.status}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Close date
                </dt>
                <dd className="mt-1 text-sm text-foreground">
                  {formatCloseDate(position.market.close_date)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Yes shares
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {formatPositionShares(position.yes_shares_cents)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  No shares
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {formatPositionShares(position.no_shares_cents)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Total shares
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {formatPositionShares(totalSharesCents)}
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <Button asChild variant="outline" size="sm">
                <Link href={`/markets/${position.market.id}`}>View market</Link>
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
