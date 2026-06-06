import { Button } from "@/components/ui/button";
import { isMarketBuyable } from "@/lib/markets/buyable";
import type { Market } from "@/lib/markets/types";

type MarketBuyPlaceholderProps = {
  market: Market;
};

export function MarketBuyPlaceholder({ market }: MarketBuyPlaceholderProps) {
  const buyable = isMarketBuyable(market);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground">Trade</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {buyable
          ? "Buying and selling will be available in a later workshop step."
          : "Buying is unavailable for closed or resolved markets."}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button disabled={!buyable} type="button">
          Buy Yes
        </Button>
        <Button disabled={!buyable} type="button" variant="outline">
          Buy No
        </Button>
      </div>
    </section>
  );
}
