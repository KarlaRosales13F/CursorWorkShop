import Link from "next/link";

import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/format";
import type { Market } from "@/lib/markets/types";

type MarketCardProps = {
  market: Market;
};

export function MarketCard({ market }: MarketCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-tight text-card-foreground">
          {market.title}
        </h2>
        <MarketStatusBadge status={market.status} />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
        {market.description || "No description provided."}
      </p>

      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Closes:</span>{" "}
          {formatCloseDate(market.close_date)}
        </p>
      </div>

      <div className="mt-5">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/markets/${market.id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}
